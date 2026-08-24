using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Application.Constants;
using EducationalPlatform.Nehzat.Application.Exceptions;
using EducationalPlatform.Nehzat.Infrastructure.Services;

namespace EducationalPlatform.Nehzat.API.Controllers;

[ApiController]
[Route("api/quran")]
[Authorize]
public class QuranController : ControllerBase
{
    private readonly IQuranService _service;
    private readonly IQuranComService _quranCom;

    public QuranController(IQuranService service, IQuranComService quranCom)
    {
        _service = service;
        _quranCom = quranCom;
    }

    // Surah endpoints
    [HttpGet("surahs")]
    
    public async Task<IActionResult> GetAllSurahs()
    {
        return Ok(await _service.GetAllSurahsAsync());
    }

    [HttpGet("surahs/{id}")]
    
    public async Task<IActionResult> GetSurahById(int id)
    {
        var result = await _service.FindSurahByIdAsync(id);
        if (result == null) return NotFound(new { message = "سوره یافت نشد." });
        return Ok(result);
    }

    [HttpPost("surahs")]
    public async Task<IActionResult> CreateSurah([FromBody] CreateSurahRequest request)
    {
        try
        {
            var result = await _service.CreateSurahAsync(request);
            return Ok(result);
        }
        catch (InvalidOperationException)
        {
            return Conflict(new { message = GenericErrorMessages.Conflict });
        }
    }

    [HttpPut("surahs/{id}")]
    public async Task<IActionResult> UpdateSurah(int id, [FromBody] UpdateSurahRequest request)
    {
        try
        {
            var result = await _service.UpdateSurahAsync(id, request);
            return Ok(result);
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = GenericErrorMessages.NotFound });
        }
    }

    [HttpDelete("surahs/{id}")]
    public async Task<IActionResult> DeleteSurah(int id)
    {
        try
        {
            await _service.DeleteSurahAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = GenericErrorMessages.NotFound });
        }
    }

    // Ayah endpoints
    [HttpGet("ayahs")]
    
    public async Task<IActionResult> GetAllAyahs()
    {
        return Ok(await _service.GetAllAyahsAsync());
    }

    [HttpGet("ayahs/surah/{surahId}")]
    
    public async Task<IActionResult> GetAyahsBySurah(int surahId)
    {
        return Ok(await _service.GetAyahsBySurahAsync(surahId));
    }

    [HttpGet("ayahs/{id}")]
    
    public async Task<IActionResult> GetAyahById(int id)
    {
        var result = await _service.FindAyahByIdAsync(id);
        if (result == null) return NotFound(new { message = "آیه یافت نشد." });
        return Ok(result);
    }

    [HttpPost("ayahs")]
    public async Task<IActionResult> CreateAyah([FromBody] CreateAyahRequest request)
    {
        var result = await _service.CreateAyahAsync(request);
        return Ok(result);
    }

    [HttpPut("ayahs/{id}")]
    public async Task<IActionResult> UpdateAyah(int id, [FromBody] UpdateAyahRequest request)
    {
        try
        {
            var result = await _service.UpdateAyahAsync(id, request);
            return Ok(result);
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = GenericErrorMessages.NotFound });
        }
    }

    [HttpDelete("ayahs/{id}")]
    public async Task<IActionResult> DeleteAyah(int id)
    {
        try
        {
            await _service.DeleteAyahAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = GenericErrorMessages.NotFound });
        }
    }

    // TajweedRule endpoints
    [HttpGet("tajweed-rules")]
    
    public async Task<IActionResult> GetAllTajweedRules()
    {
        return Ok(await _service.GetAllTajweedRulesAsync());
    }

    [HttpGet("tajweed-rules/{id}")]
    
    public async Task<IActionResult> GetTajweedRuleById(int id)
    {
        var result = await _service.FindTajweedRuleByIdAsync(id);
        if (result == null) return NotFound(new { message = "قانون تجوید یافت نشد." });
        return Ok(result);
    }

    [HttpPost("tajweed-rules")]
    public async Task<IActionResult> CreateTajweedRule([FromBody] CreateTajweedRuleRequest request)
    {
        try
        {
            var result = await _service.CreateTajweedRuleAsync(request);
            return Ok(result);
        }
        catch (InvalidOperationException)
        {
            return Conflict(new { message = GenericErrorMessages.Conflict });
        }
    }

    [HttpPut("tajweed-rules/{id}")]
    public async Task<IActionResult> UpdateTajweedRule(int id, [FromBody] UpdateTajweedRuleRequest request)
    {
        try
        {
            var result = await _service.UpdateTajweedRuleAsync(id, request);
            return Ok(result);
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = GenericErrorMessages.NotFound });
        }
    }

    [HttpDelete("tajweed-rules/{id}")]
    public async Task<IActionResult> DeleteTajweedRule(int id)
    {
        try
        {
            await _service.DeleteTajweedRuleAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = GenericErrorMessages.NotFound });
        }
    }

    // QuranStudentCourse endpoints
    [HttpGet("student-courses")]
    
    public async Task<IActionResult> GetAllQuranStudentCourses()
    {
        return Ok(await _service.GetAllQuranStudentCoursesAsync());
    }

    [HttpGet("student-courses/{id}")]
    
    public async Task<IActionResult> GetQuranStudentCourseById(int id)
    {
        var result = await _service.FindQuranStudentCourseByIdAsync(id);
        if (result == null) return NotFound(new { message = "ثبت درس قرآن یافت نشد." });
        return Ok(result);
    }

    [HttpPost("student-courses")]
    public async Task<IActionResult> CreateQuranStudentCourse([FromBody] CreateQuranStudentCourseRequest request)
    {
        try
        {
            var result = await _service.CreateQuranStudentCourseAsync(request);
            return Ok(result);
        }
        catch (InvalidOperationException)
        {
            return Conflict(new { message = GenericErrorMessages.Conflict });
        }
    }

    [HttpPut("student-courses/{id}")]
    public async Task<IActionResult> UpdateQuranStudentCourse(int id, [FromBody] UpdateQuranStudentCourseRequest request)
    {
        try
        {
            var result = await _service.UpdateQuranStudentCourseAsync(id, request);
            return Ok(result);
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = GenericErrorMessages.NotFound });
        }
    }

    [HttpDelete("student-courses/{id}")]
    public async Task<IActionResult> DeleteQuranStudentCourse(int id)
    {
        try
        {
            await _service.DeleteQuranStudentCourseAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = GenericErrorMessages.NotFound });
        }
    }

    // RecitationLevel endpoints
    [HttpGet("recitation-levels")]
    
    public async Task<IActionResult> GetAllRecitationLevels()
    {
        return Ok(await _service.GetAllRecitationLevelsAsync());
    }

    [HttpGet("recitation-levels/{id}")]
    
    public async Task<IActionResult> GetRecitationLevelById(int id)
    {
        var result = await _service.FindRecitationLevelByIdAsync(id);
        if (result == null) return NotFound(new { message = "سطح تجوید یافت نشد." });
        return Ok(result);
    }

    [HttpPost("recitation-levels")]
    public async Task<IActionResult> CreateRecitationLevel([FromBody] CreateRecitationLevelRequest request)
    {
        try
        {
            var result = await _service.CreateRecitationLevelAsync(request);
            return Ok(result);
        }
        catch (InvalidOperationException)
        {
            return Conflict(new { message = GenericErrorMessages.Conflict });
        }
    }

    [HttpPut("recitation-levels/{id}")]
    public async Task<IActionResult> UpdateRecitationLevel(int id, [FromBody] UpdateRecitationLevelRequest request)
    {
        try
        {
            var result = await _service.UpdateRecitationLevelAsync(id, request);
            return Ok(result);
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = GenericErrorMessages.NotFound });
        }
    }

    [HttpDelete("recitation-levels/{id}")]
    public async Task<IActionResult> DeleteRecitationLevel(int id)
    {
        try
        {
            await _service.DeleteRecitationLevelAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = GenericErrorMessages.NotFound });
        }
    }

    // QuranCurriculum endpoints
    [HttpGet("curricula")]
    
    public async Task<IActionResult> GetAllQuranCurricula()
    {
        return Ok(await _service.GetAllQuranCurriculaAsync());
    }

    [HttpGet("curricula/{id}")]
    
    public async Task<IActionResult> GetQuranCurriculumById(int id)
    {
        var result = await _service.FindQuranCurriculumByIdAsync(id);
        if (result == null) return NotFound(new { message = "برنامه قرآن یافت نشد." });
        return Ok(result);
    }

    [HttpPost("curricula")]
    public async Task<IActionResult> CreateQuranCurriculum([FromBody] CreateQuranCurriculumRequest request)
    {
        var result = await _service.CreateQuranCurriculumAsync(request);
        return Ok(result);
    }

    [HttpPut("curricula/{id}")]
    public async Task<IActionResult> UpdateQuranCurriculum(int id, [FromBody] UpdateQuranCurriculumRequest request)
    {
        try
        {
            var result = await _service.UpdateQuranCurriculumAsync(id, request);
            return Ok(result);
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = GenericErrorMessages.NotFound });
        }
    }

    [HttpDelete("curricula/{id}")]
    public async Task<IActionResult> DeleteQuranCurriculum(int id)
    {
        try
        {
            await _service.DeleteQuranCurriculumAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = GenericErrorMessages.NotFound });
        }
    }

    // QuranStudentProgress endpoints
    [HttpGet("progress/student/{studentId}")]
    
    public async Task<IActionResult> GetStudentProgress(int studentId)
    {
        return Ok(await _service.GetStudentProgressAsync(studentId));
    }

    [HttpGet("progress/{id}")]
    
    public async Task<IActionResult> GetProgressById(int id)
    {
        var result = await _service.FindProgressByIdAsync(id);
        if (result == null) return NotFound(new { message = "پیشرفت یافت نشد." });
        return Ok(result);
    }

    [HttpPost("progress")]
    public async Task<IActionResult> CreateProgress([FromBody] CreateProgressRequest request)
    {
        var result = await _service.CreateProgressAsync(request.StudentId, request.SurahId, request.AyahNumber, request.Percentage, request.Notes);
        return Ok(result);
    }

    // Lesson Plan endpoints
    [HttpGet("lesson-plans")]
    [AllowAnonymous]
    public async Task<IActionResult> GetLessonPlans()
    {
        var plans = await _service.GetLessonPlanFilesAsync();
        return Ok(plans);
    }

    [HttpGet("lesson-plans/{fileName}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetLessonPlan(string fileName)
    {
        try
        {
            var content = await _service.GetLessonPlanContentAsync(fileName);
            return Content(content, "text/markdown; charset=utf-8");
        }
        catch (FileNotFoundException ex)
        {
            return NotFound(new { message = $"پلن «{ex.FileName}» یافت نشد." });
        }
    }

    // Search endpoint
    [HttpGet("ayahs/search")]
    [AllowAnonymous]
    public async Task<IActionResult> SearchAyahs([FromQuery] string q, [FromQuery] int max = 50)
    {
        var results = await _service.SearchAyahsAsync(q, max);
        return Ok(results);
    }

    // Dashboard stats
    [HttpGet("dashboard-stats")]
    [AllowAnonymous]
    public async Task<IActionResult> GetDashboardStats()
    {
        var stats = await _service.GetDashboardStatsAsync();
        return Ok(stats);
    }

    // ── Quran.com API v4 Integration ──

    [HttpGet("chapters")]
    public async Task<IActionResult> GetChapters([FromQuery] string lang = "fa")
    {
        try { return Ok(await _quranCom.GetChaptersAsync(lang)); }
        catch (Exception) { return StatusCode(502, new { message = "خطا در دریافت فهرست سوره‌ها" }); }
    }

    [HttpGet("chapters/{chapterId}")]
    public async Task<IActionResult> GetChapterDetail(int chapterId, [FromQuery] string lang = "fa")
    {
        try { return Ok(await _quranCom.GetChapterDetailAsync(chapterId, lang)); }
        catch (Exception) { return StatusCode(502, new { message = "خطا در دریافت جزئیات سوره" }); }
    }

    [HttpGet("surahs/{surahId}/ayahs/{ayahNumber}/tafsir")]
    public async Task<IActionResult> GetTafsir(int surahId, int ayahNumber, [FromQuery] int tafsirId = 169)
    {
        try { return Ok(await _quranCom.GetTafsirAsync(surahId, ayahNumber, tafsirId)); }
        catch (Exception) { return StatusCode(502, new { message = "خطا در دریافت تفسیر" }); }
    }

    [HttpGet("search")]
    public async Task<IActionResult> Search([FromQuery] string q, [FromQuery] int maxResults = 20, [FromQuery] string lang = "fa")
    {
        try { return Ok(await _quranCom.SearchAsync(q, maxResults, lang)); }
        catch (Exception) { return StatusCode(502, new { message = "خطا در جستجو" }); }
    }

    [HttpGet("surahs/{surahId}/ayahs/{ayahNumber}/translations")]
    public async Task<IActionResult> GetTranslations(int surahId, int ayahNumber, [FromQuery] int translationId = 131)
    {
        try { return Ok(await _quranCom.GetTranslationsAsync(surahId, ayahNumber, translationId)); }
        catch (Exception) { return StatusCode(502, new { message = "خطا در دریافت ترجمه" }); }
    }
}

public record CreateProgressRequest(
    int StudentId,
    int SurahId,
    int AyahNumber,
    int Percentage,
    string Notes = ""
);