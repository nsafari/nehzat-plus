using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities;

[Table("Nehzat_training_assignments")]
public class TrainingAssignment
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public int SessionId { get; set; }

    [Column(TypeName = "nvarchar(255)")]
    public string Title { get; set; } = string.Empty;

    [Column(TypeName = "nvarchar(max)")]
    public string? Description { get; set; }

    public DateTime? Deadline { get; set; }

    [Column(TypeName = "nvarchar(20)")]
    public string SubmissionType { get; set; } = "text";

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [ForeignKey(nameof(SessionId))]
    public TrainingSession? Session { get; set; }

    public ICollection<TrainingSubmission> Submissions { get; set; } = new List<TrainingSubmission>();
}
