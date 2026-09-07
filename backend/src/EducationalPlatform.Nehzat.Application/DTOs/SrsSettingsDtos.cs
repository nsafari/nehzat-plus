using System.ComponentModel.DataAnnotations;

namespace EducationalPlatform.Nehzat.Application.DTOs;

public record UserSrsSettingsDto(
    int Id,
    int UserId,
    double EaseFactor,
    int IntervalDays,
    int RepetitionCount,
    int QualityThreshold, // 1-4 scale, when quality >= this, card is "known"
    DateTime LastReviewedAt,
    DateTime CreatedAt,
    DateTime UpdatedAt
);

public record UserSrsSettingsUpdateRequest(
    [Range(1.3, 5.0, ErrorMessage = " facilit باید بین ۱.۳ تا ۵.۰ باشد")]
    double EaseFactor,

    [Range(0, 365, ErrorMessage = "میزان تکرار باید بین ۰ تا ۳۶۵ روز باشد")]
    int IntervalDays,

    int QualityThreshold
);

public record SrsPresetDto(
    string Name,
    double InitialEaseFactor,
    int MinIntervalDays,
    int MaxIntervalDays,
    double EaseFactorDecrease,
    double EaseFactorIncrease
);

public record VocabularySrsPresetDto(
    string Name,
    double InitialEaseFactor,
    int MinIntervalDays,
    int MaxIntervalDays,
    double EaseFactorDecrease,
    double EaseFactorIncrease
);