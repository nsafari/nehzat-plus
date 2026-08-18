namespace EducationalPlatform.Nehzat.Application.DTOs;

public class CalendarEventDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime Start { get; set; }
    public DateTime End { get; set; }
    public bool AllDay { get; set; }
    public string Type { get; set; } = "personal";
    public string Color { get; set; } = "#3b82f6";
    public string? Location { get; set; }
    public int? CreatorUserId { get; set; }
    public bool IsPublic { get; set; }
    public List<CalendarAttendeeDto> Attendees { get; set; } = new();
}

public class CreateCalendarEventRequest
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime Start { get; set; }
    public DateTime End { get; set; }
    public bool AllDay { get; set; }
    public string Type { get; set; } = "personal";
    public string Color { get; set; } = "#3b82f6";
    public string? Location { get; set; }
    public bool IsPublic { get; set; }
    public List<int>? AttendeeUserIds { get; set; }
}

public class UpdateCalendarEventRequest : CreateCalendarEventRequest { }

public class CalendarAttendeeDto
{
    public int UserId { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string ResponseStatus { get; set; } = "pending";
}