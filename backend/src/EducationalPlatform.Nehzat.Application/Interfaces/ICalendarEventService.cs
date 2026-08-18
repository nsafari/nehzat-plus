using EducationalPlatform.Nehzat.Application.DTOs;

namespace EducationalPlatform.Nehzat.Application.Interfaces;

public interface ICalendarEventService
{
    Task<List<CalendarEventDto>> GetEventsAsync(int userId, DateTime from, DateTime to);
    Task<CalendarEventDto> CreateAsync(int userId, CreateCalendarEventRequest req);
    Task<CalendarEventDto> UpdateAsync(int userId, int eventId, UpdateCalendarEventRequest req);
    Task DeleteAsync(int userId, int eventId);
    Task RespondAsync(int userId, int eventId, string response);
}