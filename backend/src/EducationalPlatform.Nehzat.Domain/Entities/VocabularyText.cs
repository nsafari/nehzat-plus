using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities;

[Table("Nehzat_vocabulary_texts")]
public class VocabularyText
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Column(TypeName = "nvarchar(200)")]
    public string Title { get; set; } = string.Empty;

    [Column(TypeName = "nvarchar(1000)")]
    public string? Description { get; set; }

    [Column(TypeName = "nvarchar(max)")]
    public string? Content { get; set; }  // the full text content

    [Column(TypeName = "nvarchar(500)")]
    public string? Language { get; set; } = "fa";

    public int? SubjectAreaId { get; set; }

    [ForeignKey(nameof(SubjectAreaId))]
    public SubjectArea? SubjectArea { get; set; }

    public int? OwnerUserId { get; set; }

    [ForeignKey(nameof(OwnerUserId))]
    public User? Owner { get; set; }

    public bool IsPublished { get; set; } = false;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}