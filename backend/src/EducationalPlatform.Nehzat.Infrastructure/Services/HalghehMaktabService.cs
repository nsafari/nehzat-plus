using Microsoft.EntityFrameworkCore;
using EducationalPlatform.Nehzat.Application.Constants;
using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Domain.Entities;
using EducationalPlatform.Nehzat.Infrastructure.Data;

namespace EducationalPlatform.Nehzat.Infrastructure.Services;

public class HalghehMaktabService : IHalghehMaktabService
{
    private readonly AppDbContext _db;

    public HalghehMaktabService(AppDbContext db) => _db = db;

    // ====================================================================
    // Helpers
    // ====================================================================

    private async Task<(bool IsOwner, bool IsManager, bool IsMaktabMember, string Role)> GetMaktabAccessAsync(int maktabId, int userId)
    {
        var member = await _db.MaktabMembers
            .FirstOrDefaultAsync(m => m.MaktabId == maktabId && m.UserId == userId && m.Status == "active");

        if (member == null) return (false, false, false, "");

        return (member.Role == "owner", member.Role == "owner" || member.Role == "manager", true, member.Role);
    }

    private async Task<(bool IsModerator, bool IsMember)> GetHalghehAccessAsync(int halghehId, int userId)
    {
        var member = await _db.HalghehMembers
            .FirstOrDefaultAsync(m => m.HalghehId == halghehId && m.UserId == userId && m.Status == "active");

        if (member == null) return (false, false);

        return (member.Role == "moderator", true);
    }

    private async Task<bool> IsAdminAsync(int userId)
    {
        var u = await _db.Users.FindAsync(userId);
        return u?.UserType == RoleNames.Admin;
    }

    private async Task<HalghehFullDto> ToDtoAsync(Halgheh h, int userId)
    {
        var moderator = await _db.Users.FindAsync(h.ModeratorUserId);
        var maktab = await _db.Maktabs.FindAsync(h.MaktabId);
        var myMembership = await _db.HalghehMembers
            .FirstOrDefaultAsync(hm => hm.HalghehId == h.Id && hm.UserId == userId && hm.Status == "active");
        var memberCount = await _db.HalghehMembers
            .CountAsync(hm => hm.HalghehId == h.Id && hm.Status == "active");

        return new HalghehFullDto
        {
            Id = h.Id,
            MaktabId = h.MaktabId,
            MaktabName = maktab?.Name ?? "",
            Name = h.Name,
            Description = h.Description,
            MaxMembers = h.MaxMembers,
            ModeratorUserId = h.ModeratorUserId,
            ModeratorName = moderator != null ? $"{moderator.FirstName} {moderator.LastName}".Trim() : "",
            Status = h.Status,
            MemberCount = memberCount,
            MyRole = myMembership?.Role ?? "",
            CreatedAt = h.CreatedAt
        };
    }

    private async Task<(bool IsOwner, bool IsManager, bool IsMaktabMember, string Role)> GetMaktabAccessAsyncForHalghehAsync(int halghehId, int userId)
    {
        var h = await _db.Halghehs.FindAsync(halghehId);
        if (h == null) return (false, false, false, "");
        return await GetMaktabAccessAsync(h.MaktabId, userId);
    }

    // ====================================================================
    // CRUD
    // ====================================================================

    public async Task<List<HalghehFullDto>> GetAllByMaktabAsync(int maktabId, int userId)
    {
        var (_, _, isMaktabMember, _) = await GetMaktabAccessAsync(maktabId, userId);
        var isAdmin = await IsAdminAsync(userId);
        if (!isMaktabMember && !isAdmin)
            throw new UnauthorizedAccessException("You are not a member of this maktab.");

        var halghehs = await _db.Halghehs
            .Where(h => h.MaktabId == maktabId && !h.IsDeleted)
            .OrderByDescending(h => h.CreatedAt)
            .ToListAsync();

        var result = new List<HalghehFullDto>();
        foreach (var h in halghehs)
            result.Add(await ToDtoAsync(h, userId));

        return result;
    }

    public async Task<HalghehFullDto> GetByIdAsync(int halghehId, int userId)
    {
        var h = await _db.Halghehs
            .FirstOrDefaultAsync(h => h.Id == halghehId && !h.IsDeleted)
            ?? throw new KeyNotFoundException("Halgheh not found.");

        var (_, _, isMaktabMember, _) = await GetMaktabAccessAsync(h.MaktabId, userId);
        var isAdmin = await IsAdminAsync(userId);
        if (!isMaktabMember && !isAdmin)
            throw new UnauthorizedAccessException("You are not a member of this maktab.");

        return await ToDtoAsync(h, userId);
    }

    public async Task<HalghehFullDto> CreateAsync(int userId, CreateHalghehFullDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name))
            throw new ArgumentException("Halgheh name is required.");

        var (_, _, isMaktabMember, _) = await GetMaktabAccessAsync(dto.MaktabId, userId);
        if (!isMaktabMember)
            throw new UnauthorizedAccessException("Only maktab members can create halghehs.");

        var maktab = await _db.Maktabs
            .FirstOrDefaultAsync(m => m.Id == dto.MaktabId && !m.IsDeleted && m.Status == "active")
            ?? throw new KeyNotFoundException("Active maktab not found.");

        if (dto.MaxMembers.HasValue && dto.MaxMembers.Value < 2)
            throw new ArgumentException("Minimum halgheh capacity is 2.");

        var halgheh = new Halgheh
        {
            MaktabId = dto.MaktabId,
            Name = dto.Name.Trim(),
            NameEn = "",
            Code = Guid.NewGuid().ToString("N")[..8],
            Description = dto.Description?.Trim(),
            MaxMembers = dto.MaxMembers,
            ModeratorUserId = userId,
            Status = "active"
        };

        _db.Halghehs.Add(halgheh);
        await _db.SaveChangesAsync();

        var member = new HalghehMember
        {
            HalghehId = halgheh.Id,
            UserId = userId,
            Role = "moderator",
            Status = "active"
        };
        _db.HalghehMembers.Add(member);
        await _db.SaveChangesAsync();

        return await ToDtoAsync(halgheh, userId);
    }

    public async Task<HalghehFullDto> UpdateAsync(int halghehId, int userId, UpdateHalghehFullDto dto)
    {
        var h = await _db.Halghehs
            .FirstOrDefaultAsync(h => h.Id == halghehId && !h.IsDeleted)
            ?? throw new KeyNotFoundException("Halgheh not found.");

        var (isModerator, _) = await GetHalghehAccessAsync(halghehId, userId);
        var (isOwner, isManager, _, _) = await GetMaktabAccessAsync(h.MaktabId, userId);
        if (!isModerator && !isOwner && !isManager)
            throw new UnauthorizedAccessException("Only the moderator or maktab owner/manager can edit the halgheh.");

        if (dto.Name != null) h.Name = dto.Name.Trim();
        if (dto.Description != null) h.Description = dto.Description.Trim();
        if (dto.MaxMembers.HasValue)
        {
            if (dto.MaxMembers.Value < 2)
                throw new ArgumentException("Minimum halgheh capacity is 2.");
            h.MaxMembers = dto.MaxMembers.Value;
        }

        if (dto.Status != null && (isModerator || isOwner))
            h.Status = dto.Status;

        h.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        return await ToDtoAsync(h, userId);
    }

    public async Task DeleteAsync(int halghehId, int userId)
    {
        var h = await _db.Halghehs
            .FirstOrDefaultAsync(h => h.Id == halghehId && !h.IsDeleted)
            ?? throw new KeyNotFoundException("Halgheh not found.");

        var (isModerator, _) = await GetHalghehAccessAsync(halghehId, userId);
        var (isOwner, _, _, _) = await GetMaktabAccessAsync(h.MaktabId, userId);
        if (!isModerator && !isOwner)
            throw new UnauthorizedAccessException("Only the moderator or maktab owner can delete the halgheh.");

        h.IsDeleted = true;
        h.Status = "archived";
        h.UpdatedAt = DateTime.UtcNow;

        var members = await _db.HalghehMembers
            .Where(hm => hm.HalghehId == halghehId && hm.Status == "active")
            .ToListAsync();
        foreach (var m in members)
        {
            m.Status = "inactive";
            m.LeftAt = DateTime.UtcNow;
        }

        await _db.SaveChangesAsync();
    }

    // ====================================================================
    // Members
    // ====================================================================

    public async Task<PaginatedResult<HalghehMemberDto>> GetMembersAsync(int halghehId, int userId, HalghehMemberFilterDto filter)
    {
        var h = await _db.Halghehs
            .FirstOrDefaultAsync(h => h.Id == halghehId && !h.IsDeleted)
            ?? throw new KeyNotFoundException("Halgheh not found.");

        var (_, _, isMaktabMember, _) = await GetMaktabAccessAsync(h.MaktabId, userId);
        var isAdmin = await IsAdminAsync(userId);
        if (!isMaktabMember && !isAdmin)
            throw new UnauthorizedAccessException("You are not a member of this maktab.");

        var query = _db.HalghehMembers
            .Where(hm => hm.HalghehId == halghehId)
            .AsQueryable();

        if (!string.IsNullOrEmpty(filter.Search))
        {
            var search = filter.Search.Trim().ToLowerInvariant();
            query = query.Where(hm =>
                hm.User!.FirstName.ToLowerInvariant().Contains(search) ||
                hm.User.LastName.ToLowerInvariant().Contains(search) ||
                (hm.User.PhoneNumber != null && hm.User.PhoneNumber.Contains(search)));
        }
        if (!string.IsNullOrEmpty(filter.Role))
            query = query.Where(hm => hm.Role == filter.Role);
        if (!string.IsNullOrEmpty(filter.Status))
            query = query.Where(hm => hm.Status == filter.Status);

        var totalCount = await query.CountAsync();

        var items = await query
            .Include(hm => hm.User)
            .OrderBy(hm => hm.Role == "moderator" ? 0 : 1)
            .ThenByDescending(hm => hm.JoinedAt)
            .Skip((filter.Page - 1) * filter.PageSize)
            .Take(filter.PageSize)
            .Select(hm => new HalghehMemberDto
            {
                Id = hm.Id,
                UserId = hm.UserId,
                FirstName = hm.User!.FirstName,
                LastName = hm.User.LastName,
                Phone = hm.User.PhoneNumber,
                Role = hm.Role,
                Status = hm.Status,
                JoinedAt = hm.JoinedAt
            })
            .ToListAsync();

        return new PaginatedResult<HalghehMemberDto>
        {
            Items = items,
            TotalCount = totalCount,
            Page = filter.Page,
            PageSize = filter.PageSize
        };
    }

    public async Task<HalghehFullDto> JoinAsync(int halghehId, int userId)
    {
        var h = await _db.Halghehs
            .FirstOrDefaultAsync(h => h.Id == halghehId && !h.IsDeleted && h.Status == "active")
            ?? throw new KeyNotFoundException("Active halgheh not found.");

        var (_, _, isMaktabMember, _) = await GetMaktabAccessAsync(h.MaktabId, userId);
        if (!isMaktabMember)
            throw new UnauthorizedAccessException("You must be a maktab member to join a halgheh.");

        var existing = await _db.HalghehMembers
            .FirstOrDefaultAsync(hm => hm.HalghehId == halghehId && hm.UserId == userId);

        if (existing != null)
        {
            if (existing.Status == "active")
                throw new InvalidOperationException("You are already a member of this halgheh.");

            existing.Status = "active";
            existing.LeftAt = null;
            await _db.SaveChangesAsync();
            return await ToDtoAsync(h, userId);
        }

        var activeCount = await _db.HalghehMembers
            .CountAsync(hm => hm.HalghehId == halghehId && hm.Status == "active");
        if (h.MaxMembers.HasValue && activeCount >= h.MaxMembers.Value)
            throw new InvalidOperationException($"Halgheh capacity is full (max {h.MaxMembers.Value}).");

        var member = new HalghehMember
        {
            HalghehId = halghehId,
            UserId = userId,
            Role = "member",
            Status = "active"
        };
        _db.HalghehMembers.Add(member);
        await _db.SaveChangesAsync();

        return await ToDtoAsync(h, userId);
    }

    public async Task RemoveMemberAsync(int halghehId, int userId, int targetUserId)
    {
        var (isModerator, _) = await GetHalghehAccessAsync(halghehId, userId);
        var (isOwner, isManager, _, _) = await GetMaktabAccessAsyncForHalghehAsync(halghehId, userId);
        if (!isModerator && !isOwner && !isManager)
            throw new UnauthorizedAccessException("Only the moderator or maktab owner/manager can remove members.");

        if (targetUserId == userId)
            throw new InvalidOperationException("Use the leave option to remove yourself from the halgheh.");

        var target = await _db.HalghehMembers
            .FirstOrDefaultAsync(hm => hm.HalghehId == halghehId && hm.UserId == targetUserId && hm.Status == "active")
            ?? throw new KeyNotFoundException("Target member not found.");

        if (target.Role == "moderator")
            throw new InvalidOperationException("Cannot remove the moderator. Transfer moderator role first.");

        target.Status = "inactive";
        target.LeftAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
    }

    public async Task LeaveAsync(int halghehId, int userId)
    {
        var member = await _db.HalghehMembers
            .FirstOrDefaultAsync(hm => hm.HalghehId == halghehId && hm.UserId == userId && hm.Status == "active")
            ?? throw new KeyNotFoundException("You are not a member of this halgheh.");

        if (member.Role == "moderator")
            throw new InvalidOperationException("Moderator cannot leave. Transfer the moderator role first.");

        member.Status = "inactive";
        member.LeftAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
    }

    public async Task ChangeMemberRoleAsync(int halghehId, int userId, int targetUserId, string newRole)
    {
        if (newRole != "member")
            throw new ArgumentException("Only the 'member' role is configurable in halgheh. Use transfer moderator for moderator changes.");

        var (isModerator, _) = await GetHalghehAccessAsync(halghehId, userId);
        var (isOwner, isManager, _, _) = await GetMaktabAccessAsyncForHalghehAsync(halghehId, userId);
        if (!isModerator && !isOwner && !isManager)
            throw new UnauthorizedAccessException("Only the moderator or maktab owner/manager can change member roles.");

        if (targetUserId == userId)
            throw new InvalidOperationException("You cannot change your own role.");

        var target = await _db.HalghehMembers
            .FirstOrDefaultAsync(hm => hm.HalghehId == halghehId && hm.UserId == targetUserId && hm.Status == "active")
            ?? throw new KeyNotFoundException("Target member not found.");

        if (target.Role == "moderator")
            throw new InvalidOperationException("Moderator role can only be changed via transfer.");

        target.Role = newRole;
        await _db.SaveChangesAsync();
    }

    // ====================================================================
    // Management
    // ====================================================================

    public async Task TransferModeratorAsync(int halghehId, int userId, int newModeratorUserId)
    {
        var h = await _db.Halghehs
            .FirstOrDefaultAsync(h => h.Id == halghehId && !h.IsDeleted)
            ?? throw new KeyNotFoundException("Halgheh not found.");

        var (isModerator, _) = await GetHalghehAccessAsync(halghehId, userId);
        var (isOwner, _, _, _) = await GetMaktabAccessAsync(h.MaktabId, userId);
        if (!isModerator && !isOwner)
            throw new UnauthorizedAccessException("Only the current moderator or maktab owner can transfer the moderator role.");

        if (newModeratorUserId == userId)
            throw new InvalidOperationException("You are already the moderator. Select a different user.");

        var newModerator = await _db.HalghehMembers
            .FirstOrDefaultAsync(hm => hm.HalghehId == halghehId && hm.UserId == newModeratorUserId && hm.Status == "active")
            ?? throw new KeyNotFoundException("The target user is not an active member of this halgheh.");

        var oldModerator = await _db.HalghehMembers
            .FirstOrDefaultAsync(hm => hm.HalghehId == halghehId && hm.UserId == h.ModeratorUserId);
        if (oldModerator != null)
            oldModerator.Role = "member";

        newModerator.Role = "moderator";
        h.ModeratorUserId = newModeratorUserId;
        h.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
    }

    public async Task ChangeStatusAsync(int halghehId, int userId, string newStatus)
    {
        var validStatuses = new[] { "active", "inactive", "archived" };
        if (!validStatuses.Contains(newStatus))
            throw new ArgumentException("Status must be active, inactive, or archived.");

        var h = await _db.Halghehs
            .FirstOrDefaultAsync(h => h.Id == halghehId && !h.IsDeleted)
            ?? throw new KeyNotFoundException("Halgheh not found.");

        var (isModerator, _) = await GetHalghehAccessAsync(halghehId, userId);
        var (isOwner, _, _, _) = await GetMaktabAccessAsync(h.MaktabId, userId);
        if (!isModerator && !isOwner)
            throw new UnauthorizedAccessException("Only the moderator or maktab owner can change the status.");

        h.Status = newStatus;
        h.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
    }
}
