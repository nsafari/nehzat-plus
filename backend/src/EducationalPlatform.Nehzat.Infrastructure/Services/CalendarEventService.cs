using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Domain.Entities;
using EducationalPlatform.Nehzat.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace EducationalPlatform.Nehzat.Infrastructure.Services;

public class CalendarEventService : ICalendarEventService
{
    private readonly AppDbContext _db;

    public CalendarEventService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<CalendarEventDto>> GetEventsAsync(int userId, DateTime from, DateTime to)
    {
        var query = _db.CalendarEvents
            .Include(e => e.Attendees)
            .ThenInclude(a => a.User)
            .Where(e =>
                (e.CreatorUserId == userId || e.IsPublic ||
                 e.Attendees.Any(a => a.UserId == userId)) &&
                e.Start < to && e.End > from);
        var events = await query.OrderBy(e => e.Start).ToListAsync();
        return events.Select(ToDto).ToList();
    }

    public async Task<CalendarEventDto> CreateAsync(int userId, CreateCalendarEventRequest req)
    {
        Validate(req);
        var eventEntity = new CalendarEvent
        {
            Title = req.Title.Trim(),
            Description = req.Description,
            Start = req.Start,
            End = req.End,
            AllDay = req.AllDay,
            Type = req.Type,
            Color = req.Color,
            Location = req.Location,
            CreatorUserId = userId,
            IsPublic = req.IsPublic,
            CreatedAt = DateTime.UtcNow
        };
        _db.CalendarEvents.Add(eventEntity);
        await _db.SaveChangesAsync();

        var attendeeIds = (req.AttendeeUserIds ?? new List<int>())
            .Where(id => id != userId)
            .Distinct()
            .ToList();
        foreach (var attendeeId in attendeeIds)
        {
            _db.CalendarEventAttendees.Add(new CalendarEventAttendee
            {
                CalendarEventId = eventEntity.Id,
                UserId = attendeeId,
                ResponseStatus = "pending"
            });
        }
        await _db.SaveChangesAsync();

        return await GetByIdAsync(eventEntity.Id);
    }

    public async Task<CalendarEventDto> UpdateAsync(int userId, int eventId, UpdateCalendarEventRequest req)
    {
        var eventEntity = await _db.CalendarEvents
            .Include(e => e.Attendees)
            .FirstOrDefaultAsync(e => e.Id == eventId)
            ?? throw new KeyNotFoundException("رویداد یافت نشد");
        EnsureCanModify(eventEntity, userId);

        Validate(req);
        eventEntity.Title = req.Title.Trim();
        eventEntity.Description = req.Description;
        eventEntity.Start = req.Start;
        eventEntity.End = req.End;
        eventEntity.AllDay = req.AllDay;
        eventEntity.Type = req.Type;
        eventEntity.Color = req.Color;
        eventEntity.Location = req.Location;
        eventEntity.IsPublic = req.IsPublic;

        if (req.AttendeeUserIds != null)
        {
            var requested = req.AttendeeUserIds
                .Where(id => id != userId)
                .Distinct()
                .ToList();
            var existing = eventEntity.Attendees;
            var toRemove = existing.Where(a => !requested.Contains(a.UserId)).ToList();
            _db.CalendarEventAttendees.RemoveRange(toRemove);
            foreach (var attendeeId in requested.Where(id => existing.All(a => a.UserId != id)))
            {
                _db.CalendarEventAttendees.Add(new CalendarEventAttendee
                {
                    CalendarEventId = eventEntity.Id,
                    UserId = attendeeId,
                    ResponseStatus = "pending"
                });
            }
        }

        await _db.SaveChangesAsync();
        return await GetByIdAsync(eventEntity.Id);
    }

    public async Task DeleteAsync(int userId, int eventId)
    {
        var eventEntity = await _db.CalendarEvents
            .Include(e => e.Attendees)
            .FirstOrDefaultAsync(e => e.Id == eventId)
            ?? throw new KeyNotFoundException("رویداد یافت نشد");
        EnsureCanModify(eventEntity, userId);
        _db.CalendarEvents.Remove(eventEntity);
        await _db.SaveChangesAsync();
    }

    public async Task RespondAsync(int userId, int eventId, string response)
    {
        var valid = response is "accepted" or "declined" or "tentative";
        if (!valid) throw new InvalidOperationException("پاسخ نامعتبر است");
        var exists = await _db.CalendarEvents.AnyAsync(e => e.Id == eventId);
        if (!exists) throw new KeyNotFoundException("رویداد یافت نشد");

        var attendee = await _db.CalendarEventAttendees
            .FirstOrDefaultAsync(a => a.CalendarEventId == eventId && a.UserId == userId);
        if (attendee is null)
        {
            _db.CalendarEventAttendees.Add(new CalendarEventAttendee
            {
                CalendarEventId = eventId,
                UserId = userId,
                ResponseStatus = response
            });
        }
        else
        {
            attendee.ResponseStatus = response;
        }
        await _db.SaveChangesAsync();
    }

    private async Task<CalendarEventDto> GetByIdAsync(int eventId)
    {
        var eventEntity = await _db.CalendarEvents
            .Include(e => e.Attendees)
            .ThenInclude(a => a.User)
            .FirstOrDefaultAsync(e => e.Id == eventId)
            ?? throw new KeyNotFoundException("رویداد یافت نشد");
        return ToDto(eventEntity);
    }

    private static void EnsureCanModify(CalendarEvent eventEntity, int userId)
    {
        var isCreator = eventEntity.CreatorUserId == userId;
        var isAttendee = eventEntity.Attendees.Any(a => a.UserId == userId);
        if (!isCreator && !isAttendee)
            throw new UnauthorizedAccessException("شما اجازه تغییر این رویداد را ندارید");
    }

    private static void Validate(CreateCalendarEventRequest req)
    {
        if (string.IsNullOrWhiteSpace(req.Title))
            throw new InvalidOperationException("عنوان رویداد الزامی است");
        if (req.End <= req.Start)
            throw new InvalidOperationException("زمان پایان باید بعد از زمان شروع باشد");
    }

    private static CalendarEventDto ToDto(CalendarEvent e) => new()
    {
        Id = e.Id,
        Title = e.Title,
        Description = e.Description,
        Start = e.Start,
        End = e.End,
        AllDay = e.AllDay,
        Type = e.Type,
        Color = e.Color,
        Location = e.Location,
        CreatorUserId = e.CreatorUserId,
        IsPublic = e.IsPublic,
        Attendees = e.Attendees
            .Select(a => new CalendarAttendeeDto
            {
                UserId = a.UserId,
                FullName = $"{a.User.FirstName} {a.User.LastName}".Trim(),
                ResponseStatus = a.ResponseStatus
            })
            .ToList()
    };
}