using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Domain.Entities;

namespace EducationalPlatform.Nehzat.Application.Interfaces;

public interface ISrsService
{
    Task<SpacedRepetitionCard> UpsertAsync(int userId, UpsertSrsCardRequest request);
    Task<List<SpacedRepetitionCard>> GetDueCardsAsync(int userId);
    Task<SpacedRepetitionCard> ReviewCardAsync(int userId, int cardId, int quality);
    Task<SrsStatsDto> GetStatsAsync(int userId);
}