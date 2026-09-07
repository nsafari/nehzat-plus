using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities;

[Table("Nehzat_user_vocabulary_cards")]
public class UserVocabularyCard
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public int UserId { get; set; }

    [ForeignKey(nameof(UserId))]
    public User User { get; set; } = null!;

    public int VocabularyWordId { get; set; }

    [ForeignKey(nameof(VocabularyWordId))]
    public VocabularyWord VocabularyWord { get; set; } = null!;

    // Spaced repetition state
    public DateTime NextReviewAt { get; set; } = DateTime.UtcNow;

    public int Interval { get; set; } = 0;

    public double EaseFactor { get; set; } = 2.5;

    public int Repetition { get; set; } = 0;

    // Student's interaction
    public int Quality { get; set; }  // 1-4 rating from review

    public bool IsKnown { get; set; } = false;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}