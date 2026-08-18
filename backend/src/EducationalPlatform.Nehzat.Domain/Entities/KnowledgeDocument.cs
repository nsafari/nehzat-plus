using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities;

[Table("knowledge_documents", Schema = "nehzat")]
public class KnowledgeDocument
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [MaxLength(300)]
    public string Title { get; set; } = string.Empty;

    public string Content { get; set; } = string.Empty;

    [MaxLength(50)]
    public string DocumentType { get; set; } = string.Empty;

    public int? SubjectId { get; set; }

    public int? MaktabId { get; set; }

    public string? EmbeddingJson { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    [ForeignKey(nameof(SubjectId))]
    public SubjectArea? Subject { get; set; }

    [ForeignKey(nameof(MaktabId))]
    public Maktab? Maktab { get; set; }
}
