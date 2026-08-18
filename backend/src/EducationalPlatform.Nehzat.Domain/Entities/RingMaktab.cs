using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities;

[Table("ring_maktabs", Schema = "nehzat")]
public class RingMaktab
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Column("id")]
    public int Id { get; set; }

    [Column("ring_id")]
    public int RingId { get; set; }

    [ForeignKey(nameof(RingId))]
    public Ring Ring { get; set; } = null!;

    [Column("maktab_id")]
    public int MaktabId { get; set; }

    [ForeignKey(nameof(MaktabId))]
    public Maktab Maktab { get; set; } = null!;

    [Column("halgheh_id")]
    public int HalghehId { get; set; }

    [ForeignKey(nameof(HalghehId))]
    public Halgheh Halgheh { get; set; } = null!;

    [Column("academic_year")]
    [MaxLength(10)]
    public string? AcademicYear { get; set; }

    [Column("is_active")]
    public bool IsActive { get; set; } = true;

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
