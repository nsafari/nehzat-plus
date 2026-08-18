using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EducationalPlatform.Nehzat.API.Controllers;

[ApiController]
[Route("api/courier-reports")]
[Authorize]
public class CourierReportController : ControllerBase
{
    private readonly ICourierReportService _service;
    public CourierReportController(ICourierReportService service) => _service = service;
    private bool TryGetUserId(out int userId)
    {
        return int.TryParse(User.FindFirst("userId")?.Value, out userId);
    }

    [HttpGet("couriers/{courierId}")]
    public async Task<ActionResult<CourierStatsDto>> CourierStats(int courierId, [FromQuery] DateTime from, [FromQuery] DateTime to)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();
        return Ok(await _service.GetCourierStatsAsync(userId, courierId, from, to));
    }

    [HttpGet("leaderboard")]
    public async Task<ActionResult<CourierLeaderboardDto>> Leaderboard([FromQuery] DateTime from, [FromQuery] DateTime to, [FromQuery] int limit = 10)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();
        return Ok(await _service.GetLeaderboardAsync(userId, from, to, limit));
    }
}