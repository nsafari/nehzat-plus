using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;

namespace EducationalPlatform.Nehzat.API.Controllers;

[ApiController]
[Route("api/phasetransition")]
[Authorize]
public class PhaseTransitionController : ControllerBase
{
    private readonly IPhaseTransitionService _phaseTransitionService;

    public PhaseTransitionController(IPhaseTransitionService phaseTransitionService)
    {
        _phaseTransitionService = phaseTransitionService;
    }

    [HttpGet("check")]
    public async Task<IActionResult> CheckPhase([FromQuery] int userId)
    {
        var result = await _phaseTransitionService.CheckAndTransitionAsync(userId);
        if (result is null) return NotFound(new { message = "دانش‌آموز یافت نشد" });
        return Ok(result);
    }

    [HttpPost("check-all")]
    public async Task<IActionResult> CheckAllPhases()
    {
        var transitions = await _phaseTransitionService.CheckAllAsync();
        return Ok(new { transitions, message = $"{transitions} تغییر فاز اعمال شد" });
    }
}
