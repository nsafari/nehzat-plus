using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities;

[Table("maktabs", Schema = "nehzat")]
public class Maktab
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Column("id")]
    public int Id { get; set; }

    [Column("name")]
    [Required, MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [Column("name_en")]
    [MaxLength(200)]
    public string? NameEn { get; set; }

    [Column("description")]
    public string? Description { get; set; }

    [Column("city")]
    [MaxLength(100)]
    public string? City { get; set; }

    [Column("address")]
    public string? Address { get; set; }

    [Column("phone")]
    [MaxLength(20)]
    public string? Phone { get; set; }

    // ============ مالکیت ============
    [Column("owner_user_id")]
    public int OwnerUserId { get; set; }

    [ForeignKey(nameof(OwnerUserId))]
    public User? Owner { get; set; }

    // ============ کد دعوت ============
    [Column("invite_code")]
    [Required, MaxLength(20)]
    public string InviteCode { get; set; } = string.Empty;

    // ============ وضعیت ============
    [Column("status")]
    [MaxLength(20)]
    public string Status { get; set; } = "active";  // active | inactive | archived

    // ============ عمومی/خصوصی ============
    [Column("is_public")]
    public bool IsPublic { get; set; } = false;

    // ============ soft delete ============
    [Column("is_deleted")]
    public bool IsDeleted { get; set; } = false;

    // ============ metadata ============
    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Column("updated_at")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // ============ navigation ============
    public ICollection<MaktabMember> Members { get; set; } = new List<MaktabMember>();
}
