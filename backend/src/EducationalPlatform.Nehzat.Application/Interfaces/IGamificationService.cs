using EducationalPlatform.Nehzat.Application.DTOs;

namespace EducationalPlatform.Nehzat.Application.Interfaces;

public interface IGamificationService
{
    Task<List<BadgeDto>> GetBadgesAsync();
    Task<BadgeDto?> GetBadgeByIdAsync(int id);
    Task<BadgeDto> CreateBadgeAsync(CreateBadgeDto dto);
    Task<BadgeDto> UpdateBadgeAsync(int id, UpdateBadgeDto dto);
    Task DeleteBadgeAsync(int id);
    Task<List<UserBadgeDto>> GetUserBadgesAsync(int userId);
    Task<UserBadgeDto> AwardBadgeAsync(int userId, int badgeId);
    Task<List<PointTransactionDto>> GetUserPointsAsync(int userId);
    Task<PointTransactionDto> AwardPointsAsync(int userId, AwardPointsDto dto);
    Task<int> GetUserTotalPointsAsync(int userId);
    Task<List<LeaderboardEntryDto>> GetLeaderboardAsync(int? limit = 50);
}