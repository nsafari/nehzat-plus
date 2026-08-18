using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Application.Constants;
using EducationalPlatform.Nehzat.Application.Exceptions;

namespace EducationalPlatform.Nehzat.API.Controllers;

[ApiController]
[Authorize]
[Route("api/halgheh-assignment-submissions")]
public class HalghehAssignmentSubmissionController : ControllerBase
{
    private readonly IHalghehAssignmentService _service;

    public HalghehAssignmentSubmissionController(IHalghehAssignmentService service) => _service = service;

    [HttpPut("{id:int}/review")]
    public async Task<IActionResult> Review(int id, [FromBody] ReviewHalghehAssignmentSubmissionDto dto)
    {
        try
        {
            var result = await _service.ReviewAsync(id, dto);
            return result == null ? NotFound(GenericErrorMessages.NotFound) : Ok(result);
        }
        catch (KeyNotFoundException)
        {
            return NotFound(GenericErrorMessages.NotFound);
        }
        catch (UnauthorizedAccessException)
        {
            throw new ForbiddenException(GenericErrorMessages.Forbidden);
        }
    }
}