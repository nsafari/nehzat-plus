using System.ComponentModel.DataAnnotations;

namespace EducationalPlatform.Nehzat.Application.DTOs;

public record BadgeDto(
    int Id,
    string Code,
    string Title,
    string? Description,
    string? IconUrl,
    string ConditionType,
    string ConditionValue,
    bool IsActive,
    DateTime CreatedAt
);

public record CreateBadgeDto(
    [Required(ErrorMessage = "کد نشان الزامی است")]
    [StringLength(100, ErrorMessage = "کد حداکثر ۱۰۰ کاراکتر می‌تواند باشد")]
    string Code,

    [Required(ErrorMessage = "عنوان نشان الزامی است")]
    [StringLength(200, ErrorMessage = "عنوان حداکثر ۲۰۰ کاراکتر می‌تواند باشد")]
    string Title,

    [StringLength(500, ErrorMessage = "توضیحات حداکثر ۵۰۰ کاراکتر می‌تواند باشد")]
    string? Description,

    [StringLength(500, ErrorMessage = "آدرس آیکن حداکثر ۵۰۰ کاراکتر می‌تواند باشد")]
    string? IconUrl,

    [Required(ErrorMessage = "نوع شرط الزامی است")]
    [StringLength(100, ErrorMessage = "نوع شرط حداکثر ۱۰۰ کاراکتر می‌تواند باشد")]
    string ConditionType,

    [StringLength(255, ErrorMessage = "مقدار شرط حداکثر ۲۵۵ کاراکتر می‌تواند باشد")]
    string? ConditionValue,

    bool IsActive = true
);

public record UpdateBadgeDto(
    [StringLength(100, ErrorMessage = "کد حداکثر ۱۰۰ کاراکتر می‌تواند باشد")]
    string? Code,

    [StringLength(200, ErrorMessage = "عنوان حداکثر ۲۰۰ کاراکتر می‌تواند باشد")]
    string? Title,

    [StringLength(500, ErrorMessage = "توضیحات حداکثر ۵۰۰ کاراکتر می‌تواند باشد")]
    string? Description,

    [StringLength(500, ErrorMessage = "آدرس آیکن حداکثر ۵۰۰ کاراکتر می‌تواند باشد")]
    string? IconUrl,

    [StringLength(100, ErrorMessage = "نوع شرط حداکثر ۱۰۰ کاراکتر می‌تواند باشد")]
    string? ConditionType,

    [StringLength(255, ErrorMessage = "مقدار شرط حداکثر ۲۵۵ کاراکتر می‌تواند باشد")]
    string? ConditionValue,

    bool? IsActive
);

public record UserBadgeDto(
    int Id,
    int UserId,
    int BadgeId,
    string BadgeCode,
    string BadgeTitle,
    string? BadgeIconUrl,
    DateTime AwardedAt
);

public record PointTransactionDto(
    int Id,
    int UserId,
    int Amount,
    string Reason,
    string? ReferenceType,
    int? ReferenceId,
    DateTime CreatedAt
);

public record AwardPointsDto(
    [Required(ErrorMessage = "شناسه کاربر الزامی است")]
    int UserId,

    [Range(1, 100000, ErrorMessage = "مقدار امتیاز باید بین ۱ تا ۱۰۰۰۰۰ باشد")]
    int Amount,

    [Required(ErrorMessage = "دلیل دریافت امتیاز الزامی است")]
    [MaxLength(300, ErrorMessage = "دلیل حداکثر ۳۰۰ کاراکتر می‌تواند باشد")]
    string Reason,

    [StringLength(50, ErrorMessage = "نوع مرجع حداکثر ۵۰ کاراکتر می‌تواند باشد")]
    string? ReferenceType,

    int? ReferenceId
);

public record LeaderboardEntryDto(
    int Rank,
    int UserId,
    string UserName,
    int TotalPoints
);