using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EducationalPlatform.Nehzat.API.Controllers;

[ApiController]
[Route("api/profile")]
[Authorize]
public class ProfileController : ControllerBase
{
    private readonly IProfileService _profile;

    public ProfileController(IProfileService profile) => _profile = profile;

    private bool TryGetUserId(out int userId)
    {
        return int.TryParse(User.FindFirst("userId")?.Value, out userId);
    }

    [HttpGet]
    public async Task<ActionResult<ProfileDto>> GetProfile()
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();
        var dto = await _profile.GetProfileAsync(userId);
        return Ok(dto);
    }

    [HttpPut]
    public async Task<ActionResult<ProfileDto>> UpdateProfile([FromBody] UpdateProfileRequest request)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();
        var dto = await _profile.UpdateProfileAsync(userId, request);
        return Ok(dto);
    }

    [HttpGet("notifications")]
    public async Task<ActionResult<NotificationSettingsDto>> GetNotificationSettings()
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();
        var dto = await _profile.GetNotificationSettingsAsync(userId);
        return Ok(dto);
    }

    [HttpPut("notifications")]
    public async Task<ActionResult<NotificationSettingsDto>> UpdateNotificationSettings(
        [FromBody] UpdateNotificationSettingsRequest request)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();
        var dto = await _profile.UpdateNotificationSettingsAsync(userId, request);
        return Ok(dto);
    }
}
