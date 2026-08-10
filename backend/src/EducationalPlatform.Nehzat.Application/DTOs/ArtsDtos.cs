using System.ComponentModel.DataAnnotations;

namespace EducationalPlatform.Nehzat.Application.DTOs;

public record CreateArtworkRequest(
    [Required(ErrorMessage = "عنوان اثر الزامی است")]
    string Title,

    [Required(ErrorMessage = "نوع اثر الزامی است")]
    string Type,

    [Required(ErrorMessage = "آدرس فایل الزامی است")]
    string FileUrl,

    string? Description,

    string? Tags,

    bool IsPublic = true
);

public record ArtworkDto(
    int Id,
    int UserId,
    string Title,
    string Type,
    string FileUrl,
    string? Description,
    string? Tags,
    bool IsPublic,
    int LikeCount,
    DateTime CreatedAt,
    DateTime UpdatedAt
);

public record CreateMusicRecordRequest(
    [Required(ErrorMessage = "عنوان اثر صوتی الزامی است")]
    string Title,

    [Required(ErrorMessage = "آدرس فایل صوتی الزامی است")]
    string AudioUrl,

    string? ArtistName,

    int? DurationSeconds,

    string? Genre,

    string? Description,

    string? Tags,

    bool IsPublic = true
);

public record MusicRecordDto(
    int Id,
    int UserId,
    string Title,
    string AudioUrl,
    string? ArtistName,
    int? DurationSeconds,
    string? Genre,
    string? Description,
    string? Tags,
    bool IsPublic,
    int LikeCount,
    DateTime CreatedAt,
    DateTime UpdatedAt
);

public record CreateCalligraphySampleRequest(
    [Required(ErrorMessage = "عنوان اثر خط الزامی است")]
    string Title,

    [Required(ErrorMessage = "آدرس تصویر الزامی است")]
    string ImageUrl,

    string? Style,

    string? Description,

    string? Tags,

    bool IsPublic = true
);

public record CalligraphySampleDto(
    int Id,
    int UserId,
    string Title,
    string ImageUrl,
    string? Style,
    string? Description,
    string? Tags,
    bool IsPublic,
    int LikeCount,
    DateTime CreatedAt,
    DateTime UpdatedAt
);