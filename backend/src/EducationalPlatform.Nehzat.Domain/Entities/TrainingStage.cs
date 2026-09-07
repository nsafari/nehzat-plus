using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities;

[Table("Nehzat_training_stages")]
public class TrainingStage
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public int CourseId { get; set; }

    [Column(TypeName = "nvarchar(255)")]
    public string Title { get; set; } = string.Empty;

    [Column(TypeName = "nvarchar(255)")]
    public string? Slug { get; set; }

    public int StageOrder { get; set; }

    public bool Required { get; set; } = true;

    public int? PrerequisiteStageId { get; set; }

    [Column(TypeName = "nvarchar(max)")]
    public string? Description { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [ForeignKey(nameof(CourseId))]
    public TrainingCourse? Course { get; set; }

    [ForeignKey(nameof(PrerequisiteStageId))]
    public TrainingStage? PrerequisiteStage { get; set; }

    public ICollection<TrainingSession> Sessions { get; set; } = new List<TrainingSession>();
}
