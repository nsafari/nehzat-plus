using EducationalPlatform.Nehzat.Application.DTOs;

namespace EducationalPlatform.Nehzat.Application.Interfaces;

public interface IHalghehService
{
    Task<List<HalghehDto>> GetAllAsync(int? maktabId = null);
    Task<HalghehDto?> GetByIdAsync(int id);
    Task<HalghehDto> CreateAsync(CreateHalghehDto dto);
    Task<HalghehDto?> UpdateAsync(int id, UpdateHalghehDto dto);
    Task<bool> DeleteAsync(int id);
}
