using System.ComponentModel.DataAnnotations;
using EducationalPlatform.Nehzat.Domain.Constants;

namespace EducationalPlatform.Nehzat.Application.DTOs;

public record SubjectAreaDto(
    int Id,
    string Key,
    string Name,
    string? Description,
    int SortOrder
);

public record AccommodationDto(
    int Id,
    string Code,
    string Name,
    string? Description,
    string? Icon
);

public record CreateAccommodationRequest(
    [Required][StringLength(50)] string Code,
    [Required][StringLength(100)] string Name,
    string? Description = null,
    [StringLength(50)] string? Icon = null
);

public record StudyPathStepDto(
    int Id,
    int StudyPathId,
    int StepOrder,
    string Title,
    string? Description,
    string CognitiveLevel,
    int EstimatedDurationMinutes,
    string? PrerequisitesJson,
    string? ContentUrl,
    int? ResourceId,
    int? AssessmentId,
    string? AssessmentTitle,
    DateTime CreatedAt,
    DateTime UpdatedAt
);

public record StudyPathDto(
    int Id,
    string Key,
    string Title,
    string? Description,
    int AgeGroupId,
    string AgeGroupName,
    int SubjectAreaId,
    string SubjectAreaName,
    string CognitiveLevel,
    bool IsActive,
    int SortOrder,
    List<AccommodationDto> Accommodations,
    List<StudyPathStepDto> Steps,
    DateTime CreatedAt,
    DateTime UpdatedAt
);

public record StudentStudyPathDto(
    int Id,
    int StudentId,
    int StudyPathId,
    string StudyPathTitle,
    DateTime EnrollmentDate,
    int? CurrentStepId,
    StudyPathStepDto? CurrentStep,
    string Status,
    int ProgressPercentage,
    DateTime? StartedAt,
    DateTime? CompletedAt,
    List<StudyPathStepDto> Steps,
    int CompletedStepsCount
);

public record CreateStudyPathStepRequest(
    int StepOrder,
    [Required][StringLength(200)] string Title,
    string? Description = null,
    [StringLength(20)] string CognitiveLevel = CognitiveLevels.Awareness,
    int EstimatedDurationMinutes = 15,
    string? PrerequisitesJson = null,
    [StringLength(500)] string? ContentUrl = null,
    int? ResourceId = null,
    int? AssessmentId = null
);

public record UpdateStudyPathStepRequest(
    int? StepOrder = null,
    string? Title = null,
    string? Description = null,
    [StringLength(20)] string? CognitiveLevel = null,
    int? EstimatedDurationMinutes = null,
    string? PrerequisitesJson = null,
    string? ContentUrl = null,
    int? ResourceId = null,
    int? AssessmentId = null
);

public record CreateStudyPathRequest(
    [Required][StringLength(100)] string Key,
    [Required][StringLength(200)] string Title,
    [Required] int AgeGroupId,
    [Required] int SubjectAreaId,
    string? Description = null,
    [StringLength(20)] string CognitiveLevel = CognitiveLevels.Awareness,
    bool IsActive = true,
    int SortOrder = 0,
    List<CreateStudyPathStepRequest>? Steps = null,
    List<int>? AccommodationIds = null
);

public record UpdateStudyPathRequest(
    string? Key = null,
    string? Title = null,
    string? Description = null,
    int? AgeGroupId = null,
    int? SubjectAreaId = null,
    [StringLength(20)] string? CognitiveLevel = null,
    bool? IsActive = null,
    int? SortOrder = null,
    List<int>? AccommodationIds = null
);

public record ReorderStepsRequest(
    List<int> StepIds
);

public record EnrollRequest();

public record CompleteStepRequest(
    int StudyPathId,
    int StepId
);

public record SkipStepRequest(
    int StudyPathId,
    int StepId
);