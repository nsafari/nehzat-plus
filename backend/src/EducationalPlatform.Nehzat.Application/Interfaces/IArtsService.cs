using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Domain.Entities;

namespace EducationalPlatform.Nehzat.Application.Interfaces;

public interface IArtsService
{
    Task<List<Artwork>> GetArtworksAsync(int? userId = null);
    Task<Artwork> CreateArtworkAsync(int userId, CreateArtworkRequest request);
    Task<int> LikeArtworkAsync(int artworkId);

    Task<List<MusicRecord>> GetMusicRecordsAsync(int? userId = null);
    Task<MusicRecord> CreateMusicRecordAsync(int userId, CreateMusicRecordRequest request);
    Task<int> LikeMusicRecordAsync(int musicRecordId);

    Task<List<CalligraphySample>> GetCalligraphySamplesAsync(int? userId = null);
    Task<CalligraphySample> CreateCalligraphySampleAsync(int userId, CreateCalligraphySampleRequest request);
    Task<int> LikeCalligraphySampleAsync(int calligraphySampleId);
}