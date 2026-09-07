using Microsoft.EntityFrameworkCore;
using EducationalPlatform.Nehzat.Domain.Entities;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Infrastructure.Data;

namespace EducationalPlatform.Nehzat.Infrastructure.Services;

public class DailyActivityService : IDailyActivityService
{
    private readonly AppDbContext _db;

    public DailyActivityService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<DailyActivity> UpsertAsync(int userId, DateTime activityDate, int? activityMinutes, int? steps, decimal? sleepHours, string? notes)
    {
        var dateOnly = activityDate.Date;

        var existing = await _db.DailyActivities
            .FirstOrDefaultAsync(e => e.UserId == userId && e.ActivityDate == dateOnly);

        if (existing != null)
        {
            existing.ActivityMinutes = activityMinutes;
            existing.Steps = steps;
            existing.SleepHours = sleepHours;
            existing.Notes = notes;
            existing.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();
            return existing;
        }

        var activity = new DailyActivity
        {
            UserId = userId,
            ActivityDate = dateOnly,
            ActivityMinutes = activityMinutes,
            Steps = steps,
            SleepHours = sleepHours,
            Notes = notes,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _db.DailyActivities.Add(activity);
        await _db.SaveChangesAsync();
        return activity;
    }

    public async Task<DailyActivity?> GetByDateAsync(int userId, DateTime activityDate)
    {
        var dateOnly = activityDate.Date;
        return await _db.DailyActivities
            .FirstOrDefaultAsync(e => e.UserId == userId && e.ActivityDate == dateOnly);
    }

    public async Task<List<DailyActivity>> GetHistoryAsync(int userId, DateTime? fromDate, DateTime? toDate)
    {
        var query = _db.DailyActivities
            .Where(e => e.UserId == userId);

        if (fromDate.HasValue)
            query = query.Where(e => e.ActivityDate >= fromDate.Value.Date);

        if (toDate.HasValue)
            query = query.Where(e => e.ActivityDate <= toDate.Value.Date);

        return await query
            .OrderByDescending(e => e.ActivityDate)
            .ToListAsync();
    }

    public async Task<int> GetStreakAsync(int userId)
    {
        var activities = await _db.DailyActivities
            .Where(e => e.UserId == userId)
            .OrderByDescending(e => e.ActivityDate)
            .Select(e => e.ActivityDate.Date)
            .ToListAsync();

        if (activities.Count == 0)
            return 0;

        var today = DateTime.UtcNow.Date;
        var yesterday = today.AddDays(-1);

        if (activities[0] != today && activities[0] != yesterday)
            return 0;

        var streak = 1;
        for (var i = 1; i < activities.Count; i++)
        {
            if (activities[i] == activities[i - 1].AddDays(-1))
                streak++;
            else
                break;
        }

        return streak;
    }
}