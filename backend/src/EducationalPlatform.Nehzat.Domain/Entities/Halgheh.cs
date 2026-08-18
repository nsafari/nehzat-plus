using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities;

[Table("halghehs", Schema = "nehzat")]
public class Halgheh
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Column("id")]
    public int Id { get; set; }

    [Column("maktab_id")]
    public int MaktabId { get; set; }

    [ForeignKey(nameof(MaktabId))]
    public Maktab Maktab { get; set; } = null!;

    [Column("name")]
    [Required, MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [Column("name_en")]
    [MaxLength(200)]
    public string? NameEn { get; set; }

    [Column("code")]
    [Required, MaxLength(50)]
    public string Code { get; set; } = string.Empty;

    [Column("description")]
    public string? Description { get; set; }

    // ============ فیلدهای جدید Phase 6.5 ============
    [Column("max_members")]
    public int? MaxMembers { get; set; }

    [Column("moderator_user_id")]
    public int ModeratorUserId { get; set; }

    [ForeignKey(nameof(ModeratorUserId))]
    public User Moderator { get; set; } = null!;

    [Column("status")]
    [Required, MaxLength(20)]
    public string Status { get; set; } = "active";

    [Column("is_deleted")]
    public bool IsDeleted { get; set; }

    // ============ فیلدهای موجود ============
    [Column("is_active")]
    public bool IsActive { get; set; } = true;

    [Column("sort_order")]
    public int SortOrder { get; set; } = 0;

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Column("updated_at")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // ============ navigation ============
    public ICollection<HalghehMember> Members { get; set; } = new List<HalghehMember>();
}
