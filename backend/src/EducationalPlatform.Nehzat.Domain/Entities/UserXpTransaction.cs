using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities;

[Table("Nehzat_xp_transactions")]
public class UserXpTransaction
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public int UserId { get; set; }

    [ForeignKey(nameof(UserId))]
    public User User { get; set; } = null!;

    public int XpAmount { get; set; }

    [Column(TypeName = "nvarchar(300)")]
    public string Reason { get; set; } = string.Empty;

    public int? BadgeId { get; set; }

    [ForeignKey(nameof(BadgeId))]
    public XpBadge? Badge { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
