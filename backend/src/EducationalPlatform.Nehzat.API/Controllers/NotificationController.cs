using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EducationalPlatform.Nehzat.API.Controllers;

[ApiController]
[Route("api/notifications")]
[Authorize]
public class NotificationController : ControllerBase
{
    private readonly INotificationService _service;
    public NotificationController(INotificationService service) => _service = service;
    private bool TryGetUserId(out int userId)
    {
        return int.TryParse(User.FindFirst("userId")?.Value, out userId);
    }

    [HttpGet]
    public async Task<ActionResult<NotificationSummaryDto>> Get([FromQuery] int limit = 20)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();
        return Ok(await _service.GetSummaryAsync(userId, limit));
    }

    [HttpPost("{id}/read")]
    public async Task<IActionResult> MarkRead(int id)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();
        await _service.MarkReadAsync(userId, id);
        return NoContent();
    }

    [HttpPost("read-all")]
    public async Task<IActionResult> MarkAllRead()
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();
        return Ok(new { count = await _service.MarkAllReadAsync(userId) });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();
        await _service.DeleteAsync(userId, id);
        return NoContent();
    }

    [HttpPost("send")]
    public async Task<ActionResult<NotificationDto>> Send([FromBody] SendNotificationRequest req)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();
        return Ok(await _service.SendAsync(userId, req));
    }

    [HttpPost("devices")]
    public async Task<IActionResult> RegisterDevice([FromBody] RegisterDeviceRequest req)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();
        await _service.RegisterDeviceAsync(userId, req);
        return NoContent();
    }

    [HttpGet("unread-count")]
    public async Task<ActionResult<int>> UnreadCount()
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();
        return Ok(await _service.GetUnreadCountAsync(userId));
    }
}