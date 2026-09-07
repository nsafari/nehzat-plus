using EducationalPlatform.Nehzat.Application.DTOs;

namespace EducationalPlatform.Nehzat.Application.Interfaces;

public interface IMapService
{
    Task<UserLocationDto> UpdateLocationAsync(int userId, UpdateLocationRequest request);
    Task<UserLocationDto?> GetUserLocationAsync(int userId);
    Task<List<UserLocationDto>> GetSharingUsersAsync(int? halghehId = null);

    Task<MapOrderDto> CreateOrderAsync(CreateMapOrderRequest request, int userId);
    Task<List<MapOrderDto>> GetOrdersAsync(int userId, string? status = null);
    Task<MapOrderDto> GetOrderAsync(int orderId, int userId);
    Task<MapOrderDto> AssignOrderAsync(AssignOrderRequest request, int userId);
    Task<MapOrderDto> UpdateOrderStatusAsync(int orderId, UpdateOrderStatusRequest request, int userId);
    Task<MapOrderDto> AcceptOrderAsync(int orderId, int userId);
    Task<List<OrderTrackingPointDto>> GetOrderTrackingAsync(int orderId, int userId);

    Task<DeliveryRouteDto> PlanRouteAsync(PlanRouteRequest request, int userId);
    Task<DeliveryRouteDto?> GetActiveRouteForOrderAsync(int orderId, int userId);
    Task<DeliveryRouteDto> SaveRouteAsync(DeliveryRouteDto route, int userId);

    Task<MapDashboardDto> GetDashboardAsync(int userId, int? halghehId = null);
}
