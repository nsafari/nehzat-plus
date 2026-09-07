using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities;

[Table("Nehzat_notifications")]
public class Notification
{
    public int Id { get; set; }
    [Column(TypeName = "nvarchar(50)")] public string Type { get; set; } = "info"; // info|warning|success|error
    [Column(TypeName = "nvarchar(100)")] public string Title { get; set; } = string.Empty;
    [Column(TypeName = "nvarchar(max)")] public string Body { get; set; } = string.Empty;
    [Column(TypeName = "nvarchar(500)")] public string? Link { get; set; }
    [Column(TypeName = "nvarchar(500)")] public string? IconUrl { get; set; }
    public int? SenderUserId { get; set; }
    public User? Sender { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public virtual ICollection<UserNotification> Recipients { get; set; } = new List<UserNotification>();
}

[Table("Nehzat_user_notifications")]
public class UserNotification
{
    public int Id { get; set; }
    public int NotificationId { get; set; }
    public Notification Notification { get; set; } = null!;
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    public bool IsRead { get; set; }
    public DateTime? ReadAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

[Table("Nehzat_user_devices")]
public class UserDevice
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    [Column(TypeName = "nvarchar(500)")] public string DeviceToken { get; set; } = string.Empty;
    [Column(TypeName = "nvarchar(50)")] public string Platform { get; set; } = "web"; // web|android|ios
    [Column(TypeName = "nvarchar(100)")] public string? DeviceName { get; set; }
    public DateTime RegisteredAt { get; set; } = DateTime.UtcNow;
    public DateTime LastSeenAt { get; set; } = DateTime.UtcNow;
}

[Table("Nehzat_courier_daily_stats")]
public class CourierDailyStat
{
    public int Id { get; set; }
    public int CourierUserId { get; set; }
    public User Courier { get; set; } = null!;
    public DateTime Date { get; set; }
    public int DeliveredCount { get; set; }
    public decimal DistanceKm { get; set; }
    public decimal EarningsAmount { get; set; }
    public int AverageDeliveryMinutes { get; set; }
}
