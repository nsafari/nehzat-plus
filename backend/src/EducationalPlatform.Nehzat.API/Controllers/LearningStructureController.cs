using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Application.Constants;

namespace EducationalPlatform.Nehzat.API.Controllers
{
    [ApiController]
    [Route("api/learning")]
    [Authorize]
    public class LearningStructureController : ControllerBase
    {
        private readonly ILearningService _service;

        public LearningStructureController(ILearningService service)
        {
            _service = service;
        }

        // ========== LearningPath endpoints ==========

        [HttpGet("paths")]
        public async Task<IActionResult> GetAllPaths()
        {
            return Ok(await _service.GetAllPathsAsync());
        }

        [HttpGet("paths/{id}")]
        public async Task<IActionResult> GetPathById(int id)
        {
            var result = await _service.FindPathByIdAsync(id);
            if (result == null) return NotFound(new { message = GenericErrorMessages.NotFound });
            return Ok(result);
        }

        [HttpPost("paths")]
        public async Task<IActionResult> CreatePath([FromBody] CreateLearningPathRequest request)
        {
            var result = await _service.CreatePathAsync(request);
            return Ok(result);
        }

        [HttpPut("paths/{id}")]
        public async Task<IActionResult> UpdatePath(int id, [FromBody] UpdateLearningPathRequest request)
        {
            try
            {
                var result = await _service.UpdatePathAsync(id, request);
                return Ok(result);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { message = GenericErrorMessages.NotFound });
            }
        }

        [HttpDelete("paths/{id}")]
        public async Task<IActionResult> DeletePath(int id)
        {
            try
            {
                await _service.DeletePathAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { message = GenericErrorMessages.NotFound });
            }
        }

        [HttpGet("paths/{id}/tree")]
        public async Task<IActionResult> GetPathTree(int id)
        {
            try
            {
                var result = await _service.GetPathTreeAsync(id);
                return Ok(result);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { message = GenericErrorMessages.NotFound });
            }
        }

        // ========== LearningLevel endpoints ==========

        [HttpGet("paths/{pathId}/levels")]
        public async Task<IActionResult> GetLevels(int pathId)
        {
            return Ok(await _service.GetLevelsAsync(pathId));
        }

        [HttpGet("levels/{id}")]
        public async Task<IActionResult> GetLevelById(int id)
        {
            var result = await _service.FindLevelByIdAsync(id);
            if (result == null) return NotFound(new { message = GenericErrorMessages.NotFound });
            return Ok(result);
        }

        [HttpPost("levels")]
        public async Task<IActionResult> CreateLevel([FromBody] CreateLearningLevelRequest request)
        {
            try
            {
                var result = await _service.CreateLevelAsync(request);
                return Ok(result);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { message = GenericErrorMessages.NotFound });
            }
        }

        [HttpPut("levels/{id}")]
        public async Task<IActionResult> UpdateLevel(int id, [FromBody] UpdateLearningLevelRequest request)
        {
            try
            {
                var result = await _service.UpdateLevelAsync(id, request);
                return Ok(result);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { message = GenericErrorMessages.NotFound });
            }
        }

        [HttpDelete("levels/{id}")]
        public async Task<IActionResult> DeleteLevel(int id)
        {
            try
            {
                await _service.DeleteLevelAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { message = GenericErrorMessages.NotFound });
            }
        }

        // ========== StudyModule endpoints ==========

        [HttpGet("levels/{levelId}/modules")]
        public async Task<IActionResult> GetModules(int levelId)
        {
            return Ok(await _service.GetModulesAsync(levelId));
        }

        [HttpGet("modules/{id}")]
        public async Task<IActionResult> GetModuleById(int id)
        {
            var result = await _service.FindModuleByIdAsync(id);
            if (result == null) return NotFound(new { message = GenericErrorMessages.NotFound });
            return Ok(result);
        }

        [HttpPost("modules")]
        public async Task<IActionResult> CreateModule([FromBody] CreateStudyModuleRequest request)
        {
            try
            {
                var result = await _service.CreateModuleAsync(request);
                return Ok(result);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { message = GenericErrorMessages.NotFound });
            }
        }

        [HttpPut("modules/{id}")]
        public async Task<IActionResult> UpdateModule(int id, [FromBody] UpdateStudyModuleRequest request)
        {
            try
            {
                var result = await _service.UpdateModuleAsync(id, request);
                return Ok(result);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { message = GenericErrorMessages.NotFound });
            }
        }

        [HttpDelete("modules/{id}")]
        public async Task<IActionResult> DeleteModule(int id)
        {
            try
            {
                await _service.DeleteModuleAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { message = GenericErrorMessages.NotFound });
            }
        }

        // ========== StudyLesson endpoints ==========

        [HttpGet("modules/{moduleId}/lessons")]
        public async Task<IActionResult> GetLessons(int moduleId)
        {
            return Ok(await _service.GetLessonsAsync(moduleId));
        }

        [HttpGet("lessons/{id}")]
        public async Task<IActionResult> GetLessonById(int id)
        {
            var result = await _service.FindLessonByIdAsync(id);
            if (result == null) return NotFound(new { message = GenericErrorMessages.NotFound });
            return Ok(result);
        }

        [HttpPost("lessons")]
        public async Task<IActionResult> CreateLesson([FromBody] CreateStudyLessonRequest request)
        {
            try
            {
                var result = await _service.CreateLessonAsync(request);
                return Ok(result);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { message = GenericErrorMessages.NotFound });
            }
        }

        [HttpPut("lessons/{id}")]
        public async Task<IActionResult> UpdateLesson(int id, [FromBody] UpdateStudyLessonRequest request)
        {
            try
            {
                var result = await _service.UpdateLessonAsync(id, request);
                return Ok(result);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { message = GenericErrorMessages.NotFound });
            }
        }

        [HttpDelete("lessons/{id}")]
        public async Task<IActionResult> DeleteLesson(int id)
        {
            try
            {
                await _service.DeleteLessonAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { message = GenericErrorMessages.NotFound });
            }
        }

        // ========== ContentBlock endpoints ==========

        [HttpGet("lessons/{lessonId}/content-blocks")]
        public async Task<IActionResult> GetContentBlocks(int lessonId)
        {
            return Ok(await _service.GetContentBlocksAsync(lessonId));
        }

        [HttpPost("content-blocks")]
        public async Task<IActionResult> CreateContentBlock([FromBody] CreateContentBlockRequest request)
        {
            try
            {
                var result = await _service.CreateContentBlockAsync(request);
                return Ok(result);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { message = GenericErrorMessages.NotFound });
            }
        }

        [HttpPut("content-blocks/{id}")]
        public async Task<IActionResult> UpdateContentBlock(int id, [FromBody] UpdateContentBlockRequest request)
        {
            try
            {
                var result = await _service.UpdateContentBlockAsync(id, request);
                return Ok(result);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { message = GenericErrorMessages.NotFound });
            }
        }

        [HttpDelete("content-blocks/{id}")]
        public async Task<IActionResult> DeleteContentBlock(int id)
        {
            try
            {
                await _service.DeleteContentBlockAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { message = GenericErrorMessages.NotFound });
            }
        }
    }
}
