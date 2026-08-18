using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Domain.Entities;
using EducationalPlatform.Nehzat.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace EducationalPlatform.Nehzat.Infrastructure.Services;

public class ProfileService : IProfileService
{
    private readonly AppDbContext _db;

    public ProfileService(AppDbContext db) => _db = db;

    public async Task<ProfileDto> GetProfileAsync(int userId)
    {
        var user = await _db.Users.FindAsync(userId)
            ?? throw new InvalidOperationException("User not found");

        string? maktabName = null;
        var maktabMember = await _db.MaktabMembers
            .Include(mm => mm.Maktab)
            .FirstOrDefaultAsync(mm => mm.UserId == userId);
        if (maktabMember?.Maktab != null)
            maktabName = maktabMember.Maktab.Name;

        return new ProfileDto
        {
            Id = user.Id,
            FirstName = user.FirstName ?? string.Empty,
            LastName = user.LastName ?? string.Empty,
            Email = user.Email,
            PhoneNumber = user.PhoneNumber,
            NationalCode = user.NationalCode,
            ImageUrl = user.ImageUrl,
            Biography = user.Biography,
            UserType = user.UserType,
            MaktabName = maktabName,
            ApprovalStatus = user.ApprovalStatus,
            CreatedAt = user.CreatedAt,
            LastLoginAt = user.LastLoginAt
        };
    }

    public async Task<ProfileDto> UpdateProfileAsync(int userId, UpdateProfileRequest request)
    {
        var user = await _db.Users.FindAsync(userId)
            ?? throw new InvalidOperationException("User not found");

        if (request.FirstName != null) user.FirstName = request.FirstName;
        if (request.LastName != null) user.LastName = request.LastName;
        if (request.Email != null) user.Email = request.Email;
        if (request.Biography != null) user.Biography = request.Biography;
        if (request.ImageUrl != null) user.ImageUrl = request.ImageUrl;
        user.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        return await GetProfileAsync(userId);
    }

    public async Task<NotificationSettingsDto> GetNotificationSettingsAsync(int userId)
    {
        var settings = await _db.UserNotificationSettings
            .FirstOrDefaultAsync(x => x.UserId == userId);

        if (settings == null)
        {
            settings = new UserNotificationSettings
            {
                UserId = userId,
                NewAssignment = true,
                SubmissionReviewed = true,
                NewMember = true,
                SessionReminder = true,
                SystemAnnouncement = true,
                UpdatedAt = DateTime.UtcNow
            };
            _db.UserNotificationSettings.Add(settings);
            await _db.SaveChangesAsync();
        }

        return new NotificationSettingsDto
        {
            NewAssignment = settings.NewAssignment,
            SubmissionReviewed = settings.SubmissionReviewed,
            NewMember = settings.NewMember,
            SessionReminder = settings.SessionReminder,
            SystemAnnouncement = settings.SystemAnnouncement
        };
    }

    public async Task<NotificationSettingsDto> UpdateNotificationSettingsAsync(int userId, UpdateNotificationSettingsRequest request)
    {
        var settings = await _db.UserNotificationSettings
            .FirstOrDefaultAsync(x => x.UserId == userId);

        if (settings == null)
        {
            settings = new UserNotificationSettings { UserId = userId };
            _db.UserNotificationSettings.Add(settings);
        }

        settings.NewAssignment = request.NewAssignment;
        settings.SubmissionReviewed = request.SubmissionReviewed;
        settings.NewMember = request.NewMember;
        settings.SessionReminder = request.SessionReminder;
        settings.SystemAnnouncement = request.SystemAnnouncement;
        settings.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        return new NotificationSettingsDto
        {
            NewAssignment = settings.NewAssignment,
            SubmissionReviewed = settings.SubmissionReviewed,
            NewMember = settings.NewMember,
            SessionReminder = settings.SessionReminder,
            SystemAnnouncement = settings.SystemAnnouncement
        };
    }
}
