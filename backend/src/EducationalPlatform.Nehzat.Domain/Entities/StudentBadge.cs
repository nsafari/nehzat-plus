using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities;

[Table("Nehzat_student_badges")]
public class StudentBadge
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public int ProfileId { get; set; }

    [ForeignKey(nameof(ProfileId))]
    public GamificationProfile? Profile { get; set; }

    [Column(TypeName = "nvarchar(50)")]
    public string BadgeCode { get; set; } = string.Empty;

    [Column(TypeName = "nvarchar(100)")]
    public string BadgeTitle { get; set; } = string.Empty;

    [Column(TypeName = "nvarchar(200)")]
    public string? BadgeImageUrl { get; set; }

    public DateTime EarnedAt { get; set; } = DateTime.UtcNow;
}
