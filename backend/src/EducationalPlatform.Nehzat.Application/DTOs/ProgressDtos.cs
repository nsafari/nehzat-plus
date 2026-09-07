namespace EducationalPlatform.Nehzat.Application.DTOs;

public class ProgressReportDto
{
    public int Id { get; set; }
    public int StudentId { get; set; }
    public string StudentName { get; set; } = string.Empty;
    public DateTime PeriodStart { get; set; }
    public DateTime PeriodEnd { get; set; }
    public decimal OverallScore { get; set; }
    public decimal AttendanceRate { get; set; }
    public decimal AssignmentCompletionRate { get; set; }
    public int CompletedAssignments { get; set; }
    public int TotalAssignments { get; set; }
    public string? CoachNote { get; set; }
    public DateTime GeneratedAt { get; set; }
    public List<ProgressMetricDto> Metrics { get; set; } = new();
}

public class ProgressMetricDto
{
    public int Id { get; set; }
    public string MetricKey { get; set; } = string.Empty;
    public string MetricLabel { get; set; } = string.Empty;
    public decimal Score { get; set; }
    public decimal Target { get; set; }
    public int Rank { get; set; }
    public string? Notes { get; set; }
}

public class DashboardSummaryDto
{
    public List<ProgressReportDto> RecentReports { get; set; } = new();
    public List<ProgressTrendPointDto> Trend { get; set; } = new();
    public int PendingEvaluations { get; set; }
    public int UnreadMessages { get; set; }
    public int OpenWorkflows { get; set; }
    public int TotalXp { get; set; }
    public List<ProgressLeaderboardEntryDto> Leaderboard { get; set; } = new();
}

public class ProgressTrendPointDto
{
    public DateTime Date { get; set; }
    public decimal OverallScore { get; set; }
    public decimal AttendanceRate { get; set; }
    public decimal AssignmentCompletionRate { get; set; }
}

public class ProgressLeaderboardEntryDto
{
    public int StudentId { get; set; }
    public string StudentName { get; set; } = string.Empty;
    public decimal OverallScore { get; set; }
    public int Rank { get; set; }
}

public class GenerateReportRequest
{
    public int StudentId { get; set; }
    public DateTime PeriodStart { get; set; }
    public DateTime PeriodEnd { get; set; }
    public string? CoachNote { get; set; }
}
