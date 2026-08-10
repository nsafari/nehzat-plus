using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Domain.Entities;

namespace EducationalPlatform.Nehzat.Application.Interfaces;

public interface ITrainingService
{
    Task<TrainingCourseResponseDto> CreateCourseAsync(CreateTrainingCourseDto dto);
    Task<List<TrainingCourseResponseDto>> GetAllCoursesAsync();
    Task<TrainingCourseResponseDto?> GetCourseByIdAsync(int id);
    Task<TrainingCourseResponseDto> UpdateCourseAsync(int id, UpdateTrainingCourseDto dto);
    Task DeleteCourseAsync(int id);
    Task<TrainingSearchResultDto> SearchCoursesAsync(string query, int page = 1, int pageSize = 10);
    Task<List<TrainingCourseResponseDto>> FilterCoursesByStatusAsync(string status);
    Task<List<TrainingCourseResponseDto>> FilterCoursesByYearAsync(string academicYear);

    Task<TrainingStageResponseDto> CreateStageAsync(int courseId, CreateTrainingStageDto dto);
    Task<List<TrainingStageResponseDto>> GetStagesByCourseIdAsync(int courseId);
    Task<TrainingStageResponseDto?> GetStageByIdAsync(int id);
    Task<TrainingStageResponseDto> UpdateStageAsync(int id, CreateTrainingStageDto dto);
    Task DeleteStageAsync(int id);

    Task<TrainingSessionResponseDto> CreateSessionAsync(int stageId, CreateTrainingSessionDto dto);
    Task<List<TrainingSessionResponseDto>> GetSessionsByStageIdAsync(int stageId);
    Task<TrainingSessionResponseDto?> GetSessionByIdAsync(int id);
    Task<TrainingSessionResponseDto> UpdateSessionAsync(int id, CreateTrainingSessionDto dto);
    Task DeleteSessionAsync(int id);

    Task<TrainingContentResponseDto> CreateContentAsync(int sessionId, CreateTrainingContentDto dto);
    Task<List<TrainingContentResponseDto>> GetContentsBySessionIdAsync(int sessionId);
    Task<TrainingContentResponseDto?> GetContentByIdAsync(int id);
    Task<TrainingContentResponseDto> UpdateContentAsync(int id, CreateTrainingContentDto dto);
    Task DeleteContentAsync(int id);
    Task<TrainingContentResponseDto> ProcessUploadedFileAsync(int sessionId, Stream fileStream, string fileName);

    Task<TrainingEnrollmentResponseDto> CreateEnrollmentAsync(CreateTrainingEnrollmentDto dto);
    Task<List<TrainingEnrollmentResponseDto>> GetEnrollmentsByCourseIdAsync(int courseId);
    Task<List<TrainingEnrollmentResponseDto>> GetEnrollmentsByUserIdAsync(int userId);
    Task<TrainingEnrollmentResponseDto?> GetEnrollmentByIdAsync(int id);
    Task<TrainingEnrollmentResponseDto> UpdateEnrollmentStatusAsync(int id, string status);
    Task DeleteEnrollmentAsync(int id);

    Task<TrainingProgressResponseDto> UpdateProgressAsync(int enrollmentId, int sessionId, UpdateTrainingProgressDto dto);
    Task<List<TrainingProgressResponseDto>> GetProgressByEnrollmentIdAsync(int enrollmentId);
    Task<TrainingProgressResponseDto?> GetProgressByEnrollmentAndSessionAsync(int enrollmentId, int sessionId);
    Task<List<TrainingProgressResponseDto>> GetProgressBySessionIdAsync(int sessionId);

    Task<TrainingAssignmentResponseDto> CreateAssignmentAsync(int sessionId, CreateTrainingAssignmentDto dto);
    Task<List<TrainingAssignmentResponseDto>> GetAssignmentsBySessionIdAsync(int sessionId);
    Task<TrainingAssignmentResponseDto?> GetAssignmentByIdAsync(int id);
    Task<TrainingAssignmentResponseDto> UpdateAssignmentAsync(int id, CreateTrainingAssignmentDto dto);
    Task DeleteAssignmentAsync(int id);

    Task<TrainingSubmissionResponseDto> CreateSubmissionAsync(int assignmentId, int userId, CreateTrainingSubmissionDto dto);
    Task<List<TrainingSubmissionResponseDto>> GetSubmissionsByAssignmentIdAsync(int assignmentId);
    Task<TrainingSubmissionResponseDto?> GetSubmissionByIdAsync(int id);
    Task<TrainingSubmissionResponseDto> GradeSubmissionAsync(int id, decimal grade, string? feedback);

    Task<TrainingStatisticsDto> GetStatisticsAsync();
    Task<CourseStatItemDto> GetCourseStatisticsAsync(int courseId);
}
