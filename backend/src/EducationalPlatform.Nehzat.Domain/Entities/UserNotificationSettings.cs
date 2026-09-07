using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities;

[Table("Nehzat_user_notification_settings")]
public class UserNotificationSettings
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public int UserId { get; set; }

    [ForeignKey(nameof(UserId))]
    public User User { get; set; } = null!;

    public bool NewAssignment { get; set; } = true;

    public bool SubmissionReviewed { get; set; } = true;

    public bool NewMember { get; set; } = true;

    public bool SessionReminder { get; set; } = true;

    public bool SystemAnnouncement { get; set; } = true;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
