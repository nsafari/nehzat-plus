using EducationalPlatform.Nehzat.Infrastructure.Clients;

namespace EducationalPlatform.Nehzat.Infrastructure.Services;

/// <summary>
/// Service for Quran.com API v4 integration.
/// Wraps IQuranComClient with business logic and error handling.
/// </summary>
public interface IQuranComService
{
    Task<QuranComChapterDetailDto> GetChapterDetailAsync(int chapterId, string language = "fa");
    Task<List<QuranComChapterDto>> GetChaptersAsync(string language = "fa");
    Task<QuranComTafsirDto> GetTafsirAsync(int surah, int ayah, int tafsirId = 169);
    Task<List<QuranComSearchResultDto>> SearchAsync(string query, int maxResults = 20, string language = "fa");
    Task<List<QuranComTranslationDto>> GetTranslationsAsync(int surah, int ayah, int translationId = 131);
}

public class QuranComService : IQuranComService
{
    private readonly IQuranComClient _client;

    public QuranComService(IQuranComClient client)
    {
        _client = client;
    }

    public async Task<List<QuranComChapterDto>> GetChaptersAsync(string language = "fa")
    {
        var chapters = await _client.GetChaptersAsync(language);
        return chapters.Select(c => new QuranComChapterDto(
            c.Id,
            c.NameSimple,
            c.NameArabic,
            c.TranslatedName?.Name ?? "",
            c.VersesCount,
            c.RevelationPlace
        )).ToList();
    }

    public async Task<QuranComChapterDetailDto> GetChapterDetailAsync(int chapterId, string language = "fa")
    {
        var chapter = await _client.GetChapterAsync(chapterId, language);
        return new QuranComChapterDetailDto(
            chapter.Id,
            chapter.NameSimple,
            chapter.NameArabic,
            chapter.TranslatedName?.Name ?? "",
            chapter.VersesCount,
            chapter.RevelationPlace
        );
    }

    public async Task<QuranComTafsirDto> GetTafsirAsync(int surah, int ayah, int tafsirId = 169)
    {
        var verseKey = $"{surah}:{ayah}";
        var response = await _client.GetTafsirByAyahAsync(tafsirId, verseKey);
        return new QuranComTafsirDto(
            verseKey,
            tafsirId,
            response.Tafsir.Text
        );
    }

    public async Task<List<QuranComSearchResultDto>> SearchAsync(string query, int maxResults = 20, string language = "fa")
    {
        var response = await _client.SearchAsync(query, maxResults, language);
        return response.Search.Results.SelectMany(r => r.Ayat).Select(a => new QuranComSearchResultDto(
            a.VerseKey,
            a.TextUthmani,
            a.ChapterId,
            a.Translations?.FirstOrDefault()?.Text
        )).ToList();
    }

    public async Task<List<QuranComTranslationDto>> GetTranslationsAsync(int surah, int ayah, int translationId = 131)
    {
        var verseKey = $"{surah}:{ayah}";
        var response = await _client.GetTranslationAsync(translationId, verseKey);
        return response.Translations.Select(t => new QuranComTranslationDto(
            t.ResourceId,
            t.Text,
            t.VerseKey ?? verseKey
        )).ToList();
    }
}

// ── DTOs ──

public record QuranComChapterDto(
    int Id,
    string NameSimple,
    string NameArabic,
    string TranslatedName,
    int VersesCount,
    string RevelationPlace
);

public record QuranComChapterDetailDto(
    int Id,
    string NameSimple,
    string NameArabic,
    string TranslatedName,
    int VersesCount,
    string RevelationPlace
);

public record QuranComTafsirDto(
    string VerseKey,
    int TafsirId,
    string Text
);

public record QuranComSearchResultDto(
    string VerseKey,
    string TextUthmani,
    int ChapterId,
    string? TranslationText
);

public record QuranComTranslationDto(
    int ResourceId,
    string Text,
    string VerseKey
);
