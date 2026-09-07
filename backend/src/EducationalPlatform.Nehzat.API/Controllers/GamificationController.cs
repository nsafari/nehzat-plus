using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Infrastructure.Data;
using EducationalPlatform.Nehzat.Application.Constants;

namespace EducationalPlatform.Nehzat.API.Controllers;

[ApiController]
[Route("api/gamification")]
[Authorize]
public class GamificationController : ControllerBase
{
    private readonly IGamificationService _gamificationService;
    private readonly AppDbContext _db;

    public GamificationController(IGamificationService gamificationService, AppDbContext db)
    {
        _gamificationService = gamificationService;
        _db = db;
    }

    [HttpGet("badges")]
    public async Task<IActionResult> GetBadges()
    {
        return Ok(await _gamificationService.GetBadgesAsync());
    }

    [HttpGet("badges/{id}")]
    public async Task<IActionResult> GetBadgeById(int id)
    {
        var badge = await _gamificationService.GetBadgeByIdAsync(id);
        if (badge == null)
            return NotFound(new { message = "نشان یافت نشد." });
        return Ok(badge);
    }

    [HttpPost("badges")]
    [Authorize(Roles = RoleNames.Manager)]
    public async Task<IActionResult> CreateBadge([FromBody] CreateBadgeDto dto)
    {
        return Ok(await _gamificationService.CreateBadgeAsync(dto));
    }

    [HttpPut("badges/{id}")]
    [Authorize(Roles = RoleNames.Manager)]
    public async Task<IActionResult> UpdateBadge(int id, [FromBody] UpdateBadgeDto dto)
    {
        try
        {
            return Ok(await _gamificationService.UpdateBadgeAsync(id, dto));
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = GenericErrorMessages.NotFound });
        }
    }

    [HttpDelete("badges/{id}")]
    [Authorize(Roles = RoleNames.Manager)]
    public async Task<IActionResult> DeleteBadge(int id)
    {
        try
        {
            await _gamificationService.DeleteBadgeAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = GenericErrorMessages.NotFound });
        }
    }

    [HttpGet("badges/mine")]
    public async Task<IActionResult> GetMyBadges()
    {
        var userId = await GetCurrentUserIdAsync();
        if (userId == null)
            return Unauthorized(new { message = "شناسه کاربر در توکن یافت نشد." });

        return Ok(await _gamificationService.GetUserBadgesAsync(userId.Value));
    }

    [HttpPost("badges/{badgeId}/award/{userId}")]
    [Authorize(Roles = RoleNames.Manager)]
    public async Task<IActionResult> AwardBadge(int badgeId, int userId)
    {
        try
        {
            return Ok(await _gamificationService.AwardBadgeAsync(userId, badgeId));
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = GenericErrorMessages.NotFound });
        }
        catch (InvalidOperationException)
        {
            return BadRequest(new { message = GenericErrorMessages.BadRequest });
        }
    }

    [HttpGet("points/mine")]
    public async Task<IActionResult> GetMyPoints()
    {
        var userId = await GetCurrentUserIdAsync();
        if (userId == null)
            return Unauthorized(new { message = "شناسه کاربر در توکن یافت نشد." });

        return Ok(await _gamificationService.GetUserPointsAsync(userId.Value));
    }

    [HttpGet("points/{userId}")]
    public async Task<IActionResult> GetUserPoints(int userId)
    {
        return Ok(await _gamificationService.GetUserPointsAsync(userId));
    }

    [HttpPost("points")]
    [Authorize(Roles = RoleNames.Manager)]
    public async Task<IActionResult> AwardPoints([FromBody] AwardPointsDto dto)
    {
        try
        {
            return Ok(await _gamificationService.AwardPointsAsync(dto.UserId, dto));
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = GenericErrorMessages.NotFound });
        }
    }

    [HttpGet("leaderboard")]
    public async Task<IActionResult> GetLeaderboard([FromQuery] int? limit = null)
    {
        return Ok(await _gamificationService.GetLeaderboardAsync(limit));
    }

    private async Task<int?> GetCurrentUserIdAsync()
    {
        var sub = User.FindFirst("sub")?.Value;
        if (string.IsNullOrEmpty(sub))
            return null;

        return await ResolveUserIdAsync(sub);
    }

    private async Task<int?> ResolveUserIdAsync(string usernameOrId)
    {
        if (int.TryParse(usernameOrId, out var userId))
        {
            var exists = await _db.Users.AnyAsync(u => u.Id == userId);
            if (exists) return userId;
        }

        var user = await _db.Users.FirstOrDefaultAsync(u => u.Username == usernameOrId);
        return user?.Id;
    }
}