using System.ComponentModel.DataAnnotations;

namespace EducationalPlatform.Nehzat.Application.DTOs;

public record UpsertSrsCardRequest(
    [Required(ErrorMessage = "نوع محتوا الزامی است")]
    string ContentType,

    int? ContentId,

    [Required(ErrorMessage = "سوال الزامی است")]
    string Question,

    [Required(ErrorMessage = "پاسخ الزامی است")]
    string Answer
);

public record SrsReviewRequest(
    [Range(1, 4, ErrorMessage = "کیفیت پاسخ باید بین ۱ تا ۴ باشد")]
    int Quality
);

public record SpacedRepetitionCardDto(
    int Id,
    int UserId,
    string ContentType,
    int? ContentId,
    string Question,
    string Answer,
    DateTime NextReviewAt,
    int Interval,
    double EaseFactor,
    int Repetition,
    DateTime CreatedAt,
    DateTime UpdatedAt
);

public record SrsStatsDto(
    int DueToday,
    int TotalCards,
    int LearningCards,
    int ReviewCards,
    double AverageEaseFactor
);