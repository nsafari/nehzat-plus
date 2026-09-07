using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EducationalPlatform.Nehzat.API.Controllers;

[ApiController]
[Route("api/calendar")]
[Authorize]
public class CalendarController : ControllerBase
{
    private readonly ICalendarEventService _service;
    public CalendarController(ICalendarEventService service) => _service = service;

    private bool TryGetUserId(out int userId)
    {
        return int.TryParse(User.FindFirst("userId")?.Value, out userId);
    }

    [HttpGet("events")]
    public async Task<ActionResult<List<CalendarEventDto>>> GetEvents([FromQuery] DateTime from, [FromQuery] DateTime to)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();
        return Ok(await _service.GetEventsAsync(userId, from, to));
    }

    [HttpPost("events")]
    public async Task<ActionResult<CalendarEventDto>> Create([FromBody] CreateCalendarEventRequest req)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();
        return Ok(await _service.CreateAsync(userId, req));
    }

    [HttpPut("events/{id:int}")]
    public async Task<ActionResult<CalendarEventDto>> Update(int id, [FromBody] UpdateCalendarEventRequest req)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();
        return Ok(await _service.UpdateAsync(userId, id, req));
    }

    [HttpDelete("events/{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();
        await _service.DeleteAsync(userId, id);
        return NoContent();
    }

    [HttpPost("events/{id:int}/respond")]
    public async Task<IActionResult> Respond(int id, [FromBody] string response)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();
        await _service.RespondAsync(userId, id, response);
        return NoContent();
    }
}