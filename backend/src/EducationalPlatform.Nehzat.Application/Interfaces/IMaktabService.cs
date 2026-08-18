using EducationalPlatform.Nehzat.Application.DTOs;

namespace EducationalPlatform.Nehzat.Application.Interfaces;

public interface IMaktabService
{
    // ============ CRUD اصلی ============
    /// <summary>لیست مکتب‌های قابل دسترسی کاربر</summary>
    Task<List<MaktabDto>> GetAllAsync(int userId);

    /// <summary>جزئیات یک مکتب</summary>
    Task<MaktabDto> GetByIdAsync(int maktabId, int userId);

    /// <summary>ایجاد مکتب جدید (کاربر = owner)</summary>
    Task<MaktabDto> CreateAsync(int userId, CreateMaktabDto dto);

    /// <summary>ویرایش مکتب (فقط owner/manager)</summary>
    Task<MaktabDto> UpdateAsync(int maktabId, int userId, UpdateMaktabDto dto);

    /// <summary>حذف (soft delete) مکتب — فقط owner</summary>
    Task DeleteAsync(int maktabId, int userId);

    // ============ دعوت و عضویت ============
    /// <summary>دریافت کد دعوت مکتب (فقط owner/manager)</summary>
    Task<string> GetInviteCodeAsync(int maktabId, int userId);

    /// <summary>بازتولید کد دعوت جدید</summary>
    Task<string> RegenerateInviteCodeAsync(int maktabId, int userId);

    /// <summary>عضویت با کد دعوت</summary>
    Task<MaktabDto> JoinByInviteCodeAsync(int userId, string inviteCode);

    /// <summary>دعوت با کد ملی (فقط owner/manager)</summary>
    Task<MaktabMemberDto> InviteByNationalCodeAsync(int maktabId, int userId, InviteByNationalCodeDto dto);

    // ============ مدیریت اعضا ============
    /// <summary>لیست اعضای مکتب</summary>
    Task<PaginatedResult<MaktabMemberDto>> GetMembersAsync(int maktabId, int userId, MaktabMemberFilterDto filter);

    /// <summary>تغییر نقش عضو (فقط owner/manager)</summary>
    Task ChangeMemberRoleAsync(int maktabId, int userId, int targetUserId, string newRole);

    /// <summary>حذف عضو از مکتب (فقط owner/manager)</summary>
    Task RemoveMemberAsync(int maktabId, int userId, int targetUserId);

    /// <summary>خروج خود کاربر از مکتب</summary>
    Task LeaveMaktabAsync(int maktabId, int userId);

    // ============ مالکیت ============
    /// <summary>انتقال مالکیت (فقط owner)</summary>
    Task TransferOwnershipAsync(int maktabId, int userId, int newOwnerUserId);

    // ============ وضعیت ============
    /// <summary>تغییر وضعیت مکتب (فقط owner)</summary>
    Task ChangeStatusAsync(int maktabId, int userId, string newStatus);
}

public class PaginatedResult<T>
{
    public List<T> Items { get; set; } = new();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
}
