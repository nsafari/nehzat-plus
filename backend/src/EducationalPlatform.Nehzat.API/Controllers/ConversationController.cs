using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Application.Constants;
using EducationalPlatform.Nehzat.Application.Exceptions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EducationalPlatform.Nehzat.API.Controllers;

[ApiController]
[Route("api/conversations")]
[Authorize]
public class ConversationController : ControllerBase
{
    private readonly IConversationService _conversationService;

    public ConversationController(IConversationService conversationService)
    {
        _conversationService = conversationService;
    }

    private bool TryGetUserId(out int userId)
    {
        return int.TryParse(User.FindFirst("userId")?.Value, out userId);
    }

    [HttpGet]
    public async Task<IActionResult> GetConversations()
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();
        var conversations = await _conversationService.GetUserConversationsAsync(userId);
        return Ok(conversations);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetConversation(int id)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();
        var conversation = await _conversationService.GetConversationAsync(id, userId);
        if (conversation == null)
            return NotFound(new { message = "مکالمه یافت نشد." });
        return Ok(conversation);
    }

    [HttpPost]
    public async Task<IActionResult> CreateConversation([FromBody] CreateConversationRequest request)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();
        try
        {
            var conversation = await _conversationService.CreateConversationAsync(userId, request);
            return CreatedAtAction(nameof(GetConversation), new { id = conversation.Id }, conversation);
        }
        catch (ArgumentException)
        {
            return BadRequest(new { message = GenericErrorMessages.BadRequest });
        }
    }

    [HttpPost("{id}/members")]
    public async Task<IActionResult> AddMember(int id, [FromBody] AddMemberRequest request)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();
        try
        {
            var conversation = await _conversationService.AddMemberAsync(id, userId, request);
            return Ok(conversation);
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = GenericErrorMessages.NotFound });
        }
        catch (UnauthorizedAccessException)
        {
            throw new ForbiddenException(GenericErrorMessages.Forbidden);
        }
        catch (InvalidOperationException)
        {
            return Conflict(new { message = GenericErrorMessages.Conflict });
        }
    }

    [HttpDelete("{id}/members/{memberId}")]
    public async Task<IActionResult> RemoveMember(int id, int memberId)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();
        try
        {
            await _conversationService.RemoveMemberAsync(id, memberId, userId);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = GenericErrorMessages.NotFound });
        }
        catch (UnauthorizedAccessException)
        {
            throw new ForbiddenException(GenericErrorMessages.Forbidden);
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteConversation(int id)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();
        try
        {
            await _conversationService.DeleteConversationAsync(id, userId);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = GenericErrorMessages.NotFound });
        }
        catch (UnauthorizedAccessException)
        {
            throw new ForbiddenException(GenericErrorMessages.Forbidden);
        }
    }

    [HttpGet("unread")]
    public async Task<IActionResult> GetUnreadCount()
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();
        var unread = await _conversationService.GetUnreadCountAsync(userId);
        return Ok(unread);
    }
}