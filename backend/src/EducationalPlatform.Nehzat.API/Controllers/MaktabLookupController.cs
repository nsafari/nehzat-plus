using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;

namespace EducationalPlatform.Nehzat.API.Controllers;

[ApiController]
[Route("api/maktab-lookup")]
[Authorize]
public class MaktabLookupController : ControllerBase
{
    private readonly IMaktabLookupService _maktabLookupService;

    public MaktabLookupController(IMaktabLookupService maktabLookupService)
    {
        _maktabLookupService = maktabLookupService;
    }

    [HttpGet]
    public async Task<IActionResult> DetermineMaktab([FromQuery] DateTime birthDate, [FromQuery] string gender)
    {
        try
        {
            var result = await _maktabLookupService.DetermineMaktabAsync(birthDate, gender);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpGet("all")]
    public async Task<IActionResult> GetAllLookups()
    {
        var result = await _maktabLookupService.GetAllLookupsAsync();
        return Ok(result);
    }
}
