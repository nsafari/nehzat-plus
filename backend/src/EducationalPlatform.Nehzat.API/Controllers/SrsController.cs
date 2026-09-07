using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Application.DTOs;
using System.Security.Claims;

namespace EducationalPlatform.Nehzat.API.Controllers;

[ApiController]
[Route("api/spaced-repetition")]
[Authorize]
public class SrsController : ControllerBase
{
    private readonly ISrsService _srsService;

    public SrsController(ISrsService srsService)
    {
        _srsService = srsService;
    }

    [HttpPost]
    public async Task<IActionResult> Upsert([FromBody] UpsertSrsCardRequest request)
    {
        var userId = GetUserId();
        if (userId is null)
            return Unauthorized(new { message = "User ID not found in token." });

        var result = await _srsService.UpsertAsync(userId.Value, request);
        return Ok(result);
    }

    [HttpGet("due")]
    public async Task<IActionResult> GetDueCards()
    {
        var userId = GetUserId();
        if (userId is null)
            return Unauthorized(new { message = "User ID not found in token." });

        var result = await _srsService.GetDueCardsAsync(userId.Value);
        return Ok(result);
    }

    [HttpPost("{cardId}/review")]
    public async Task<IActionResult> Review(int cardId, [FromBody] SrsReviewRequest request)
    {
        var userId = GetUserId();
        if (userId is null)
            return Unauthorized(new { message = "User ID not found in token." });

        try
        {
            var result = await _srsService.ReviewCardAsync(userId.Value, cardId, request.Quality);
            return Ok(result);
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = "کارت مرور یافت نشد" });
        }
    }

    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var userId = GetUserId();
        if (userId is null)
            return Unauthorized(new { message = "User ID not found in token." });

        var result = await _srsService.GetStatsAsync(userId.Value);
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