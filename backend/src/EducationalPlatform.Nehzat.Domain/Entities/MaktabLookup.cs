using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities;

[Table("Nehzat_maktab_lookup")]
public class MaktabLookup
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Column(TypeName = "nvarchar(20)")]
    public string Gender { get; set; } = string.Empty;

    public int AgeMin { get; set; }

    public int AgeMax { get; set; }

    [Column(TypeName = "nvarchar(100)")]
    public string MaktabName { get; set; } = string.Empty;

    [Column(TypeName = "nvarchar(100)")]
    public string? MaktabNameEn { get; set; }

    [Column(TypeName = "nvarchar(10)")]
    public string Phase { get; set; } = string.Empty;

    [Column(TypeName = "nvarchar(500)")]
    public string? Description { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
