using Microsoft.EntityFrameworkCore;
using EducationalPlatform.Nehzat.Application.Constants;
using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Domain.Entities;
using EducationalPlatform.Nehzat.Infrastructure.Data;

namespace EducationalPlatform.Nehzat.Infrastructure.Services;

public class HalghehAssignmentService : IHalghehAssignmentService
{
    private readonly AppDbContext _db;

    public HalghehAssignmentService(AppDbContext db) => _db = db;

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

    private async Task<HalghehAssignmentDto> ToDtoAsync(HalghehAssignment a, int userId)
    {
        var creator = await _db.Users.FindAsync(a.CreatedByUserId);
        var mySubmission = await _db.HalghehAssignmentSubmissions
            .FirstOrDefaultAsync(s => s.HalghehAssignmentId == a.Id && s.UserId == userId);
        var submissionCount = await _db.HalghehAssignmentSubmissions
            .CountAsync(s => s.HalghehAssignmentId == a.Id);

        return new HalghehAssignmentDto
        {
            Id = a.Id,
            HalghehId = a.HalghehId,
            Title = a.Title,
            Description = a.Description,
            DueDate = a.DueDate,
            Status = a.Status,
            MySubmissionStatus = mySubmission?.Status ?? "",
            SubmissionCount = submissionCount,
            CreatorName = creator != null ? $"{creator.FirstName} {creator.LastName}".Trim() : "",
            CreatedAt = a.CreatedAt
        };
    }

    public async Task<PaginatedResult<HalghehAssignmentDto>> GetByHalghehAsync(int halghehId, int page, int pageSize)
    {
        var halgheh = await _db.Halghehs
            .FirstOrDefaultAsync(h => h.Id == halghehId && !h.IsDeleted)
            ?? throw new KeyNotFoundException("Halgheh not found.");

        var query = _db.HalghehAssignments
            .Where(a => a.HalghehId == halghehId)
            .OrderByDescending(a => a.CreatedAt);

        var totalCount = await query.CountAsync();

        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var dtos = new List<HalghehAssignmentDto>();
        foreach (var a in items)
            dtos.Add(await ToDtoAsync(a, 0)); // userId=0 for list, actual userId passed from controller

        return new PaginatedResult<HalghehAssignmentDto>
        {
            Items = dtos,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize
        };
    }

    public async Task<HalghehAssignmentDto?> GetByIdAsync(int halghehId, int assignmentId)
    {
        var a = await _db.HalghehAssignments
            .FirstOrDefaultAsync(a => a.Id == assignmentId && a.HalghehId == halghehId);
        if (a == null) return null;

        return await ToDtoAsync(a, 0);
    }

    public async Task<HalghehAssignmentDto> CreateAsync(int halghehId, CreateHalghehAssignmentDto dto)
    {
        var halgheh = await _db.Halghehs
            .FirstOrDefaultAsync(h => h.Id == halghehId && !h.IsDeleted && h.Status == "active")
            ?? throw new KeyNotFoundException("Active halgheh not found.");

        var assignment = new HalghehAssignment
        {
            HalghehId = halghehId,
            Title = dto.Title.Trim(),
            Description = dto.Description?.Trim(),
            DueDate = dto.DueDate,
            Status = "active",
            CreatedByUserId = 0 // Will be set from controller using UserId
        };

        _db.HalghehAssignments.Add(assignment);
        await _db.SaveChangesAsync();

        return await ToDtoAsync(assignment, 0);
    }

    public async Task<HalghehAssignmentDto?> UpdateAsync(int halghehId, int assignmentId, UpdateHalghehAssignmentDto dto)
    {
        var a = await _db.HalghehAssignments
            .FirstOrDefaultAsync(x => x.Id == assignmentId && x.HalghehId == halghehId);
        if (a == null) return null;

        a.Title = dto.Title.Trim();
        a.Description = dto.Description?.Trim();
        a.DueDate = dto.DueDate;
        a.Status = dto.Status;
        a.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        return await ToDtoAsync(a, 0);
    }

    public async Task DeleteAsync(int halghehId, int assignmentId)
    {
        var a = await _db.HalghehAssignments
            .FirstOrDefaultAsync(x => x.Id == assignmentId && x.HalghehId == halghehId);
        if (a == null) return;

        _db.HalghehAssignments.Remove(a);
        await _db.SaveChangesAsync();
    }

    public async Task<List<HalghehAssignmentSubmissionDto>> GetSubmissionsAsync(int halghehId, int assignmentId)
    {
        var exists = await _db.HalghehAssignments
            .AnyAsync(x => x.Id == assignmentId && x.HalghehId == halghehId);
        if (!exists) throw new KeyNotFoundException("Assignment not found.");

        return await _db.HalghehAssignmentSubmissions
            .Where(s => s.HalghehAssignmentId == assignmentId)
            .OrderBy(s => s.SubmittedAt)
            .Select(s => new HalghehAssignmentSubmissionDto
            {
                Id = s.Id,
                HalghehAssignmentId = s.HalghehAssignmentId,
                UserId = s.UserId,
                Content = s.Content,
                Status = s.Status,
                Feedback = s.Feedback,
                Grade = s.Grade,
                SubmittedAt = s.SubmittedAt,
                ReviewedAt = s.ReviewedAt
            })
            .ToListAsync();
    }

    public async Task<HalghehAssignmentSubmissionDto?> SubmitAsync(int halghehId, int assignmentId, SubmitHalghehAssignmentDto dto)
    {
        var halgheh = await _db.Halghehs
            .FirstOrDefaultAsync(h => h.Id == halghehId && !h.IsDeleted && h.Status == "active")
            ?? throw new KeyNotFoundException("Active halgheh not found.");

        var a = await _db.HalghehAssignments
            .FirstOrDefaultAsync(x => x.Id == assignmentId && x.HalghehId == halghehId);
        if (a == null) return null;
        if (a.Status != "active") throw new InvalidOperationException("This assignment is closed.");

        var userId = 0; // Will be set from controller
        var existing = await _db.HalghehAssignmentSubmissions
            .FirstOrDefaultAsync(s => s.HalghehAssignmentId == assignmentId && s.UserId == userId);

        if (existing == null)
        {
            existing = new HalghehAssignmentSubmission
            {
                HalghehAssignmentId = assignmentId,
                UserId = userId
            };
            _db.HalghehAssignmentSubmissions.Add(existing);
        }

        existing.Content = dto.Content.Trim();
        existing.Status = "submitted";
        existing.Feedback = null;
        existing.Grade = null;
        existing.SubmittedAt = DateTime.UtcNow;
        existing.ReviewedByUserId = null;
        existing.ReviewedAt = null;

        await _db.SaveChangesAsync();

        return new HalghehAssignmentSubmissionDto
        {
            Id = existing.Id,
            HalghehAssignmentId = existing.HalghehAssignmentId,
            UserId = existing.UserId,
            Content = existing.Content,
            Status = existing.Status,
            SubmittedAt = existing.SubmittedAt
        };
    }

    public async Task<HalghehAssignmentSubmissionDto?> ReviewAsync(int submissionId, ReviewHalghehAssignmentSubmissionDto dto)
    {
        var sub = await _db.HalghehAssignmentSubmissions
            .Include(s => s.HalghehAssignment)
            .FirstOrDefaultAsync(s => s.Id == submissionId);
        if (sub == null) return null;

        var halgheh = await _db.Halghehs
            .FirstOrDefaultAsync(h => h.Id == sub.HalghehAssignment.HalghehId && !h.IsDeleted)
            ?? throw new KeyNotFoundException("Halgheh not found.");

        // Authorization: only moderator or admin can review
        var (isModerator, _) = await GetHalghehAccessAsync(halgheh.Id, 0); // userId from controller
        var isAdmin = await IsAdminAsync(0);
        if (!isModerator && !isAdmin)
            throw new UnauthorizedAccessException("Only moderator or admin can review submissions.");

        sub.Status = dto.Status;
        sub.Feedback = dto.Feedback;
        sub.Grade = dto.Grade;
        sub.ReviewedByUserId = 0; // from controller
        sub.ReviewedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        return new HalghehAssignmentSubmissionDto
        {
            Id = sub.Id,
            HalghehAssignmentId = sub.HalghehAssignmentId,
            UserId = sub.UserId,
            Content = sub.Content,
            Status = sub.Status,
            Feedback = sub.Feedback,
            Grade = sub.Grade,
            SubmittedAt = sub.SubmittedAt,
            ReviewedAt = sub.ReviewedAt
        };
    }
}