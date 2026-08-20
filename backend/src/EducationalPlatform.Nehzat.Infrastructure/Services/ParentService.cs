using Microsoft.EntityFrameworkCore;
using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Domain.Entities;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Infrastructure.Data;

namespace EducationalPlatform.Nehzat.Infrastructure.Services;

public class ParentService : IParentService
{
    private readonly AppDbContext _db;
    private readonly IMaktabLookupService _maktabLookup;

    public ParentService(AppDbContext db, IMaktabLookupService maktabLookup)
    {
        _db = db;
        _maktabLookup = maktabLookup;
    }

    public async Task<List<Parent>> GetAllAsync()
    {
        return await _db.Parents
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();
    }

    public async Task<Parent?> FindByIdAsync(int id)
    {
        return await _db.Parents.FindAsync(id);
    }

    public async Task<Parent> CreateAsync(CreateParentRequest request)
    {
        var entity = new Parent
        {
            Username = request.Username.Trim(),
            FirstName = request.FirstName.Trim(),
            LastName = request.LastName.Trim(),
            Email = request.Email.Trim(),
            PhoneNumber = request.PhoneNumber?.Trim(),
            Address = request.Address?.Trim(),
            NationalCode = request.NationalCode?.Trim(),
            BranchId = request.BranchId,
            Status = "active",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _db.Parents.Add(entity);
        await _db.SaveChangesAsync();

        return (await FindByIdAsync(entity.Id))!;
    }

    public async Task<Parent> UpdateAsync(int id, UpdateParentRequest request)
    {
        var existing = await _db.Parents.FindAsync(id)
            ?? throw new KeyNotFoundException("والد پیدا نشد.");

        if (request.FirstName != null) existing.FirstName = request.FirstName.Trim();
        if (request.LastName != null) existing.LastName = request.LastName.Trim();
        if (request.Email != null) existing.Email = request.Email.Trim();
        if (request.PhoneNumber != null) existing.PhoneNumber = request.PhoneNumber.Trim();
        if (request.Address != null) existing.Address = request.Address.Trim();
        if (request.NationalCode != null) existing.NationalCode = request.NationalCode.Trim();
        if (request.BranchId != null) existing.BranchId = request.BranchId;
        if (request.Status != null) existing.Status = request.Status;

        existing.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        return (await FindByIdAsync(id))!;
    }

    public async Task DeleteAsync(int id)
    {
        var entity = await _db.Parents.FindAsync(id)
            ?? throw new KeyNotFoundException("والد پیدا نشد.");

        _db.Parents.Remove(entity);
        await _db.SaveChangesAsync();
    }

    public async Task<List<Student>> GetStudentsAsync(int parentId)
    {
        return await _db.ParentStudents
            .Where(ps => ps.ParentId == parentId)
            .Include(ps => ps.Student)
            .Select(ps => ps.Student!)
            .ToListAsync();
    }

    public async Task<List<ParentStudentInfo>> GetStudentsInfoAsync(int parentId)
    {
        var students = await _db.ParentStudents
            .Where(ps => ps.ParentId == parentId)
            .Include(ps => ps.Student)
            .Select(ps => ps.Student!)
            .ToListAsync();

        var result = new List<ParentStudentInfo>();

        foreach (var student in students)
        {
            var info = new ParentStudentInfo
            {
                StudentId = student.Id,
                StudentName = $"{student.FirstName} {student.LastName}",
                StudentCode = student.StudentId,
                Age = 0,
                Phase = "A"
            };

            if (student.DateOfBirth.HasValue && !string.IsNullOrEmpty(student.Gender))
            {
                var lookup = await _maktabLookup.DetermineMaktabAsync(student.DateOfBirth.Value, student.Gender);
                info.Age = lookup.Age;
                info.Phase = lookup.Phase;
            }

            var user = await _db.Users.FirstOrDefaultAsync(u => u.StudentId == student.Id);
            if (user != null)
            {
                var enrollment = await _db.UserEnrollments
                    .Where(e => e.UserId == user.Id && e.Status == "active")
                    .Include(e => e.LearningPath)
                    .Include(e => e.LessonProgress)
                    .FirstOrDefaultAsync();

                if (enrollment != null)
                {
                    info.ActivePathId = enrollment.LearningPathId;
                    info.ActivePathTitle = enrollment.LearningPath?.Title;

                    var totalLessons = await _db.StudyLessons
                        .Where(l => l.StudyModule!.LearningLevel!.LearningPathId == enrollment.LearningPathId)
                        .CountAsync();

                    var completedLessons = enrollment.LessonProgress
                        .Count(lp => lp.Status == "completed");

                    var totalLevels = await _db.LearningLevels
                        .Where(l => l.LearningPathId == enrollment.LearningPathId)
                        .CountAsync();

                    var completedLevels = await _db.LearningLevels
                        .Where(l => l.LearningPathId == enrollment.LearningPathId)
                        .Where(l => l.Modules.Any(m => m.Lessons.All(les =>
                            enrollment.LessonProgress.Any(lp => lp.StudyLessonId == les.Id && lp.Status == "completed"))))
                        .CountAsync();

                    info.TotalLessons = totalLessons;
                    info.CompletedLessons = completedLessons;
                    info.TotalLevels = totalLevels;
                    info.CompletedLevels = completedLevels;
                    info.LastActivityDate = enrollment.LessonProgress
                        .Where(lp => lp.CompletedAt.HasValue)
                        .Max(lp => (DateTime?)lp.CompletedAt);
                }
            }

            result.Add(info);
        }

        return result;
    }
}
