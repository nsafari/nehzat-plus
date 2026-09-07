using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities;

[Table("halgheh_assignment_submissions", Schema = "nehzat")]
public class HalghehAssignmentSubmission
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Column("id")]
    public int Id { get; set; }

    [Column("halgheh_assignment_id")]
    public int HalghehAssignmentId { get; set; }

    [ForeignKey(nameof(HalghehAssignmentId))]
    public HalghehAssignment HalghehAssignment { get; set; } = null!;

    [Column("user_id")]
    public int UserId { get; set; }

    [Column("content")]
    [Required]
    public string Content { get; set; } = string.Empty;

    [Column("status")]
    [Required, MaxLength(20)]
    public string Status { get; set; } = "submitted"; // submitted | approved | rejected

    [Column("feedback")]
    [MaxLength(2000)]
    public string? Feedback { get; set; }

    [Column("grade")]
    public int? Grade { get; set; } // 0-20

    [Column("submitted_at")]
    public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;

    [Column("reviewed_by_user_id")]
    public int? ReviewedByUserId { get; set; }

    [Column("reviewed_at")]
    public DateTime? ReviewedAt { get; set; }
}