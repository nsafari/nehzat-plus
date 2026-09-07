using EducationalPlatform.Nehzat.Application.Constants;
using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace EducationalPlatform.Nehzat.API.Controllers;

[ApiController]
[Authorize]
[Route("api/map")]
public class MapController : ControllerBase
{
    private readonly IMapService _service;
    public MapController(IMapService service) => _service = service;

    private int? UserId
    {
        get
        {
            var userIdClaim = User.FindFirstValue("userId");
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
                return null;
            return userId;
        }
    }

    [HttpPut("location")]
    public async Task<IActionResult> UpdateLocation([FromBody] UpdateLocationRequest request)
    {
        var userId = UserId;
        if (userId == null)
            return Unauthorized(new { message = "User ID not found in token." });

        try
        {
            return Ok(await _service.UpdateLocationAsync(userId.Value, request));
        }
        catch (Exception ex)
        {
            return BadRequest(GenericErrorMessages.BadRequest);
        }
    }

    [HttpGet("location/me")]
    public async Task<IActionResult> GetMyLocation()
    {
        var userId = UserId;
        if (userId == null)
            return Unauthorized(new { message = "User ID not found in token." });

        return Ok(await _service.GetUserLocationAsync(userId.Value));
    }

    [HttpGet("location/users")]
    public async Task<IActionResult> GetSharingUsers([FromQuery] int? halghehId)
        => Ok(await _service.GetSharingUsersAsync(halghehId));

    [HttpPost("orders")]
    public async Task<IActionResult> CreateOrder([FromBody] CreateMapOrderRequest request)
    {
        var userId = UserId;
        if (userId == null)
            return Unauthorized(new { message = "User ID not found in token." });

        try
        {
            return Ok(await _service.CreateOrderAsync(request, userId.Value));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(GenericErrorMessages.BadRequest);
        }
    }

    [HttpGet("orders")]
    public async Task<IActionResult> GetOrders([FromQuery] string? status)
    {
        var userId = UserId;
        if (userId == null)
            return Unauthorized(new { message = "User ID not found in token." });

        return Ok(await _service.GetOrdersAsync(userId.Value, status));
    }

    [HttpGet("orders/{orderId:int}")]
    public async Task<IActionResult> GetOrder(int orderId)
    {
        var userId = UserId;
        if (userId == null)
            return Unauthorized(new { message = "User ID not found in token." });

        try
        {
            return Ok(await _service.GetOrderAsync(orderId, userId.Value));
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(GenericErrorMessages.NotFound);
        }
    }

    [HttpPost("orders/{orderId:int}/accept")]
    public async Task<IActionResult> AcceptOrder(int orderId)
    {
        var userId = UserId;
        if (userId == null)
            return Unauthorized(new { message = "User ID not found in token." });

        try
        {
            return Ok(await _service.AcceptOrderAsync(orderId, userId.Value));
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(GenericErrorMessages.NotFound);
        }
    }

    [HttpPost("orders/assign")]
    public async Task<IActionResult> AssignOrder([FromBody] AssignOrderRequest request)
    {
        var userId = UserId;
        if (userId == null)
            return Unauthorized(new { message = "User ID not found in token." });

        try
        {
            return Ok(await _service.AssignOrderAsync(request, userId.Value));
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(GenericErrorMessages.NotFound);
        }
    }

    [HttpPut("orders/{orderId:int}/status")]
    public async Task<IActionResult> UpdateOrderStatus(int orderId, [FromBody] UpdateOrderStatusRequest request)
    {
        var userId = UserId;
        if (userId == null)
            return Unauthorized(new { message = "User ID not found in token." });

        try
        {
            return Ok(await _service.UpdateOrderStatusAsync(orderId, request, userId.Value));
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(GenericErrorMessages.NotFound);
        }
    }

    [HttpGet("orders/{orderId:int}/tracking")]
    public async Task<IActionResult> GetOrderTracking(int orderId)
    {
        var userId = UserId;
        if (userId == null)
            return Unauthorized(new { message = "User ID not found in token." });

        return Ok(await _service.GetOrderTrackingAsync(orderId, userId.Value));
    }

    [HttpPost("routes/plan")]
    public async Task<IActionResult> PlanRoute([FromBody] PlanRouteRequest request)
    {
        var userId = UserId;
        if (userId == null)
            return Unauthorized(new { message = "User ID not found in token." });

        try
        {
            return Ok(await _service.PlanRouteAsync(request, userId.Value));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(GenericErrorMessages.BadRequest);
        }
    }

    [HttpGet("routes/order/{orderId:int}")]
    public async Task<IActionResult> GetRouteForOrder(int orderId)
    {
        var userId = UserId;
        if (userId == null)
            return Unauthorized(new { message = "User ID not found in token." });

        return Ok(await _service.GetActiveRouteForOrderAsync(orderId, userId.Value));
    }

    [HttpGet("dashboard")]
    public async Task<IActionResult> GetDashboard([FromQuery] int? halghehId)
    {
        var userId = UserId;
        if (userId == null)
            return Unauthorized(new { message = "User ID not found in token." });

        return Ok(await _service.GetDashboardAsync(userId.Value, halghehId));
    }
}
