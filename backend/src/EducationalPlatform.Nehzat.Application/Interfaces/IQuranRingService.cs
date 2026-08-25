using EducationalPlatform.Nehzat.Application.DTOs;

namespace EducationalPlatform.Nehzat.Application.Interfaces;

public interface IQuranRingService
{
    // Rings
    Task<List<QuranRingDto>> GetAllRingsAsync(QuranRingFilterDto? filter = null);
    Task<QuranRingDto?> GetRingByIdAsync(int id);
    Task<QuranRingDto?> GetRingByCodeAsync(string code);
    Task<QuranRingDto> CreateRingAsync(CreateQuranRingRequest request);
    Task<QuranRingDto> UpdateRingAsync(int id, UpdateQuranRingRequest request);
    Task<bool> DeleteRingAsync(int id);

    // Sessions
    Task<List<QuranRingSessionDto>> GetSessionsAsync(SessionFilterDto? filter = null);
    Task<QuranRingSessionDto?> GetSessionByIdAsync(int id);
    Task<QuranRingSessionDto> CreateSessionAsync(CreateQuranRingSessionRequest request);
    Task<QuranRingSessionDto> UpdateSessionAsync(int id, UpdateQuranRingSessionRequest request);
    Task<bool> DeleteSessionAsync(int id);
    Task<List<QuranRingSessionDto>> GetSessionsByRingAsync(int ringId);

    // Session Steps
    Task<QuranSessionStepDto> CreateStepAsync(CreateQuranSessionStepRequest request);
    Task<QuranSessionStepDto> UpdateStepAsync(int id, CreateQuranSessionStepRequest request);
    Task<bool> DeleteStepAsync(int id);

    // Student Progress
    Task<List<StudentQuranSessionProgressDto>> GetStudentProgressAsync(StudentProgressFilterDto? filter = null);
    Task<StudentQuranSessionProgressDto?> GetStudentProgressByIdAsync(int id);
    Task<StudentQuranSessionProgressDto> StartSessionAsync(int studentId, int sessionId);
    Task<StudentQuranSessionProgressDto> UpdateSessionProgressAsync(int id, UpdateSessionProgressRequest request);
    Task<StudentStepProgressDto> UpdateStepProgressAsync(int id, UpdateStepProgressRequest request);
    Task<StudentQuranSessionProgressDto> CompleteSessionAsync(int id, int? assessmentScore = null);

    // Speed Categories
    Task<StudentSpeedCategoryDto?> GetStudentSpeedCategoryAsync(int studentId, int ringId);
    Task<StudentSpeedCategoryDto> UpdateSpeedCategoryAsync(int studentId, int ringId, UpdateSpeedCategoryRequest request);
    Task<StudentSpeedCategoryDto> CalculateSpeedCategoryAsync(int studentId, int ringId);
    Task<List<StudentSpeedCategoryDto>> GetStudentsBySpeedCategoryAsync(string category, int? ringId = null);

    // Tadabbor
    Task<List<TadabborEntryDto>> GetTadabborEntriesAsync(TadabborFilterDto? filter = null);
    Task<TadabborEntryDto?> GetTadabborEntryByIdAsync(int id);
    Task<TadabborEntryDto> CreateTadabborEntryAsync(CreateTadabborEntryRequest request);
    Task<TadabborEntryDto> UpdateTadabborEntryAsync(int id, UpdateTadabborEntryRequest request);
    Task<bool> DeleteTadabborEntryAsync(int id);

    // Asset Evaluation
    Task<List<QuranAssetEvaluationDto>> GetAssetEvaluationsAsync(EvaluationFilterDto? filter = null);
    Task<QuranAssetEvaluationDto?> GetAssetEvaluationByIdAsync(int id);
    Task<QuranAssetEvaluationDto> CreateAssetEvaluationAsync(CreateAssetEvaluationRequest request);
    Task<QuranAssetEvaluationDto?> GetLatestEvaluationAsync(int studentId, int ringId);

    // Coach Interview
    Task<List<CoachInterviewDto>> GetCoachInterviewsAsync(InterviewFilterDto? filter = null);
    Task<CoachInterviewDto?> GetCoachInterviewByIdAsync(int id);
    Task<CoachInterviewDto> CreateCoachInterviewAsync(CreateCoachInterviewRequest request);

    // Student Interview
    Task<List<StudentInterviewDto>> GetStudentInterviewsAsync(InterviewFilterDto? filter = null);
    Task<StudentInterviewDto?> GetStudentInterviewByIdAsync(int id);
    Task<StudentInterviewDto> CreateStudentInterviewAsync(CreateStudentInterviewRequest request);

    // Ring Surahs
    Task<List<QuranRingSurahDto>> GetRingSurahsAsync(int ringId);
    Task<QuranRingSurahDto> CreateRingSurahAsync(CreateQuranRingSurahRequest request);
    Task<bool> DeleteRingSurahAsync(int id);

    // Ring Resources
    Task<List<QuranRingResourceDto>> GetRingResourcesAsync(int ringId);
    Task<QuranRingResourceDto> CreateRingResourceAsync(CreateQuranRingResourceRequest request);
    Task<bool> DeleteRingResourceAsync(int id);

    // Dashboard
    Task<QuranRingDashboardDto> GetDashboardAsync(int? ringId = null);
}
