using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;

namespace EducationalPlatform.Nehzat.API.Controllers;

[ApiController]
[Route("api/feedback")]
[Authorize]
public class FeedbackController : ControllerBase
{
    private readonly IFeedbackService _feedbackService;

    public FeedbackController(IFeedbackService feedbackService)
    {
        _feedbackService = feedbackService;
    }

    [HttpGet("latest")]
    public async Task<ActionResult<FeedbackDto?>> GetLatest()
    {
        var userId = User.FindFirst("sub")?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        var result = await _feedbackService.GetLatestFeedbackAsync(userId);
        return Ok(result);
    }

    [HttpGet("recent")]
    public async Task<ActionResult<List<FeedbackDto>>> GetRecent([FromQuery] int count = 10)
    {
        var userId = User.FindFirst("sub")?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        var result = await _feedbackService.GetRecentFeedbacksAsync(userId, count);
        return Ok(result);
    }

    [HttpGet("submission/{id}")]
    public async Task<ActionResult<FeedbackDto?>> GetBySubmission(int id)
    {
        var result = await _feedbackService.GetSubmissionFeedbackAsync(id);
        if (result is null)
            return NotFound();

        return Ok(result);
    }
}
