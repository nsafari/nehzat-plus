using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.API.Helpers;
using EducationalPlatform.Nehzat.Application.Constants;
using EducationalPlatform.Nehzat.Application.Exceptions;

namespace EducationalPlatform.Nehzat.API.Controllers;

[ApiController]
[Route("api/training")]
[Authorize]
public class TrainingController : ControllerBase
{
    private readonly ITrainingService _trainingService;

    public TrainingController(ITrainingService trainingService)
    {
        _trainingService = trainingService;
    }

    [HttpGet("courses")]
    public async Task<IActionResult> GetAllCourses()
    {
        return Ok(await _trainingService.GetAllCoursesAsync());
    }

    [HttpGet("courses/{id}")]
    public async Task<IActionResult> GetCourseById(int id)
    {
        var course = await _trainingService.GetCourseByIdAsync(id);
        if (course == null) return NotFound();
        return Ok(course);
    }

    [HttpPost("courses")]
    [Authorize(Roles = "admin,manager,headquarters")]
    public async Task<IActionResult> CreateCourse([FromBody] CreateTrainingCourseDto dto)
    {
        var course = await _trainingService.CreateCourseAsync(dto);
        return CreatedAtAction(nameof(GetCourseById), new { id = course.Id }, course);
    }

[HttpPut("courses/{id}")]
        [Authorize(Roles = "admin,manager,headquarters")]
        public async Task<IActionResult> UpdateCourse(int id, [FromBody] UpdateTrainingCourseDto dto)
        {
            try
            {
                return Ok(await _trainingService.UpdateCourseAsync(id, dto));
            }
            catch (KeyNotFoundException)
            {
                return NotFound(GenericErrorMessages.NotFound);
            }
        }

    [HttpDelete("courses/{id}")]
    [Authorize(Roles = "admin,manager,headquarters")]
    public async Task<IActionResult> DeleteCourse(int id)
    {
        await _trainingService.DeleteCourseAsync(id);
        return NoContent();
    }

    [HttpGet("courses/search")]
    public async Task<IActionResult> SearchCourses([FromQuery] string q, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        return Ok(await _trainingService.SearchCoursesAsync(q, page, pageSize));
    }

    [HttpGet("courses/filter/status")]
    public async Task<IActionResult> FilterCoursesByStatus([FromQuery] string status)
    {
        return Ok(await _trainingService.FilterCoursesByStatusAsync(status));
    }

    [HttpGet("courses/filter/year")]
    public async Task<IActionResult> FilterCoursesByYear([FromQuery] string academicYear)
    {
        return Ok(await _trainingService.FilterCoursesByYearAsync(academicYear));
    }

    [HttpGet("courses/{courseId}/stages")]
    public async Task<IActionResult> GetStagesByCourseId(int courseId)
    {
        return Ok(await _trainingService.GetStagesByCourseIdAsync(courseId));
    }

    [HttpPost("courses/{courseId}/stages")]
    [Authorize(Roles = "admin,manager,headquarters")]
    public async Task<IActionResult> CreateStage(int courseId, [FromBody] CreateTrainingStageDto dto)
    {
        var stage = await _trainingService.CreateStageAsync(courseId, dto);
        return CreatedAtAction(nameof(GetStagesByCourseId), new { courseId }, stage);
    }

    [HttpGet("stages/{id}")]
    public async Task<IActionResult> GetStageById(int id)
    {
        var stage = await _trainingService.GetStageByIdAsync(id);
        if (stage == null) return NotFound();
        return Ok(stage);
    }

[HttpPut("stages/{id}")]
        [Authorize(Roles = "admin,manager,headquarters")]
        public async Task<IActionResult> UpdateStage(int id, [FromBody] CreateTrainingStageDto dto)
        {
            try
            {
                return Ok(await _trainingService.UpdateStageAsync(id, dto));
            }
            catch (KeyNotFoundException)
            {
                return NotFound(GenericErrorMessages.NotFound);
            }
        }

    [HttpDelete("stages/{id}")]
    [Authorize(Roles = "admin,manager,headquarters")]
    public async Task<IActionResult> DeleteStage(int id)
    {
        await _trainingService.DeleteStageAsync(id);
        return NoContent();
    }

    [HttpGet("stages/{stageId}/sessions")]
    public async Task<IActionResult> GetSessionsByStageId(int stageId)
    {
        return Ok(await _trainingService.GetSessionsByStageIdAsync(stageId));
    }

    [HttpPost("stages/{stageId}/sessions")]
    [Authorize(Roles = "admin,manager,headquarters,coach")]
    public async Task<IActionResult> CreateSession(int stageId, [FromBody] CreateTrainingSessionDto dto)
    {
        var session = await _trainingService.CreateSessionAsync(stageId, dto);
        return CreatedAtAction(nameof(GetSessionsByStageId), new { stageId }, session);
    }

    [HttpGet("sessions/{id}")]
    public async Task<IActionResult> GetSessionById(int id)
    {
        var session = await _trainingService.GetSessionByIdAsync(id);
        if (session == null) return NotFound();
        return Ok(session);
    }

[HttpPut("sessions/{id}")]
        [Authorize(Roles = "admin,manager,headquarters,coach")]
        public async Task<IActionResult> UpdateSession(int id, [FromBody] CreateTrainingSessionDto dto)
        {
            try
            {
                return Ok(await _trainingService.UpdateSessionAsync(id, dto));
            }
            catch (KeyNotFoundException)
            {
                return NotFound(GenericErrorMessages.NotFound);
            }
        }

    [HttpDelete("sessions/{id}")]
    [Authorize(Roles = "admin,manager,headquarters,coach")]
    public async Task<IActionResult> DeleteSession(int id)
    {
        await _trainingService.DeleteSessionAsync(id);
        return NoContent();
    }

    [HttpGet("sessions/{sessionId}/contents")]
    public async Task<IActionResult> GetContentsBySessionId(int sessionId)
    {
        return Ok(await _trainingService.GetContentsBySessionIdAsync(sessionId));
    }

    [HttpGet("sessions/{sessionId}/progress")]
    public async Task<IActionResult> GetProgressBySessionId(int sessionId)
    {
        return Ok(await _trainingService.GetProgressBySessionIdAsync(sessionId));
    }

    [HttpPost("sessions/{sessionId}/contents")]
    [Authorize(Roles = "admin,manager,headquarters,coach")]
    public async Task<IActionResult> CreateContent(int sessionId, [FromBody] CreateTrainingContentDto dto)
    {
        var content = await _trainingService.CreateContentAsync(sessionId, dto);
        return CreatedAtAction(nameof(GetContentsBySessionId), new { sessionId }, content);
    }

    [HttpGet("contents/{id}")]
    public async Task<IActionResult> GetContentById(int id)
    {
        var content = await _trainingService.GetContentByIdAsync(id);
        if (content == null) return NotFound();
        return Ok(content);
    }

[HttpPut("contents/{id}")]
        [Authorize(Roles = "admin,manager,headquarters,coach")]
        public async Task<IActionResult> UpdateContent(int id, [FromBody] CreateTrainingContentDto dto)
        {
            try
            {
                return Ok(await _trainingService.UpdateContentAsync(id, dto));
            }
            catch (KeyNotFoundException)
            {
                return NotFound(GenericErrorMessages.NotFound);
            }
        }

    [HttpDelete("contents/{id}")]
    [Authorize(Roles = "admin,manager,headquarters,coach")]
    public async Task<IActionResult> DeleteContent(int id)
    {
        await _trainingService.DeleteContentAsync(id);
        return NoContent();
    }

    [HttpPost("sessions/{sessionId}/upload")]
    [Authorize(Roles = "admin,manager,headquarters,coach")]
    public async Task<IActionResult> UploadContent(int sessionId, IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest(new { message = "فایل آپلود نشده است" });

        if (!FileUploadValidator.IsValidFile(file, out var validationError))
            return BadRequest(new { message = validationError });

        using var stream = file.OpenReadStream();
        var content = await _trainingService.ProcessUploadedFileAsync(sessionId, stream, file.FileName);
        return CreatedAtAction(nameof(GetContentById), new { id = content.Id }, content);
    }

[HttpPost("enrollments")]
        public async Task<IActionResult> CreateEnrollment([FromBody] CreateTrainingEnrollmentDto dto)
        {
            try
            {
                var enrollment = await _trainingService.CreateEnrollmentAsync(dto);
                return CreatedAtAction(nameof(GetEnrollmentById), new { id = enrollment.Id }, enrollment);
            }
            catch (InvalidOperationException)
            {
                return BadRequest(GenericErrorMessages.BadRequest);
            }
        }

    [HttpGet("enrollments/{id}")]
    public async Task<IActionResult> GetEnrollmentById(int id)
    {
        var enrollment = await _trainingService.GetEnrollmentByIdAsync(id);
        if (enrollment == null) return NotFound();
        return Ok(enrollment);
    }

    [HttpGet("courses/{courseId}/enrollments")]
    public async Task<IActionResult> GetEnrollmentsByCourseId(int courseId)
    {
        return Ok(await _trainingService.GetEnrollmentsByCourseIdAsync(courseId));
    }

    [HttpGet("users/{userId}/enrollments")]
    public async Task<IActionResult> GetEnrollmentsByUserId(int userId)
    {
        return Ok(await _trainingService.GetEnrollmentsByUserIdAsync(userId));
    }

[HttpPut("enrollments/{id}/status")]
        [Authorize(Roles = "admin,manager,headquarters")]
        public async Task<IActionResult> UpdateEnrollmentStatus(int id, [FromBody] string status)
        {
            try
            {
                return Ok(await _trainingService.UpdateEnrollmentStatusAsync(id, status));
            }
            catch (KeyNotFoundException)
            {
                return NotFound(GenericErrorMessages.NotFound);
            }
        }

    [HttpDelete("enrollments/{id}")]
    [Authorize(Roles = "admin,manager,headquarters")]
    public async Task<IActionResult> DeleteEnrollment(int id)
    {
        await _trainingService.DeleteEnrollmentAsync(id);
        return NoContent();
    }

    [HttpPut("enrollments/{enrollmentId}/sessions/{sessionId}/progress")]
    public async Task<IActionResult> UpdateProgress(int enrollmentId, int sessionId, [FromBody] UpdateTrainingProgressDto dto)
    {
        return Ok(await _trainingService.UpdateProgressAsync(enrollmentId, sessionId, dto));
    }

    [HttpGet("enrollments/{enrollmentId}/progress")]
    public async Task<IActionResult> GetProgressByEnrollmentId(int enrollmentId)
    {
        return Ok(await _trainingService.GetProgressByEnrollmentIdAsync(enrollmentId));
    }

    [HttpGet("sessions/{sessionId}/assignments")]
    public async Task<IActionResult> GetAssignmentsBySessionId(int sessionId)
    {
        return Ok(await _trainingService.GetAssignmentsBySessionIdAsync(sessionId));
    }

    [HttpPost("sessions/{sessionId}/assignments")]
    [Authorize(Roles = "admin,manager,headquarters,coach")]
    public async Task<IActionResult> CreateAssignment(int sessionId, [FromBody] CreateTrainingAssignmentDto dto)
    {
        var assignment = await _trainingService.CreateAssignmentAsync(sessionId, dto);
        return CreatedAtAction(nameof(GetAssignmentsBySessionId), new { sessionId }, assignment);
    }

    [HttpGet("assignments/{id}")]
    public async Task<IActionResult> GetAssignmentById(int id)
    {
        var assignment = await _trainingService.GetAssignmentByIdAsync(id);
        if (assignment == null) return NotFound();
        return Ok(assignment);
    }

[HttpPut("assignments/{id}")]
        [Authorize(Roles = "admin,manager,headquarters,coach")]
        public async Task<IActionResult> UpdateAssignment(int id, [FromBody] CreateTrainingAssignmentDto dto)
        {
            try
            {
                return Ok(await _trainingService.UpdateAssignmentAsync(id, dto));
            }
            catch (KeyNotFoundException)
            {
                return NotFound(GenericErrorMessages.NotFound);
            }
        }

    [HttpDelete("assignments/{id}")]
    [Authorize(Roles = "admin,manager,headquarters,coach")]
    public async Task<IActionResult> DeleteAssignment(int id)
    {
        await _trainingService.DeleteAssignmentAsync(id);
        return NoContent();
    }

    [HttpPost("assignments/{assignmentId}/submissions")]
    public async Task<IActionResult> CreateSubmission(int assignmentId, [FromBody] CreateTrainingSubmissionDto dto)
    {
        if (!int.TryParse(User.FindFirst("userId")?.Value, out var userId))
            return Unauthorized();
        var submission = await _trainingService.CreateSubmissionAsync(assignmentId, userId, dto);
        return CreatedAtAction(nameof(GetSubmissionsByAssignmentId), new { assignmentId }, submission);
    }

    [HttpGet("assignments/{assignmentId}/submissions")]
    [Authorize(Roles = "admin,manager,headquarters,coach")]
    public async Task<IActionResult> GetSubmissionsByAssignmentId(int assignmentId)
    {
        return Ok(await _trainingService.GetSubmissionsByAssignmentIdAsync(assignmentId));
    }

    [HttpGet("submissions/{id}")]
    public async Task<IActionResult> GetSubmissionById(int id)
    {
        var submission = await _trainingService.GetSubmissionByIdAsync(id);
        if (submission == null) return NotFound();
        return Ok(submission);
    }

[HttpPut("submissions/{id}/grade")]
        [Authorize(Roles = "admin,manager,headquarters,coach")]
        public async Task<IActionResult> GradeSubmission(int id, [FromBody] GradeSubmissionDto dto)
        {
            try
            {
                return Ok(await _trainingService.GradeSubmissionAsync(id, dto.Grade, dto.Feedback));
            }
            catch (KeyNotFoundException)
            {
                return NotFound(GenericErrorMessages.NotFound);
            }
        }

    [HttpGet("statistics")]
    [Authorize(Roles = "admin,manager,headquarters")]
    public async Task<IActionResult> GetStatistics()
    {
        return Ok(await _trainingService.GetStatisticsAsync());
    }

[HttpGet("courses/{courseId}/statistics")]
        [Authorize(Roles = "admin,manager,headquarters")]
        public async Task<IActionResult> GetCourseStatistics(int courseId)
        {
            try
            {
                return Ok(await _trainingService.GetCourseStatisticsAsync(courseId));
            }
            catch (KeyNotFoundException)
            {
                return NotFound(GenericErrorMessages.NotFound);
            }
        }
}

public record GradeSubmissionDto(decimal Grade, string? Feedback);
