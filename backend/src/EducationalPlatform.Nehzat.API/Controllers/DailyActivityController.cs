using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Application.DTOs;
using System.Security.Claims;

namespace EducationalPlatform.Nehzat.API.Controllers;

[ApiController]
[Route("physical-activity")]
[Authorize]
public class DailyActivityController : ControllerBase
{
    private readonly IDailyActivityService _dailyActivityService;

    public DailyActivityController(IDailyActivityService dailyActivityService)
    {
        _dailyActivityService = dailyActivityService;
    }

    [HttpPost]
    public async Task<IActionResult> Upsert([FromBody] UpsertDailyActivityRequest request)
    {
        var userIdClaim = User.FindFirstValue("userId");
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
            return Unauthorized(new { message = "User ID not found in token." });

        var result = await _dailyActivityService.UpsertAsync(userId, request.ActivityDate, request.ActivityMinutes, request.Steps, request.SleepHours, request.Notes);
        return Ok(result);
    }

    [HttpGet("today")]
    public async Task<IActionResult> GetToday()
    {
        var userIdClaim = User.FindFirstValue("userId");
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
            return Unauthorized(new { message = "User ID not found in token." });

        var result = await _dailyActivityService.GetByDateAsync(userId, DateTime.UtcNow);
        if (result == null)
            return NotFound(new { message = "فعالیتی برای امروز ثبت نشده است" });
        return Ok(result);
    }

    [HttpGet("history")]
    public async Task<IActionResult> GetHistory([FromQuery] DateTime? fromDate, [FromQuery] DateTime? toDate)
    {
        var userIdClaim = User.FindFirstValue("userId");
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
            return Unauthorized(new { message = "User ID not found in token." });

        var result = await _dailyActivityService.GetHistoryAsync(userId, fromDate, toDate);
        return Ok(result);
    }

    [HttpGet("streak")]
    public async Task<IActionResult> GetStreak()
    {
        var userIdClaim = User.FindFirstValue("userId");
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
            return Unauthorized(new { message = "User ID not found in token." });

        var streak = await _dailyActivityService.GetStreakAsync(userId);
        return Ok(new { streak });
    }
}