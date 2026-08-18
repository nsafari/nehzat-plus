namespace EducationalPlatform.Nehzat.Application.DTOs;

public class ProfileDto
{
    public int Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string FullName => $"{FirstName} {LastName}".Trim();
    public string? Email { get; set; }
    public string? PhoneNumber { get; set; }
    public string? NationalCode { get; set; }
    public string? ImageUrl { get; set; }
    public string? Biography { get; set; }
    public string UserType { get; set; } = string.Empty;
    public string? MaktabName { get; set; }
    public string ApprovalStatus { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime? LastLoginAt { get; set; }
}

public class UpdateProfileRequest
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Email { get; set; }
    public string? Biography { get; set; }
    public string? ImageUrl { get; set; }
}

public class NotificationSettingsDto
{
    public bool NewAssignment { get; set; } = true;
    public bool SubmissionReviewed { get; set; } = true;
    public bool NewMember { get; set; } = true;
    public bool SessionReminder { get; set; } = true;
    public bool SystemAnnouncement { get; set; } = true;
}

public class UpdateNotificationSettingsRequest
{
    public bool NewAssignment { get; set; } = true;
    public bool SubmissionReviewed { get; set; } = true;
    public bool NewMember { get; set; } = true;
    public bool SessionReminder { get; set; } = true;
    public bool SystemAnnouncement { get; set; } = true;
}
