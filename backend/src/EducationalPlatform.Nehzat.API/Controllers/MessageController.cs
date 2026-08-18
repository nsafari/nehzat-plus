using EducationalPlatform.Nehzat.Application.Constants;
using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EducationalPlatform.Nehzat.API.Controllers;

[ApiController]
[Route("api/conversations/{conversationId}/messages")]
[Authorize]
public class MessageController : ControllerBase
{
    private readonly IMessageService _messageService;

    public MessageController(IMessageService messageService)
    {
        _messageService = messageService;
    }

    private bool TryGetUserId(out int userId)
    {
        return int.TryParse(User.FindFirst("userId")?.Value, out userId);
    }

    [HttpGet]
    public async Task<IActionResult> GetMessages(int conversationId, [FromQuery] int page = 1, [FromQuery] int pageSize = 50)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();
        try
        {
            var messages = await _messageService.GetMessagesAsync(conversationId, userId, page, pageSize);
            return Ok(messages);
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
    }

    [HttpPost]
    public async Task<IActionResult> SendMessage(int conversationId, [FromBody] SendMessageRequest request)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();
        request.ConversationId = conversationId;

        try
        {
            var message = await _messageService.SendMessageAsync(userId, request);
            return CreatedAtAction(nameof(GetMessages), new { conversationId }, message);
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(GenericErrorMessages.NotFound);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(GenericErrorMessages.BadRequest);
        }
    }

    [HttpPut("{messageId}")]
    public async Task<IActionResult> EditMessage(int conversationId, int messageId, [FromBody] EditMessageRequest request)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();
        try
        {
            var message = await _messageService.EditMessageAsync(messageId, userId, request.Content);
            return Ok(message);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(GenericErrorMessages.NotFound);
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(GenericErrorMessages.BadRequest);
        }
    }

    [HttpDelete("{messageId}")]
    public async Task<IActionResult> DeleteMessage(int conversationId, int messageId)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();
        try
        {
            await _messageService.DeleteMessageAsync(messageId, userId);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(GenericErrorMessages.NotFound);
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
    }

    [HttpPost("read")]
    public async Task<IActionResult> MarkAsRead(int conversationId, [FromBody] MarkReadRequest request)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();
        await _messageService.MarkAsReadAsync(conversationId, userId, request);
        return NoContent();
    }

    [HttpGet("unread-count")]
    public async Task<IActionResult> GetUnreadCount(int conversationId)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();
        var count = await _messageService.GetUnreadCountAsync(conversationId, userId);
        return Ok(new { count });
    }
}

public class EditMessageRequest
{
    public string Content { get; set; } = string.Empty;
}
