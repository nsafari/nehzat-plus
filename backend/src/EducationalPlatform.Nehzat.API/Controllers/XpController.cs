using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;
using System.Security.Claims;

namespace EducationalPlatform.Nehzat.API.Controllers;

[ApiController]
[Route("api/xp")]
[Authorize]
public class XpController : ControllerBase
{
    private readonly IXpService _xpService;

    public XpController(IXpService xpService)
    {
        _xpService = xpService;
    }

    [HttpGet]
    public async Task<IActionResult> GetUserXp()
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized(new { message = "User ID not found in token." });

        var result = await _xpService.GetUserXpAsync(userId.Value);
        return Ok(result);
    }

    [HttpPost("award")]
    public async Task<IActionResult> AwardXp([FromBody] AwardXpRequest request)
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized(new { message = "User ID not found in token." });

        var result = await _xpService.AwardXpAsync(userId.Value, request.Xp, request.Reason);
        return Ok(result);
    }

    [HttpGet("badges")]
    public async Task<IActionResult> GetBadges()
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized(new { message = "User ID not found in token." });

        var result = await _xpService.GetBadgesAsync(userId.Value);
        return Ok(result);
    }

    [HttpGet("activity")]
    public async Task<IActionResult> GetRecentActivity([FromQuery] int limit = 10)
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized(new { message = "User ID not found in token." });

        if (limit < 1 || limit > 50)
            limit = 10;

        var result = await _xpService.GetRecentActivityAsync(userId.Value, limit);
        return Ok(result);
    }

    private int? GetUserId()
    {
        var userIdClaim = User.FindFirstValue("userId");
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
            return null;
        return userId;
    }
}