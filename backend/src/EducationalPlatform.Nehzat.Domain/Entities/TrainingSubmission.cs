using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities;

[Table("Nehzat_training_submissions")]
public class TrainingSubmission
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public int AssignmentId { get; set; }

    public int UserId { get; set; }

    [Column(TypeName = "nvarchar(max)")]
    public string? Content { get; set; }

    [Column(TypeName = "nvarchar(500)")]
    public string? FileUrl { get; set; }

    public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;

    [Column(TypeName = "decimal(5,2)")]
    public decimal? Grade { get; set; }

    [Column(TypeName = "nvarchar(max)")]
    public string? Feedback { get; set; }

    [ForeignKey(nameof(AssignmentId))]
    public TrainingAssignment? Assignment { get; set; }

    [ForeignKey(nameof(UserId))]
    public User? User { get; set; }
}
