using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Application.Constants;
using EducationalPlatform.Nehzat.Application.Exceptions;

namespace EducationalPlatform.Nehzat.API.Controllers;

[ApiController]
[Route("halghehs")]
[Authorize]
public class HalghehController : ControllerBase
{
    private readonly IHalghehService _service;
    private readonly IHalghehMaktabService _maktabService;

    public HalghehController(IHalghehService service, IHalghehMaktabService maktabService)
    {
        _service = service;
        _maktabService = maktabService;
    }

    private bool TryGetUserId(out int userId)
    {
        return int.TryParse(User.FindFirst("userId")?.Value, out userId);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int? maktabId)
    {
        return Ok(await _service.GetAllAsync(maktabId));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _service.GetByIdAsync(id);
        if (result == null) return NotFound(new { message = "حلقه پیدا نشد." });
        return Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = "admin,manager,headquarters")]
    public async Task<IActionResult> Create([FromBody] CreateHalghehDto dto)
    {
        try
        {
            var result = await _service.CreateAsync(dto);
            return Ok(result);
        }
        catch (KeyNotFoundException)
        {
            return NotFound(GenericErrorMessages.NotFound);
        }
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "admin,manager,headquarters")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateHalghehDto dto)
    {
        var result = await _service.UpdateAsync(id, dto);
        if (result == null) return NotFound(GenericErrorMessages.NotFound);
        return Ok(result);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "admin,manager")]
    public async Task<IActionResult> Delete(int id)
    {
        var success = await _service.DeleteAsync(id);
        if (!success) return NotFound(GenericErrorMessages.NotFound);
        return NoContent();
    }

    [HttpGet("maktab/{maktabId}")]
    public async Task<IActionResult> GetAllByMaktab(int maktabId)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();
        var result = await _maktabService.GetAllByMaktabAsync(maktabId, userId);
        return Ok(result);
    }

    /// <summary>
    /// ایجاد حلقه جدید با تعیین خودکار ناظم
    /// </summary>
    [HttpPost("full")]
    public async Task<IActionResult> CreateFull([FromBody] CreateHalghehFullDto dto)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();
        try
        {
            var result = await _maktabService.CreateAsync(userId, dto);
            return Ok(result);
        }
        catch (KeyNotFoundException)
        {
            return NotFound(GenericErrorMessages.NotFound);
        }
        catch (UnauthorizedAccessException)
        {
            throw new ForbiddenException(GenericErrorMessages.Forbidden);
        }
    }

    /// <summary>
    /// ویرایش حلقه (فقط ناظم/مالک مکتب)
    /// </summary>
    [HttpPut("{id}/full")]
    public async Task<IActionResult> UpdateFull(int id, [FromBody] UpdateHalghehFullDto dto)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();
        try
        {
            var result = await _maktabService.UpdateAsync(id, userId, dto);
            return Ok(result);
        }
        catch (KeyNotFoundException)
        {
            return NotFound(GenericErrorMessages.NotFound);
        }
        catch (UnauthorizedAccessException)
        {
            throw new ForbiddenException(GenericErrorMessages.Forbidden);
        }
    }

    /// <summary>
    /// حذف حلقه (فقط ناظم)
    /// </summary>
    [HttpDelete("{id}/full")]
    public async Task<IActionResult> DeleteFull(int id)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();
        try
        {
            await _maktabService.DeleteAsync(id, userId);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound(GenericErrorMessages.NotFound);
        }
        catch (UnauthorizedAccessException)
        {
            throw new ForbiddenException(GenericErrorMessages.Forbidden);
        }
    }

    /// <summary>
    /// لیست اعضای حلقه با صفحه‌بندی و فیلتر
    /// </summary>
    [HttpGet("{id}/members")]
    public async Task<IActionResult> GetMembers(int id, [FromQuery] HalghehMemberFilterDto filter)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();
        try
        {
            var result = await _maktabService.GetMembersAsync(id, userId, filter);
            return Ok(result);
        }
        catch (UnauthorizedAccessException)
        {
            throw new ForbiddenException(GenericErrorMessages.Forbidden);
        }
    }

    /// <summary>
    /// عضویت در حلقه
    /// </summary>
    [HttpPost("{id}/join")]
    public async Task<IActionResult> Join(int id)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();
        try
        {
            var result = await _maktabService.JoinAsync(id, userId);
            return Ok(result);
        }
        catch (KeyNotFoundException)
        {
            return NotFound(GenericErrorMessages.NotFound);
        }
        catch (InvalidOperationException)
        {
            return BadRequest(GenericErrorMessages.BadRequest);
        }
    }

    /// <summary>
    /// حذف عضو از حلقه (فقط ناظم)
    /// </summary>
    [HttpDelete("{id}/members/{targetUserId}")]
    public async Task<IActionResult> RemoveMember(int id, int targetUserId)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();
        try
        {
            await _maktabService.RemoveMemberAsync(id, userId, targetUserId);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound(GenericErrorMessages.NotFound);
        }
        catch (UnauthorizedAccessException)
        {
            throw new ForbiddenException(GenericErrorMessages.Forbidden);
        }
    }

    /// <summary>
    /// ترک حلقه توسط عضو
    /// </summary>
    [HttpPost("{id}/leave")]
    public async Task<IActionResult> Leave(int id)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();
        try
        {
            await _maktabService.LeaveAsync(id, userId);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(GenericErrorMessages.NotFound);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(GenericErrorMessages.BadRequest);
        }
    }

    /// <summary>
    /// تغییر نقش عضو (فقط ناظم)
    /// </summary>
    [HttpPut("{id}/members/{targetUserId}/role")]
    public async Task<IActionResult> ChangeMemberRole(int id, int targetUserId, [FromBody] ChangeRoleDto dto)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();
        try
        {
            await _maktabService.ChangeMemberRoleAsync(id, userId, targetUserId, dto.Role);
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

    /// <summary>
    /// انتقال ناظمی (فقط ناظم فعلی)
    /// </summary>
    [HttpPost("{id}/transfer")]
    public async Task<IActionResult> TransferModerator(int id, [FromBody] TransferModeratorDto dto)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();
        try
        {
            await _maktabService.TransferModeratorAsync(id, userId, dto.NewModeratorUserId);
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

    /// <summary>
    /// تغییر وضعیت حلقه (فقط ناظم)
    /// </summary>
    [HttpPatch("{id}/status")]
    public async Task<IActionResult> ChangeStatus(int id, [FromBody] ChangeStatusDto dto)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();
        try
        {
            await _maktabService.ChangeStatusAsync(id, userId, dto.Status);
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
}
