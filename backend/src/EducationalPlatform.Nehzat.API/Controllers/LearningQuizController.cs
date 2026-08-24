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
    public class LearningQuizController : ControllerBase
    {
        private readonly ILearningService _service;

        public LearningQuizController(ILearningService service)
        {
            _service = service;
        }

        // ========== Quiz endpoints ==========

        [HttpGet("lessons/{lessonId}/quizzes")]
        public async Task<IActionResult> GetQuizzes(int lessonId)
        {
            return Ok(await _service.GetQuizzesAsync(lessonId));
        }

        [HttpGet("quizzes/{id}")]
        public async Task<IActionResult> GetQuizById(int id)
        {
            var result = await _service.FindQuizByIdAsync(id);
            if (result == null) return NotFound(new { message = GenericErrorMessages.NotFound });
            return Ok(result);
        }

        [HttpPost("quizzes")]
        public async Task<IActionResult> CreateQuiz([FromBody] CreateLearningQuizRequest request)
        {
            try
            {
                var result = await _service.CreateQuizAsync(request);
                return Ok(result);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { message = GenericErrorMessages.NotFound });
            }
        }

        [HttpPut("quizzes/{id}")]
        public async Task<IActionResult> UpdateQuiz(int id, [FromBody] UpdateLearningQuizRequest request)
        {
            try
            {
                var result = await _service.UpdateQuizAsync(id, request);
                return Ok(result);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { message = GenericErrorMessages.NotFound });
            }
        }

        [HttpDelete("quizzes/{id}")]
        public async Task<IActionResult> DeleteQuiz(int id)
        {
            try
            {
                await _service.DeleteQuizAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { message = GenericErrorMessages.NotFound });
            }
        }

        // ========== QuizQuestion endpoints ==========

        [HttpGet("quizzes/{quizId}/questions")]
        public async Task<IActionResult> GetQuizQuestions(int quizId)
        {
            return Ok(await _service.GetQuizQuestionsAsync(quizId));
        }

        [HttpPost("quiz-questions")]
        public async Task<IActionResult> CreateQuestion([FromBody] CreateLearningQuizQuestionRequest request)
        {
            try
            {
                var result = await _service.CreateQuestionAsync(request);
                return Ok(result);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { message = GenericErrorMessages.NotFound });
            }
        }

        [HttpPut("quiz-questions/{id}")]
        public async Task<IActionResult> UpdateQuestion(int id, [FromBody] UpdateLearningQuizQuestionRequest request)
        {
            try
            {
                var result = await _service.UpdateQuestionAsync(id, request);
                return Ok(result);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { message = GenericErrorMessages.NotFound });
            }
        }

        [HttpDelete("quiz-questions/{id}")]
        public async Task<IActionResult> DeleteQuestion(int id)
        {
            try
            {
                await _service.DeleteQuestionAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { message = GenericErrorMessages.NotFound });
            }
        }

        // ========== QuizOption endpoints ==========

        [HttpPost("quiz-options")]
        public async Task<IActionResult> CreateOption([FromBody] CreateQuizOptionRequest request)
        {
            try
            {
                var result = await _service.CreateOptionAsync(request);
                return Ok(result);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { message = GenericErrorMessages.NotFound });
            }
        }

        [HttpPut("quiz-options/{id}")]
        public async Task<IActionResult> UpdateOption(int id, [FromBody] UpdateQuizOptionRequest request)
        {
            try
            {
                var result = await _service.UpdateOptionAsync(id, request);
                return Ok(result);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { message = GenericErrorMessages.NotFound });
            }
        }

        [HttpDelete("quiz-options/{id}")]
        public async Task<IActionResult> DeleteOption(int id)
        {
            try
            {
                await _service.DeleteOptionAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { message = GenericErrorMessages.NotFound });
            }
        }
    }
}
