using Microsoft.EntityFrameworkCore;
using EducationalPlatform.Nehzat.Domain.Entities;
using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Infrastructure.Data;

namespace EducationalPlatform.Nehzat.Infrastructure.Services;

public class EducationalProcessService : IEducationalProcessService
{
    private readonly AppDbContext _context;

    public EducationalProcessService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<EducationalProcessDto>> GetProcessesAsync()
    {
        var processes = await _context.EducationalProcesses
            .Include(p => p.Workflow)
            .OrderBy(p => p.Name)
            .ToListAsync();

        return processes.Select(MapProcess).ToList();
    }

    public async Task<EducationalProcessDto?> GetProcessByIdAsync(int id)
    {
        var process = await _context.EducationalProcesses
            .Include(p => p.Workflow)
            .FirstOrDefaultAsync(p => p.Id == id);

        return process == null ? null : MapProcess(process);
    }

    public async Task<EducationalProcessDto?> GetProcessByEntityTypeAsync(string entityType)
    {
        var process = await _context.EducationalProcesses
            .Include(p => p.Workflow)
            .FirstOrDefaultAsync(p => p.EntityType == entityType && p.IsActive);

        return process == null ? null : MapProcess(process);
    }

    public async Task<EducationalProcessDto> CreateProcessAsync(CreateEducationalProcessDto dto)
    {
        var workflow = await _context.WorkflowDefinitions
            .FirstOrDefaultAsync(w => w.Id == dto.WorkflowId)
            ?? throw new KeyNotFoundException("WorkflowDefinition not found");

        var process = new EducationalProcess
        {
            WorkflowId = dto.WorkflowId,
            EntityType = dto.EntityType,
            Name = dto.Name,
            Description = dto.Description ?? string.Empty,
            IsActive = dto.IsActive,
            AutoTrigger = dto.AutoTrigger,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.EducationalProcesses.Add(process);
        await _context.SaveChangesAsync();

        return (await GetProcessByIdAsync(process.Id))!;
    }

    public async Task<EducationalProcessDto> UpdateProcessAsync(int id, UpdateEducationalProcessDto dto)
    {
        var process = await _context.EducationalProcesses
            .Include(p => p.Workflow)
            .FirstOrDefaultAsync(p => p.Id == id)
            ?? throw new KeyNotFoundException("EducationalProcess not found");

        if (dto.WorkflowId.HasValue)
        {
            var workflow = await _context.WorkflowDefinitions
                .FirstOrDefaultAsync(w => w.Id == dto.WorkflowId.Value)
                ?? throw new KeyNotFoundException("WorkflowDefinition not found");
            process.WorkflowId = dto.WorkflowId.Value;
        }

        if (!string.IsNullOrWhiteSpace(dto.EntityType))
            process.EntityType = dto.EntityType;

        if (!string.IsNullOrWhiteSpace(dto.Name))
            process.Name = dto.Name;

        if (dto.Description != null)
            process.Description = dto.Description;

        if (dto.IsActive.HasValue)
            process.IsActive = dto.IsActive.Value;

        if (dto.AutoTrigger.HasValue)
            process.AutoTrigger = dto.AutoTrigger.Value;

        process.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return (await GetProcessByIdAsync(process.Id))!;
    }

    public async Task DeleteProcessAsync(int id)
    {
        var process = await _context.EducationalProcesses
            .FirstOrDefaultAsync(p => p.Id == id);

        if (process == null) return;

        _context.EducationalProcesses.Remove(process);
        await _context.SaveChangesAsync();
    }

    public async Task<ProcessTriggerResultDto> TriggerProcessAsync(
        string entityType,
        int entityId,
        string title,
        string description,
        string createdByUsername)
    {
        var process = await _context.EducationalProcesses
            .Include(p => p.Workflow)
            .ThenInclude(w => w.Steps)
            .FirstOrDefaultAsync(p => p.EntityType == entityType && p.IsActive);

        if (process == null)
            return new ProcessTriggerResultDto(false, null, "فرآیند آموزشی برای این نوع رویداد تعریف نشده است");

        if (!process.AutoTrigger)
            return new ProcessTriggerResultDto(false, null, "این فرآیند به صورت خودکار فعال نیست");

        var creator = await _context.Users
            .FirstOrDefaultAsync(u => u.Username == createdByUsername);

        if (creator == null)
            return new ProcessTriggerResultDto(false, null, "کاربر یافت نشد");

        var firstStep = process.Workflow.Steps.OrderBy(s => s.StepOrder).FirstOrDefault();

        var request = new WorkflowRequest
        {
            WorkflowId = process.WorkflowId,
            Title = title,
            Description = description,
            Status = "pending",
            CurrentStepId = firstStep?.Id,
            CreatedBy = creator.Id,
            EntityType = entityType,
            EntityId = entityId,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.WorkflowRequests.Add(request);
        await _context.SaveChangesAsync();

        return new ProcessTriggerResultDto(true, request.Id, "درخواست فرآیند آموزشی با موفقیت ایجاد شد");
    }

    private static EducationalProcessDto MapProcess(EducationalProcess process)
    {
        return new EducationalProcessDto(
            process.Id,
            process.WorkflowId,
            process.Workflow?.Name ?? string.Empty,
            process.EntityType,
            process.Name,
            process.Description,
            process.IsActive,
            process.AutoTrigger,
            process.CreatedAt,
            process.UpdatedAt
        );
    }
}
