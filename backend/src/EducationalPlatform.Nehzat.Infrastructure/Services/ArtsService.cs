using Microsoft.EntityFrameworkCore;
using EducationalPlatform.Nehzat.Domain.Entities;
using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Infrastructure.Data;

namespace EducationalPlatform.Nehzat.Infrastructure.Services;

public class ArtsService : IArtsService
{
    private readonly AppDbContext _db;

    public ArtsService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<Artwork>> GetArtworksAsync(int? userId = null)
    {
        var query = _db.Artworks.AsQueryable();

        if (userId.HasValue)
            query = query.Where(e => e.IsPublic || e.UserId == userId.Value);
        else
            query = query.Where(e => e.IsPublic);

        return await query
            .OrderByDescending(e => e.CreatedAt)
            .ToListAsync();
    }

    public async Task<Artwork> CreateArtworkAsync(int userId, CreateArtworkRequest request)
    {
        var artwork = new Artwork
        {
            UserId = userId,
            Title = request.Title,
            Type = request.Type,
            FileUrl = request.FileUrl,
            Description = request.Description,
            Tags = request.Tags,
            IsPublic = request.IsPublic,
            LikeCount = 0,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _db.Artworks.Add(artwork);
        await _db.SaveChangesAsync();
        return artwork;
    }

    public async Task<int> LikeArtworkAsync(int artworkId)
    {
        var artwork = await _db.Artworks.FindAsync(artworkId)
            ?? throw new KeyNotFoundException("اثر هنری یافت نشد");

        artwork.LikeCount++;
        artwork.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return artwork.LikeCount;
    }

    public async Task<List<MusicRecord>> GetMusicRecordsAsync(int? userId = null)
    {
        var query = _db.MusicRecords.AsQueryable();

        if (userId.HasValue)
            query = query.Where(e => e.IsPublic || e.UserId == userId.Value);
        else
            query = query.Where(e => e.IsPublic);

        return await query
            .OrderByDescending(e => e.CreatedAt)
            .ToListAsync();
    }

    public async Task<MusicRecord> CreateMusicRecordAsync(int userId, CreateMusicRecordRequest request)
    {
        var record = new MusicRecord
        {
            UserId = userId,
            Title = request.Title,
            AudioUrl = request.AudioUrl,
            ArtistName = request.ArtistName,
            DurationSeconds = request.DurationSeconds,
            Genre = request.Genre,
            Description = request.Description,
            Tags = request.Tags,
            IsPublic = request.IsPublic,
            LikeCount = 0,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _db.MusicRecords.Add(record);
        await _db.SaveChangesAsync();
        return record;
    }

    public async Task<int> LikeMusicRecordAsync(int musicRecordId)
    {
        var record = await _db.MusicRecords.FindAsync(musicRecordId)
            ?? throw new KeyNotFoundException("اثر صوتی یافت نشد");

        record.LikeCount++;
        record.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return record.LikeCount;
    }

    public async Task<List<CalligraphySample>> GetCalligraphySamplesAsync(int? userId = null)
    {
        var query = _db.CalligraphySamples.AsQueryable();

        if (userId.HasValue)
            query = query.Where(e => e.IsPublic || e.UserId == userId.Value);
        else
            query = query.Where(e => e.IsPublic);

        return await query
            .OrderByDescending(e => e.CreatedAt)
            .ToListAsync();
    }

    public async Task<CalligraphySample> CreateCalligraphySampleAsync(int userId, CreateCalligraphySampleRequest request)
    {
        var sample = new CalligraphySample
        {
            UserId = userId,
            Title = request.Title,
            ImageUrl = request.ImageUrl,
            Style = request.Style,
            Description = request.Description,
            Tags = request.Tags,
            IsPublic = request.IsPublic,
            LikeCount = 0,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _db.CalligraphySamples.Add(sample);
        await _db.SaveChangesAsync();
        return sample;
    }

    public async Task<int> LikeCalligraphySampleAsync(int calligraphySampleId)
    {
        var sample = await _db.CalligraphySamples.FindAsync(calligraphySampleId)
            ?? throw new KeyNotFoundException("اثر خوشنویسی یافت نشد");

        sample.LikeCount++;
        sample.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return sample.LikeCount;
    }
}