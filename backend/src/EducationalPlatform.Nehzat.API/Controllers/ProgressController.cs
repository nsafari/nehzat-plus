using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace EducationalPlatform.Nehzat.API.Controllers;

[ApiController]
[Route("api/progress")]
[Authorize]
public class ProgressController : ControllerBase
{
    private readonly IProgressService _service;
    public ProgressController(IProgressService service) => _service = service;

    private int? UserId
    {
        get
        {
            var userIdClaim = User.FindFirstValue("userId");
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
                return null;
            return userId;
        }
    }

    [HttpGet("dashboard")]
    public async Task<ActionResult<DashboardSummaryDto>> GetDashboard()
    {
        var userId = UserId;
        if (userId == null)
            return Unauthorized(new { message = "User ID not found in token." });

        return Ok(await _service.GetDashboardAsync(userId.Value));
    }

    [HttpGet("students/{studentId}/reports")]
    public async Task<ActionResult<List<ProgressReportDto>>> GetReports(int studentId, [FromQuery] int limit = 12)
    {
        var userId = UserId;
        if (userId == null)
            return Unauthorized(new { message = "User ID not found in token." });

        if (studentId != userId.Value)
            return NotFound();

        return Ok(await _service.GetReportsByStudentAsync(userId.Value, studentId, limit));
    }

    [HttpPost("reports")]
    public async Task<ActionResult<ProgressReportDto>> GenerateReport([FromBody] GenerateReportRequest req)
    {
        var userId = UserId;
        if (userId == null)
            return Unauthorized(new { message = "User ID not found in token." });

        return Ok(await _service.GenerateReportAsync(userId.Value, req));
    }

    [HttpGet("leaderboard")]
    public async Task<ActionResult<List<ProgressLeaderboardEntryDto>>> GetLeaderboard([FromQuery] int limit = 10)
    {
        var userId = UserId;
        if (userId == null)
            return Unauthorized(new { message = "User ID not found in token." });

        return Ok(await _service.GetLeaderboardAsync(userId.Value, limit));
    }
}