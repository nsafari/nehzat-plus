using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities;

[Table("halgheh_members", Schema = "nehzat")]
public class HalghehMember
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Column("id")]
    public int Id { get; set; }

    [Column("halgheh_id")]
    public int HalghehId { get; set; }

    [ForeignKey(nameof(HalghehId))]
    public Halgheh Halgheh { get; set; } = null!;

    [Column("user_id")]
    public int UserId { get; set; }

    [ForeignKey(nameof(UserId))]
    public User User { get; set; } = null!;

    [Column("role")]
    [Required, MaxLength(20)]
    public string Role { get; set; } = "member";

    [Column("status")]
    [Required, MaxLength(20)]
    public string Status { get; set; } = "active";

    [Column("joined_at")]
    public DateTime JoinedAt { get; set; } = DateTime.UtcNow;

    [Column("left_at")]
    public DateTime? LeftAt { get; set; }
}
