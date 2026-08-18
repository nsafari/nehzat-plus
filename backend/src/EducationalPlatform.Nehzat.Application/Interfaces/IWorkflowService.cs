using EducationalPlatform.Nehzat.Application.DTOs;

namespace EducationalPlatform.Nehzat.Application.Interfaces;

public interface IWorkflowService
{
    Task<List<WorkflowDefinitionDto>> GetDefinitionsAsync();
    Task<WorkflowDefinitionDto?> GetDefinitionByIdAsync(int id);
    Task<WorkflowDefinitionDto> CreateDefinitionAsync(CreateWorkflowDefinitionDto dto);
    Task DeleteDefinitionAsync(int id);
    Task<List<WorkflowRequestDto>> GetRequestsAsync();
    Task<List<WorkflowRequestDto>> GetRequestsMineAsync(string username);
    Task<WorkflowRequestDto?> GetRequestByIdAsync(int id);
    Task<WorkflowRequestDto> CreateRequestAsync(int workflowId, CreateWorkflowRequestDto dto, string createdByUsername);
    Task<WorkflowRequestDto> PerformActionAsync(int requestId, PerformWorkflowActionDto dto, string actorUsername);
}
