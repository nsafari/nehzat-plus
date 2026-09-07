using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities;

[Table("Nehzat_student_study_paths")]
public class StudentStudyPath
{
    public int Id { get; set; }

    public int StudentId { get; set; }
    [ForeignKey(nameof(StudentId))]
    public Student Student { get; set; } = null!;

    public int StudyPathId { get; set; }
    [ForeignKey(nameof(StudyPathId))]
    public StudyPath StudyPath { get; set; } = null!;

    public DateTime EnrollmentDate { get; set; } = DateTime.UtcNow;

    public int? CurrentStepId { get; set; }
    [ForeignKey(nameof(CurrentStepId))]
    public StudyPathStep? CurrentStep { get; set; }

    [MaxLength(20)]
    public string Status { get; set; } = "active";

    [Range(0, 100)]
    public int ProgressPercentage { get; set; }

    public DateTime? StartedAt { get; set; }

    public DateTime? CompletedAt { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}