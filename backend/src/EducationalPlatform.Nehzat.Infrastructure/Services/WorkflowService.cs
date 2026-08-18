using Microsoft.EntityFrameworkCore;
using EducationalPlatform.Nehzat.Domain.Entities;
using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Application.Exceptions;
using EducationalPlatform.Nehzat.Application.Constants;
using EducationalPlatform.Nehzat.Infrastructure.Data;

namespace EducationalPlatform.Nehzat.Infrastructure.Services;

public class WorkflowService : IWorkflowService
{
    private readonly AppDbContext _context;

    public WorkflowService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<WorkflowDefinitionDto>> GetDefinitionsAsync()
    {
        var definitions = await _context.WorkflowDefinitions
            .Include(d => d.Steps)
            .OrderBy(d => d.CreatedAt)
            .ToListAsync();

        return definitions.Select(MapDefinition).ToList();
    }

    public async Task<WorkflowDefinitionDto?> GetDefinitionByIdAsync(int id)
    {
        var definition = await _context.WorkflowDefinitions
            .Include(d => d.Steps)
            .FirstOrDefaultAsync(d => d.Id == id);

        return definition == null ? null : MapDefinition(definition);
    }

    public async Task<WorkflowDefinitionDto> CreateDefinitionAsync(CreateWorkflowDefinitionDto dto)
    {
        var definition = new WorkflowDefinition
        {
            Name = dto.Name,
            Code = dto.Code,
            Description = dto.Description ?? string.Empty,
            IsActive = dto.IsActive,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            Steps = (dto.Steps ?? new List<CreateWorkflowStepDto>())
                .OrderBy(s => s.StepOrder)
                .Select(s => new WorkflowStep
                {
                    StepOrder = s.StepOrder,
                    Name = s.Name,
                    RoleRequired = s.RoleRequired ?? string.Empty,
                    ActionType = string.IsNullOrWhiteSpace(s.ActionType) ? "approve" : s.ActionType,
                    IsFinalStep = s.IsFinalStep
                })
                .ToList()
        };

        _context.WorkflowDefinitions.Add(definition);
        await _context.SaveChangesAsync();

        return (await GetDefinitionByIdAsync(definition.Id))!;
    }

    public async Task DeleteDefinitionAsync(int id)
    {
        var definition = await _context.WorkflowDefinitions
            .Include(d => d.Steps)
            .Include(d => d.Requests)
            .ThenInclude(r => r.Actions)
            .FirstOrDefaultAsync(d => d.Id == id);

        if (definition == null) return;

        var requests = definition.Requests;
        var requestIds = requests.Select(r => r.Id).ToList();

        var orphanActions = await _context.WorkflowActions
            .Where(a => requestIds.Contains(a.RequestId))
            .ToListAsync();

        _context.WorkflowActions.RemoveRange(orphanActions);
        _context.WorkflowRequests.RemoveRange(requests);
        _context.WorkflowSteps.RemoveRange(definition.Steps);
        _context.WorkflowDefinitions.Remove(definition);
        await _context.SaveChangesAsync();
    }

    public async Task<List<WorkflowRequestDto>> GetRequestsAsync()
    {
        var requests = await _context.WorkflowRequests
            .Include(r => r.Workflow)
            .Include(r => r.Creator)
            .Include(r => r.CurrentStep)
            .Include(r => r.Actions)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();

        return (await MapRequests(requests)).ToList();
    }

    public async Task<List<WorkflowRequestDto>> GetRequestsMineAsync(string username)
    {
        var requests = await _context.WorkflowRequests
            .Include(r => r.Workflow)
            .Include(r => r.Creator)
            .Include(r => r.CurrentStep)
            .Include(r => r.Actions)
            .Where(r => r.Creator.Username == username)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();

        return (await MapRequests(requests)).ToList();
    }

    public async Task<WorkflowRequestDto?> GetRequestByIdAsync(int id)
    {
        var request = await _context.WorkflowRequests
            .Include(r => r.Workflow)
            .Include(r => r.Creator)
            .Include(r => r.CurrentStep)
            .Include(r => r.Actions)
            .FirstOrDefaultAsync(r => r.Id == id);

        if (request == null) return null;

        var dtos = await MapRequests(new List<WorkflowRequest> { request });
        return dtos.FirstOrDefault();
    }

    public async Task<WorkflowRequestDto> CreateRequestAsync(int workflowId, CreateWorkflowRequestDto dto, string createdByUsername)
    {
        var workflow = await _context.WorkflowDefinitions
            .Include(w => w.Steps)
            .FirstOrDefaultAsync(w => w.Id == workflowId)
            ?? throw new KeyNotFoundException("WorkflowDefinition not found");

        var creator = await _context.Users.FirstOrDefaultAsync(u => u.Username == createdByUsername)
            ?? throw new KeyNotFoundException("User not found");

        var firstStep = workflow.Steps.OrderBy(s => s.StepOrder).FirstOrDefault();

        var request = new WorkflowRequest
        {
            WorkflowId = workflow.Id,
            Title = dto.Title,
            Description = dto.Description ?? string.Empty,
            Status = "pending",
            CurrentStepId = firstStep?.Id,
            CreatedBy = creator.Id,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.WorkflowRequests.Add(request);
        await _context.SaveChangesAsync();

        return (await GetRequestByIdAsync(request.Id))!;
    }

    public async Task<WorkflowRequestDto> PerformActionAsync(int requestId, PerformWorkflowActionDto dto, string actorUsername)
    {
        var request = await _context.WorkflowRequests
            .Include(r => r.Workflow)
            .ThenInclude(w => w.Steps)
            .Include(r => r.CurrentStep)
            .Include(r => r.Creator)
            .Include(r => r.Actions)
            .FirstOrDefaultAsync(r => r.Id == requestId)
            ?? throw new KeyNotFoundException("WorkflowRequest not found");

        if (request.Status == "completed" || request.Status == "cancelled" || request.Status == "rejected")
            throw new InvalidOperationException("Workflow request is already finished");

        var actor = await _context.Users.FirstOrDefaultAsync(u => u.Username == actorUsername)
            ?? throw new KeyNotFoundException("User not found");

        var actionType = string.IsNullOrWhiteSpace(dto.Action) ? "approve" : dto.Action;
        var currentStep = request.CurrentStep;
        var steps = request.Workflow.Steps.OrderBy(s => s.StepOrder).ToList();

        if (currentStep != null && !string.IsNullOrEmpty(currentStep.RoleRequired))
        {
            if (actor.UserType != currentStep.RoleRequired && actor.UserType != RoleNames.Admin)
            {
                throw new ForbiddenException(GenericErrorMessages.Forbidden);
            }
        }

        var workflowAction = new WorkflowAction
        {
            RequestId = request.Id,
            StepId = currentStep?.Id ?? steps.FirstOrDefault()?.Id ?? 0,
            ActorId = actor.Id,
            Action = actionType,
            Comment = dto.Comment ?? string.Empty,
            CreatedAt = DateTime.UtcNow
        };
        _context.WorkflowActions.Add(workflowAction);

        if (actionType.Equals("reject", StringComparison.OrdinalIgnoreCase))
        {
            request.Status = "rejected";
        }
        else if (actionType.Equals("return", StringComparison.OrdinalIgnoreCase))
        {
            request.Status = "returned";
            request.CurrentStepId = steps.FirstOrDefault()?.Id;
        }
        else
        {
            if (steps.Count == 0)
            {
                request.Status = "completed";
                request.CurrentStepId = null;
            }
            else if (currentStep == null)
            {
                request.CurrentStepId = steps.First().Id;
            }
            else if (currentStep.IsFinalStep)
            {
                request.Status = "completed";
                request.CurrentStepId = null;
            }
            else
            {
                var next = steps.FirstOrDefault(s => s.StepOrder > currentStep.StepOrder);
                if (next == null)
                {
                    request.Status = "completed";
                    request.CurrentStepId = null;
                }
                else
                {
                    request.CurrentStepId = next.Id;
                }
            }
        }

        request.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return (await GetRequestByIdAsync(request.Id))!;
    }

    private static WorkflowDefinitionDto MapDefinition(WorkflowDefinition definition)
    {
        return new WorkflowDefinitionDto(
            definition.Id,
            definition.Name,
            definition.Code,
            definition.Description,
            definition.IsActive,
            definition.CreatedAt,
            definition.UpdatedAt,
            definition.Steps
                .OrderBy(s => s.StepOrder)
                .Select(s => new WorkflowStepDto(
                    s.Id,
                    s.WorkflowId,
                    s.StepOrder,
                    s.Name,
                    s.RoleRequired,
                    s.ActionType,
                    s.IsFinalStep
                ))
                .ToList()
        );
    }

    private async Task<List<WorkflowRequestDto>> MapRequests(List<WorkflowRequest> requests)
    {
        if (requests.Count == 0) return new List<WorkflowRequestDto>();

        var userIds = requests
            .Select(r => r.CreatedBy)
            .Concat(requests.SelectMany(r => r.Actions).Select(a => a.ActorId))
            .Distinct()
            .ToList();

        var users = await _context.Users
            .Where(u => userIds.Contains(u.Id))
            .ToDictionaryAsync(u => u.Id, u => u);

        return requests.Select(r =>
        {
            var creator = users.TryGetValue(r.CreatedBy, out var c) ? c : null;
            var createdByName = creator != null
                ? Truncate(((creator.FirstName ?? "") + " " + (creator.LastName ?? "")).Trim(), 100)
                : string.Empty;

            var actions = r.Actions
                .OrderBy(a => a.CreatedAt)
                .Select(a =>
                {
                    var actor = users.TryGetValue(a.ActorId, out var u) ? u : null;
                    var actorName = actor != null
                        ? Truncate(((actor.FirstName ?? "") + " " + (actor.LastName ?? "")).Trim(), 100)
                        : string.Empty;
                    return new WorkflowActionDto(
                        a.Id,
                        a.RequestId,
                        a.StepId,
                        a.ActorId,
                        actorName,
                        a.Action,
                        a.Comment,
                        a.CreatedAt
                    );
                })
                .ToList();

            return new WorkflowRequestDto(
                r.Id,
                r.WorkflowId,
                r.Workflow?.Name ?? string.Empty,
                r.Title,
                r.Description,
                r.Status,
                r.CurrentStepId,
                r.CurrentStep?.Name ?? string.Empty,
                r.CreatedBy,
                createdByName,
                r.CreatedAt,
                r.UpdatedAt,
                actions
            );
        }).ToList();
    }

    private static string Truncate(string value, int maxLength)
    {
        return value.Length > maxLength ? value.Substring(0, maxLength) : value;
    }
}