namespace EducationalPlatform.Nehzat.Application.DTOs;

public record LoginRequestDto(string Username, string Password);
public record LoginResponseDto(string Token, string Username, string Role, int? StudentId, int? BranchId, string? ImageUrl);
public record RegisterRequestDto(string Username, string Password, string FirstName, string LastName, string Email);

public record QrCodeResponseDto(string SessionId, string QrData, DateTime ExpiresAt);
public record QrPollResponseDto(string Status, string? Token, string? Username, string? Role, int? StudentId, int? BranchId);
public record QrScanConfirmDto(string Status, string Message);
