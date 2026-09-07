using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities;

[Table("badges", Schema = "nehzat")]
public class Badge
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Column(TypeName = "varchar(100)")]
    public string Code { get; set; } = string.Empty;

    [Column(TypeName = "nvarchar(200)")]
    public string Title { get; set; } = string.Empty;

    [Column(TypeName = "nvarchar(500)")]
    public string? Description { get; set; }

    [Column(TypeName = "nvarchar(500)")]
    public string? IconUrl { get; set; }

    [Column(TypeName = "varchar(100)")]
    public string ConditionType { get; set; } = string.Empty;

    [Column(TypeName = "nvarchar(255)")]
    public string ConditionValue { get; set; } = string.Empty;

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<UserBadge> UserBadges { get; set; } = new List<UserBadge>();
}