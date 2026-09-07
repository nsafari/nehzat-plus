using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Domain.Entities;
using EducationalPlatform.Nehzat.Domain.Entities.Math;
using EducationalPlatform.Nehzat.Domain.Entities.Quran;
using EducationalPlatform.Nehzat.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace EducationalPlatform.Nehzat.Infrastructure.Services;

public class ProgressService : IProgressService
{
    private readonly AppDbContext _db;

    public ProgressService(AppDbContext db) => _db = db;

    public async Task<DashboardSummaryDto> GetDashboardAsync(int userId)
    {
        var user = await _db.Users.FindAsync(userId);
        var isStudent = user?.StudentId != null;

        List<ProgressReport> reports;
        if (isStudent && user!.StudentId != null)
        {
            reports = await _db.ProgressReports
                .Include(r => r.Metrics)
                .Include(r => r.Student)
                .Where(r => r.StudentId == user.StudentId)
                .OrderByDescending(r => r.PeriodEnd)
                .Take(6)
                .ToListAsync();
        }
        else
        {
            var all = await _db.ProgressReports
                .Include(r => r.Metrics)
                .Include(r => r.Student)
                .OrderByDescending(r => r.PeriodEnd)
                .ToListAsync();
            reports = all.GroupBy(r => r.StudentId)
                .Select(g => g.First())
                .Take(6)
                .ToList();
        }

        var recentReports = reports.Take(3).Select(r => ToDto(r)).ToList();
        var trend = reports
            .OrderBy(r => r.PeriodEnd)
            .Select(r => new ProgressTrendPointDto
            {
                Date = r.PeriodEnd,
                OverallScore = r.OverallScore,
                AttendanceRate = r.AttendanceRate,
                AssignmentCompletionRate = r.AssignmentCompletionRate
            })
            .ToList();

        var unreadMessages = await CountUnreadMessagesAsync(userId);
        var openWorkflows = await _db.WorkflowRequests.CountAsync(w => w.Status == "pending");
        var totalXp = await _db.UserXp
            .Where(x => x.UserId == userId)
            .Select(x => (int?)x.TotalXp)
            .FirstOrDefaultAsync() ?? 0;

        var pendingEvaluations = isStudent
            ? await _db.AssessmentResults.CountAsync(a => a.StudentId == user!.StudentId && a.Status == "pending")
            : await _db.AssessmentResults.CountAsync(a => a.Status == "pending");

        return new DashboardSummaryDto
        {
            RecentReports = recentReports,
            Trend = trend,
            PendingEvaluations = pendingEvaluations,
            UnreadMessages = unreadMessages,
            OpenWorkflows = openWorkflows,
            TotalXp = totalXp,
            Leaderboard = await GetLeaderboardAsync(userId, 5)
        };
    }

    public async Task<List<ProgressReportDto>> GetReportsByStudentAsync(int userId, int studentId, int limit = 12)
    {
        var reports = await _db.ProgressReports
            .Include(r => r.Metrics)
            .Include(r => r.Student)
            .Where(r => r.StudentId == studentId)
            .OrderByDescending(r => r.PeriodEnd)
            .Take(limit)
            .ToListAsync();
        return reports.Select(ToDto).ToList();
    }

    public async Task<ProgressReportDto> GenerateReportAsync(int userId, GenerateReportRequest req)
    {
        var mathScore = await AverageOrZeroAsync(
            _db.MathProgresses.Where(p => p.StudentId == req.StudentId && p.Score.HasValue).Select(p => (decimal?)p.Score));

        var quranScore = await AverageOrZeroAsync(
            _db.QuranStudentProgresses.Where(q => q.StudentId == req.StudentId).Select(q => (decimal?)q.Percentage));

        var submissions = await _db.AssignmentSubmissions
            .Where(s => s.StudentId == req.StudentId
                && s.SubmissionDate >= req.PeriodStart.Date
                && s.SubmissionDate <= req.PeriodEnd.Date)
            .ToListAsync();
        var completed = submissions.Count(s => s.IsCompleted);
        var total = submissions.Count;
        var completionRate = total > 0 ? Math.Round((decimal)completed / total * 100m, 2) : 0m;

        var metrics = new List<ProgressMetric>
        {
            new()
            {
                MetricKey = "math",
                MetricLabel = "ریاضی",
                Score = mathScore,
                Target = 100,
                Rank = 1,
                Notes = "میانگین نمرات تمرین‌های ریاضی"
            },
            new()
            {
                MetricKey = "quran",
                MetricLabel = "قرآن",
                Score = quranScore,
                Target = 100,
                Rank = 2,
                Notes = "میانگین درصد پیشرفت قرائت و حفظ"
            },
            new()
            {
                MetricKey = "assignments",
                MetricLabel = "تکالیف",
                Score = completionRate,
                Target = 100,
                Rank = 3,
                Notes = $"تکمیل {completed} از {total} تکلیف دوره"
            },
            new()
            {
                MetricKey = "behavior",
                MetricLabel = "رفتار",
                Score = 85,
                Target = 100,
                Rank = 4,
                Notes = "ارزیابی مربی"
            }
        };

        var overall = Math.Round(metrics.Average(m => m.Score), 2);

        var report = new ProgressReport
        {
            StudentId = req.StudentId,
            PeriodStart = req.PeriodStart,
            PeriodEnd = req.PeriodEnd,
            OverallScore = overall,
            AttendanceRate = completionRate,
            AssignmentCompletionRate = completionRate,
            CompletedAssignments = completed,
            TotalAssignments = total,
            CoachNote = req.CoachNote,
            GeneratedAt = DateTime.UtcNow,
            Metrics = metrics
        };

        _db.ProgressReports.Add(report);
        await _db.SaveChangesAsync();
        return ToDto(report);
    }

    public async Task<List<ProgressLeaderboardEntryDto>> GetLeaderboardAsync(int userId, int limit = 10)
    {
        var all = await _db.ProgressReports
            .Include(r => r.Student)
            .OrderByDescending(r => r.PeriodEnd)
            .ToListAsync();

        var top = all.GroupBy(r => r.StudentId)
            .Select(g => g.First())
            .OrderByDescending(r => r.OverallScore)
            .Take(limit)
            .ToList();

        return top
            .Select((r, i) => new ProgressLeaderboardEntryDto
            {
                StudentId = r.StudentId,
                StudentName = r.Student != null
                    ? $"{r.Student.FirstName} {r.Student.LastName}".Trim()
                    : $"دانش‌آموز {r.StudentId}",
                OverallScore = r.OverallScore,
                Rank = i + 1
            })
            .ToList();
    }

    private async Task<int> CountUnreadMessagesAsync(int userId)
    {
        var memberships = await _db.ConversationMembers
            .Where(cm => cm.UserId == userId)
            .Select(cm => new { cm.ConversationId, cm.LastReadAt })
            .ToListAsync();

        if (memberships.Count == 0) return 0;

        var conversationIds = memberships.Select(m => m.ConversationId).ToList();

        var messages = await _db.Messages
            .Where(m => conversationIds.Contains(m.ConversationId)
                && m.SenderId != userId
                && !m.IsDeleted)
            .Select(m => new { m.ConversationId, m.CreatedAt })
            .ToListAsync();

        var unread = 0;
        foreach (var membership in memberships)
        {
            var lastReadAt = membership.LastReadAt;
            unread += messages.Count(m =>
                m.ConversationId == membership.ConversationId &&
                (!lastReadAt.HasValue || m.CreatedAt > lastReadAt.Value));
        }
        return unread;
    }

    private static async Task<decimal> AverageOrZeroAsync(IQueryable<decimal?> query)
    {
        var values = await query.ToListAsync();
        if (values.Count == 0) return 0m;
        var average = values.Where(v => v.HasValue).Select(v => v!.Value).DefaultIfEmpty(0m).Average();
        return Math.Clamp(average, 0m, 100m);
    }

    private static ProgressReportDto ToDto(ProgressReport r) => new()
    {
        Id = r.Id,
        StudentId = r.StudentId,
        StudentName = r.Student != null
            ? $"{r.Student.FirstName} {r.Student.LastName}".Trim()
            : $"دانش‌آموز {r.StudentId}",
        PeriodStart = r.PeriodStart,
        PeriodEnd = r.PeriodEnd,
        OverallScore = r.OverallScore,
        AttendanceRate = r.AttendanceRate,
        AssignmentCompletionRate = r.AssignmentCompletionRate,
        CompletedAssignments = r.CompletedAssignments,
        TotalAssignments = r.TotalAssignments,
        CoachNote = r.CoachNote,
        GeneratedAt = r.GeneratedAt,
        Metrics = r.Metrics.OrderBy(m => m.Rank).Select(m => new ProgressMetricDto
        {
            Id = m.Id,
            MetricKey = m.MetricKey,
            MetricLabel = m.MetricLabel,
            Score = m.Score,
            Target = m.Target,
            Rank = m.Rank,
            Notes = m.Notes
        }).ToList()
    };
}
