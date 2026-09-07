using EducationalPlatform.Nehzat.Application.DTOs;

namespace EducationalPlatform.Nehzat.Application.Interfaces;

public interface IMaktabLookupService
{
    Task<MaktabLookupResponse> DetermineMaktabAsync(DateTime birthDate, string gender);
    Task<List<MaktabLookupResponse>> GetAllLookupsAsync();
}
