using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities;

[Table("Nehzat_daily_activities")]
public class DailyActivity
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public int UserId { get; set; }

    [ForeignKey(nameof(UserId))]
    public User User { get; set; } = null!;

    [Column(TypeName = "date")]
    public DateTime ActivityDate { get; set; }

    public int? ActivityMinutes { get; set; }

    public int? Steps { get; set; }

    [Column(TypeName = "decimal(3,1)")]
    public decimal? SleepHours { get; set; }

    [Column(TypeName = "text")]
    public string? Notes { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}