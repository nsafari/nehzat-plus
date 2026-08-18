using EducationalPlatform.Nehzat.Application.DTOs;

namespace EducationalPlatform.Nehzat.Application.Interfaces;

public interface IProfileService
{
    Task<ProfileDto> GetProfileAsync(int userId);
    Task<ProfileDto> UpdateProfileAsync(int userId, UpdateProfileRequest request);
    Task<NotificationSettingsDto> GetNotificationSettingsAsync(int userId);
    Task<NotificationSettingsDto> UpdateNotificationSettingsAsync(int userId, UpdateNotificationSettingsRequest request);
}
