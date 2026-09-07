using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities;

[Table("Nehzat_training_sessions")]
public class TrainingSession
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public int StageId { get; set; }

    [Column(TypeName = "nvarchar(255)")]
    public string Title { get; set; } = string.Empty;

    public int SessionNumber { get; set; }

    public int DurationMinutes { get; set; } = 45;

    [Column(TypeName = "nvarchar(20)")]
    public string SessionType { get; set; } = "theory";

    [Column(TypeName = "nvarchar(max)")]
    public string? Description { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [ForeignKey(nameof(StageId))]
    public TrainingStage? Stage { get; set; }

    public ICollection<TrainingContent> Contents { get; set; } = new List<TrainingContent>();
    public ICollection<TrainingAssignment> Assignments { get; set; } = new List<TrainingAssignment>();
}
