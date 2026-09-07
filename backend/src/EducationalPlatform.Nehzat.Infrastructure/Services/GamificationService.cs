using Microsoft.EntityFrameworkCore;
using EducationalPlatform.Nehzat.Domain.Entities;
using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Infrastructure.Data;

namespace EducationalPlatform.Nehzat.Infrastructure.Services;

public class GamificationService : IGamificationService
{
    private readonly AppDbContext _db;

    public GamificationService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<BadgeDto>> GetBadgesAsync()
    {
        return await _db.Badges
            .OrderBy(b => b.Code)
            .Select(b => new BadgeDto(
                b.Id,
                b.Code,
                b.Title,
                b.Description,
                b.IconUrl,
                b.ConditionType,
                b.ConditionValue,
                b.IsActive,
                b.CreatedAt
            ))
            .ToListAsync();
    }

    public async Task<BadgeDto?> GetBadgeByIdAsync(int id)
    {
        var badge = await _db.Badges.FindAsync(id);
        return badge == null ? null : ToBadgeDto(badge);
    }

    public async Task<BadgeDto> CreateBadgeAsync(CreateBadgeDto dto)
    {
        var badge = new Badge
        {
            Code = dto.Code.Trim(),
            Title = dto.Title.Trim(),
            Description = dto.Description?.Trim(),
            IconUrl = dto.IconUrl?.Trim(),
            ConditionType = dto.ConditionType.Trim(),
            ConditionValue = dto.ConditionValue?.Trim() ?? string.Empty,
            IsActive = dto.IsActive,
            CreatedAt = DateTime.UtcNow
        };

        _db.Badges.Add(badge);
        await _db.SaveChangesAsync();
        return ToBadgeDto(badge);
    }

    public async Task<BadgeDto> UpdateBadgeAsync(int id, UpdateBadgeDto dto)
    {
        var badge = await _db.Badges.FindAsync(id)
            ?? throw new KeyNotFoundException("نشان یافت نشد.");

        if (dto.Code != null) badge.Code = dto.Code.Trim();
        if (dto.Title != null) badge.Title = dto.Title.Trim();
        if (dto.Description != null) badge.Description = dto.Description.Trim();
        if (dto.IconUrl != null) badge.IconUrl = dto.IconUrl.Trim();
        if (dto.ConditionType != null) badge.ConditionType = dto.ConditionType.Trim();
        if (dto.ConditionValue != null) badge.ConditionValue = dto.ConditionValue.Trim();
        if (dto.IsActive != null) badge.IsActive = dto.IsActive.Value;

        await _db.SaveChangesAsync();
        return ToBadgeDto(badge);
    }

    public async Task DeleteBadgeAsync(int id)
    {
        var badge = await _db.Badges.FindAsync(id)
            ?? throw new KeyNotFoundException("نشان یافت نشد.");
        _db.Badges.Remove(badge);
        await _db.SaveChangesAsync();
    }

    public async Task<List<UserBadgeDto>> GetUserBadgesAsync(int userId)
    {
        return await _db.UserBadges
            .Where(ub => ub.UserId == userId)
            .OrderByDescending(ub => ub.AwardedAt)
            .Select(ub => new UserBadgeDto(
                ub.Id,
                ub.UserId,
                ub.BadgeId,
                ub.Badge.Code,
                ub.Badge.Title,
                ub.Badge.IconUrl,
                ub.AwardedAt
            ))
            .ToListAsync();
    }

    public async Task<UserBadgeDto> AwardBadgeAsync(int userId, int badgeId)
    {
        var user = await _db.Users.FindAsync(userId)
            ?? throw new KeyNotFoundException("کاربر یافت نشد.");
        var badge = await _db.Badges.FindAsync(badgeId)
            ?? throw new KeyNotFoundException("نشان یافت نشد.");

        var alreadyAwarded = await _db.UserBadges
            .AnyAsync(ub => ub.UserId == userId && ub.BadgeId == badgeId);
        if (alreadyAwarded)
            throw new InvalidOperationException("این نشان قبلاً به این کاربر اعطا شده است.");

        var userBadge = new UserBadge
        {
            UserId = user.Id,
            BadgeId = badge.Id,
            AwardedAt = DateTime.UtcNow
        };
        _db.UserBadges.Add(userBadge);
        await _db.SaveChangesAsync();

        return new UserBadgeDto(
            userBadge.Id,
            userBadge.UserId,
            userBadge.BadgeId,
            badge.Code,
            badge.Title,
            badge.IconUrl,
            userBadge.AwardedAt
        );
    }

    public async Task<List<PointTransactionDto>> GetUserPointsAsync(int userId)
    {
        return await _db.PointTransactions
            .Where(t => t.UserId == userId)
            .OrderByDescending(t => t.CreatedAt)
            .Select(t => new PointTransactionDto(
                t.Id,
                t.UserId,
                t.Amount,
                t.Reason,
                t.ReferenceType,
                t.ReferenceId,
                t.CreatedAt
            ))
            .ToListAsync();
    }

    public async Task<PointTransactionDto> AwardPointsAsync(int userId, AwardPointsDto dto)
    {
        var user = await _db.Users.FindAsync(userId)
            ?? throw new KeyNotFoundException("کاربر یافت نشد.");

        var transaction = new PointTransaction
        {
            UserId = user.Id,
            Amount = dto.Amount,
            Reason = dto.Reason.Trim(),
            ReferenceType = dto.ReferenceType?.Trim(),
            ReferenceId = dto.ReferenceId,
            CreatedAt = DateTime.UtcNow
        };
        _db.PointTransactions.Add(transaction);
        await _db.SaveChangesAsync();

        return new PointTransactionDto(
            transaction.Id,
            transaction.UserId,
            transaction.Amount,
            transaction.Reason,
            transaction.ReferenceType,
            transaction.ReferenceId,
            transaction.CreatedAt
        );
    }

    public async Task<int> GetUserTotalPointsAsync(int userId)
    {
        return await _db.PointTransactions
            .Where(t => t.UserId == userId)
            .SumAsync(t => (int?)t.Amount) ?? 0;
    }

    public async Task<List<LeaderboardEntryDto>> GetLeaderboardAsync(int? limit = 50)
    {
        var take = limit is > 0 ? limit.Value : 50;
        if (take > 100) take = 100;

        var totals = await _db.PointTransactions
            .GroupBy(t => t.UserId)
            .Select(g => new { UserId = g.Key, Total = g.Sum(t => t.Amount) })
            .OrderByDescending(x => x.Total)
            .Take(take)
            .ToListAsync();

        var userIds = totals.Select(x => x.UserId).ToList();
        var users = await _db.Users
            .Where(u => userIds.Contains(u.Id))
            .Select(u => new { u.Id, Name = u.FirstName + " " + u.LastName })
            .ToDictionaryAsync(u => u.Id);

        var entries = new List<LeaderboardEntryDto>();
        for (var i = 0; i < totals.Count; i++)
        {
            var item = totals[i];
            users.TryGetValue(item.UserId, out var user);
            entries.Add(new LeaderboardEntryDto(
                i + 1,
                item.UserId,
                user?.Name ?? string.Empty,
                item.Total
            ));
        }
        return entries;
    }

    private static BadgeDto ToBadgeDto(Badge badge)
    {
        return new BadgeDto(
            badge.Id,
            badge.Code,
            badge.Title,
            badge.Description,
            badge.IconUrl,
            badge.ConditionType,
            badge.ConditionValue,
            badge.IsActive,
            badge.CreatedAt
        );
    }
}