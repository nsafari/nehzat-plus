using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using EducationalPlatform.Nehzat.Application.Constants;
using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;

namespace EducationalPlatform.Nehzat.API.Controllers;

[ApiController]
[Route("admin/educational-processes")]
[Authorize(Roles = RoleNames.Manager)]
public class AdminEducationalProcessesController : ControllerBase
{
    private readonly IEducationalProcessService _processService;

    public AdminEducationalProcessesController(IEducationalProcessService processService)
    {
        _processService = processService;
    }

    [HttpGet]
    public async Task<IActionResult> GetProcesses()
    {
        var result = await _processService.GetProcessesAsync();
        return Ok(result);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetProcessById(int id)
    {
        var result = await _processService.GetProcessByIdAsync(id);
        if (result == null) return NotFound();
        return Ok(result);
    }

    [HttpGet("by-entity-type/{entityType}")]
    public async Task<IActionResult> GetProcessByEntityType(string entityType)
    {
        var result = await _processService.GetProcessByEntityTypeAsync(entityType);
        if (result == null) return NotFound();
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> CreateProcess([FromBody] CreateEducationalProcessDto dto)
    {
        try
        {
            var result = await _processService.CreateProcessAsync(dto);
            return Ok(result);
        }
        catch (KeyNotFoundException)
        {
            return BadRequest("Workflow یافت نشد");
        }
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateProcess(int id, [FromBody] UpdateEducationalProcessDto dto)
    {
        try
        {
            var result = await _processService.UpdateProcessAsync(id, dto);
            return Ok(result);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteProcess(int id)
    {
        await _processService.DeleteProcessAsync(id);
        return NoContent();
    }

    [HttpPost("trigger")]
    public async Task<IActionResult> TriggerProcess([FromBody] TriggerProcessRequest request)
    {
        var username = User.FindFirst("sub")?.Value ?? string.Empty;
        var result = await _processService.TriggerProcessAsync(
            request.EntityType,
            request.EntityId,
            request.Title,
            request.Description,
            username);

        if (!result.Success)
            return BadRequest(result.Message);

        return Ok(result);
    }
}

public record TriggerProcessRequest(
    string EntityType,
    int EntityId,
    string Title,
    string Description
);
