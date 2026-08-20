using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using EducationalPlatform.Nehzat.Domain.Constants;

namespace EducationalPlatform.Nehzat.Domain.Entities;

[Table("Nehzat_study_path_steps")]
public class StudyPathStep
{
    public int Id { get; set; }

    public int StudyPathId { get; set; }
    [ForeignKey(nameof(StudyPathId))]
    public StudyPath StudyPath { get; set; } = null!;

    public int StepOrder { get; set; }

    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    [MaxLength(20)]
    public string CognitiveLevel { get; set; } = CognitiveLevels.Awareness;

    public int EstimatedDurationMinutes { get; set; } = 15;

    public string? PrerequisitesJson { get; set; }

    [MaxLength(500)]
    public string? ContentUrl { get; set; }

    public int? ResourceId { get; set; }

    public int? AssessmentId { get; set; }
    [ForeignKey(nameof(AssessmentId))]
    public Assessment? Assessment { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}