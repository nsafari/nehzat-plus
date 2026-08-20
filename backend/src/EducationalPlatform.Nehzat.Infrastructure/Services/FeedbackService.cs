using Microsoft.EntityFrameworkCore;
using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Domain.Entities;
using EducationalPlatform.Nehzat.Infrastructure.Data;

namespace EducationalPlatform.Nehzat.Infrastructure.Services;

public class FeedbackService : IFeedbackService
{
    private readonly AppDbContext _db;

    public FeedbackService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<FeedbackDto?> GetLatestFeedbackAsync(string userId)
    {
        var feedbacks = await GetRecentFeedbacksAsync(userId, 1);
        return feedbacks.FirstOrDefault();
    }

    public async Task<List<FeedbackDto>> GetRecentFeedbacksAsync(string userId, int count = 5)
    {
        var user = await _db.Users
            .FirstOrDefaultAsync(u => u.Username == userId);
        if (user?.StudentId is null) return new();

        var student = await _db.Students.FindAsync(user.StudentId.Value);
        if (student is null) return new();

        var submissions = await _db.TrainingSubmissions
            .Where(s => s.UserId == user.Id)
            .OrderByDescending(s => s.SubmittedAt)
            .Take(count)
            .Include(s => s.Assignment)
                .ThenInclude(a => a!.Session)
                    .ThenInclude(se => se!.Stage)
                        .ThenInclude(st => st!.Course)
            .ToListAsync();

        return submissions.Select(s => BuildFeedbackDto(s, student)).ToList();
    }

    public async Task<FeedbackDto?> GetSubmissionFeedbackAsync(int submissionId)
    {
        var submission = await _db.TrainingSubmissions
            .Include(s => s.Assignment)
                .ThenInclude(a => a!.Session)
                    .ThenInclude(se => se!.Stage)
                        .ThenInclude(st => st!.Course)
            .Include(s => s.User)
            .FirstOrDefaultAsync(s => s.Id == submissionId);

        if (submission?.User?.StudentId is null) return null;

        var student = await _db.Students.FindAsync(submission.User.StudentId.Value);
        if (student is null) return null;

        return BuildFeedbackDto(submission, student);
    }

    private FeedbackDto BuildFeedbackDto(TrainingSubmission submission, Student student)
    {
        var phase = GetPhase(student.DateOfBirth);
        var grade = (int)(submission.Grade ?? 0);
        var course = submission.Assignment?.Session?.Stage?.Course;

        return new FeedbackDto
        {
            Phase = phase,
            Title = GetTitle(phase),
            MainText = GetMainText(phase, grade),
            Emoji = GetEmoji(phase, grade),
            Grade = grade,
            MaxGrade = 100,
            ChartData = phase is "C" or "D" or "E"
                ? GenerateChartData(grade)
                : new(),
            Analysis = phase is "D" or "E" ? GetAnalysis(grade) : null,
            Suggestions = phase is "E" ? GetSuggestions(grade) : null,
            SubjectName = course?.Title,
            FeedbackDate = submission.SubmittedAt,
            SubmissionId = submission.Id,
        };
    }

    private static string GetPhase(DateTime? dateOfBirth)
    {
        if (dateOfBirth is null) return "E";
        var today = DateTime.UtcNow;
        var age = today.Year - dateOfBirth.Value.Year;
        if (dateOfBirth.Value.Date > today.AddYears(-age)) age--;

        return age switch
        {
            <= 8 => "A",
            <= 11 => "B",
            <= 14 => "C",
            <= 17 => "D",
            _ => "E"
        };
    }

    private static string GetTitle(string phase) => phase switch
    {
        "A" => "آفرین! 🎉",
        "B" => "نمره‌ات",
        _ => "گزارش"
    };

    private static string GetMainText(string phase, int score) => phase switch
    {
        "A" => "عالی بود! به تلاشت ادامه بده 🌟",
        "B" => $"نمره تو {score} از ۱۰۰ هست. خوب کار کردی!",
        "C" => $"نمره نهایی: {score} از ۱۰۰. نمودار زیر رو ببین.",
        "D" => $"نمره نهایی: {score} از ۱۰۰. تحلیل کامل در ادامه.",
        _ => $"نمره نهایی: {score} از ۱۰۰. گزارش جامع زیر."
    };

    private static string GetEmoji(string phase, int score) => phase switch
    {
        "A" when score >= 80 => "🌟",
        "A" => "👍",
        "B" when score >= 80 => "⭐",
        _ => "📊"
    };

    private static List<ChartDataPointDto> GenerateChartData(int score)
    {
        return new()
        {
            new() { Label = "دقت", Value = score * 0.3, Color = "#4CAF50" },
            new() { Label = "خلاقیت", Value = score * 0.25, Color = "#2196F3" },
            new() { Label = "تلاش", Value = score * 0.25, Color = "#FF9800" },
            new() { Label = "دانش", Value = score * 0.2, Color = "#9C27B0" },
        };
    }

    private static string GetAnalysis(int score) => score switch
    {
        >= 90 => "عملکردت عالی بود. در همه زمینه‌ها موفق عمل کردی.",
        >= 70 => "خوب بودی. می‌تونی با تمرکز روی نقاط ضعف، بهتر بشی.",
        >= 50 => "قابل قبوله. نیاز به تلاش بیشتر داری.",
        _ => "باید بیشتر تلاش کنی. پیشنهاد می‌کنم از معلمت کمک بگیری."
    };

    private static List<string> GetSuggestions(int score)
    {
        var suggestions = new List<string>
        {
            "مرور درس‌ها قبل از آزمون",
            "حل تمرین‌های اضافی",
        };
        if (score < 70)
            suggestions.Add("شرکت در کلاس تقویتی");
        return suggestions;
    }
}
