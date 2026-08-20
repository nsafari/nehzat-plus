using System.ComponentModel.DataAnnotations;

namespace EducationalPlatform.Nehzat.Application.DTOs;

public record EducationalProcessDto(
    int Id,
    int WorkflowId,
    string WorkflowName,
    string EntityType,
    string Name,
    string Description,
    bool IsActive,
    bool AutoTrigger,
    DateTime CreatedAt,
    DateTime UpdatedAt
);

public record CreateEducationalProcessDto(
    [Required(ErrorMessage = "شناسه workflow الزامی است")]
    int WorkflowId,

    [Required(ErrorMessage = "نوع رویداد آموزشی الزامی است")]
    string EntityType,

    [Required(ErrorMessage = "نام فرآیند الزامی است")]
    string Name,

    string Description,

    bool IsActive,

    bool AutoTrigger
);

public record UpdateEducationalProcessDto(
    int? WorkflowId,
    string? EntityType,
    string? Name,
    string? Description,
    bool? IsActive,
    bool? AutoTrigger
);

public record ProcessTriggerResultDto(
    bool Success,
    int? RequestId,
    string Message
);
