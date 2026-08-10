using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities;

[Table("Nehzat_training_progress")]
public class TrainingProgress
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public int EnrollmentId { get; set; }

    public int SessionId { get; set; }

    [Column(TypeName = "nvarchar(20)")]
    public string Status { get; set; } = "NotStarted";

    [Column(TypeName = "decimal(5,2)")]
    public decimal? Score { get; set; }

    public DateTime? CompletedAt { get; set; }

    [Column(TypeName = "nvarchar(max)")]
    public string? Notes { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [ForeignKey(nameof(EnrollmentId))]
    public TrainingEnrollment? Enrollment { get; set; }

    [ForeignKey(nameof(SessionId))]
    public TrainingSession? Session { get; set; }
}
