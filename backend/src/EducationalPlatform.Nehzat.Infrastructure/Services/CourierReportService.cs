using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Domain.Entities;
using EducationalPlatform.Nehzat.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace EducationalPlatform.Nehzat.Infrastructure.Services;

public class CourierReportService : ICourierReportService
{
    private readonly AppDbContext _db;

    public CourierReportService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<CourierStatsDto> GetCourierStatsAsync(int userId, int courierUserId, DateTime from, DateTime to)
    {
        var fromDate = from.Date;
        var toDate = to.Date;
        var courier = await _db.Users.FindAsync(courierUserId);
        var courierName = courier is null
            ? $"پیک {courierUserId}"
            : $"{courier.FirstName} {courier.LastName}".Trim();

        var stats = await _db.CourierDailyStats
            .Where(s => s.CourierUserId == courierUserId && s.Date >= fromDate && s.Date <= toDate)
            .OrderBy(s => s.Date)
            .ToListAsync();

        if (stats.Count == 0)
        {
            stats = await BuildStatsFromOrdersAsync(courierUserId, fromDate, toDate);
        }

        var totalDeliveries = stats.Sum(s => s.DeliveredCount);
        var totalDistance = stats.Sum(s => s.DistanceKm);
        var totalEarnings = stats.Sum(s => s.EarningsAmount);

        var daysInPeriod = Math.Max(1, (toDate - fromDate).Days + 1);
        var dailyAverage = stats.Count > 0
            ? totalEarnings / stats.Count
            : totalEarnings / daysInPeriod;

        return new CourierStatsDto
        {
            CourierUserId = courierUserId,
            CourierName = courierName,
            PeriodStart = fromDate,
            PeriodEnd = toDate,
            TotalDeliveries = totalDeliveries,
            TotalDistance = Math.Round(totalDistance, 2),
            TotalEarnings = Math.Round(totalEarnings, 0),
            DailyAverage = Math.Round(dailyAverage, 0),
            DailyBreakdown = stats.Select(s => new CourierDailyStatDto
            {
                Date = s.Date,
                DeliveredCount = s.DeliveredCount,
                DistanceKm = s.DistanceKm,
                EarningsAmount = s.EarningsAmount,
                AverageDeliveryMinutes = s.AverageDeliveryMinutes
            }).ToList()
        };
    }

    public async Task<CourierLeaderboardDto> GetLeaderboardAsync(int userId, DateTime from, DateTime to, int limit = 10)
    {
        var fromDate = from.Date;
        var toDate = to.Date;

        var groups = await _db.CourierDailyStats
            .Where(s => s.Date >= fromDate && s.Date <= toDate)
            .GroupBy(s => s.CourierUserId)
            .Select(g => new CourierAggregate
            {
                CourierUserId = g.Key,
                TotalDeliveries = g.Sum(s => s.DeliveredCount),
                TotalEarnings = g.Sum(s => s.EarningsAmount)
            })
            .OrderByDescending(g => g.TotalEarnings)
            .Take(limit)
            .ToListAsync();

        if (groups.Count == 0)
        {
            groups = await BuildLeaderboardFromOrdersAsync(fromDate, toDate, limit);
        }

        var userIds = groups.Select(g => g.CourierUserId).ToList();
        var users = await _db.Users
            .Where(u => userIds.Contains(u.Id))
            .ToDictionaryAsync(u => u.Id);

        var entries = groups
            .Select((g, i) => new CourierLeaderboardEntryDto
            {
                Rank = i + 1,
                CourierUserId = g.CourierUserId,
                CourierName = users.TryGetValue(g.CourierUserId, out var u)
                    ? $"{u.FirstName} {u.LastName}".Trim()
                    : $"پیک {g.CourierUserId}",
                TotalDeliveries = g.TotalDeliveries,
                TotalEarnings = Math.Round(g.TotalEarnings, 0)
            })
            .ToList();

        return new CourierLeaderboardDto { Entries = entries };
    }

    private async Task<List<CourierDailyStat>> BuildStatsFromOrdersAsync(int courierUserId, DateTime from, DateTime to)
    {
        return await _db.Set<MapOrder>()
            .Where(o => o.AssignedToUserId == courierUserId
                        && o.Status == "delivered"
                        && o.DeliveredAt >= from
                        && o.DeliveredAt <= to.AddDays(1))
            .GroupBy(o => o.DeliveredAt!.Value.Date)
            .Select(g => new CourierDailyStat
            {
                CourierUserId = courierUserId,
                Date = g.Key,
                DeliveredCount = g.Count()
            })
            .OrderBy(s => s.Date)
            .ToListAsync();
    }

    private async Task<List<CourierAggregate>> BuildLeaderboardFromOrdersAsync(DateTime from, DateTime to, int limit)
    {
        return await _db.Set<MapOrder>()
            .Where(o => o.AssignedToUserId != null
                        && o.Status == "delivered"
                        && o.DeliveredAt >= from
                        && o.DeliveredAt <= to.AddDays(1))
            .GroupBy(o => o.AssignedToUserId!.Value)
            .Select(g => new CourierAggregate
            {
                CourierUserId = g.Key,
                TotalDeliveries = g.Count(),
                TotalEarnings = 0m
            })
            .OrderByDescending(g => g.TotalDeliveries)
            .Take(limit)
            .ToListAsync();
    }

    private sealed class CourierAggregate
    {
        public int CourierUserId { get; set; }
        public int TotalDeliveries { get; set; }
        public decimal TotalEarnings { get; set; }
    }
}
