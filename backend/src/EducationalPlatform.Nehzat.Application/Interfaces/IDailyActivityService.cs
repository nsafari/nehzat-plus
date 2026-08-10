using EducationalPlatform.Nehzat.Domain.Entities;

namespace EducationalPlatform.Nehzat.Application.Interfaces;

public interface IDailyActivityService
{
    Task<DailyActivity> UpsertAsync(int userId, DateTime activityDate, int? activityMinutes, int? steps, decimal? sleepHours, string? notes);
    Task<DailyActivity?> GetByDateAsync(int userId, DateTime activityDate);
    Task<List<DailyActivity>> GetHistoryAsync(int userId, DateTime? fromDate, DateTime? toDate);
    Task<int> GetStreakAsync(int userId);
}