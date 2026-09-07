using EducationalPlatform.Nehzat.Application.Constants;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;

namespace EducationalPlatform.Nehzat.API.Controllers
{
    [ApiController]
    [Route("api/persian-literature")]
    [Authorize]
    public class PersianLiteratureController : ControllerBase
    {
        private readonly IPersianLiteratureService _service;

        public PersianLiteratureController(IPersianLiteratureService service)
        {
            _service = service;
        }

        // ========== Poet endpoints ==========

        [HttpGet("poets")]
        public async Task<IActionResult> GetAllPoets([FromQuery] string? difficulty = null)
        {
            return Ok(await _service.GetAllPoetsAsync(difficulty));
        }

        [HttpGet("poets/{id}")]
        public async Task<IActionResult> GetPoetById(int id)
        {
            var result = await _service.FindPoetByIdAsync(id);
            if (result == null) return NotFound(new { message = "شاعر یافت نشد." });
            return Ok(result);
        }

        [HttpPost("poets")]
        public async Task<IActionResult> CreatePoet([FromBody] CreatePoetRequest request)
        {
            try
            {
                var result = await _service.CreatePoetAsync(request);
                return Ok(result);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(GenericErrorMessages.Conflict);
            }
        }

        [HttpPut("poets/{id}")]
        public async Task<IActionResult> UpdatePoet(int id, [FromBody] UpdatePoetRequest request)
        {
            try
            {
                var result = await _service.UpdatePoetAsync(id, request);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(GenericErrorMessages.NotFound);
            }
        }

        [HttpDelete("poets/{id}")]
        public async Task<IActionResult> DeletePoet(int id)
        {
            try
            {
                await _service.DeletePoetAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(GenericErrorMessages.NotFound);
            }
        }

        [HttpGet("poets/search")]
        public async Task<IActionResult> SearchPoets([FromQuery] string q, [FromQuery] int max = 20)
        {
            var results = await _service.SearchPoetsAsync(q, max);
            return Ok(results);
        }

        // ========== Poem endpoints ==========

        [HttpGet("poems")]
        public async Task<IActionResult> GetAllPoems([FromQuery] int? poetId = null, [FromQuery] string? genre = null, [FromQuery] string? difficulty = null)
        {
            return Ok(await _service.GetAllPoemsAsync(poetId, genre, difficulty));
        }

        [HttpGet("poems/{id}")]
        public async Task<IActionResult> GetPoemById(int id)
        {
            var result = await _service.FindPoemByIdAsync(id);
            if (result == null) return NotFound(new { message = "شعر یافت نشد." });
            return Ok(result);
        }

        [HttpPost("poems")]
        public async Task<IActionResult> CreatePoem([FromBody] CreatePoemRequest request)
        {
            try
            {
                var result = await _service.CreatePoemAsync(request);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(GenericErrorMessages.NotFound);
            }
        }

        [HttpPut("poems/{id}")]
        public async Task<IActionResult> UpdatePoem(int id, [FromBody] UpdatePoemRequest request)
        {
            try
            {
                var result = await _service.UpdatePoemAsync(id, request);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(GenericErrorMessages.NotFound);
            }
        }

        [HttpDelete("poems/{id}")]
        public async Task<IActionResult> DeletePoem(int id)
        {
            try
            {
                await _service.DeletePoemAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(GenericErrorMessages.NotFound);
            }
        }

        [HttpGet("poems/search")]
        public async Task<IActionResult> SearchPoems([FromQuery] string q, [FromQuery] int max = 20)
        {
            var results = await _service.SearchPoemsAsync(q, max);
            return Ok(results);
        }

        // ========== Analysis endpoints ==========

        [HttpGet("poems/{poemId}/analyses")]
        public async Task<IActionResult> GetAnalysesByPoem(int poemId)
        {
            return Ok(await _service.GetAnalysesByPoemAsync(poemId));
        }

        [HttpGet("analyses/{id}")]
        public async Task<IActionResult> GetAnalysisById(int id)
        {
            var result = await _service.FindAnalysisByIdAsync(id);
            if (result == null) return NotFound(new { message = "تحلیل یافت نشد." });
            return Ok(result);
        }

        [HttpPost("analyses")]
        public async Task<IActionResult> CreateAnalysis([FromBody] CreateAnalysisRequest request)
        {
            try
            {
                var result = await _service.CreateAnalysisAsync(request);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(GenericErrorMessages.NotFound);
            }
        }

        [HttpPut("analyses/{id}")]
        public async Task<IActionResult> UpdateAnalysis(int id, [FromBody] UpdateAnalysisRequest request)
        {
            try
            {
                var result = await _service.UpdateAnalysisAsync(id, request);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(GenericErrorMessages.NotFound);
            }
        }

        [HttpDelete("analyses/{id}")]
        public async Task<IActionResult> DeleteAnalysis(int id)
        {
            try
            {
                await _service.DeleteAnalysisAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(GenericErrorMessages.NotFound);
            }
        }

        // ========== Dashboard ==========

        [HttpGet("dashboard-stats")]
        [AllowAnonymous]
        public async Task<IActionResult> GetDashboardStats()
        {
            var stats = await _service.GetDashboardStatsAsync();
            return Ok(stats);
        }
    }
}
