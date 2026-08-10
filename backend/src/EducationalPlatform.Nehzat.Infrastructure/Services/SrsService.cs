using Microsoft.EntityFrameworkCore;
using EducationalPlatform.Nehzat.Domain.Entities;
using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Infrastructure.Data;

namespace EducationalPlatform.Nehzat.Infrastructure.Services;

public class SrsService : ISrsService
{
    private const double MinEaseFactor = 1.3;
    private const double DefaultEaseFactor = 2.5;
    private const int MaxIntervalDays = 365;

    private readonly AppDbContext _db;

    public SrsService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<SpacedRepetitionCard> UpsertAsync(int userId, UpsertSrsCardRequest request)
    {
        var card = new SpacedRepetitionCard
        {
            UserId = userId,
            ContentType = request.ContentType,
            ContentId = request.ContentId,
            Question = request.Question,
            Answer = request.Answer,
            NextReviewAt = DateTime.UtcNow,
            Interval = 0,
            EaseFactor = DefaultEaseFactor,
            Repetition = 0,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _db.SpacedRepetitionCards.Add(card);
        await _db.SaveChangesAsync();
        return card;
    }

    public async Task<List<SpacedRepetitionCard>> GetDueCardsAsync(int userId)
    {
        return await _db.SpacedRepetitionCards
            .Where(c => c.UserId == userId && c.NextReviewAt <= DateTime.UtcNow)
            .OrderBy(c => c.NextReviewAt)
            .ToListAsync();
    }

    public async Task<SpacedRepetitionCard> ReviewCardAsync(int userId, int cardId, int quality)
    {
        var card = await _db.SpacedRepetitionCards
            .FirstOrDefaultAsync(c => c.Id == cardId && c.UserId == userId)
            ?? throw new KeyNotFoundException("کارت مرور یافت نشد");

        var (interval, easeFactor, repetition) = Sm2Schedule(quality, card.Interval, card.EaseFactor, card.Repetition);

        card.Interval = interval;
        card.EaseFactor = easeFactor;
        card.Repetition = repetition;
        card.NextReviewAt = DateTime.UtcNow.AddDays(interval);
        card.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return card;
    }

    public async Task<SrsStatsDto> GetStatsAsync(int userId)
    {
        var now = DateTime.UtcNow;
        var cards = await _db.SpacedRepetitionCards
            .Where(c => c.UserId == userId)
            .ToListAsync();

        var dueToday = cards.Count(c => c.NextReviewAt <= now);
        var learning = cards.Count(c => c.Repetition < 3);
        var review = cards.Count(c => c.Repetition >= 3);
        var avgEase = cards.Count == 0 ? DefaultEaseFactor : cards.Average(c => c.EaseFactor);

        return new SrsStatsDto(
            DueToday: dueToday,
            TotalCards: cards.Count,
            LearningCards: learning,
            ReviewCards: review,
            AverageEaseFactor: Math.Round(avgEase, 2)
        );
    }

    internal static (int Interval, double EaseFactor, int Repetition) Sm2Schedule(int quality, int currentInterval, double currentEaseFactor, int currentRepetition)
    {
        var q = Math.Clamp(quality, 1, 4);
        var easeFactor = Math.Max(MinEaseFactor, currentEaseFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));

        if (q < 3)
        {
            return (1, easeFactor, 0);
        }

        var repetition = currentRepetition + 1;
        var interval = GetNextInterval(currentInterval, easeFactor, repetition);
        return (interval, easeFactor, repetition);
    }

    private static int GetNextInterval(int currentInterval, double easeFactor, int repetition)
    {
        if (repetition <= 0) return 1;
        if (repetition == 1) return 3;
        if (repetition == 2) return 7;
        if (repetition == 3) return 21;
        return Math.Min(Math.Max(1, (int)Math.Round(currentInterval * easeFactor)), MaxIntervalDays);
    }
}