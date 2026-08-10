using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities;

[Table("Nehzat_calligraphy_samples")]
public class CalligraphySample
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public int UserId { get; set; }

    [ForeignKey(nameof(UserId))]
    public User User { get; set; } = null!;

    [Column(TypeName = "varchar(200)")]
    public string Title { get; set; } = string.Empty;

    [Column(TypeName = "text")]
    public string ImageUrl { get; set; } = string.Empty;

    [Column(TypeName = "varchar(100)")]
    public string? Style { get; set; }

    [Column(TypeName = "text")]
    public string? Description { get; set; }

    [Column(TypeName = "varchar(500)")]
    public string? Tags { get; set; }

    public bool IsPublic { get; set; } = true;

    public int LikeCount { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}