using EducationalPlatform.Nehzat.Application.DTOs;

namespace EducationalPlatform.Nehzat.Application.Interfaces;

public interface IAuthService
{
    Task<LoginResponseDto?> LoginAsync(LoginRequestDto request);
    Task<LoginResponseDto?> RegisterAsync(RegisterRequestDto request);
    Task<QrCodeResponseDto?> GenerateQrCodeAsync(string deviceInfo);
    Task<QrPollResponseDto?> PollQrStatusAsync(string sessionId);
    Task<QrScanConfirmDto?> ScanAndConfirmQrAsync(string sessionId, string username);
}
