using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities;

[Table("Nehzat_spaced_repetition_cards")]
public class SpacedRepetitionCard
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public int UserId { get; set; }

    [ForeignKey(nameof(UserId))]
    public User User { get; set; } = null!;

    [Column(TypeName = "nvarchar(50)")]
    public string ContentType { get; set; } = string.Empty;

    public int? ContentId { get; set; }

    [Column(TypeName = "text")]
    public string Question { get; set; } = string.Empty;

    [Column(TypeName = "text")]
    public string Answer { get; set; } = string.Empty;

    public DateTime NextReviewAt { get; set; } = DateTime.UtcNow;

    public int Interval { get; set; }

    public double EaseFactor { get; set; } = 2.5;

    public int Repetition { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
