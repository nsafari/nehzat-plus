using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities;

[Table("Nehzat_progress_reports")]
public class ProgressReport
{
    public int Id { get; set; }
    public int StudentId { get; set; }
    public Student Student { get; set; } = null!;
    public DateTime PeriodStart { get; set; } // 14-day window start
    public DateTime PeriodEnd { get; set; }
    [Column(TypeName = "decimal(5,2)")] public decimal OverallScore { get; set; } // 0-100
    [Column(TypeName = "decimal(5,2)")] public decimal AttendanceRate { get; set; }
    [Column(TypeName = "decimal(5,2)")] public decimal AssignmentCompletionRate { get; set; }
    public int CompletedAssignments { get; set; }
    public int TotalAssignments { get; set; }
    [Column(TypeName = "nvarchar(500)")] public string? CoachNote { get; set; }
    public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;

    public virtual ICollection<ProgressMetric> Metrics { get; set; } = new List<ProgressMetric>();
}

[Table("Nehzat_progress_metrics")]
public class ProgressMetric
{
    public int Id { get; set; }
    public int ProgressReportId { get; set; }
    public ProgressReport Report { get; set; } = null!;
    [Column(TypeName = "nvarchar(100)")] public string MetricKey { get; set; } = string.Empty; // e.g., "math", "quran", "behavior"
    [Column(TypeName = "nvarchar(100)")] public string MetricLabel { get; set; } = string.Empty; // Persian label
    [Column(TypeName = "decimal(5,2)")] public decimal Score { get; set; } // 0-100
    [Column(TypeName = "decimal(5,2)")] public decimal Target { get; set; } // 0-100
    public int Rank { get; set; } // 1=best
    [Column(TypeName = "nvarchar(max)")] public string? Notes { get; set; }
}
