using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;

namespace EducationalPlatform.Nehzat.Domain.Entities;

[Table("halgheh_assignments", Schema = "nehzat")]
public class HalghehAssignment
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Column("id")]
    public int Id { get; set; }

    [Column("halgheh_id")]
    public int HalghehId { get; set; }

    [ForeignKey(nameof(HalghehId))]
    public Halgheh Halgheh { get; set; } = null!;

    [Column("title")]
    [Required, MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [Column("description")]
    public string? Description { get; set; }

    [Column("due_date")]
    public DateTime? DueDate { get; set; }

    [Column("status")]
    [Required, MaxLength(20)]
    public string Status { get; set; } = "active"; // draft | active | closed

    [Column("created_by_user_id")]
    public int CreatedByUserId { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Column("updated_at")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<HalghehAssignmentSubmission> Submissions { get; set; } = new List<HalghehAssignmentSubmission>();
}