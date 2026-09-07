using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Application.DTOs;
using System.Security.Claims;

namespace EducationalPlatform.Nehzat.API.Controllers;

[ApiController]
[Route("api/arts")]
[Authorize]
public class ArtsController : ControllerBase
{
    private readonly IArtsService _artsService;

    public ArtsController(IArtsService artsService)
    {
        _artsService = artsService;
    }

    private bool TryGetUserId(out int userId)
    {
        var userIdClaim = User.FindFirstValue("userId");
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var parsed))
        {
            userId = 0;
            return false;
        }

        userId = parsed;
        return true;
    }

    [HttpGet]
    public async Task<IActionResult> GetArtworks()
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized(new { message = "User ID not found in token." });

        var result = await _artsService.GetArtworksAsync(userId);
        return Ok(result);
    }

    [HttpGet("music")]
    public async Task<IActionResult> GetMusicRecords()
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized(new { message = "User ID not found in token." });

        var result = await _artsService.GetMusicRecordsAsync(userId);
        return Ok(result);
    }

    [HttpGet("calligraphy")]
    public async Task<IActionResult> GetCalligraphySamples()
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized(new { message = "User ID not found in token." });

        var result = await _artsService.GetCalligraphySamplesAsync(userId);
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> UploadArtwork([FromBody] CreateArtworkRequest request)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized(new { message = "User ID not found in token." });

        var result = await _artsService.CreateArtworkAsync(userId, request);
        return Ok(result);
    }

    [HttpPost("music")]
    public async Task<IActionResult> UploadMusicRecord([FromBody] CreateMusicRecordRequest request)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized(new { message = "User ID not found in token." });

        var result = await _artsService.CreateMusicRecordAsync(userId, request);
        return Ok(result);
    }

    [HttpPost("calligraphy")]
    public async Task<IActionResult> UploadCalligraphySample([FromBody] CreateCalligraphySampleRequest request)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized(new { message = "User ID not found in token." });

        var result = await _artsService.CreateCalligraphySampleAsync(userId, request);
        return Ok(result);
    }

    [HttpPost("{id}/like")]
    public async Task<IActionResult> LikeArtwork(int id)
    {
        var likeCount = await _artsService.LikeArtworkAsync(id);
        return Ok(new { id, likeCount });
    }

    [HttpPost("music/{id}/like")]
    public async Task<IActionResult> LikeMusicRecord(int id)
    {
        var likeCount = await _artsService.LikeMusicRecordAsync(id);
        return Ok(new { id, likeCount });
    }

    [HttpPost("calligraphy/{id}/like")]
    public async Task<IActionResult> LikeCalligraphySample(int id)
    {
        var likeCount = await _artsService.LikeCalligraphySampleAsync(id);
        return Ok(new { id, likeCount });
    }
}