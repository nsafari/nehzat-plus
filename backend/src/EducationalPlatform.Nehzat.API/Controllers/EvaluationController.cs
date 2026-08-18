using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EducationalPlatform.Nehzat.API.Controllers;

[ApiController]
[Route("api/evaluations")]
[Authorize]
public class EvaluationController : ControllerBase
{
    private readonly IEvaluationService _service;

    public EvaluationController(IEvaluationService service)
    {
        _service = service;
    }

    private bool TryGetUserId(out int userId)
    {
        return int.TryParse(User.FindFirst("userId")?.Value, out userId);
    }

    [HttpGet("questions")]
    public async Task<ActionResult<List<QuestionDto>>> GetQuestions([FromQuery] string? category, [FromQuery] string? difficulty)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();
        return Ok(await _service.GetQuestionsAsync(userId, category, difficulty));
    }

    [HttpPost("questions")]
    public async Task<ActionResult<QuestionDto>> CreateQuestion([FromBody] CreateQuestionRequest req)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();
        return Ok(await _service.CreateQuestionAsync(userId, req));
    }

    [HttpDelete("questions/{id:int}")]
    public async Task<IActionResult> DeleteQuestion(int id)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();
        await _service.DeleteQuestionAsync(userId, id);
        return NoContent();
    }

    [HttpPost("start")]
    public async Task<ActionResult<RandomEvaluationDto>> Start([FromBody] StartEvaluationRequest req)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();
        return Ok(await _service.StartEvaluationAsync(userId, req));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<RandomEvaluationDto>> Get(int id)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();
        return Ok(await _service.GetEvaluationAsync(userId, id));
    }

    [HttpPost("submit")]
    public async Task<ActionResult<RandomEvaluationDto>> Submit([FromBody] SubmitAnswersRequest req)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();
        return Ok(await _service.SubmitAnswersAsync(userId, req));
    }

    [HttpGet("mine")]
    public async Task<ActionResult<List<RandomEvaluationDto>>> Mine([FromQuery] int limit = 20)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();
        return Ok(await _service.GetMyEvaluationsAsync(userId, limit));
    }

    [HttpGet("stats")]
    public async Task<ActionResult<EvaluationStatsDto>> Stats()
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();
        return Ok(await _service.GetStatsAsync(userId));
    }
}