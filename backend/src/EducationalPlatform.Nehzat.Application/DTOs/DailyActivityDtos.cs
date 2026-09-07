using System.ComponentModel.DataAnnotations;

namespace EducationalPlatform.Nehzat.Application.DTOs;

public record UpsertDailyActivityRequest(
    [Required(ErrorMessage = "تاریخ فعالیت الزامی است")]
    DateTime ActivityDate,

    int? ActivityMinutes,

    int? Steps,

    [Range(0, 24, ErrorMessage = "ساعت خواب باید بین ۰ تا ۲۴ باشد")]
    decimal? SleepHours,

    string? Notes
);

public record DailyActivityDto(
    int Id,
    int UserId,
    DateTime ActivityDate,
    int? ActivityMinutes,
    int? Steps,
    decimal? SleepHours,
    string? Notes,
    DateTime CreatedAt,
    DateTime UpdatedAt
);

public record DailyActivityHistoryDto(
    int Id,
    int UserId,
    DateTime ActivityDate,
    int? ActivityMinutes,
    int? Steps,
    decimal? SleepHours,
    string? Notes,
    DateTime CreatedAt,
    DateTime UpdatedAt
);