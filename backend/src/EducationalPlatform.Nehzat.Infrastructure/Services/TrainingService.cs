using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using System.Text.Encodings.Web;
using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Domain.Entities;
using EducationalPlatform.Nehzat.Infrastructure.Data;

namespace EducationalPlatform.Nehzat.Infrastructure.Services;

public class TrainingService : ITrainingService
{
    private readonly AppDbContext _db;

    public TrainingService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<TrainingCourseResponseDto> CreateCourseAsync(CreateTrainingCourseDto dto)
    {
        var course = new TrainingCourse
        {
            Title = dto.Title,
            Slug = dto.Title.Replace(" ", "-").ToLower(),
            Description = dto.Description,
            AcademicYear = dto.AcademicYear,
            MaxEnrollment = dto.MaxEnrollment,
            StartDate = dto.StartDate,
            EndDate = dto.EndDate,
            Status = "Draft"
        };

        _db.TrainingCourses.Add(course);
        await _db.SaveChangesAsync();

        return MapToCourseResponse(course, 0, 0);
    }

    public async Task<List<TrainingCourseResponseDto>> GetAllCoursesAsync()
    {
        var courses = await _db.TrainingCourses
            .Include(c => c.Stages)
            .Include(c => c.Enrollments)
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync();

        return courses.Select(c => MapToCourseResponse(c, c.Stages.Count, c.Enrollments.Count)).ToList();
    }

    public async Task<TrainingCourseResponseDto?> GetCourseByIdAsync(int id)
    {
        var course = await _db.TrainingCourses
            .Include(c => c.Stages)
            .Include(c => c.Enrollments)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (course == null) return null;
        return MapToCourseResponse(course, course.Stages.Count, course.Enrollments.Count);
    }

    public async Task<TrainingCourseResponseDto> UpdateCourseAsync(int id, UpdateTrainingCourseDto dto)
    {
        var course = await _db.TrainingCourses.FindAsync(id)
            ?? throw new KeyNotFoundException("دوره یافت نشد");

        if (dto.Title != null) course.Title = dto.Title;
        if (dto.Description != null) course.Description = dto.Description;
        if (dto.Status != null) course.Status = dto.Status;
        if (dto.MaxEnrollment.HasValue) course.MaxEnrollment = dto.MaxEnrollment;
        if (dto.StartDate.HasValue) course.StartDate = dto.StartDate;
        if (dto.EndDate.HasValue) course.EndDate = dto.EndDate;
        course.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        var stagesCount = await _db.TrainingStages.CountAsync(s => s.CourseId == id);
        var enrollmentsCount = await _db.TrainingEnrollments.CountAsync(e => e.CourseId == id);
        return MapToCourseResponse(course, stagesCount, enrollmentsCount);
    }

    public async Task DeleteCourseAsync(int id)
    {
        var course = await _db.TrainingCourses.FindAsync(id)
            ?? throw new KeyNotFoundException("دوره یافت نشد");

        _db.TrainingCourses.Remove(course);
        await _db.SaveChangesAsync();
    }

    public async Task<TrainingSearchResultDto> SearchCoursesAsync(string query, int page = 1, int pageSize = 10)
    {
        var queryable = _db.TrainingCourses
            .Include(c => c.Stages)
            .Include(c => c.Enrollments)
            .Where(c => c.Title.Contains(query) || (c.Description != null && c.Description.Contains(query)));

        var totalCount = await queryable.CountAsync();
        var courses = await queryable
            .OrderByDescending(c => c.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new TrainingSearchResultDto(
            courses.Select(c => MapToCourseResponse(c, c.Stages.Count, c.Enrollments.Count)).ToList(),
            totalCount,
            page,
            pageSize
        );
    }

    public async Task<List<TrainingCourseResponseDto>> FilterCoursesByStatusAsync(string status)
    {
        var courses = await _db.TrainingCourses
            .Include(c => c.Stages)
            .Include(c => c.Enrollments)
            .Where(c => c.Status == status)
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync();

        return courses.Select(c => MapToCourseResponse(c, c.Stages.Count, c.Enrollments.Count)).ToList();
    }

    public async Task<List<TrainingCourseResponseDto>> FilterCoursesByYearAsync(string academicYear)
    {
        var courses = await _db.TrainingCourses
            .Include(c => c.Stages)
            .Include(c => c.Enrollments)
            .Where(c => c.AcademicYear == academicYear)
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync();

        return courses.Select(c => MapToCourseResponse(c, c.Stages.Count, c.Enrollments.Count)).ToList();
    }

    public async Task<TrainingStageResponseDto> CreateStageAsync(int courseId, CreateTrainingStageDto dto)
    {
        var stage = new TrainingStage
        {
            CourseId = courseId,
            Title = dto.Title,
            Slug = dto.Title.Replace(" ", "-").ToLower(),
            Description = dto.Description,
            StageOrder = dto.StageOrder,
            Required = dto.Required,
            PrerequisiteStageId = dto.PrerequisiteStageId
        };

        _db.TrainingStages.Add(stage);
        await _db.SaveChangesAsync();

        return MapToStageResponse(stage, 0);
    }

    public async Task<List<TrainingStageResponseDto>> GetStagesByCourseIdAsync(int courseId)
    {
        var stages = await _db.TrainingStages
            .Include(s => s.Sessions)
            .Where(s => s.CourseId == courseId)
            .OrderBy(s => s.StageOrder)
            .ToListAsync();

        return stages.Select(s => MapToStageResponse(s, s.Sessions.Count)).ToList();
    }

    public async Task<TrainingStageResponseDto?> GetStageByIdAsync(int id)
    {
        var stage = await _db.TrainingStages
            .Include(s => s.Sessions)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (stage == null) return null;
        return MapToStageResponse(stage, stage.Sessions.Count);
    }

    public async Task<TrainingStageResponseDto> UpdateStageAsync(int id, CreateTrainingStageDto dto)
    {
        var stage = await _db.TrainingStages.FindAsync(id)
            ?? throw new KeyNotFoundException("مرحله یافت نشد");

        stage.Title = dto.Title;
        stage.Slug = dto.Title.Replace(" ", "-").ToLower();
        stage.Description = dto.Description;
        stage.StageOrder = dto.StageOrder;
        stage.Required = dto.Required;
        stage.PrerequisiteStageId = dto.PrerequisiteStageId;

        await _db.SaveChangesAsync();

        var sessionsCount = await _db.TrainingSessions.CountAsync(s => s.StageId == id);
        return MapToStageResponse(stage, sessionsCount);
    }

    public async Task DeleteStageAsync(int id)
    {
        var stage = await _db.TrainingStages.FindAsync(id)
            ?? throw new KeyNotFoundException("مرحله یافت نشد");

        _db.TrainingStages.Remove(stage);
        await _db.SaveChangesAsync();
    }

    public async Task<TrainingSessionResponseDto> CreateSessionAsync(int stageId, CreateTrainingSessionDto dto)
    {
        var session = new TrainingSession
        {
            StageId = stageId,
            Title = dto.Title,
            SessionNumber = dto.SessionNumber,
            DurationMinutes = dto.DurationMinutes,
            SessionType = dto.SessionType,
            Description = dto.Description
        };

        _db.TrainingSessions.Add(session);
        await _db.SaveChangesAsync();

        return MapToSessionResponse(session, 0, 0);
    }

    public async Task<List<TrainingSessionResponseDto>> GetSessionsByStageIdAsync(int stageId)
    {
        var sessions = await _db.TrainingSessions
            .Include(s => s.Contents)
            .Include(s => s.Assignments)
            .Where(s => s.StageId == stageId)
            .OrderBy(s => s.SessionNumber)
            .ToListAsync();

        return sessions.Select(s => MapToSessionResponse(s, s.Contents.Count, s.Assignments.Count)).ToList();
    }

    public async Task<TrainingSessionResponseDto?> GetSessionByIdAsync(int id)
    {
        var session = await _db.TrainingSessions
            .Include(s => s.Contents)
            .Include(s => s.Assignments)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (session == null) return null;
        return MapToSessionResponse(session, session.Contents.Count, session.Assignments.Count);
    }

    public async Task<TrainingSessionResponseDto> UpdateSessionAsync(int id, CreateTrainingSessionDto dto)
    {
        var session = await _db.TrainingSessions.FindAsync(id)
            ?? throw new KeyNotFoundException("جلسه یافت نشد");

        session.Title = dto.Title;
        session.SessionNumber = dto.SessionNumber;
        session.DurationMinutes = dto.DurationMinutes;
        session.SessionType = dto.SessionType;
        session.Description = dto.Description;

        await _db.SaveChangesAsync();

        var contentsCount = await _db.TrainingContents.CountAsync(c => c.SessionId == id);
        var assignmentsCount = await _db.TrainingAssignments.CountAsync(a => a.SessionId == id);
        return MapToSessionResponse(session, contentsCount, assignmentsCount);
    }

    public async Task DeleteSessionAsync(int id)
    {
        var session = await _db.TrainingSessions.FindAsync(id)
            ?? throw new KeyNotFoundException("جلسه یافت نشد");

        _db.TrainingSessions.Remove(session);
        await _db.SaveChangesAsync();
    }

    public async Task<TrainingContentResponseDto> CreateContentAsync(int sessionId, CreateTrainingContentDto dto)
    {
        var content = new TrainingContent
        {
            SessionId = sessionId,
            ContentType = dto.ContentType,
            SourceFile = dto.SourceFile,
            RawText = dto.RawText,
            StructuredData = dto.StructuredData
        };

        _db.TrainingContents.Add(content);
        await _db.SaveChangesAsync();

        return MapToContentResponse(content);
    }

    public async Task<List<TrainingContentResponseDto>> GetContentsBySessionIdAsync(int sessionId)
    {
        var contents = await _db.TrainingContents
            .Where(c => c.SessionId == sessionId)
            .OrderByDescending(c => c.ImportedAt)
            .ToListAsync();

        return contents.Select(MapToContentResponse).ToList();
    }

    public async Task<TrainingContentResponseDto?> GetContentByIdAsync(int id)
    {
        var content = await _db.TrainingContents.FindAsync(id);
        if (content == null) return null;
        return MapToContentResponse(content);
    }

    public async Task<TrainingContentResponseDto> UpdateContentAsync(int id, CreateTrainingContentDto dto)
    {
        var content = await _db.TrainingContents.FindAsync(id)
            ?? throw new KeyNotFoundException("محتوا یافت نشد");

        content.ContentType = dto.ContentType;
        content.SourceFile = dto.SourceFile;
        content.RawText = dto.RawText;
        content.StructuredData = dto.StructuredData;
        content.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return MapToContentResponse(content);
    }

    public async Task DeleteContentAsync(int id)
    {
        var content = await _db.TrainingContents.FindAsync(id)
            ?? throw new KeyNotFoundException("محتوا یافت نشد");

        _db.TrainingContents.Remove(content);
        await _db.SaveChangesAsync();
    }

    public async Task<TrainingContentResponseDto> ProcessUploadedFileAsync(int sessionId, Stream fileStream, string fileName)
    {
        using var reader = new StreamReader(fileStream);
        var rawText = await reader.ReadToEndAsync();

        var content = new TrainingContent
        {
            SessionId = sessionId,
            ContentType = "transcript",
            SourceFile = fileName,
            RawText = rawText,
            StructuredData = ExtractStructure(rawText)
        };

        _db.TrainingContents.Add(content);
        await _db.SaveChangesAsync();

        return MapToContentResponse(content);
    }

    public async Task<TrainingEnrollmentResponseDto> CreateEnrollmentAsync(CreateTrainingEnrollmentDto dto)
    {
        var exists = await _db.TrainingEnrollments
            .AnyAsync(e => e.UserId == dto.UserId && e.CourseId == dto.CourseId);

        if (exists)
            throw new InvalidOperationException("ثبت‌نام تکراری");

        var enrollment = new TrainingEnrollment
        {
            UserId = dto.UserId,
            CourseId = dto.CourseId,
            Status = "Pending"
        };

        _db.TrainingEnrollments.Add(enrollment);
        await _db.SaveChangesAsync();

        return await GetEnrollmentByIdAsync(enrollment.Id)
            ?? throw new InvalidOperationException("خطا در بازیابی ثبت‌نام");
    }

    public async Task<List<TrainingEnrollmentResponseDto>> GetEnrollmentsByCourseIdAsync(int courseId)
    {
        var enrollments = await _db.TrainingEnrollments
            .Include(e => e.User)
            .Include(e => e.Course)
            .Where(e => e.CourseId == courseId)
            .ToListAsync();

        return enrollments.Select(MapToEnrollmentResponse).ToList();
    }

    public async Task<List<TrainingEnrollmentResponseDto>> GetEnrollmentsByUserIdAsync(int userId)
    {
        var enrollments = await _db.TrainingEnrollments
            .Include(e => e.User)
            .Include(e => e.Course)
            .Where(e => e.UserId == userId)
            .ToListAsync();

        return enrollments.Select(MapToEnrollmentResponse).ToList();
    }

    public async Task<TrainingEnrollmentResponseDto?> GetEnrollmentByIdAsync(int id)
    {
        var enrollment = await _db.TrainingEnrollments
            .Include(e => e.User)
            .Include(e => e.Course)
            .FirstOrDefaultAsync(e => e.Id == id);

        if (enrollment == null) return null;
        return MapToEnrollmentResponse(enrollment);
    }

    public async Task<TrainingEnrollmentResponseDto> UpdateEnrollmentStatusAsync(int id, string status)
    {
        var enrollment = await _db.TrainingEnrollments.FindAsync(id)
            ?? throw new KeyNotFoundException("ثبت‌نام یافت نشد");

        enrollment.Status = status;
        await _db.SaveChangesAsync();

        return await GetEnrollmentByIdAsync(id)
            ?? throw new InvalidOperationException("خطا در بازیابی ثبت‌نام");
    }

    public async Task DeleteEnrollmentAsync(int id)
    {
        var enrollment = await _db.TrainingEnrollments.FindAsync(id)
            ?? throw new KeyNotFoundException("ثبت‌نام یافت نشد");

        _db.TrainingEnrollments.Remove(enrollment);
        await _db.SaveChangesAsync();
    }

    public async Task<TrainingProgressResponseDto> UpdateProgressAsync(int enrollmentId, int sessionId, UpdateTrainingProgressDto dto)
    {
        var progress = await _db.TrainingProgresses
            .FirstOrDefaultAsync(p => p.EnrollmentId == enrollmentId && p.SessionId == sessionId);

        if (progress == null)
        {
            progress = new TrainingProgress
            {
                EnrollmentId = enrollmentId,
                SessionId = sessionId,
                Status = dto.Status,
                Score = dto.Score,
                Notes = dto.Notes,
                CompletedAt = dto.Status == "Completed" ? DateTime.UtcNow : null
            };
            _db.TrainingProgresses.Add(progress);
        }
        else
        {
            progress.Status = dto.Status;
            progress.Score = dto.Score;
            progress.Notes = dto.Notes;
            if (dto.Status == "Completed" && progress.CompletedAt == null)
                progress.CompletedAt = DateTime.UtcNow;
        }

        await _db.SaveChangesAsync();

        var session = await _db.TrainingSessions.FindAsync(sessionId);
        return MapToProgressResponse(progress, session?.Title);
    }

    public async Task<List<TrainingProgressResponseDto>> GetProgressByEnrollmentIdAsync(int enrollmentId)
    {
        var progresses = await _db.TrainingProgresses
            .Include(p => p.Session)
            .Where(p => p.EnrollmentId == enrollmentId)
            .ToListAsync();

        return progresses.Select(p => MapToProgressResponse(p, p.Session?.Title)).ToList();
    }

    public async Task<TrainingProgressResponseDto?> GetProgressByEnrollmentAndSessionAsync(int enrollmentId, int sessionId)
    {
        var progress = await _db.TrainingProgresses
            .Include(p => p.Session)
            .FirstOrDefaultAsync(p => p.EnrollmentId == enrollmentId && p.SessionId == sessionId);

        if (progress == null) return null;
        return MapToProgressResponse(progress, progress.Session?.Title);
    }

    public async Task<List<TrainingProgressResponseDto>> GetProgressBySessionIdAsync(int sessionId)
    {
        var progresses = await _db.TrainingProgresses
            .Include(p => p.Session)
            .Where(p => p.SessionId == sessionId)
            .ToListAsync();

        return progresses.Select(p => MapToProgressResponse(p, p.Session?.Title)).ToList();
    }


    public async Task<TrainingAssignmentResponseDto> CreateAssignmentAsync(int sessionId, CreateTrainingAssignmentDto dto)
    {
        var assignment = new TrainingAssignment
        {
            SessionId = sessionId,
            Title = dto.Title,
            Description = dto.Description,
            Deadline = dto.Deadline,
            SubmissionType = dto.SubmissionType
        };

        _db.TrainingAssignments.Add(assignment);
        await _db.SaveChangesAsync();

        return MapToAssignmentResponse(assignment, 0);
    }

    public async Task<List<TrainingAssignmentResponseDto>> GetAssignmentsBySessionIdAsync(int sessionId)
    {
        var assignments = await _db.TrainingAssignments
            .Include(a => a.Submissions)
            .Where(a => a.SessionId == sessionId)
            .ToListAsync();

        return assignments.Select(a => MapToAssignmentResponse(a, a.Submissions.Count)).ToList();
    }

    public async Task<TrainingAssignmentResponseDto?> GetAssignmentByIdAsync(int id)
    {
        var assignment = await _db.TrainingAssignments
            .Include(a => a.Submissions)
            .FirstOrDefaultAsync(a => a.Id == id);

        if (assignment == null) return null;
        return MapToAssignmentResponse(assignment, assignment.Submissions.Count);
    }

    public async Task<TrainingAssignmentResponseDto> UpdateAssignmentAsync(int id, CreateTrainingAssignmentDto dto)
    {
        var assignment = await _db.TrainingAssignments.FindAsync(id)
            ?? throw new KeyNotFoundException("تکلیف یافت نشد");

        assignment.Title = dto.Title;
        assignment.Description = dto.Description;
        assignment.Deadline = dto.Deadline;
        assignment.SubmissionType = dto.SubmissionType;

        await _db.SaveChangesAsync();

        var submissionsCount = await _db.TrainingSubmissions.CountAsync(s => s.AssignmentId == id);
        return MapToAssignmentResponse(assignment, submissionsCount);
    }

    public async Task DeleteAssignmentAsync(int id)
    {
        var assignment = await _db.TrainingAssignments.FindAsync(id)
            ?? throw new KeyNotFoundException("تکلیف یافت نشد");

        _db.TrainingAssignments.Remove(assignment);
        await _db.SaveChangesAsync();
    }

    public async Task<TrainingSubmissionResponseDto> CreateSubmissionAsync(int assignmentId, int userId, CreateTrainingSubmissionDto dto)
    {
        var submission = new TrainingSubmission
        {
            AssignmentId = assignmentId,
            UserId = userId,
            Content = dto.Content,
            FileUrl = dto.FileUrl
        };

        _db.TrainingSubmissions.Add(submission);
        await _db.SaveChangesAsync();

        var user = await _db.Users.FindAsync(userId);
        return MapToSubmissionResponse(submission, user?.Username);
    }

    public async Task<List<TrainingSubmissionResponseDto>> GetSubmissionsByAssignmentIdAsync(int assignmentId)
    {
        var submissions = await _db.TrainingSubmissions
            .Include(s => s.User)
            .Where(s => s.AssignmentId == assignmentId)
            .ToListAsync();

        return submissions.Select(s => MapToSubmissionResponse(s, s.User?.Username)).ToList();
    }

    public async Task<TrainingSubmissionResponseDto?> GetSubmissionByIdAsync(int id)
    {
        var submission = await _db.TrainingSubmissions
            .Include(s => s.User)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (submission == null) return null;
        return MapToSubmissionResponse(submission, submission.User?.Username);
    }

    public async Task<TrainingSubmissionResponseDto> GradeSubmissionAsync(int id, decimal grade, string? feedback)
    {
        var submission = await _db.TrainingSubmissions.FindAsync(id)
            ?? throw new KeyNotFoundException("ارسال یافت نشد");

        submission.Grade = grade;
        submission.Feedback = feedback;

        await _db.SaveChangesAsync();

        var user = await _db.Users.FindAsync(submission.UserId);
        return MapToSubmissionResponse(submission, user?.Username);
    }

    public async Task<TrainingStatisticsDto> GetStatisticsAsync()
    {
        var totalCourses = await _db.TrainingCourses.CountAsync();
        var activeCourses = await _db.TrainingCourses.CountAsync(c => c.Status == "Active");
        var totalEnrollments = await _db.TrainingEnrollments.CountAsync();
        var totalSessions = await _db.TrainingSessions.CountAsync();
        var totalContent = await _db.TrainingContents.CountAsync();

        var courseStats = await _db.TrainingCourses
            .Include(c => c.Enrollments)
            .OrderByDescending(c => c.CreatedAt)
            .Take(10)
            .Select(c => new CourseStatItemDto(
                c.Id,
                c.Title,
                c.Enrollments.Count,
                0
            ))
            .ToListAsync();

        return new TrainingStatisticsDto(
            totalCourses,
            activeCourses,
            totalEnrollments,
            totalSessions,
            totalContent,
            courseStats
        );
    }

    public async Task<CourseStatItemDto> GetCourseStatisticsAsync(int courseId)
    {
        var course = await _db.TrainingCourses.FindAsync(courseId)
            ?? throw new KeyNotFoundException("دوره یافت نشد");

        var enrollmentCount = await _db.TrainingEnrollments.CountAsync(e => e.CourseId == courseId);
        var completedCount = await _db.TrainingEnrollments.CountAsync(e => e.CourseId == courseId && e.Status == "Completed");
        var completionRate = enrollmentCount > 0 ? (int)((double)completedCount / enrollmentCount * 100) : 0;

        return new CourseStatItemDto(courseId, course.Title, enrollmentCount, completionRate);
    }

    private static TrainingCourseResponseDto MapToCourseResponse(TrainingCourse course, int stagesCount, int enrollmentsCount)
    {
        return new TrainingCourseResponseDto(
            course.Id,
            course.Title,
            course.Slug,
            course.Description,
            course.AcademicYear,
            course.Status,
            course.MaxEnrollment,
            course.StartDate,
            course.EndDate,
            course.CreatedAt,
            stagesCount,
            enrollmentsCount
        );
    }

    private static TrainingStageResponseDto MapToStageResponse(TrainingStage stage, int sessionsCount)
    {
        return new TrainingStageResponseDto(
            stage.Id,
            stage.CourseId,
            stage.Title,
            stage.Slug,
            stage.StageOrder,
            stage.Required,
            stage.Description,
            sessionsCount,
            stage.PrerequisiteStageId
        );
    }

    private static TrainingSessionResponseDto MapToSessionResponse(TrainingSession session, int contentsCount, int assignmentsCount)
    {
        return new TrainingSessionResponseDto(
            session.Id,
            session.StageId,
            session.Title,
            session.SessionNumber,
            session.DurationMinutes,
            session.SessionType,
            session.Description,
            contentsCount,
            assignmentsCount
        );
    }

    private static TrainingContentResponseDto MapToContentResponse(TrainingContent content)
    {
        return new TrainingContentResponseDto(
            content.Id,
            content.SessionId,
            content.ContentType,
            content.SourceFile,
            content.RawText,
            content.StructuredData,
            content.ImportedAt
        );
    }

    private static TrainingEnrollmentResponseDto MapToEnrollmentResponse(TrainingEnrollment enrollment)
    {
        return new TrainingEnrollmentResponseDto(
            enrollment.Id,
            enrollment.UserId,
            enrollment.CourseId,
            enrollment.EnrolledAt,
            enrollment.Status,
            enrollment.User?.Username,
            enrollment.Course?.Title
        );
    }

    private static TrainingProgressResponseDto MapToProgressResponse(TrainingProgress progress, string? sessionTitle)
    {
        return new TrainingProgressResponseDto(
            progress.Id,
            progress.EnrollmentId,
            progress.SessionId,
            progress.Status,
            progress.Score,
            progress.CompletedAt,
            progress.Notes,
            sessionTitle
        );
    }

    private static TrainingAssignmentResponseDto MapToAssignmentResponse(TrainingAssignment assignment, int submissionsCount)
    {
        return new TrainingAssignmentResponseDto(
            assignment.Id,
            assignment.SessionId,
            assignment.Title,
            assignment.Description,
            assignment.Deadline,
            assignment.SubmissionType,
            submissionsCount
        );
    }

    private static TrainingSubmissionResponseDto MapToSubmissionResponse(TrainingSubmission submission, string? userName)
    {
        return new TrainingSubmissionResponseDto(
            submission.Id,
            submission.AssignmentId,
            submission.UserId,
            submission.Content,
            submission.FileUrl,
            submission.SubmittedAt,
            submission.Grade,
            submission.Feedback,
            userName
        );
    }

    private static string ExtractStructure(string rawText)
    {
        var structure = new Dictionary<string, object>
        {
            ["sections"] = new List<string>(),
            ["questions"] = new List<string>(),
            ["assignments"] = new List<string>()
        };

        var lines = rawText.Split('\n');
        foreach (var line in lines)
        {
            var trimmed = line.Trim();
            if (trimmed.StartsWith("بخش:") || trimmed.StartsWith("فصل:"))
                ((List<string>)structure["sections"]).Add(trimmed);
            else if (trimmed.StartsWith("سؤال:") || trimmed.StartsWith("سوال:"))
                ((List<string>)structure["questions"]).Add(trimmed);
            else if (trimmed.StartsWith("تکلیف:") || trimmed.StartsWith("تمرین:"))
                ((List<string>)structure["assignments"]).Add(trimmed);
        }

        return JsonSerializer.Serialize(structure, new JsonSerializerOptions
        {
            ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles,
            Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping
        });
    }
}
