using EducationalPlatform.Nehzat.Application.DTOs;

namespace EducationalPlatform.Nehzat.Application.Interfaces;

public interface IHalghehMaktabService
{
    // ============ CRUD اصلی ============
    Task<List<HalghehFullDto>> GetAllByMaktabAsync(int maktabId, int userId);
    Task<HalghehFullDto> GetByIdAsync(int halghehId, int userId);
    Task<HalghehFullDto> CreateAsync(int userId, CreateHalghehFullDto dto);
    Task<HalghehFullDto> UpdateAsync(int halghehId, int userId, UpdateHalghehFullDto dto);
    Task DeleteAsync(int halghehId, int userId);

    // ============ اعضا ============
    Task<PaginatedResult<HalghehMemberDto>> GetMembersAsync(int halghehId, int userId, HalghehMemberFilterDto filter);
    Task<HalghehFullDto> JoinAsync(int halghehId, int userId);
    Task RemoveMemberAsync(int halghehId, int userId, int targetUserId);
    Task LeaveAsync(int halghehId, int userId);
    Task ChangeMemberRoleAsync(int halghehId, int userId, int targetUserId, string newRole);

    // ============ مدیریت ============
    Task TransferModeratorAsync(int halghehId, int userId, int newModeratorUserId);
    Task ChangeStatusAsync(int halghehId, int userId, string newStatus);
}
