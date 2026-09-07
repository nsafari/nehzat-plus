using EducationalPlatform.Nehzat.Domain.Entities;
using EducationalPlatform.Nehzat.Application.DTOs;

namespace EducationalPlatform.Nehzat.Application.Interfaces;

public interface IXpService
{
    Task<UserXp> GetOrCreateAsync(int userId);
    Task<UserXpDto> GetUserXpAsync(int userId);
    Task<List<XpBadgeDto>> GetBadgesAsync(int userId);
    Task<AwardXpResultDto> AwardXpAsync(int userId, int xpAmount, string reason);
    Task<List<XpActivityDto>> GetRecentActivityAsync(int userId, int limit = 10);
}
