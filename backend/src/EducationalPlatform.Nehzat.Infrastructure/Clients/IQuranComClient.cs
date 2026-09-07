using Refit;
using System.Text.Json.Serialization;

namespace EducationalPlatform.Nehzat.Infrastructure.Clients;

/// <summary>
/// Refit client for Quran.com API v4 (https://api.quran.com).
/// Free, public API — no authentication required.
/// </summary>
public interface IQuranComClient
{
    [Get("/api/v4/chapters")]
    Task<List<QuranComChapter>> GetChaptersAsync(
        [Query] string? language = null);

    [Get("/api/v4/chapters/{chapterId}")]
    Task<QuranComChapter> GetChapterAsync(
        int chapterId,
        [Query] string? language = null);

    [Get("/api/v4/verses/by_chapter/{chapterId}")]
    Task<QuranComVersesResponse> GetVersesByChapterAsync(
        int chapterId,
        [Query] string? language = null,
        [Query] int per_page = 300,
        [Query] string? words = null,
        [Query] string? word_fields = null,
        [Query] string? translations = null);

    [Get("/api/v4/verses/by_key/{verseKey}")]
    Task<QuranComVerseResponse> GetVerseByKeyAsync(
        string verseKey,
        [Query] string? language = null,
        [Query] string? words = null,
        [Query] string? translations = null);

    [Get("/api/v4/tafsirs/{tafsirId}/by_ayah/{verseKey}")]
    Task<QuranComTafsirResponse> GetTafsirByAyahAsync(
        int tafsirId,
        string verseKey,
        [Query] string? language = null);

    [Get("/api/v4/search")]
    Task<QuranComSearchResponse> SearchAsync(
        [Query] string q,
        [Query] int size = 20,
        [Query] string? language = null,
        [Query] int page = 1);

    [Get("/api/v4/quran/translations/{translationId}")]
    Task<QuranComTranslationResponse> GetTranslationAsync(
        int translationId,
        [Query] string? verse_key = null);

    [Get("/api/v4/options/translations")]
    Task<List<QuranComTranslationOption>> GetTranslationsListAsync(
        [Query] string? language = null);
}

// ── Response DTOs ──

public record QuranComVersesResponse(
    [property: JsonPropertyName("verses")] List<QuranComVerse> Verses,
    [property: JsonPropertyName("pagination")] QuranComPagination? Pagination);

public record QuranComVerseResponse(
    [property: JsonPropertyName("verse")] QuranComVerse Verse);

public record QuranComVerse(
    [property: JsonPropertyName("id")] int Id,
    [property: JsonPropertyName("verse_key")] string VerseKey,
    [property: JsonPropertyName("text_uthmani")] string? TextUthmani,
    [property: JsonPropertyName("text_imlaei_simple")] string? TextImlaeiSimple,
    [property: JsonPropertyName("translations")] List<QuranComTranslation>? Translations);

public record QuranComTranslation(
    [property: JsonPropertyName("id")] int Id,
    [property: JsonPropertyName("resource_id")] int ResourceId,
    [property: JsonPropertyName("text")] string Text);

public record QuranComTafsirResponse(
    [property: JsonPropertyName("tafsir")] QuranComTafsirData Tafsir);

public record QuranComTafsirData(
    [property: JsonPropertyName("id")] int Id,
    [property: JsonPropertyName("resource_id")] int ResourceId,
    [property: JsonPropertyName("text")] string Text,
    [property: JsonPropertyName("verse_key")] string? VerseKey);

public record QuranComSearchResponse(
    [property: JsonPropertyName("search")] QuranComSearchData Search);

public record QuranComSearchData(
    [property: JsonPropertyName("total")] int Total,
    [property: JsonPropertyName("page")] int Page,
    [property: JsonPropertyName("per_page")] int PerPage,
    [property: JsonPropertyName("total_pages")] int TotalPages,
    [property: JsonPropertyName("results")] List<QuranComSearchResult> Results);

public record QuranComSearchResult(
    [property: JsonPropertyName("ayat")] List<QuranComSearchAyah> Ayat);

public record QuranComSearchAyah(
    [property: JsonPropertyName("id")] int Id,
    [property: JsonPropertyName("verse_key")] string VerseKey,
    [property: JsonPropertyName("text_uthmani")] string TextUthmani,
    [property: JsonPropertyName("chapter_id")] int ChapterId,
    [property: JsonPropertyName("translations")] List<QuranComTranslation>? Translations);

public record QuranComTranslationResponse(
    [property: JsonPropertyName("translations")] List<QuranComTranslationData> Translations);

public record QuranComTranslationData(
    [property: JsonPropertyName("id")] int Id,
    [property: JsonPropertyName("resource_id")] int ResourceId,
    [property: JsonPropertyName("text")] string Text,
    [property: JsonPropertyName("verse_key")] string? VerseKey);

public record QuranComTranslationOption(
    [property: JsonPropertyName("id")] int Id,
    [property: JsonPropertyName("name")] string Name,
    [property: JsonPropertyName("author_name")] string? AuthorName,
    [property: JsonPropertyName("language_name")] string LanguageName);

public record QuranComChapter(
    [property: JsonPropertyName("id")] int Id,
    [property: JsonPropertyName("name_simple")] string NameSimple,
    [property: JsonPropertyName("name_arabic")] string NameArabic,
    [property: JsonPropertyName("translated_name")] QuranComTranslatedName? TranslatedName,
    [property: JsonPropertyName("verses_count")] int VersesCount,
    [property: JsonPropertyName("revelation_place")] string RevelationPlace);

public record QuranComTranslatedName(
    [property: JsonPropertyName("language_name")] string LanguageName,
    [property: JsonPropertyName("name")] string Name);

public record QuranComPagination(
    [property: JsonPropertyName("total_records")] int TotalRecords,
    [property: JsonPropertyName("per_page")] int PerPage,
    [property: JsonPropertyName("current_page")] int CurrentPage);
