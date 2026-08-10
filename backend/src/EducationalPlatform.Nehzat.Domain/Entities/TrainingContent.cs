using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities;

[Table("Nehzat_training_content")]
public class TrainingContent
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public int SessionId { get; set; }

    [Column(TypeName = "nvarchar(20)")]
    public string ContentType { get; set; } = "transcript";

    [Column(TypeName = "nvarchar(500)")]
    public string? SourceFile { get; set; }

    [Column(TypeName = "nvarchar(max)")]
    public string? RawText { get; set; }

    [Column(TypeName = "nvarchar(max)")]
    public string? StructuredData { get; set; }

    public DateTime ImportedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }

    [ForeignKey(nameof(SessionId))]
    public TrainingSession? Session { get; set; }
}
