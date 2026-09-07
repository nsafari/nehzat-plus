using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Application.Constants;
using EducationalPlatform.Nehzat.Application.Exceptions;

namespace EducationalPlatform.Nehzat.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class MaktabController : ControllerBase
{
    private readonly IMaktabService _service;

    public MaktabController(IMaktabService service) => _service = service;

    private bool TryGetUserId(out int userId)
    {
        return int.TryParse(User.FindFirst("userId")?.Value, out userId);
    }

    // ====================================================================
    // CRUD
    // ====================================================================

    [HttpGet]
    public async Task<ActionResult<List<MaktabDto>>> GetAll()
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();
        return Ok(await _service.GetAllAsync(userId));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<MaktabDto>> GetById(int id)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();
        try { return Ok(await _service.GetByIdAsync(id, userId)); }
        catch (KeyNotFoundException) { return NotFound(new { message = GenericErrorMessages.NotFound }); }
        catch (UnauthorizedAccessException) { throw new ForbiddenException(GenericErrorMessages.Forbidden); }
    }

    [HttpPost]
    public async Task<ActionResult<MaktabDto>> Create([FromBody] CreateMaktabDto dto)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();
        try { return Ok(await _service.CreateAsync(userId, dto)); }
        catch (ArgumentException) { return BadRequest(new { message = GenericErrorMessages.BadRequest }); }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<MaktabDto>> Update(int id, [FromBody] UpdateMaktabDto dto)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();
        try { return Ok(await _service.UpdateAsync(id, userId, dto)); }
        catch (KeyNotFoundException) { return NotFound(new { message = GenericErrorMessages.NotFound }); }
        catch (UnauthorizedAccessException) { throw new ForbiddenException(GenericErrorMessages.Forbidden); }
        catch (ArgumentException) { return BadRequest(new { message = GenericErrorMessages.BadRequest }); }
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();
        try { await _service.DeleteAsync(id, userId); return NoContent(); }
        catch (KeyNotFoundException) { return NotFound(new { message = GenericErrorMessages.NotFound }); }
        catch (UnauthorizedAccessException) { throw new ForbiddenException(GenericErrorMessages.Forbidden); }
    }

    // ====================================================================
    // دعوت و عضویت
    // ====================================================================

    [HttpGet("{id}/invite-code")]
    public async Task<ActionResult<InviteCodeResponse>> GetInviteCode(int id)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();
        try { return Ok(new InviteCodeResponse { InviteCode = await _service.GetInviteCodeAsync(id, userId) }); }
        catch (KeyNotFoundException) { return NotFound(new { message = GenericErrorMessages.NotFound }); }
        catch (UnauthorizedAccessException) { throw new ForbiddenException(GenericErrorMessages.Forbidden); }
    }

    [HttpPost("{id}/invite-code/regenerate")]
    public async Task<ActionResult<InviteCodeResponse>> RegenerateInviteCode(int id)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();
        try { return Ok(new InviteCodeResponse { InviteCode = await _service.RegenerateInviteCodeAsync(id, userId) }); }
        catch (KeyNotFoundException) { return NotFound(new { message = GenericErrorMessages.NotFound }); }
        catch (UnauthorizedAccessException) { throw new ForbiddenException(GenericErrorMessages.Forbidden); }
    }

    [HttpPost("join")]
    public async Task<ActionResult<MaktabDto>> JoinByInviteCode([FromBody] JoinByInviteCodeDto dto)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();
        try { return Ok(await _service.JoinByInviteCodeAsync(userId, dto.InviteCode)); }
        catch (KeyNotFoundException) { return NotFound(new { message = GenericErrorMessages.NotFound }); }
        catch (InvalidOperationException) { return BadRequest(new { message = GenericErrorMessages.BadRequest }); }
        catch (ArgumentException) { return BadRequest(new { message = GenericErrorMessages.BadRequest }); }
    }

    [HttpPost("{id}/invite")]
    public async Task<ActionResult<MaktabMemberDto>> InviteByNationalCode(int id, [FromBody] InviteByNationalCodeDto dto)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();
        try { return Ok(await _service.InviteByNationalCodeAsync(id, userId, dto)); }
        catch (KeyNotFoundException) { return NotFound(new { message = GenericErrorMessages.NotFound }); }
        catch (UnauthorizedAccessException) { throw new ForbiddenException(GenericErrorMessages.Forbidden); }
        catch (ArgumentException) { return BadRequest(new { message = GenericErrorMessages.BadRequest }); }
        catch (InvalidOperationException) { return BadRequest(new { message = GenericErrorMessages.BadRequest }); }
    }

    // ====================================================================
    // مدیریت اعضا
    // ====================================================================

    [HttpGet("{id}/members")]
    public async Task<ActionResult<PaginatedResult<MaktabMemberDto>>> GetMembers(int id, [FromQuery] MaktabMemberFilterDto filter)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();
        try { return Ok(await _service.GetMembersAsync(id, userId, filter)); }
        catch (KeyNotFoundException) { return NotFound(new { message = GenericErrorMessages.NotFound }); }
        catch (UnauthorizedAccessException) { throw new ForbiddenException(GenericErrorMessages.Forbidden); }
    }

    [HttpPut("{id}/members/{targetUserId}/role")]
    public async Task<ActionResult> ChangeMemberRole(int id, int targetUserId, [FromBody] ChangeRoleDto dto)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();
        try { await _service.ChangeMemberRoleAsync(id, userId, targetUserId, dto.Role); return NoContent(); }
        catch (KeyNotFoundException) { return NotFound(new { message = GenericErrorMessages.NotFound }); }
        catch (UnauthorizedAccessException) { throw new ForbiddenException(GenericErrorMessages.Forbidden); }
        catch (ArgumentException) { return BadRequest(new { message = GenericErrorMessages.BadRequest }); }
        catch (InvalidOperationException) { return BadRequest(new { message = GenericErrorMessages.BadRequest }); }
    }

    [HttpDelete("{id}/members/{targetUserId}")]
    public async Task<ActionResult> RemoveMember(int id, int targetUserId)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();
        try { await _service.RemoveMemberAsync(id, userId, targetUserId); return NoContent(); }
        catch (KeyNotFoundException) { return NotFound(new { message = GenericErrorMessages.NotFound }); }
        catch (UnauthorizedAccessException) { throw new ForbiddenException(GenericErrorMessages.Forbidden); }
        catch (InvalidOperationException) { return BadRequest(new { message = GenericErrorMessages.BadRequest }); }
    }

    [HttpPost("{id}/leave")]
    public async Task<ActionResult> Leave(int id)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();
        try { await _service.LeaveMaktabAsync(id, userId); return NoContent(); }
        catch (KeyNotFoundException) { return NotFound(new { message = GenericErrorMessages.NotFound }); }
        catch (InvalidOperationException) { return BadRequest(new { message = GenericErrorMessages.BadRequest }); }
    }

    // ====================================================================
    // مالکیت
    // ====================================================================

    [HttpPost("{id}/transfer-ownership")]
    public async Task<ActionResult> TransferOwnership(int id, [FromBody] TransferOwnershipDto dto)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();
        try { await _service.TransferOwnershipAsync(id, userId, dto.NewOwnerUserId); return NoContent(); }
        catch (KeyNotFoundException) { return NotFound(new { message = GenericErrorMessages.NotFound }); }
        catch (UnauthorizedAccessException) { throw new ForbiddenException(GenericErrorMessages.Forbidden); }
        catch (InvalidOperationException) { return BadRequest(new { message = GenericErrorMessages.BadRequest }); }
    }

    // ====================================================================
    // وضعیت
    // ====================================================================

    [HttpPatch("{id}/status")]
    public async Task<ActionResult> ChangeStatus(int id, [FromBody] ChangeStatusDto dto)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();
        try { await _service.ChangeStatusAsync(id, userId, dto.Status); return NoContent(); }
        catch (KeyNotFoundException) { return NotFound(new { message = GenericErrorMessages.NotFound }); }
        catch (UnauthorizedAccessException) { throw new ForbiddenException(GenericErrorMessages.Forbidden); }
        catch (ArgumentException) { return BadRequest(new { message = GenericErrorMessages.BadRequest }); }
    }
}
// ============ Extra DTOs ============

public class InviteCodeResponse
{
    public string InviteCode { get; set; } = string.Empty;
}

public class JoinByInviteCodeDto
{
    public string InviteCode { get; set; } = string.Empty;
}

public class ChangeRoleDto
{
    public string Role { get; set; } = string.Empty;
}

public class ChangeStatusDto
{
    public string Status { get; set; } = string.Empty;
}
