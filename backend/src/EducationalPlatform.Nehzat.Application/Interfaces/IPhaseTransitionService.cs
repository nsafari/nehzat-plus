using EducationalPlatform.Nehzat.Application.DTOs;

namespace EducationalPlatform.Nehzat.Application.Interfaces;

public interface IPhaseTransitionService
{
    Task<PhaseTransitionResultDto?> CheckAndTransitionAsync(int userId);
    Task<int> CheckAllAsync();
}
