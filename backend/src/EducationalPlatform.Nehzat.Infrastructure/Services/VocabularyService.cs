using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Infrastructure.Data;

namespace EducationalPlatform.Nehzat.Infrastructure.Services;

#pragma warning disable CS1998
public class VocabularyService : IVocabularyService
{
    private readonly AppDbContext _db;
    public VocabularyService(AppDbContext db) => _db = db;

    public Task<VocabularyTextDto> CreateTextAsync(VocabularyTextCreateRequest request, string userId)
        => throw new NotImplementedException();
    public Task<VocabularyTextDto> UpdateTextAsync(int textId, VocabularyTextUpdateRequest request, string userId)
        => throw new NotImplementedException();
    public Task DeleteTextAsync(int textId, string userId)
        => throw new NotImplementedException();
    public Task<List<VocabularyTextDto>> GetTextsAsync(string? language, bool? isPublished, string? userId)
        => throw new NotImplementedException();
    public Task<VocabularyTextDto> GetTextByIdAsync(int textId, string userId)
        => throw new NotImplementedException();
    public Task<VocabularyWordDto> CreateWordAsync(VocabularyWordCreateRequest request, string userId)
        => throw new NotImplementedException();
    public Task<VocabularyWordDto> UpdateWordAsync(int wordId, VocabularyWordUpdateRequest request, string userId)
        => throw new NotImplementedException();
    public Task DeleteWordAsync(int wordId, string userId)
        => throw new NotImplementedException();
    public Task<List<VocabularyWordDto>> GetWordsByTextAsync(int textId, string userId)
        => throw new NotImplementedException();
    public Task<VocabularyWordDto> GetWordByIdAsync(int wordId, string userId)
        => throw new NotImplementedException();
    public Task<UserVocabularyCardDto> GetCardAsync(int userId, int wordId)
        => throw new NotImplementedException();
    public Task<List<UserVocabularyCardDto>> GetDueCardsAsync(int userId)
        => throw new NotImplementedException();
    public Task<List<UserVocabularyCardDto>> GetLearningCardsAsync(int userId)
        => throw new NotImplementedException();
    public Task<List<UserVocabularyCardDto>> GetReviewCardsAsync(int userId)
        => throw new NotImplementedException();
    public Task<UserVocabularyCardDto> ReviewCardAsync(int userId, int cardId, int quality)
        => throw new NotImplementedException();
    public Task<VocabularySearchDto> SearchCardsAsync(VocabularySearchDto searchDto, int userId)
        => throw new NotImplementedException();
    public Task<EaseFactorInfoDto> GetEaseFactorInfoAsync(int userId)
        => throw new NotImplementedException();
}
#pragma warning restore CS1998
