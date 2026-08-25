using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Domain.Entities;

namespace EducationalPlatform.Nehzat.Application.Interfaces;

public interface IVocabularySrsService
{
    Task<UserSrsSettingsDto> GetSettingsAsync(int userId);
    Task<UserSrsSettingsDto> UpdateSettingsAsync(UserSrsSettingsUpdateRequest request, string userId);
    Task<List<UserVocabularyCardDto>> GetCardsDueForReviewAsync(int userId);
    Task<int> GetDueCardCountAsync(int userId);
    Task<EaseFactorInfoDto> GetEaseFactorInfoAsync(int userId);
    Task<(bool ShouldReview, int Quality, int Interval, double EaseFactor)> CalculateNextReviewAsync(
        int userId,
        int cardId,
        int quality,
        DateTime now
    );
}

public interface IVocabularySrsSettingsService
{
    Task<VocabularySrsPresetDto> GetCurrentPresetAsync();
    Task<List<VocabularySrsPresetDto>> GetAvailablePresetsAsync();
    Task<UserSrsSettingsDto> ApplyPresetAsync(string presetName, int userId);
}