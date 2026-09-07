using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;

namespace EducationalPlatform.Nehzat.API.Controllers;

[ApiController]
[Route("admin/vocabulary")]
[Authorize(Roles = "admin,manager,headquarters")]
public class AdminVocabularyController : ControllerBase
{
    private readonly IVocabularyService _vocabularyService;

    public AdminVocabularyController(IVocabularyService vocabularyService)
    {
        _vocabularyService = vocabularyService;
    }

    #region Vocabulary Text Admin Endpoints

    [HttpPost("texts")]
    public async Task<IActionResult> CreateText([FromBody] VocabularyTextCreateRequest request)
    {
        // Admin can create texts for any user, or we'll use a system user
        var userId = "admin-system"; // Admin can override ownership

        var text = await _vocabularyService.CreateTextAsync(request, userId);
        return Ok(text);
    }

    [HttpPut("texts/{textId}")]
    public async Task<IActionResult> UpdateText(int textId, [FromBody] VocabularyTextUpdateRequest request)
    {
        var userId = "admin-system";

        var text = await _vocabularyService.UpdateTextAsync(textId, request, userId);
        return Ok(text);
    }

    [HttpDelete("texts/{textId}")]
    public async Task<IActionResult> DeleteText(int textId)
    {
        var userId = "admin-system";

        await _vocabularyService.DeleteTextAsync(textId, userId);
        return NoContent();
    }

    [HttpGet("texts")]
    public async Task<IActionResult> GetAllTexts([FromQuery] string? language, [FromQuery] bool? isPublished)
    {
        var texts = await _vocabularyService.GetTextsAsync(language, isPublished, null);
        return Ok(texts);
    }

    [HttpGet("texts/{textId}")]
    public async Task<IActionResult> GetTextById(int textId)
    {
        var text = await _vocabularyService.GetTextByIdAsync(textId, "admin-system");
        return Ok(text);
    }

    #endregion

    #region Vocabulary Word Admin Endpoints

    [HttpPost("texts/{textId}/words")]
    public async Task<IActionResult> CreateWord(int textId, [FromBody] VocabularyWordCreateRequest request)
    {
        var userId = "admin-system";

        var word = await _vocabularyService.CreateWordAsync(request, userId);
        return Ok(word);
    }

    [HttpPut("words/{wordId}")]
    public async Task<IActionResult> UpdateWord(int wordId, [FromBody] VocabularyWordUpdateRequest request)
    {
        var userId = "admin-system";

        var word = await _vocabularyService.UpdateWordAsync(wordId, request, userId);
        return Ok(word);
    }

    [HttpDelete("words/{wordId}")]
    public async Task<IActionResult> DeleteWord(int wordId)
    {
        var userId = "admin-system";

        await _vocabularyService.DeleteWordAsync(wordId, userId);
        return NoContent();
    }

    [HttpGet("words")]
    public async Task<IActionResult> GetAllWords([FromQuery] int? textId, [FromQuery] string? difficultyLevel)
    {
        var words = await _vocabularyService.GetWordsByTextAsync(textId ?? 0, string.Empty);
        if (difficultyLevel != null)
        {
            words = words.Where(w => w.DifficultyLevel == difficultyLevel).ToList();
        }
        return Ok(words);
    }

    #endregion

    #region User Vocabulary Card Admin Endpoints

    [HttpGet("cards/all/{userId}")]
    public async Task<IActionResult> GetAllUserCards(string userId)
    {
        var cards = await _vocabularyService.GetDueCardsAsync(int.Parse(userId));
        // In a full implementation, we'd have methods to get all cards regardless of due status
        return Ok(cards);
    }

    #endregion
}