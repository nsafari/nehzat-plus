using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using EducationalPlatform.Nehzat.Application.Constants;
using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;

namespace EducationalPlatform.Nehzat.API.Controllers;

[ApiController]
[Route("api/workflow")]
[Authorize]
public class WorkflowController : ControllerBase
{
    private readonly IWorkflowService _workflowService;

    public WorkflowController(IWorkflowService workflowService)
    {
        _workflowService = workflowService;
    }

    [HttpGet("definitions")]
    public async Task<IActionResult> GetDefinitions()
    {
        var result = await _workflowService.GetDefinitionsAsync();
        return Ok(result);
    }

    [HttpGet("definitions/{id:int}")]
    public async Task<IActionResult> GetDefinitionById(int id)
    {
        var result = await _workflowService.GetDefinitionByIdAsync(id);
        if (result == null) return NotFound();
        return Ok(result);
    }

    [HttpPost("definitions")]
    [Authorize(Roles = RoleNames.Manager)]
    public async Task<IActionResult> CreateDefinition([FromBody] CreateWorkflowDefinitionDto dto)
    {
        var result = await _workflowService.CreateDefinitionAsync(dto);
        return Ok(result);
    }

    [HttpDelete("definitions/{id:int}")]
    [Authorize(Roles = RoleNames.Manager)]
    public async Task<IActionResult> DeleteDefinition(int id)
    {
        await _workflowService.DeleteDefinitionAsync(id);
        return NoContent();
    }

    [HttpGet("requests")]
    public async Task<IActionResult> GetRequests()
    {
        var result = await _workflowService.GetRequestsAsync();
        return Ok(result);
    }

    [HttpGet("requests/mine")]
    public async Task<IActionResult> GetMyRequests()
    {
        var username = GetCurrentUserId();
        var result = await _workflowService.GetRequestsMineAsync(username);
        return Ok(result);
    }

    [HttpGet("requests/{id:int}")]
    public async Task<IActionResult> GetRequestById(int id)
    {
        var result = await _workflowService.GetRequestByIdAsync(id);
        if (result == null) return NotFound();
        return Ok(result);
    }

    [HttpPost("requests")]
    public async Task<IActionResult> CreateRequest([FromBody] CreateWorkflowRequestDto dto, [FromQuery] int workflowId)
    {
        try
        {
            var result = await _workflowService.CreateRequestAsync(workflowId, dto, GetCurrentUserId());
            return Ok(result);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    [HttpPost("requests/{id:int}/actions")]
    public async Task<IActionResult> PerformAction(int id, [FromBody] PerformWorkflowActionDto dto)
    {
        try
        {
            var result = await _workflowService.PerformActionAsync(id, dto, GetCurrentUserId());
            return Ok(result);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    private string GetCurrentUserId() => User.FindFirst("sub")?.Value ?? string.Empty;
}