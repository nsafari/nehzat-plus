using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;

namespace EducationalPlatform.Nehzat.API.Controllers;

[ApiController]
[Route("api/quran-rings")]
[Authorize]
public class QuranRingController : ControllerBase
{
    private readonly IQuranRingService _service;

    public QuranRingController(IQuranRingService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<List<QuranRingDto>>> GetAllRings([FromQuery] QuranRingFilterDto? filter)
    {
        return Ok(await _service.GetAllRingsAsync(filter));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<QuranRingDto>> GetRingById(int id)
    {
        var result = await _service.GetRingByIdAsync(id);
        return result is null ? NotFound() : Ok(result);
    }

    [HttpGet("by-code/{code}")]
    public async Task<ActionResult<QuranRingDto>> GetRingByCode(string code)
    {
        var result = await _service.GetRingByCodeAsync(code);
        return result is null ? NotFound() : Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<QuranRingDto>> CreateRing([FromBody] CreateQuranRingRequest request)
    {
        var result = await _service.CreateRingAsync(request);
        return CreatedAtAction(nameof(GetRingById), new { id = result.Id }, result);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<QuranRingDto>> UpdateRing(int id, [FromBody] UpdateQuranRingRequest request)
    {
        return Ok(await _service.UpdateRingAsync(id, request));
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteRing(int id)
    {
        return await _service.DeleteRingAsync(id) ? NoContent() : NotFound();
    }

    [HttpGet("sessions")]
    public async Task<ActionResult<List<QuranRingSessionDto>>> GetSessions([FromQuery] SessionFilterDto? filter)
    {
        return Ok(await _service.GetSessionsAsync(filter));
    }

    [HttpGet("sessions/{id}")]
    public async Task<ActionResult<QuranRingSessionDto>> GetSessionById(int id)
    {
        var result = await _service.GetSessionByIdAsync(id);
        return result is null ? NotFound() : Ok(result);
    }

    [HttpGet("{ringId}/sessions")]
    public async Task<ActionResult<List<QuranRingSessionDto>>> GetSessionsByRing(int ringId)
    {
        return Ok(await _service.GetSessionsByRingAsync(ringId));
    }

    [HttpPost("sessions")]
    public async Task<ActionResult<QuranRingSessionDto>> CreateSession([FromBody] CreateQuranRingSessionRequest request)
    {
        var result = await _service.CreateSessionAsync(request);
        return CreatedAtAction(nameof(GetSessionById), new { id = result.Id }, result);
    }

    [HttpPut("sessions/{id}")]
    public async Task<ActionResult<QuranRingSessionDto>> UpdateSession(int id, [FromBody] UpdateQuranRingSessionRequest request)
    {
        return Ok(await _service.UpdateSessionAsync(id, request));
    }

    [HttpDelete("sessions/{id}")]
    public async Task<ActionResult> DeleteSession(int id)
    {
        return await _service.DeleteSessionAsync(id) ? NoContent() : NotFound();
    }

    [HttpPost("steps")]
    public async Task<ActionResult<QuranSessionStepDto>> CreateStep([FromBody] CreateQuranSessionStepRequest request)
    {
        return Ok(await _service.CreateStepAsync(request));
    }

    [HttpPut("steps/{id}")]
    public async Task<ActionResult<QuranSessionStepDto>> UpdateStep(int id, [FromBody] CreateQuranSessionStepRequest request)
    {
        return Ok(await _service.UpdateStepAsync(id, request));
    }

    [HttpDelete("steps/{id}")]
    public async Task<ActionResult> DeleteStep(int id)
    {
        return await _service.DeleteStepAsync(id) ? NoContent() : NotFound();
    }

    [HttpGet("progress")]
    public async Task<ActionResult<List<StudentQuranSessionProgressDto>>> GetStudentProgress([FromQuery] StudentProgressFilterDto? filter)
    {
        return Ok(await _service.GetStudentProgressAsync(filter));
    }

    [HttpGet("progress/{id}")]
    public async Task<ActionResult<StudentQuranSessionProgressDto>> GetStudentProgressById(int id)
    {
        var result = await _service.GetStudentProgressByIdAsync(id);
        return result is null ? NotFound() : Ok(result);
    }

    [HttpPost("progress/start/{studentId}/{sessionId}")]
    public async Task<ActionResult<StudentQuranSessionProgressDto>> StartSession(int studentId, int sessionId)
    {
        return Ok(await _service.StartSessionAsync(studentId, sessionId));
    }

    [HttpPut("progress/{id}")]
    public async Task<ActionResult<StudentQuranSessionProgressDto>> UpdateSessionProgress(int id, [FromBody] UpdateSessionProgressRequest request)
    {
        return Ok(await _service.UpdateSessionProgressAsync(id, request));
    }

    [HttpPut("progress/step/{id}")]
    public async Task<ActionResult<StudentStepProgressDto>> UpdateStepProgress(int id, [FromBody] UpdateStepProgressRequest request)
    {
        return Ok(await _service.UpdateStepProgressAsync(id, request));
    }

    [HttpPost("progress/{id}/complete")]
    public async Task<ActionResult<StudentQuranSessionProgressDto>> CompleteSession(int id, [FromQuery] int? assessmentScore = null)
    {
        return Ok(await _service.CompleteSessionAsync(id, assessmentScore));
    }

    [HttpGet("speed-categories/{studentId}/{ringId}")]
    public async Task<ActionResult<StudentSpeedCategoryDto>> GetStudentSpeedCategory(int studentId, int ringId)
    {
        var result = await _service.GetStudentSpeedCategoryAsync(studentId, ringId);
        return result is null ? NotFound() : Ok(result);
    }

    [HttpPut("speed-categories/{studentId}/{ringId}")]
    public async Task<ActionResult<StudentSpeedCategoryDto>> UpdateSpeedCategory(int studentId, int ringId, [FromBody] UpdateSpeedCategoryRequest request)
    {
        return Ok(await _service.UpdateSpeedCategoryAsync(studentId, ringId, request));
    }

    [HttpPost("speed-categories/{studentId}/{ringId}/calculate")]
    public async Task<ActionResult<StudentSpeedCategoryDto>> CalculateSpeedCategory(int studentId, int ringId)
    {
        return Ok(await _service.CalculateSpeedCategoryAsync(studentId, ringId));
    }

    [HttpGet("speed-categories/by-category/{category}")]
    public async Task<ActionResult<List<StudentSpeedCategoryDto>>> GetStudentsBySpeedCategory(string category, [FromQuery] int? ringId = null)
    {
        return Ok(await _service.GetStudentsBySpeedCategoryAsync(category, ringId));
    }

    [HttpGet("tadabbor")]
    public async Task<ActionResult<List<TadabborEntryDto>>> GetTadabborEntries([FromQuery] TadabborFilterDto? filter)
    {
        return Ok(await _service.GetTadabborEntriesAsync(filter));
    }

    [HttpGet("tadabbor/{id}")]
    public async Task<ActionResult<TadabborEntryDto>> GetTadabborEntryById(int id)
    {
        var result = await _service.GetTadabborEntryByIdAsync(id);
        return result is null ? NotFound() : Ok(result);
    }

    [HttpPost("tadabbor")]
    public async Task<ActionResult<TadabborEntryDto>> CreateTadabborEntry([FromBody] CreateTadabborEntryRequest request)
    {
        return Ok(await _service.CreateTadabborEntryAsync(request));
    }

    [HttpPut("tadabbor/{id}")]
    public async Task<ActionResult<TadabborEntryDto>> UpdateTadabborEntry(int id, [FromBody] UpdateTadabborEntryRequest request)
    {
        return Ok(await _service.UpdateTadabborEntryAsync(id, request));
    }

    [HttpDelete("tadabbor/{id}")]
    public async Task<ActionResult> DeleteTadabborEntry(int id)
    {
        return await _service.DeleteTadabborEntryAsync(id) ? NoContent() : NotFound();
    }

    [HttpGet("evaluations")]
    public async Task<ActionResult<List<QuranAssetEvaluationDto>>> GetAssetEvaluations([FromQuery] EvaluationFilterDto? filter)
    {
        return Ok(await _service.GetAssetEvaluationsAsync(filter));
    }

    [HttpGet("evaluations/{id}")]
    public async Task<ActionResult<QuranAssetEvaluationDto>> GetAssetEvaluationById(int id)
    {
        var result = await _service.GetAssetEvaluationByIdAsync(id);
        return result is null ? NotFound() : Ok(result);
    }

    [HttpPost("evaluations")]
    public async Task<ActionResult<QuranAssetEvaluationDto>> CreateAssetEvaluation([FromBody] CreateAssetEvaluationRequest request)
    {
        return Ok(await _service.CreateAssetEvaluationAsync(request));
    }

    [HttpGet("evaluations/latest/{studentId}/{ringId}")]
    public async Task<ActionResult<QuranAssetEvaluationDto>> GetLatestEvaluation(int studentId, int ringId)
    {
        var result = await _service.GetLatestEvaluationAsync(studentId, ringId);
        return result is null ? NotFound() : Ok(result);
    }

    [HttpGet("interviews/coach")]
    public async Task<ActionResult<List<CoachInterviewDto>>> GetCoachInterviews([FromQuery] InterviewFilterDto? filter)
    {
        return Ok(await _service.GetCoachInterviewsAsync(filter));
    }

    [HttpGet("interviews/coach/{id}")]
    public async Task<ActionResult<CoachInterviewDto>> GetCoachInterviewById(int id)
    {
        var result = await _service.GetCoachInterviewByIdAsync(id);
        return result is null ? NotFound() : Ok(result);
    }

    [HttpPost("interviews/coach")]
    public async Task<ActionResult<CoachInterviewDto>> CreateCoachInterview([FromBody] CreateCoachInterviewRequest request)
    {
        return Ok(await _service.CreateCoachInterviewAsync(request));
    }

    [HttpGet("interviews/student")]
    public async Task<ActionResult<List<StudentInterviewDto>>> GetStudentInterviews([FromQuery] InterviewFilterDto? filter)
    {
        return Ok(await _service.GetStudentInterviewsAsync(filter));
    }

    [HttpGet("interviews/student/{id}")]
    public async Task<ActionResult<StudentInterviewDto>> GetStudentInterviewById(int id)
    {
        var result = await _service.GetStudentInterviewByIdAsync(id);
        return result is null ? NotFound() : Ok(result);
    }

    [HttpPost("interviews/student")]
    public async Task<ActionResult<StudentInterviewDto>> CreateStudentInterview([FromBody] CreateStudentInterviewRequest request)
    {
        return Ok(await _service.CreateStudentInterviewAsync(request));
    }

    [HttpGet("{ringId}/surahs")]
    public async Task<ActionResult<List<QuranRingSurahDto>>> GetRingSurahs(int ringId)
    {
        return Ok(await _service.GetRingSurahsAsync(ringId));
    }

    [HttpPost("surahs")]
    public async Task<ActionResult<QuranRingSurahDto>> CreateRingSurah([FromBody] CreateQuranRingSurahRequest request)
    {
        return Ok(await _service.CreateRingSurahAsync(request));
    }

    [HttpDelete("surahs/{id}")]
    public async Task<ActionResult> DeleteRingSurah(int id)
    {
        return await _service.DeleteRingSurahAsync(id) ? NoContent() : NotFound();
    }

    [HttpGet("{ringId}/resources")]
    public async Task<ActionResult<List<QuranRingResourceDto>>> GetRingResources(int ringId)
    {
        return Ok(await _service.GetRingResourcesAsync(ringId));
    }

    [HttpPost("resources")]
    public async Task<ActionResult<QuranRingResourceDto>> CreateRingResource([FromBody] CreateQuranRingResourceRequest request)
    {
        return Ok(await _service.CreateRingResourceAsync(request));
    }

    [HttpDelete("resources/{id}")]
    public async Task<ActionResult> DeleteRingResource(int id)
    {
        return await _service.DeleteRingResourceAsync(id) ? NoContent() : NotFound();
    }

    [HttpGet("dashboard")]
    public async Task<ActionResult<QuranRingDashboardDto>> GetDashboard([FromQuery] int? ringId = null)
    {
        return Ok(await _service.GetDashboardAsync(ringId));
    }
}
