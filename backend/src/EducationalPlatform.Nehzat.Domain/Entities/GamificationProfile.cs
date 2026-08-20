using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities;

[Table("Nehzat_gamification_profiles")]
public class GamificationProfile
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public int UserId { get; set; }

    [ForeignKey(nameof(UserId))]
    public User? User { get; set; }

    public int TotalXp { get; set; }
    public int Level { get; set; }
    public int Coins { get; set; }
    public int StreakDays { get; set; }
    public int TotalLogins { get; set; }
    public int QuizzesCompleted { get; set; }
    public int CorrectAnswers { get; set; }
    public DateTime? LastLoginDate { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<StudentBadge> Badges { get; set; } = new List<StudentBadge>();
}
