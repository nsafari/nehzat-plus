using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Domain.Entities;

namespace EducationalPlatform.Nehzat.Application.Interfaces;

public interface IVocabularyService
{
    Task<VocabularyTextDto> CreateTextAsync(VocabularyTextCreateRequest request, string userId);
    Task<VocabularyTextDto> UpdateTextAsync(int textId, VocabularyTextUpdateRequest request, string userId);
    Task DeleteTextAsync(int textId, string userId);
    Task<List<VocabularyTextDto>> GetTextsAsync(string? language, bool? isPublished, string? userId);
    Task<VocabularyTextDto> GetTextByIdAsync(int textId, string userId);

    Task<VocabularyWordDto> CreateWordAsync(VocabularyWordCreateRequest request, string userId);
    Task<VocabularyWordDto> UpdateWordAsync(int wordId, VocabularyWordUpdateRequest request, string userId);
    Task DeleteWordAsync(int wordId, string userId);
    Task<List<VocabularyWordDto>> GetWordsByTextAsync(int textId, string userId);
    Task<VocabularyWordDto> GetWordByIdAsync(int wordId, string userId);

    Task<UserVocabularyCardDto> GetCardAsync(int userId, int wordId);
    Task<List<UserVocabularyCardDto>> GetDueCardsAsync(int userId);
    Task<List<UserVocabularyCardDto>> GetLearningCardsAsync(int userId);
    Task<List<UserVocabularyCardDto>> GetReviewCardsAsync(int userId);
    Task<UserVocabularyCardDto> ReviewCardAsync(int userId, int cardId, int quality);
    Task<VocabularySearchDto> SearchCardsAsync(VocabularySearchDto searchDto, int userId);

    Task<EaseFactorInfoDto> GetEaseFactorInfoAsync(int userId);
}

public record EaseFactorInfoDto(
    double CurrentEaseFactor,
    int MinEaseFactor = 1,
    int MaxEaseFactor = 5,
    double DefaultEaseFactor = 2.5
);