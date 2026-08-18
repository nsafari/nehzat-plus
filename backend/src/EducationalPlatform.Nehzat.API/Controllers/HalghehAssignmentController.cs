using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Application.Constants;
using EducationalPlatform.Nehzat.Application.Exceptions;

namespace EducationalPlatform.Nehzat.API.Controllers;

[ApiController]
[Route("api/halghehs/{halghehId}/assignments")]
[Authorize]
public class HalghehAssignmentController : ControllerBase
{
    private readonly IHalghehAssignmentService _service;

    public HalghehAssignmentController(IHalghehAssignmentService service) => _service = service;

    [HttpGet]
    public async Task<IActionResult> GetList(int halghehId, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var result = await _service.GetByHalghehAsync(halghehId, page, pageSize);
        // Note: MySubmissionStatus won't be populated correctly for list without userId
        // We'll handle this by passing UserId through a modified service method if needed
        return Ok(result);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int halghehId, int id)
    {
        var result = await _service.GetByIdAsync(halghehId, id);
        return result == null ? NotFound() : Ok(result);
    }

[HttpPost]
        public async Task<IActionResult> Create(int halghehId, [FromBody] CreateHalghehAssignmentDto dto)
        {
            try
            {
                var result = await _service.CreateAsync(halghehId, dto);
                return Ok(result);
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

[HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int halghehId, int id, [FromBody] UpdateHalghehAssignmentDto dto)
        {
            try
            {
                var result = await _service.UpdateAsync(halghehId, id, dto);
                return result == null ? NotFound() : Ok(result);
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

[HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int halghehId, int id)
        {
            try
            {
                await _service.DeleteAsync(halghehId, id);
                return NoContent();
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

[HttpGet("{id:int}/submissions")]
        public async Task<IActionResult> GetSubmissions(int halghehId, int id)
        {
            try
            {
                var result = await _service.GetSubmissionsAsync(halghehId, id);
                return Ok(result);
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

[HttpPost("{id:int}/submit")]
        public async Task<IActionResult> Submit(int halghehId, int id, [FromBody] SubmitHalghehAssignmentDto dto)
        {
            try
            {
                var result = await _service.SubmitAsync(halghehId, id, dto);
                return result == null ? NotFound() : Ok(result);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(GenericErrorMessages.NotFound);
            }
            catch (InvalidOperationException)
            {
                return BadRequest(GenericErrorMessages.BadRequest);
            }
            catch (UnauthorizedAccessException)
            {
                throw new ForbiddenException(GenericErrorMessages.Forbidden);
            }
        }
}