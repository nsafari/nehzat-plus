using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities;

[Table("Nehzat_vocabulary_words")]
public class VocabularyWord
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Column(TypeName = "nvarchar(200)")]
    public string WordText { get; set; } = string.Empty;  // the actual word

    [Column(TypeName = "nvarchar(500)")]
    public string? Definition { get; set; }  // Persian definition

    [Column(TypeName = "nvarchar(500)")]
    public string? ExampleSentence { get; set; }

    [Column(TypeName = "nvarchar(500)")]
    public string? ExampleTranslation { get; set; }

    [Column(TypeName = "nvarchar(50)")]
    public string PartOfSpeech { get; set; } = string.Empty;  // noun, verb, adjective, etc.

    [Column(TypeName = "nvarchar(200)")]
    public string? ImageUrl { get; set; }  // optional image for the word

    [Column(TypeName = "nvarchar(200)")]
    public string? AudioUrl { get; set; }  // optional pronunciation audio

    [Column(TypeName = "nvarchar(100)")]
    public string DifficultyLevel { get; set; } = "medium";  // easy, medium, hard

    public int VocabularyTextId { get; set; }

    [ForeignKey(nameof(VocabularyTextId))]
    public VocabularyText VocabularyText { get; set; } = null!;

    public int DisplayOrder { get; set; } = 0;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}