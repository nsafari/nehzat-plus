using Microsoft.EntityFrameworkCore;
using EducationalPlatform.Nehzat.Domain.Entities;
using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Infrastructure.Data;

namespace EducationalPlatform.Nehzat.Infrastructure.Services;

public class XpService : IXpService
{
    private readonly AppDbContext _db;

    public XpService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<UserXp> GetOrCreateAsync(int userId)
    {
        var userXp = await _db.UserXp.FirstOrDefaultAsync(x => x.UserId == userId);
        if (userXp != null)
            return userXp;

        userXp = new UserXp
        {
            UserId = userId,
            TotalXp = 0,
            Level = 0,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        _db.UserXp.Add(userXp);
        await _db.SaveChangesAsync();
        return userXp;
    }

    public async Task<UserXpDto> GetUserXpAsync(int userId)
    {
        var userXp = await GetOrCreateAsync(userId);
        return BuildUserXpDto(userXp);
    }

    public async Task<List<XpBadgeDto>> GetBadgesAsync(int userId)
    {
        var totalXp = (await GetOrCreateAsync(userId)).TotalXp;
        var badges = await _db.XpBadges
            .Where(b => b.IsActive)
            .OrderBy(b => b.XpMilestone)
            .ToListAsync();
        return badges.Select(b => ToBadgeDto(b, totalXp >= b.XpMilestone)).ToList();
    }

    public async Task<AwardXpResultDto> AwardXpAsync(int userId, int xpAmount, string reason)
    {
        var userXp = await GetOrCreateAsync(userId);
        var before = userXp.TotalXp;

        userXp.TotalXp += xpAmount;
        var newLevel = CalculateLevel(userXp.TotalXp);
        var leveledUp = newLevel > userXp.Level;
        userXp.Level = newLevel;
        userXp.UpdatedAt = DateTime.UtcNow;

        _db.XpTransactions.Add(new UserXpTransaction
        {
            UserId = userId,
            XpAmount = xpAmount,
            Reason = reason,
            CreatedAt = DateTime.UtcNow
        });

        var newBadges = await UnlockBadgesAsync(userId, before, userXp.TotalXp);
        await _db.SaveChangesAsync();

        return new AwardXpResultDto(
            BuildUserXpDto(userXp),
            xpAmount,
            leveledUp,
            newBadges
        );
    }

    public async Task<List<XpActivityDto>> GetRecentActivityAsync(int userId, int limit = 10)
    {
        var transactions = await _db.XpTransactions
            .Include(t => t.Badge)
            .Where(t => t.UserId == userId)
            .OrderByDescending(t => t.CreatedAt)
            .ThenByDescending(t => t.Id)
            .Take(limit)
            .ToListAsync();

        return transactions.Select(ToActivityDto).ToList();
    }

    private async Task<List<XpBadgeDto>> UnlockBadgesAsync(int userId, int before, int after)
    {
        var crossed = await _db.XpBadges
            .Where(b => b.IsActive && b.XpMilestone > before && b.XpMilestone <= after)
            .OrderBy(b => b.XpMilestone)
            .ToListAsync();

        var dtos = new List<XpBadgeDto>();
        foreach (var badge in crossed)
        {
            _db.XpTransactions.Add(new UserXpTransaction
            {
                UserId = userId,
                XpAmount = 0,
                BadgeId = badge.Id,
                Reason = $"دریافت نشان «{badge.Name}»",
                CreatedAt = DateTime.UtcNow
            });
            dtos.Add(ToBadgeDto(badge, true));
        }
        return dtos;
    }

    private static UserXpDto BuildUserXpDto(UserXp userXp)
    {
        var level = CalculateLevel(userXp.TotalXp);
        var currentLevelXp = XpForLevel(level);
        var nextLevelXp = XpForLevel(level + 1);
        var range = nextLevelXp - currentLevelXp;
        var progress = userXp.TotalXp - currentLevelXp;
        var percent = range > 0 ? Math.Clamp((int)Math.Round(progress * 100.0 / range), 0, 100) : 100;

        return new UserXpDto(
            userXp.UserId,
            userXp.TotalXp,
            level,
            currentLevelXp,
            nextLevelXp,
            progress,
            percent,
            userXp.UpdatedAt
        );
    }

    private static XpBadgeDto ToBadgeDto(XpBadge badge, bool isEarned)
    {
        return new XpBadgeDto(
            badge.Id,
            badge.Code,
            badge.Name,
            badge.Description,
            badge.Icon,
            badge.XpMilestone,
            badge.Category,
            isEarned
        );
    }

    private static XpActivityDto ToActivityDto(UserXpTransaction transaction)
    {
        return new XpActivityDto(
            transaction.Id,
            transaction.BadgeId.HasValue ? "badge" : "xp",
            transaction.XpAmount,
            transaction.BadgeId,
            transaction.Badge?.Name,
            transaction.Badge?.Icon,
            transaction.Reason,
            transaction.CreatedAt
        );
    }

    public static int CalculateLevel(int totalXp)
    {
        return (int)Math.Floor(Math.Sqrt(totalXp / 100.0));
    }

    private static int XpForLevel(int level)
    {
        return 100 * level * level;
    }
}
