namespace EducationalPlatform.Nehzat.Application.DTOs;

public class ParentStudentInfo
{
    public int StudentId { get; set; }
    public string StudentName { get; set; } = string.Empty;
    public string StudentCode { get; set; } = string.Empty;
    public string? CourseName { get; set; }
    public double? LatestGrade { get; set; }
    public double? AttendanceRate { get; set; }

    public int Age { get; set; }
    public string Phase { get; set; } = "A";
    public int? ActivePathId { get; set; }
    public string? ActivePathTitle { get; set; }
    public int CompletedLevels { get; set; }
    public int TotalLevels { get; set; }
    public int CompletedLessons { get; set; }
    public int TotalLessons { get; set; }
    public DateTime? LastActivityDate { get; set; }
}
