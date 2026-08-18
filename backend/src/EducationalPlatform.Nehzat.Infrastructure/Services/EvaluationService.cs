using System.Text.Json;
using EducationalPlatform.Nehzat.Application.Constants;
using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Domain.Entities;
using EducationalPlatform.Nehzat.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace EducationalPlatform.Nehzat.Infrastructure.Services;

public class EvaluationService : IEvaluationService
{
    private readonly AppDbContext _db;

    public EvaluationService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<QuestionDto>> GetQuestionsAsync(int userId, string? category = null, string? difficulty = null)
    {
        var query = _db.Set<Question>().AsQueryable();
        if (!string.IsNullOrEmpty(category)) query = query.Where(q => q.Category == category);
        if (!string.IsNullOrEmpty(difficulty)) query = query.Where(q => q.Difficulty == difficulty);
        var questions = await query.OrderByDescending(q => q.CreatedAt).ToListAsync();
        return questions.Select(ToQuestionDto).ToList();
    }

    public async Task<QuestionDto> CreateQuestionAsync(int userId, CreateQuestionRequest req)
    {
        if (string.IsNullOrWhiteSpace(req.Text))
            throw new InvalidOperationException("متن سوال نمی‌تواند خالی باشد");

        var question = new Question
        {
            Text = req.Text.Trim(),
            Category = string.IsNullOrWhiteSpace(req.Category) ? "math" : req.Category.Trim(),
            Difficulty = string.IsNullOrWhiteSpace(req.Difficulty) ? "medium" : req.Difficulty.Trim(),
            Type = string.IsNullOrWhiteSpace(req.Type) ? "multiple_choice" : req.Type.Trim(),
            OptionsJson = JsonSerializer.Serialize(req.Options ?? new List<string>()),
            CorrectAnswer = (req.CorrectAnswer ?? string.Empty).Trim(),
            Points = req.Points <= 0 ? 10 : req.Points,
            CreatedByUserId = userId,
            CreatedAt = DateTime.UtcNow
        };
        _db.Set<Question>().Add(question);
        await _db.SaveChangesAsync();
        return ToQuestionDto(question);
    }

    public async Task DeleteQuestionAsync(int userId, int questionId)
    {
        var question = await _db.Set<Question>().FindAsync(questionId)
            ?? throw new KeyNotFoundException("سوال یافت نشد");
        if (question.CreatedByUserId != userId)
            throw new UnauthorizedAccessException("فقط سازنده سوال می‌تواند آن را حذف کند");
        _db.Set<Question>().Remove(question);
        await _db.SaveChangesAsync();
    }

    public async Task<RandomEvaluationDto> StartEvaluationAsync(int userId, StartEvaluationRequest req)
    {
        var student = await _db.Students.FindAsync(req.StudentId)
            ?? throw new KeyNotFoundException("دانش‌آموز یافت نشد");

        var query = _db.Set<Question>().AsQueryable();
        if (!string.IsNullOrEmpty(req.Category)) query = query.Where(q => q.Category == req.Category);
        var count = req.QuestionCount > 0 ? req.QuestionCount : 10;
        var questions = await query.OrderBy(q => Guid.NewGuid()).Take(count).ToListAsync();
        if (questions.Count == 0)
            throw new InvalidOperationException("سوالی در این دسته‌بندی موجود نیست");

        var evaluation = new RandomEvaluation
        {
            StudentId = req.StudentId,
            Title = $"ارزیابی {student.FirstName} {student.LastName}".Trim(),
            Category = req.Category,
            Status = "in_progress",
            TotalQuestions = questions.Count,
            StartedAt = DateTime.UtcNow
        };
        _db.Set<RandomEvaluation>().Add(evaluation);
        await _db.SaveChangesAsync();

        return ToDto(evaluation, studentName: $"{student.FirstName} {student.LastName}".Trim(), questions: questions);
    }

    public async Task<RandomEvaluationDto> GetEvaluationAsync(int userId, int evaluationId)
    {
        var evaluation = await _db.Set<RandomEvaluation>()
            .Include(e => e.Student)
            .Include(e => e.Answers)
            .FirstOrDefaultAsync(e => e.Id == evaluationId)
            ?? throw new KeyNotFoundException("ارزیابی یافت نشد");

        var questions = await ResolveQuestionsAsync(evaluation);
        return ToDto(evaluation, questions: questions);
    }

    public async Task<RandomEvaluationDto> SubmitAnswersAsync(int userId, SubmitAnswersRequest req)
    {
        var evaluation = await _db.Set<RandomEvaluation>()
            .Include(e => e.Student)
            .Include(e => e.Answers)
            .FirstOrDefaultAsync(e => e.Id == req.RandomEvaluationId)
            ?? throw new KeyNotFoundException("ارزیابی یافت نشد");
        if (evaluation.Status != "in_progress")
            throw new InvalidOperationException("این ارزیابی قبلاً ثبت شده است");

        var questionIds = (req.Answers ?? new List<EvaluationAnswerDto>()).Select(a => a.QuestionId).ToList();
        var questions = await _db.Set<Question>()
            .Where(q => questionIds.Contains(q.Id))
            .ToDictionaryAsync(q => q.Id);

        foreach (var answer in req.Answers)
        {
            if (!questions.TryGetValue(answer.QuestionId, out var question)) continue;
            var isCorrect = !string.IsNullOrEmpty(question.CorrectAnswer)
                && string.Equals(question.CorrectAnswer.Trim(), (answer.AnswerText ?? string.Empty).Trim(), StringComparison.OrdinalIgnoreCase);
            evaluation.Answers.Add(new EvaluationAnswer
            {
                RandomEvaluationId = evaluation.Id,
                QuestionId = answer.QuestionId,
                AnswerText = answer.AnswerText ?? string.Empty,
                IsCorrect = isCorrect,
                PointsEarned = isCorrect ? question.Points : 0,
                AnsweredAt = DateTime.UtcNow
            });
        }

        var earned = evaluation.Answers.Sum(a => a.PointsEarned);
        var maxPoints = questions.Values.Sum(q => q.Points);
        evaluation.TotalScore = maxPoints > 0 ? Math.Round((decimal)earned / maxPoints * 100, 2) : 0;
        evaluation.CorrectAnswers = evaluation.Answers.Count(a => a.IsCorrect);
        evaluation.Status = "completed";
        evaluation.CompletedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return ToDto(evaluation, questions: questions.Values.ToList());
    }

    public async Task<List<RandomEvaluationDto>> GetMyEvaluationsAsync(int userId, int limit = 20)
    {
        var studentIds = await ResolveStudentIdsAsync(userId);
        if (studentIds.Count == 0) return new List<RandomEvaluationDto>();

        var evaluations = await _db.Set<RandomEvaluation>()
            .Include(e => e.Student)
            .Include(e => e.Answers)
            .Where(e => studentIds.Contains(e.StudentId))
            .OrderByDescending(e => e.StartedAt)
            .Take(limit)
            .ToListAsync();

        return evaluations.Select(e => ToDto(e)).ToList();
    }

    public async Task<EvaluationStatsDto> GetStatsAsync(int userId)
    {
        var evaluations = await GetMyEvaluationsAsync(userId, 1000);
        var completed = evaluations.Where(e => e.Status == "completed").ToList();

        return new EvaluationStatsDto
        {
            TotalEvaluations = evaluations.Count,
            CompletedEvaluations = completed.Count,
            TotalQuestions = evaluations.Sum(e => e.TotalQuestions),
            CategoryBreakdown = evaluations
                .GroupBy(e => string.IsNullOrEmpty(e.Category) ? "other" : e.Category)
                .ToDictionary(g => g.Key, g => g.Count()),
            ScoreTrend = completed
                .Where(e => e.CompletedAt.HasValue)
                .Select(e => new { e.CompletedAt!.Value.Year, e.CompletedAt!.Value.Month, e.TotalScore })
                .GroupBy(e => new { e.Year, e.Month })
                .OrderBy(g => g.Key.Year)
                .ThenBy(g => g.Key.Month)
                .Select(g => new EvaluationTrendPointDto
                {
                    Date = new DateTime(g.Key.Year, g.Key.Month, 1),
                    AverageScore = Math.Round(g.Average(e => e.TotalScore), 2)
                })
                .ToList()
        };
    }

    private async Task<List<int>> ResolveStudentIdsAsync(int userId)
    {
        var user = await _db.Users.FindAsync(userId);
        var studentIds = new List<int>();
        if (user?.StudentId is int ownStudentId)
            studentIds.Add(ownStudentId);

        if (user != null && (user.UserType == RoleNames.Coach || user.UserType == RoleNames.Manager || user.UserType == RoleNames.Teacher))
        {
            var coach = await _db.Coaches.FirstOrDefaultAsync(c => c.Username == user.Username);
            if (coach != null)
            {
                var courseIds = await _db.CoachCourses
                    .Where(cc => cc.CoachId == coach.Id)
                    .Select(cc => cc.CourseId)
                    .ToListAsync();
                if (courseIds.Count > 0)
                {
                    studentIds.AddRange(await _db.StudentCourses
                        .Where(sc => courseIds.Contains(sc.CourseId))
                        .Select(sc => sc.StudentId)
                        .Distinct()
                        .ToListAsync());
                }
            }
        }

        return studentIds.Distinct().ToList();
    }

    private async Task<List<Question>> ResolveQuestionsAsync(RandomEvaluation evaluation)
    {
        if (evaluation.Answers.Count > 0)
        {
            var answeredIds = evaluation.Answers.Select(a => a.QuestionId).ToList();
            return await _db.Set<Question>().Where(q => answeredIds.Contains(q.Id)).ToListAsync();
        }

        var query = _db.Set<Question>().AsQueryable();
        if (!string.IsNullOrEmpty(evaluation.Category)) query = query.Where(q => q.Category == evaluation.Category);
        return await query.OrderBy(q => Guid.NewGuid()).Take(evaluation.TotalQuestions).ToListAsync();
    }

    private static QuestionDto ToQuestionDto(Question q) => new()
    {
        Id = q.Id,
        Text = q.Text,
        Category = q.Category,
        Difficulty = q.Difficulty,
        Type = q.Type,
        Options = ParseOptions(q.OptionsJson),
        CorrectAnswer = q.CorrectAnswer,
        Points = q.Points,
        CreatedAt = q.CreatedAt
    };

    private static List<string> ParseOptions(string json)
    {
        try
        {
            return JsonSerializer.Deserialize<List<string>>(json) ?? new List<string>();
        }
        catch
        {
            return new List<string>();
        }
    }

    private static RandomEvaluationDto ToDto(RandomEvaluation e, string? studentName = null, List<Question>? questions = null)
    {
        var name = studentName
            ?? (e.Student != null ? $"{e.Student.FirstName} {e.Student.LastName}".Trim() : string.Empty);
        return new RandomEvaluationDto
        {
            Id = e.Id,
            StudentId = e.StudentId,
            StudentName = name,
            Title = e.Title,
            Category = e.Category,
            StartedAt = e.StartedAt,
            CompletedAt = e.CompletedAt,
            TotalQuestions = e.TotalQuestions,
            CorrectAnswers = e.CorrectAnswers,
            TotalScore = e.TotalScore,
            Status = e.Status,
            Questions = (questions ?? new List<Question>()).Select(q => new EvaluationQuestionDto
            {
                QuestionId = q.Id,
                Text = q.Text,
                Options = ParseOptions(q.OptionsJson),
                Points = q.Points
            }).ToList(),
            Answers = e.Answers.Select(a => new EvaluationAnswerDto
            {
                QuestionId = a.QuestionId,
                AnswerText = a.AnswerText,
                IsCorrect = a.IsCorrect,
                PointsEarned = a.PointsEarned
            }).ToList()
        };
    }
}