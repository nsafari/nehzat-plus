using EducationalPlatform.Nehzat.Application.DTOs;

namespace EducationalPlatform.Nehzat.Application.Interfaces;

public interface IEducationalProcessService
{
    Task<List<EducationalProcessDto>> GetProcessesAsync();
    Task<EducationalProcessDto?> GetProcessByIdAsync(int id);
    Task<EducationalProcessDto?> GetProcessByEntityTypeAsync(string entityType);
    Task<EducationalProcessDto> CreateProcessAsync(CreateEducationalProcessDto dto);
    Task<EducationalProcessDto> UpdateProcessAsync(int id, UpdateEducationalProcessDto dto);
    Task DeleteProcessAsync(int id);
    Task<ProcessTriggerResultDto> TriggerProcessAsync(string entityType, int entityId, string title, string description, string createdByUsername);
}
