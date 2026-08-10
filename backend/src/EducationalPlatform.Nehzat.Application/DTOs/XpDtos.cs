using System.ComponentModel.DataAnnotations;

namespace EducationalPlatform.Nehzat.Application.DTOs;

public record AwardXpRequest(
    [Range(1, 10000, ErrorMessage = "مقدار XP باید بین ۱ تا ۱۰۰۰۰ باشد")]
    int Xp,

    [Required(ErrorMessage = "دلیل دریافت XP الزامی است")]
    [MaxLength(300, ErrorMessage = "دلیل حداکثر ۳۰۰ کاراکتر می‌تواند باشد")]
    string Reason
);

public record UserXpDto(
    int UserId,
    int TotalXp,
    int Level,
    int CurrentLevelXp,
    int NextLevelXp,
    int LevelProgressXp,
    int LevelProgressPercent,
    DateTime UpdatedAt
);

public record XpBadgeDto(
    int Id,
    string Code,
    string Name,
    string? Description,
    string? Icon,
    int XpMilestone,
    string Category,
    bool IsEarned
);

public record AwardXpResultDto(
    UserXpDto UserXp,
    int AwardedXp,
    bool LeveledUp,
    List<XpBadgeDto> NewBadges
);

public record XpActivityDto(
    int Id,
    string Type,
    int XpAmount,
    int? BadgeId,
    string? BadgeName,
    string? BadgeIcon,
    string Reason,
    DateTime CreatedAt
);
