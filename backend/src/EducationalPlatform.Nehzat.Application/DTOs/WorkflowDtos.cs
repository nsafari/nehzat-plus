using System.ComponentModel.DataAnnotations;

namespace EducationalPlatform.Nehzat.Application.DTOs;

public record WorkflowStepDto(
    int Id,
    int WorkflowId,
    int StepOrder,
    string Name,
    string RoleRequired,
    string ActionType,
    bool IsFinalStep
);

public record WorkflowDefinitionDto(
    int Id,
    string Name,
    string Code,
    string Description,
    bool IsActive,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    List<WorkflowStepDto> Steps
);

public record CreateWorkflowStepDto(
    [Required(ErrorMessage = "ترتیب گام الزامی است")]
    int StepOrder,

    [Required(ErrorMessage = "نام گام الزامی است")]
    string Name,

    string RoleRequired,

    string ActionType,

    bool IsFinalStep
);

public record CreateWorkflowDefinitionDto(
    [Required(ErrorMessage = "نام جریان کاری الزامی است")]
    string Name,

    [Required(ErrorMessage = "کد جریان کاری الزامی است")]
    string Code,

    string Description,

    bool IsActive,

    List<CreateWorkflowStepDto> Steps
);

public record WorkflowActionDto(
    int Id,
    int RequestId,
    int StepId,
    int ActorId,
    string ActorName,
    string Action,
    string Comment,
    DateTime CreatedAt
);

public record WorkflowRequestDto(
    int Id,
    int WorkflowId,
    string WorkflowName,
    string Title,
    string Description,
    string Status,
    int? CurrentStepId,
    string CurrentStepName,
    int CreatedBy,
    string CreatedByName,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    List<WorkflowActionDto> Actions
);

public record CreateWorkflowRequestDto(
    [Required(ErrorMessage = "عنوان درخواست الزامی است")]
    string Title,

    string Description
);

public record PerformWorkflowActionDto(
    [Required(ErrorMessage = "نوع اقدام الزامی است")]
    string Action,

    string Comment
);
