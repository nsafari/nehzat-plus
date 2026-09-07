using Microsoft.EntityFrameworkCore;
using EducationalPlatform.Nehzat.Application.Constants;
using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Domain.Entities;
using EducationalPlatform.Nehzat.Infrastructure.Data;

namespace EducationalPlatform.Nehzat.Infrastructure.Services;

public class MaktabService : IMaktabService
{
    private readonly AppDbContext _db;

    public MaktabService(AppDbContext db) => _db = db;

    // ====================================================================
    // کمکی — دسترسی و سطوح دسترسی
    // ====================================================================

    private async Task<(bool IsOwner, bool IsManager, bool IsMember)> GetAccessLevelAsync(int maktabId, int userId)
    {
        var member = await _db.MaktabMembers
            .FirstOrDefaultAsync(m => m.MaktabId == maktabId && m.UserId == userId && m.Status == "active");

        if (member == null) return (false, false, false);

        return (member.Role == "owner", member.Role == "owner" || member.Role == "manager", true);
    }

    private async Task<MaktabDto> ToDtoAsync(Maktab m, int userId)
    {
        var owner = await _db.Users.FindAsync(m.OwnerUserId);
        var myMembership = await _db.MaktabMembers
            .FirstOrDefaultAsync(mm => mm.MaktabId == m.Id && mm.UserId == userId && mm.Status == "active");
        var memberCount = await _db.MaktabMembers
            .CountAsync(mm => mm.MaktabId == m.Id && mm.Status == "active");

        return new MaktabDto
        {
            Id = m.Id,
            Name = m.Name,
            Description = m.Description,
            City = m.City,
            Address = m.Address,
            Phone = m.Phone,
            OwnerUserId = m.OwnerUserId,
            OwnerName = owner != null ? $"{owner.FirstName} {owner.LastName}".Trim() : "",
            InviteCode = m.InviteCode,
            Status = m.Status,
            IsPublic = m.IsPublic,
            MemberCount = memberCount,
            MyRole = myMembership?.Role ?? "",
            CreatedAt = m.CreatedAt
        };
    }

    private static string GenerateInviteCode()
    {
        const string chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        var random = Random.Shared;
        var code = new char[8];
        for (int i = 0; i < 8; i++)
            code[i] = chars[random.Next(chars.Length)];
        return new string(code);
    }

    private static string GetOwnerName(User? u) => u != null ? $"{u.FirstName ?? ""} {u.LastName ?? ""}".Trim() : "";

    private async Task<bool> IsAdminAsync(int userId)
    {
        var u = await _db.Users.FindAsync(userId);
        return u?.UserType == RoleNames.Admin;
    }

    // ====================================================================
    // CRUD اصلی
    // ====================================================================

    public async Task<List<MaktabDto>> GetAllAsync(int userId)
    {
        var isAdmin = await IsAdminAsync(userId);

        var query = _db.Maktabs
            .Where(m => !m.IsDeleted)
            .AsQueryable();

        if (!isAdmin)
        {
            var memberMaktabIds = await _db.MaktabMembers
                .Where(mm => mm.UserId == userId && mm.Status == "active")
                .Select(mm => mm.MaktabId)
                .ToListAsync();

            query = query.Where(m => m.IsPublic || memberMaktabIds.Contains(m.Id));
        }

        var maktabs = await query.OrderByDescending(m => m.CreatedAt).ToListAsync();
        if (maktabs.Count == 0) return [];

        var maktabIds = maktabs.Select(m => m.Id).ToList();
        var ownerIds = maktabs.Select(m => m.OwnerUserId).Distinct().ToList();

        var owners = await _db.Users
            .Where(u => ownerIds.Contains(u.Id))
            .Select(u => new { u.Id, u.FirstName, u.LastName })
            .ToListAsync();

        var ownerLookup = owners.ToDictionary(o => o.Id, o => $"{o.FirstName ?? ""} {o.LastName ?? ""}".Trim());

        var myMemberships = await _db.MaktabMembers
            .Where(mm => maktabIds.Contains(mm.MaktabId) && mm.UserId == userId && mm.Status == "active")
            .Select(mm => new { mm.MaktabId, mm.Role })
            .ToListAsync();

        var myMembershipLookup = myMemberships.ToDictionary(m => m.MaktabId, m => m.Role);

        var memberCounts = await _db.MaktabMembers
            .Where(mm => maktabIds.Contains(mm.MaktabId) && mm.Status == "active")
            .GroupBy(mm => mm.MaktabId)
            .Select(g => new { MaktabId = g.Key, Count = g.Count() })
            .ToDictionaryAsync(g => g.MaktabId, g => g.Count);

        var result = new List<MaktabDto>();
        foreach (var m in maktabs)
        {
            result.Add(new MaktabDto
            {
                Id = m.Id,
                Name = m.Name,
                Description = m.Description,
                City = m.City,
                Address = m.Address,
                Phone = m.Phone,
                OwnerUserId = m.OwnerUserId,
                OwnerName = ownerLookup.GetValueOrDefault(m.OwnerUserId, ""),
                InviteCode = m.InviteCode,
                Status = m.Status,
                IsPublic = m.IsPublic,
                MemberCount = memberCounts.GetValueOrDefault(m.Id, 0),
                MyRole = myMembershipLookup.GetValueOrDefault(m.Id, ""),
                CreatedAt = m.CreatedAt
            });
        }

        return result;
    }

    public async Task<MaktabDto> GetByIdAsync(int maktabId, int userId)
    {
        var m = await _db.Maktabs
            .FirstOrDefaultAsync(m => m.Id == maktabId && !m.IsDeleted)
            ?? throw new KeyNotFoundException("مکتب یافت نشد.");

        var (_, _, isMember) = await GetAccessLevelAsync(maktabId, userId);
        var isAdmin = await IsAdminAsync(userId);

        if (!m.IsPublic && !isMember && !isAdmin)
            throw new UnauthorizedAccessException("شما عضو این مکتب نیستید.");

        return await ToDtoAsync(m, userId);
    }

    public async Task<MaktabDto> CreateAsync(int userId, CreateMaktabDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name))
            throw new ArgumentException("نام مکتب الزامی است.");

        // Ensure unique invite code
        string inviteCode;
        bool isUnique;
        do
        {
            inviteCode = GenerateInviteCode();
            isUnique = !await _db.Maktabs.AnyAsync(m => m.InviteCode == inviteCode);
        } while (!isUnique);

        var maktab = new Maktab
        {
            Name = dto.Name.Trim(),
            Description = dto.Description?.Trim(),
            City = dto.City?.Trim(),
            Address = dto.Address?.Trim(),
            Phone = dto.Phone?.Trim(),
            OwnerUserId = userId,
            InviteCode = inviteCode,
            Status = "active",
            IsPublic = dto.IsPublic
        };

        _db.Maktabs.Add(maktab);
        await _db.SaveChangesAsync();

        // صاحب مکتب به‌عنوان owner عضو می‌شود
        var member = new MaktabMember
        {
            MaktabId = maktab.Id,
            UserId = userId,
            Role = "owner",
            Status = "active"
        };
        _db.MaktabMembers.Add(member);
        await _db.SaveChangesAsync();

        return await ToDtoAsync(maktab, userId);
    }

    public async Task<MaktabDto> UpdateAsync(int maktabId, int userId, UpdateMaktabDto dto)
    {
        var m = await _db.Maktabs
            .FirstOrDefaultAsync(m => m.Id == maktabId && !m.IsDeleted)
            ?? throw new KeyNotFoundException("مکتب یافت نشد.");

        var (isOwner, isManager, _) = await GetAccessLevelAsync(maktabId, userId);
        if (!isOwner && !isManager)
            throw new UnauthorizedAccessException("فقط صاحب یا مدیر مکتب می‌تواند آن را ویرایش کند.");

        if (dto.Name != null) m.Name = dto.Name.Trim();
        if (dto.Description != null) m.Description = dto.Description.Trim();
        if (dto.City != null) m.City = dto.City.Trim();
        if (dto.Address != null) m.Address = dto.Address.Trim();
        if (dto.Phone != null) m.Phone = dto.Phone.Trim();
        if (dto.IsPublic.HasValue) m.IsPublic = dto.IsPublic.Value;

        // فقط owner می‌تواند status را تغییر دهد
        if (dto.Status != null && isOwner)
            m.Status = dto.Status;

        m.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        return await ToDtoAsync(m, userId);
    }

    public async Task DeleteAsync(int maktabId, int userId)
    {
        var m = await _db.Maktabs
            .FirstOrDefaultAsync(m => m.Id == maktabId && !m.IsDeleted)
            ?? throw new KeyNotFoundException("مکتب یافت نشد.");

        var (isOwner, _, _) = await GetAccessLevelAsync(maktabId, userId);
        if (!isOwner)
            throw new UnauthorizedAccessException("فقط صاحب مکتب می‌تواند آن را حذف کند.");

        m.IsDeleted = true;
        m.Status = "archived";
        m.UpdatedAt = DateTime.UtcNow;

        // غیرفعال کردن همه اعضا
        var members = await _db.MaktabMembers
            .Where(mm => mm.MaktabId == maktabId && mm.Status == "active")
            .ToListAsync();
        foreach (var member in members)
        {
            member.Status = "inactive";
            member.LeftAt = DateTime.UtcNow;
        }

        await _db.SaveChangesAsync();
    }

    // ====================================================================
    // دعوت و عضویت
    // ====================================================================

    public async Task<string> GetInviteCodeAsync(int maktabId, int userId)
    {
        var m = await _db.Maktabs
            .FirstOrDefaultAsync(m => m.Id == maktabId && !m.IsDeleted)
            ?? throw new KeyNotFoundException("مکتب یافت نشد.");

        var (isOwner, isManager, _) = await GetAccessLevelAsync(maktabId, userId);
        if (!isOwner && !isManager)
            throw new UnauthorizedAccessException("فقط صاحب یا مدیر مکتب می‌تواند کد دعوت را ببیند.");

        return m.InviteCode;
    }

    public async Task<string> RegenerateInviteCodeAsync(int maktabId, int userId)
    {
        var m = await _db.Maktabs
            .FirstOrDefaultAsync(m => m.Id == maktabId && !m.IsDeleted)
            ?? throw new KeyNotFoundException("مکتب یافت نشد.");

        var (isOwner, isManager, _) = await GetAccessLevelAsync(maktabId, userId);
        if (!isOwner && !isManager)
            throw new UnauthorizedAccessException("فقط صاحب یا مدیر مکتب می‌تواند کد دعوت را بازتولید کند.");

        string newCode;
        bool isUnique;
        do
        {
            newCode = GenerateInviteCode();
            isUnique = !await _db.Maktabs.AnyAsync(m => m.InviteCode == newCode);
        } while (!isUnique);

        m.InviteCode = newCode;
        m.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        return m.InviteCode;
    }

    public async Task<MaktabDto> JoinByInviteCodeAsync(int userId, string inviteCode)
    {
        if (string.IsNullOrWhiteSpace(inviteCode))
            throw new ArgumentException("کد دعوت الزامی است.");

        var m = await _db.Maktabs
            .FirstOrDefaultAsync(m => m.InviteCode == inviteCode.Trim().ToUpperInvariant() && !m.IsDeleted && m.Status == "active")
            ?? throw new KeyNotFoundException("کد دعوت نامعتبر است یا مکتب فعال نیست.");

        var existing = await _db.MaktabMembers
            .FirstOrDefaultAsync(mm => mm.MaktabId == m.Id && mm.UserId == userId);

        if (existing != null)
        {
            if (existing.Status == "active")
                throw new InvalidOperationException("شما قبلاً عضو این مکتب هستید.");

            existing.Status = "active";
            existing.LeftAt = null;
            await _db.SaveChangesAsync();
            return await ToDtoAsync(m, userId);
        }

        var member = new MaktabMember
        {
            MaktabId = m.Id,
            UserId = userId,
            Role = "member",
            Status = "active"
        };
        _db.MaktabMembers.Add(member);
        await _db.SaveChangesAsync();

        return await ToDtoAsync(m, userId);
    }

    public async Task<MaktabMemberDto> InviteByNationalCodeAsync(int maktabId, int userId, InviteByNationalCodeDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.NationalCode))
            throw new ArgumentException("کد ملی الزامی است.");

        var (isOwner, isManager, _) = await GetAccessLevelAsync(maktabId, userId);
        if (!isOwner && !isManager)
            throw new UnauthorizedAccessException("فقط صاحب یا مدیر مکتب می‌تواند دعوت کند.");

        if (dto.Role != "manager" && dto.Role != "member")
            throw new ArgumentException("نقش باید manager یا member باشد.");

        var targetUser = await _db.Users
            .FirstOrDefaultAsync(u => u.NationalCode == dto.NationalCode.Trim())
            ?? throw new KeyNotFoundException("کاربری با این کد ملی یافت نشد.");

        var existing = await _db.MaktabMembers
            .FirstOrDefaultAsync(mm => mm.MaktabId == maktabId && mm.UserId == targetUser.Id);

        if (existing != null)
        {
            if (existing.Status == "active")
                throw new InvalidOperationException("این کاربر قبلاً عضو مکتب است.");

            existing.Status = "active";
            existing.Role = dto.Role;
            existing.LeftAt = null;
            await _db.SaveChangesAsync();

            return new MaktabMemberDto
            {
                Id = existing.Id,
                UserId = targetUser.Id,
                FirstName = targetUser.FirstName ?? "",
                LastName = targetUser.LastName ?? "",
            NationalCode = targetUser.NationalCode,
            Phone = targetUser.PhoneNumber,
            Role = existing.Role,
                Status = existing.Status,
                JoinedAt = existing.JoinedAt
            };
        }

        var member = new MaktabMember
        {
            MaktabId = maktabId,
            UserId = targetUser.Id,
            Role = dto.Role,
            Status = "active"
        };
        _db.MaktabMembers.Add(member);
        await _db.SaveChangesAsync();

        return new MaktabMemberDto
        {
            Id = member.Id,
            UserId = targetUser.Id,
            FirstName = targetUser.FirstName ?? "",
            LastName = targetUser.LastName ?? "",
            NationalCode = targetUser.NationalCode,
            Phone = targetUser.PhoneNumber,
            Role = member.Role,
            Status = member.Status,
            JoinedAt = member.JoinedAt
        };
    }

    // ====================================================================
    // مدیریت اعضا
    // ====================================================================

    public async Task<PaginatedResult<MaktabMemberDto>> GetMembersAsync(int maktabId, int userId, MaktabMemberFilterDto filter)
    {
        var m = await _db.Maktabs
            .FirstOrDefaultAsync(m => m.Id == maktabId && !m.IsDeleted)
            ?? throw new KeyNotFoundException("مکتب یافت نشد.");

        var (_, _, isMember) = await GetAccessLevelAsync(maktabId, userId);
        var isAdmin = await IsAdminAsync(userId);
        if (!isMember && !isAdmin)
            throw new UnauthorizedAccessException("شما عضو این مکتب نیستید.");

        var query = _db.MaktabMembers
            .Where(mm => mm.MaktabId == maktabId)
            .AsQueryable();

        if (!string.IsNullOrEmpty(filter.Search))
        {
            var search = filter.Search.Trim().ToLowerInvariant();
            query = query.Where(mm =>
                mm.User!.FirstName!.ToLowerInvariant().Contains(search) ||
                mm.User.LastName!.ToLowerInvariant().Contains(search) ||
                (mm.User.NationalCode != null && mm.User.NationalCode.Contains(search)) ||
                (mm.User.PhoneNumber != null && mm.User.PhoneNumber.Contains(search)));
        }
        if (!string.IsNullOrEmpty(filter.Role))
            query = query.Where(mm => mm.Role == filter.Role);
        if (!string.IsNullOrEmpty(filter.Status))
            query = query.Where(mm => mm.Status == filter.Status);

        var totalCount = await query.CountAsync();

        var items = await query
            .Include(mm => mm.User)
            .OrderBy(mm => mm.Role == "owner" ? 0 : mm.Role == "manager" ? 1 : 2)
            .ThenByDescending(mm => mm.JoinedAt)
            .Skip((filter.Page - 1) * filter.PageSize)
            .Take(filter.PageSize)
            .Select(mm => new MaktabMemberDto
            {
                Id = mm.Id,
                UserId = mm.UserId,
                FirstName = mm.User!.FirstName!,
                LastName = mm.User.LastName!,
                NationalCode = mm.User.NationalCode,
                Phone = mm.User.PhoneNumber,
                Role = mm.Role,
                Status = mm.Status,
                JoinedAt = mm.JoinedAt
            })
            .ToListAsync();

        return new PaginatedResult<MaktabMemberDto>
        {
            Items = items,
            TotalCount = totalCount,
            Page = filter.Page,
            PageSize = filter.PageSize
        };
    }

    public async Task ChangeMemberRoleAsync(int maktabId, int userId, int targetUserId, string newRole)
    {
        if (newRole != "manager" && newRole != "member")
            throw new ArgumentException("نقش باید manager یا member باشد.");

        var (isOwner, isManager, _) = await GetAccessLevelAsync(maktabId, userId);
        if (!isOwner && !isManager)
            throw new UnauthorizedAccessException("فقط صاحب یا مدیر مکتب می‌تواند نقش اعضا را تغییر دهد.");

        if (targetUserId == userId)
            throw new InvalidOperationException("نمی‌توانید نقش خود را تغییر دهید.");

        var targetMember = await _db.MaktabMembers
            .FirstOrDefaultAsync(mm => mm.MaktabId == maktabId && mm.UserId == targetUserId && mm.Status == "active")
            ?? throw new KeyNotFoundException("عضو مورد نظر یافت نشد.");

        if (targetMember.Role == "owner")
            throw new InvalidOperationException("نمی‌توان نقش صاحب مکتب را تغییر داد.");

        if (!isOwner && targetMember.Role == "manager")
            throw new UnauthorizedAccessException("فقط صاحب مکتب می‌تواند نقش مدیران را تغییر دهد.");

        targetMember.Role = newRole;
        await _db.SaveChangesAsync();
    }

    public async Task RemoveMemberAsync(int maktabId, int userId, int targetUserId)
    {
        var (isOwner, isManager, _) = await GetAccessLevelAsync(maktabId, userId);
        if (!isOwner && !isManager)
            throw new UnauthorizedAccessException("فقط صاحب یا مدیر مکتب می‌تواند عضو حذف کند.");

        if (targetUserId == userId)
            throw new InvalidOperationException("برای خروج خود از گزینه «خروج از مکتب» استفاده کنید.");

        var targetMember = await _db.MaktabMembers
            .FirstOrDefaultAsync(mm => mm.MaktabId == maktabId && mm.UserId == targetUserId && mm.Status == "active")
            ?? throw new KeyNotFoundException("عضو مورد نظر یافت نشد.");

        if (targetMember.Role == "owner")
            throw new InvalidOperationException("نمی‌توان صاحب مکتب را حذف کرد. ابتدا مالکیت را انتقال دهید.");

        if (!isOwner && targetMember.Role == "manager")
            throw new UnauthorizedAccessException("فقط صاحب مکتب می‌تواند مدیران را حذف کند.");

        targetMember.Status = "inactive";
        targetMember.LeftAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
    }

    public async Task LeaveMaktabAsync(int maktabId, int userId)
    {
        var member = await _db.MaktabMembers
            .FirstOrDefaultAsync(mm => mm.MaktabId == maktabId && mm.UserId == userId && mm.Status == "active")
            ?? throw new KeyNotFoundException("شما عضو این مکتب نیستید.");

        if (member.Role == "owner")
            throw new InvalidOperationException("صاحب مکتب نمی‌تواند خارج شود. ابتدا مالکیت را به فرد دیگری انتقال دهید.");

        member.Status = "inactive";
        member.LeftAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
    }

    // ====================================================================
    // مالکیت
    // ====================================================================

    public async Task TransferOwnershipAsync(int maktabId, int userId, int newOwnerUserId)
    {
        var m = await _db.Maktabs
            .FirstOrDefaultAsync(m => m.Id == maktabId && !m.IsDeleted)
            ?? throw new KeyNotFoundException("مکتب یافت نشد.");

        var (isOwner, _, _) = await GetAccessLevelAsync(maktabId, userId);
        if (!isOwner)
            throw new UnauthorizedAccessException("فقط صاحب مکتب می‌تواند مالکیت را انتقال دهد.");

        if (newOwnerUserId == userId)
            throw new InvalidOperationException("شما صاحب فعلی هستید. کاربر جدیدی انتخاب کنید.");

        var newOwnerMember = await _db.MaktabMembers
            .FirstOrDefaultAsync(mm => mm.MaktabId == maktabId && mm.UserId == newOwnerUserId && mm.Status == "active")
            ?? throw new KeyNotFoundException("کاربر مورد نظر عضو فعال این مکتب نیست.");

        // تغییر owner قدیمی به manager
        var oldOwnerMember = await _db.MaktabMembers
            .FirstOrDefaultAsync(mm => mm.MaktabId == maktabId && mm.UserId == userId);
        if (oldOwnerMember != null)
            oldOwnerMember.Role = "manager";

        // تغییر نقش مالک جدید
        newOwnerMember.Role = "owner";

        // به‌روزرسانی OwnerUserId در مکتب
        m.OwnerUserId = newOwnerUserId;
        m.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
    }

    // ====================================================================
    // وضعیت
    // ====================================================================

    public async Task ChangeStatusAsync(int maktabId, int userId, string newStatus)
    {
        var validStatuses = new[] { "active", "inactive", "archived" };
        if (!validStatuses.Contains(newStatus))
            throw new ArgumentException("وضعیت باید active، inactive یا archived باشد.");

        var m = await _db.Maktabs
            .FirstOrDefaultAsync(m => m.Id == maktabId && !m.IsDeleted)
            ?? throw new KeyNotFoundException("مکتب یافت نشد.");

        var (isOwner, _, _) = await GetAccessLevelAsync(maktabId, userId);
        if (!isOwner)
            throw new UnauthorizedAccessException("فقط صاحب مکتب می‌تواند وضعیت را تغییر دهد.");

        m.Status = newStatus;
        m.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
    }
}
