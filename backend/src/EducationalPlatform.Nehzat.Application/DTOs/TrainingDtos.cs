using EducationalPlatform.Nehzat.Domain.Entities;

namespace EducationalPlatform.Nehzat.Application.DTOs;

public record CreateTrainingCourseDto(
    string Title,
    string? Description,
    string AcademicYear,
    int? MaxEnrollment,
    DateTime? StartDate,
    DateTime? EndDate
);

public record UpdateTrainingCourseDto(
    string? Title,
    string? Description,
    string? Status,
    int? MaxEnrollment,
    DateTime? StartDate,
    DateTime? EndDate
);

public record TrainingCourseResponseDto(
    int Id,
    string Title,
    string? Slug,
    string? Description,
    string AcademicYear,
    string Status,
    int? MaxEnrollment,
    DateTime? StartDate,
    DateTime? EndDate,
    DateTime CreatedAt,
    int StagesCount,
    int EnrollmentsCount
);

public record CreateTrainingStageDto(
    string Title,
    string? Description,
    int StageOrder,
    bool Required = true,
    int? PrerequisiteStageId = null
);

public record TrainingStageResponseDto(
    int Id,
    int CourseId,
    string Title,
    string? Slug,
    int StageOrder,
    bool Required,
    string? Description,
    int SessionsCount,
    int? PrerequisiteStageId
);

public record CreateTrainingSessionDto(
    string Title,
    int SessionNumber,
    int DurationMinutes = 45,
    string SessionType = "theory",
    string? Description = null
);

public record TrainingSessionResponseDto(
    int Id,
    int StageId,
    string Title,
    int SessionNumber,
    int DurationMinutes,
    string SessionType,
    string? Description,
    int ContentsCount,
    int AssignmentsCount
);

public record CreateTrainingContentDto(
    string ContentType,
    string? SourceFile,
    string? RawText,
    string? StructuredData
);

public record TrainingContentResponseDto(
    int Id,
    int SessionId,
    string ContentType,
    string? SourceFile,
    string? RawText,
    string? StructuredData,
    DateTime ImportedAt
);

public record CreateTrainingEnrollmentDto(
    int UserId,
    int CourseId
);

public record TrainingEnrollmentResponseDto(
    int Id,
    int UserId,
    int CourseId,
    DateTime EnrolledAt,
    string Status,
    string? UserName,
    string? CourseTitle
);

public record UpdateTrainingProgressDto(
    string Status,
    decimal? Score = null,
    string? Notes = null
);

public record TrainingProgressResponseDto(
    int Id,
    int EnrollmentId,
    int SessionId,
    string Status,
    decimal? Score,
    DateTime? CompletedAt,
    string? Notes,
    string? SessionTitle
);

public record CreateTrainingAssignmentDto(
    string Title,
    string? Description,
    DateTime? Deadline,
    string SubmissionType = "text"
);

public record TrainingAssignmentResponseDto(
    int Id,
    int SessionId,
    string Title,
    string? Description,
    DateTime? Deadline,
    string SubmissionType,
    int SubmissionsCount
);

public record CreateTrainingSubmissionDto(
    string? Content,
    string? FileUrl
);

public record TrainingSubmissionResponseDto(
    int Id,
    int AssignmentId,
    int UserId,
    string? Content,
    string? FileUrl,
    DateTime SubmittedAt,
    decimal? Grade,
    string? Feedback,
    string? UserName
);

public record TrainingSearchResultDto(
    List<TrainingCourseResponseDto> Courses,
    int TotalCount,
    int Page,
    int PageSize
);

public record TrainingStatisticsDto(
    int TotalCourses,
    int ActiveCourses,
    int TotalEnrollments,
    int TotalSessions,
    int TotalContent,
    List<CourseStatItemDto> CourseStats
);

public record CourseStatItemDto(
    int CourseId,
    string CourseTitle,
    int EnrollmentCount,
    int CompletionRate
);
