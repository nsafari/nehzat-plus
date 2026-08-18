using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities;

[Table("Nehzat_calendar_events")]
public class CalendarEvent
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Column(TypeName = "nvarchar(200)")]
    public string Title { get; set; } = string.Empty;

    [Column(TypeName = "nvarchar(max)")]
    public string? Description { get; set; }

    public DateTime Start { get; set; }
    public DateTime End { get; set; }
    public bool AllDay { get; set; }

    [Column(TypeName = "nvarchar(50)")]
    public string Type { get; set; } = "personal"; // personal|work|holiday|session|exam

    [Column(TypeName = "nvarchar(20)")]
    public string Color { get; set; } = "#3b82f6";

    [Column(TypeName = "nvarchar(200)")]
    public string? Location { get; set; }

    public int? CreatorUserId { get; set; }
    public bool IsPublic { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public User? Creator { get; set; }

    public List<CalendarEventAttendee> Attendees { get; set; } = new();
}

[Table("Nehzat_calendar_event_attendees")]
public class CalendarEventAttendee
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public int CalendarEventId { get; set; }
    public CalendarEvent CalendarEvent { get; set; } = null!;

    public int UserId { get; set; }
    public User User { get; set; } = null!;

    [Column(TypeName = "nvarchar(20)")]
    public string ResponseStatus { get; set; } = "pending"; // accepted|declined|tentative|pending
}
