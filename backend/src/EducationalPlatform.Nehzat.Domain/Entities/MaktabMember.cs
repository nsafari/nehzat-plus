using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities;

[Table("maktab_members", Schema = "nehzat")]
public class MaktabMember
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Column("id")]
    public int Id { get; set; }

    [Column("maktab_id")]
    public int MaktabId { get; set; }

    [ForeignKey(nameof(MaktabId))]
    public Maktab? Maktab { get; set; }

    [Column("user_id")]
    public int UserId { get; set; }

    [ForeignKey(nameof(UserId))]
    public User? User { get; set; }

    // ============ نقش ============
    [Column("role")]
    [Required, MaxLength(20)]
    public string Role { get; set; } = "member";  // owner | manager | member

    // ============ وضعیت عضویت ============
    [Column("status")]
    [MaxLength(20)]
    public string Status { get; set; } = "active";  // active | inactive | banned

    // ============ metadata ============
    [Column("joined_at")]
    public DateTime JoinedAt { get; set; } = DateTime.UtcNow;

    [Column("left_at")]
    public DateTime? LeftAt { get; set; }
}
