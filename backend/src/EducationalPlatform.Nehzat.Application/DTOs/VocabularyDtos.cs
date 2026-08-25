using System.ComponentModel.DataAnnotations;

namespace EducationalPlatform.Nehzat.Application.DTOs;

public record VocabularyTextDto(
    int Id,
    string Title,
    string? Description,
    string? Content,
    string Language,
    int? SubjectAreaId,
    string? OwnerUserId,
    bool IsPublished,
    DateTime CreatedAt,
    DateTime? UpdatedAt
);

public record VocabularyTextCreateRequest(
    [Required(ErrorMessage = "عنوان vocab-text الزامی است")]
    string Title,

    [StringLength(1000, ErrorMessage = "توضیحات максимум ۱۰۰۰ کاراکتر")]
    string? Description,

    [StringLength(5000, ErrorMessage = "محتوا максимум ۵۰۰۰ کاراکتر")]
    string? Content,

    [Required(ErrorMessage = "زبان vocab-text الزامی است")]
    string Language,

    int? SubjectAreaId,

    bool IsPublished
);

public record VocabularyTextUpdateRequest(
    [Required(ErrorMessage = "عنوان vocab-text الزامی است")]
    string Title,

    [StringLength(1000, ErrorMessage = "توضیحات максимум ۱۰۰۰ کاراکتر")]
    string? Description,

    [StringLength(5000, ErrorMessage = "محتوا максимум ۵۰۰۰ کاراکتر")]
    string? Content,

    string Language,

    bool IsPublished
);

public record VocabularyWordDto(
    int Id,
    string WordText,
    string? Definition,
    string? ExampleSentence,
    string? ExampleTranslation,
    string PartOfSpeech,
    string? ImageUrl,
    string? AudioUrl,
    string DifficultyLevel,
    int VocabularyTextId,
    int DisplayOrder,
    DateTime CreatedAt
);

public record VocabularyWordCreateRequest(
    [Required(ErrorMessage = "واژه الزامی است")]
    string WordText,

    [StringLength(500, ErrorMessage = "تعریف максимум ۵۰۰ کاراکتر")]
    string? Definition,

    [StringLength(500, ErrorMessage = "جمله نمونه максимум ۵۰۰ کاراکتر")]
    string? ExampleSentence,

    [StringLength(500, ErrorMessage = "ترجمه جمله نمونه максимум ۵۰۰ کاراکتر")]
    string? ExampleTranslation,

    [Required(ErrorMessage = "بخش‌jasz الزامی است")]
    string PartOfSpeech,

    string? ImageUrl,

    string? AudioUrl,

    string DifficultyLevel,

    int VocabularyTextId,

    int DisplayOrder
);

public record VocabularyWordUpdateRequest(
    [Required(ErrorMessage = "واژه الزامی است")]
    string WordText,

    [StringLength(500, ErrorMessage = "تعریف максимум ۵۰۰ کاراکتر")]
    string? Definition,

    [StringLength(500, ErrorMessage = "جمله نمونه максимум ۵۰۰ کاراکتر")]
    string? ExampleSentence,

    [StringLength(500, ErrorMessage = "ترجمه جمله نمونه максимум ۵۰۰ کاراکتر")]
    string? ExampleTranslation,

    string PartOfSpeech,

    string? ImageUrl,

    string? AudioUrl,

    string DifficultyLevel,

    int VocabularyTextId,

    int DisplayOrder
);

public record UserVocabularyCardDto(
    int Id,
    int UserId,
    int VocabularyWordId,
    DateTime NextReviewAt,
    int Interval,
    double EaseFactor,
    int Repetition,
    int Quality,
    bool IsKnown,
    bool IsDue,
    string WordText,
    string? Definition,
    string? ExampleSentence
);

public record UserVocabularyCardCreateRequest(
    int VocabularyWordId
);

public record UserVocabularyReviewRequest(
    [Range(1, 4, ErrorMessage = "کیفیت پاسخ باید بین ۱ تا ۴ باشد")]
    int Quality
);

public record VocabularySearchDto(
    string? Query,
    string? Language,
    string? DifficultyLevel,
    bool? IsKnown,
    DateTime? NextReviewBefore
);