using EducationalPlatform.Nehzat.Application.DTOs;

namespace EducationalPlatform.Nehzat.Application.Interfaces;

public interface IProgressService
{
    Task<DashboardSummaryDto> GetDashboardAsync(int userId);
    Task<List<ProgressReportDto>> GetReportsByStudentAsync(int userId, int studentId, int limit = 12);
    Task<ProgressReportDto> GenerateReportAsync(int userId, GenerateReportRequest req);
    Task<List<ProgressLeaderboardEntryDto>> GetLeaderboardAsync(int userId, int limit = 10);
}
