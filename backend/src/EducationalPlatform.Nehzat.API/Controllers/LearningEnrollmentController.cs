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
    public class LearningEnrollmentController : ControllerBase
    {
        private readonly ILearningService _service;

        public LearningEnrollmentController(ILearningService service)
        {
            _service = service;
        }

        // ========== Enrollment endpoints ==========

        [HttpPost("enroll")]
        public async Task<IActionResult> EnrollUser([FromBody] EnrollUserRequest request)
        {
            try
            {
                var result = await _service.EnrollUserAsync(request);
                return Ok(result);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { message = GenericErrorMessages.NotFound });
            }
            catch (InvalidOperationException)
            {
                return Conflict(new { message = GenericErrorMessages.Conflict });
            }
        }

        [HttpGet("enrollments")]
        public async Task<IActionResult> GetEnrollments([FromQuery] int? userId)
        {
            if (userId.HasValue)
                return Ok(await _service.GetUserEnrollmentsAsync(userId.Value));

            // If no userId query param, try to get from claims
            var claimUserId = User.FindFirst("userId")?.Value;
            if (!string.IsNullOrEmpty(claimUserId) && int.TryParse(claimUserId, out var uid))
                return Ok(await _service.GetUserEnrollmentsAsync(uid));

            return BadRequest(new { message = GenericErrorMessages.BadRequest });
        }

        [HttpGet("enrollments/{userId}")]
        public async Task<IActionResult> GetUserEnrollments(int userId)
        {
            return Ok(await _service.GetUserEnrollmentsAsync(userId));
        }

        [HttpPut("enrollments/{id}/status")]
        public async Task<IActionResult> UpdateEnrollmentStatus(int id, [FromQuery] string status)
        {
            try
            {
                var result = await _service.UpdateEnrollmentStatusAsync(id, status);
                return Ok(result);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { message = GenericErrorMessages.NotFound });
            }
        }

        // ========== Lesson Progress endpoints ==========

        [HttpPost("lessons/{lessonId}/complete")]
        public async Task<IActionResult> CompleteLesson(int lessonId, [FromQuery] int enrollmentId)
        {
            try
            {
                var result = await _service.CompleteLessonAsync(enrollmentId, lessonId);
                return Ok(result);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { message = GenericErrorMessages.NotFound });
            }
        }

        [HttpPatch("progress/{lessonId}")]
        public async Task<IActionResult> UpdateLessonProgress(int lessonId, [FromBody] UpdateLessonProgressRequest request)
        {
            try
            {
                var result = await _service.UpdateLessonProgressAsync(request.EnrollmentId, lessonId, request.Status, request.Score);
                return Ok(result);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { message = GenericErrorMessages.NotFound });
            }
        }

        [HttpPut("lessons/{lessonId}/progress")]
        public async Task<IActionResult> UpdateLessonProgressLegacy(int lessonId, [FromQuery] int enrollmentId, [FromQuery] string status, [FromQuery] int? score = null)
        {
            try
            {
                var result = await _service.UpdateLessonProgressAsync(enrollmentId, lessonId, status, score);
                return Ok(result);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { message = GenericErrorMessages.NotFound });
            }
        }

        // ========== Quiz Submission ==========

        [HttpPost("quiz/submit")]
        public async Task<IActionResult> SubmitQuiz([FromBody] SubmitQuizRequest request)
        {
            try
            {
                var result = await _service.SubmitQuizAsync(request);
                return Ok(result);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { message = GenericErrorMessages.NotFound });
            }
            catch (InvalidOperationException)
            {
                return BadRequest(new { message = GenericErrorMessages.BadRequest });
            }
        }

        [HttpGet("quiz-attempts/{enrollmentId}")]
        public async Task<IActionResult> GetQuizAttempts(int enrollmentId)
        {
            // Get userId from enrollment or claims
            var claimUserId = User.FindFirst("userId")?.Value;
            if (!string.IsNullOrEmpty(claimUserId) && int.TryParse(claimUserId, out var userId))
            {
                // We need quizId too - but frontend only sends enrollmentId
                // This endpoint needs review -暂时返回空列表
                return Ok(new List<object>());
            }
            return BadRequest(new { message = GenericErrorMessages.BadRequest });
        }

        [HttpGet("users/{userId}/quizzes/{quizId}/attempts")]
        public async Task<IActionResult> GetUserQuizAttempts(int userId, int quizId)
        {
            return Ok(await _service.GetUserQuizAttemptsAsync(userId, quizId));
        }

        // ========== Dashboard ==========

        [HttpGet("dashboard/{userId}/{pathId}")]
        public async Task<IActionResult> GetUserDashboard(int userId, int pathId)
        {
            return Ok(await _service.GetUserDashboardAsync(userId));
        }

        [HttpGet("dashboard/stats")]
        public async Task<IActionResult> GetDashboardStats()
        {
            var claimUserId = User.FindFirst("userId")?.Value;
            if (!string.IsNullOrEmpty(claimUserId) && int.TryParse(claimUserId, out var userId))
            {
                return Ok(await _service.GetUserDashboardAsync(userId));
            }
            return BadRequest(new { message = GenericErrorMessages.BadRequest });
        }

        [HttpGet("users/{userId}/dashboard")]
        public async Task<IActionResult> GetUserDashboardLegacy(int userId)
        {
            return Ok(await _service.GetUserDashboardAsync(userId));
        }
    }
}

/// <summary>
/// Request DTO for PATCH lesson progress (frontend format)
/// </summary>
public class UpdateLessonProgressRequest
{
    public int EnrollmentId { get; set; }
    public string Status { get; set; } = string.Empty;
    public int? Score { get; set; }
}
