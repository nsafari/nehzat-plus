using System.Net.Http.Json;
using System.Text.Json;
using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Domain.Entities;
using EducationalPlatform.Nehzat.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace EducationalPlatform.Nehzat.Infrastructure.Services;

public class MapService : IMapService
{
    private readonly AppDbContext _db;
    private readonly ILogger<MapService> _logger;
    private readonly IHttpClientFactory _httpClientFactory;

    public MapService(AppDbContext db, ILogger<MapService> logger, IHttpClientFactory httpClientFactory)
    {
        _db = db;
        _logger = logger;
        _httpClientFactory = httpClientFactory;
    }

    public async Task<UserLocationDto> UpdateLocationAsync(int userId, UpdateLocationRequest request)
    {
        var location = await _db.Set<UserLocation>().FirstOrDefaultAsync(l => l.UserId == userId);
        if (location is null)
        {
            location = new UserLocation { UserId = userId };
            _db.Set<UserLocation>().Add(location);
        }
        location.Latitude = request.Latitude;
        location.Longitude = request.Longitude;
        location.Accuracy = request.Accuracy;
        location.Speed = request.Speed;
        location.Heading = request.Heading;
        location.IsSharing = request.IsSharing;
        location.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return new UserLocationDto
        {
            UserId = userId,
            Latitude = location.Latitude,
            Longitude = location.Longitude,
            Speed = location.Speed,
            IsSharing = location.IsSharing,
            UpdatedAt = location.UpdatedAt
        };
    }

    public async Task<UserLocationDto?> GetUserLocationAsync(int userId)
    {
        var location = await _db.Set<UserLocation>().FirstOrDefaultAsync(l => l.UserId == userId && l.IsSharing);
        if (location is null) return null;
        var user = await _db.Users.FindAsync(userId);
        return new UserLocationDto
        {
            UserId = userId,
            FullName = user != null ? $"{user.FirstName} {user.LastName}".Trim() : null,
            ImageUrl = user?.ImageUrl,
            Latitude = location.Latitude,
            Longitude = location.Longitude,
            Speed = location.Speed,
            IsSharing = location.IsSharing,
            UpdatedAt = location.UpdatedAt
        };
    }

    public async Task<List<UserLocationDto>> GetSharingUsersAsync(int? halghehId = null)
    {
        var query = _db.Set<UserLocation>().Where(l => l.IsSharing);
        if (halghehId.HasValue)
        {
            var memberIds = await _db.Set<HalghehMember>().Where(m => m.HalghehId == halghehId).Select(m => m.UserId).ToListAsync();
            query = query.Where(l => memberIds.Contains(l.UserId));
        }
        var list = await query.OrderByDescending(l => l.UpdatedAt).ToListAsync();
        var userIds = list.Select(l => l.UserId).ToList();
        var users = await _db.Users.Where(u => userIds.Contains(u.Id)).ToDictionaryAsync(u => u.Id);
        return list.Select(l => new UserLocationDto
        {
            UserId = l.UserId,
            FullName = users.ContainsKey(l.UserId) ? $"{users[l.UserId].FirstName} {users[l.UserId].LastName}".Trim() : null,
            ImageUrl = users.ContainsKey(l.UserId) ? users[l.UserId].ImageUrl : null,
            Latitude = l.Latitude,
            Longitude = l.Longitude,
            Speed = l.Speed,
            IsSharing = l.IsSharing,
            UpdatedAt = l.UpdatedAt
        }).ToList();
    }

    public async Task<MapOrderDto> CreateOrderAsync(CreateMapOrderRequest request, int userId)
    {
        var order = new MapOrder
        {
            OrderCode = GenerateOrderCode(),
            CreatedByUserId = userId,
            HalghehId = request.HalghehId,
            Title = request.Title.Trim(),
            Description = request.Description,
            PickupLatitude = request.Pickup.Latitude,
            PickupLongitude = request.Pickup.Longitude,
            PickupAddress = request.PickupAddress,
            DeliveryLatitude = request.Delivery.Latitude,
            DeliveryLongitude = request.Delivery.Longitude,
            DeliveryAddress = request.DeliveryAddress,
            Status = "pending"
        };
        _db.Set<MapOrder>().Add(order);
        await _db.SaveChangesAsync();
        _db.Set<OrderTrackingPoint>().Add(new OrderTrackingPoint
        {
            OrderId = order.Id,
            Latitude = request.Pickup.Latitude,
            Longitude = request.Pickup.Longitude,
            Note = "سفارش ثبت شد"
        });
        await _db.SaveChangesAsync();
        return MapOrderToDto(order);
    }

    public async Task<List<MapOrderDto>> GetOrdersAsync(int userId, string? status = null)
    {
        var query = _db.Set<MapOrder>().Where(o => o.CreatedByUserId == userId || o.AssignedToUserId == userId);
        if (!string.IsNullOrEmpty(status)) query = query.Where(o => o.Status == status);
        var orders = await query.OrderByDescending(o => o.CreatedAt).ToListAsync();
        return orders.Select(MapOrderToDto).ToList();
    }

    public async Task<MapOrderDto> GetOrderAsync(int orderId, int userId)
    {
        var order = await _db.Set<MapOrder>().FindAsync(orderId);
        if (order is null) throw new KeyNotFoundException("سفارش یافت نشد");
        if (order.CreatedByUserId != userId && order.AssignedToUserId != userId)
            throw new KeyNotFoundException("سفارش یافت نشد");
        return MapOrderToDto(order);
    }

    public async Task<MapOrderDto> AssignOrderAsync(AssignOrderRequest request, int userId)
    {
        var order = await _db.Set<MapOrder>().FindAsync(request.OrderId);
        if (order is null) throw new KeyNotFoundException("سفارش یافت نشد");
        order.AssignedToUserId = request.AssignedToUserId;
        order.Status = "assigned";
        order.AssignedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return MapOrderToDto(order);
    }

    public async Task<MapOrderDto> AcceptOrderAsync(int orderId, int userId)
    {
        var order = await _db.Set<MapOrder>().FindAsync(orderId);
        if (order is null) throw new KeyNotFoundException("سفارش یافت نشد");
        order.AssignedToUserId = userId;
        order.Status = "accepted";
        order.AcceptedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return MapOrderToDto(order);
    }

    public async Task<MapOrderDto> UpdateOrderStatusAsync(int orderId, UpdateOrderStatusRequest request, int userId)
    {
        var order = await _db.Set<MapOrder>().FindAsync(orderId);
        if (order is null) throw new KeyNotFoundException("سفارش یافت نشد");
        if (request.CurrentLocation != null)
        {
            _db.Set<OrderTrackingPoint>().Add(new OrderTrackingPoint
            {
                OrderId = orderId,
                Latitude = request.CurrentLocation.Latitude,
                Longitude = request.CurrentLocation.Longitude,
                Note = request.Note
            });
        }
        order.Status = request.Status;
        switch (request.Status)
        {
            case "picked_up": order.PickedUpAt = DateTime.UtcNow; break;
            case "delivered": order.DeliveredAt = DateTime.UtcNow; break;
        }
        await _db.SaveChangesAsync();
        return MapOrderToDto(order);
    }

    public async Task<List<OrderTrackingPointDto>> GetOrderTrackingAsync(int orderId, int userId)
    {
        var order = await _db.Set<MapOrder>().FindAsync(orderId);
        if (order is null) throw new KeyNotFoundException("سفارش یافت نشد");
        if (order.CreatedByUserId != userId && order.AssignedToUserId != userId)
            throw new KeyNotFoundException("سفارش یافت نشد");

        return await _db.Set<OrderTrackingPoint>()
            .Where(t => t.OrderId == orderId)
            .OrderBy(t => t.RecordedAt)
            .Select(t => new OrderTrackingPointDto
            {
                Id = t.Id,
                Latitude = t.Latitude,
                Longitude = t.Longitude,
                Speed = t.Speed,
                Note = t.Note,
                RecordedAt = t.RecordedAt
            })
            .ToListAsync();
    }

    public async Task<DeliveryRouteDto> PlanRouteAsync(PlanRouteRequest request, int userId)
    {
        if (request.Waypoints.Count < 2)
            throw new InvalidOperationException("حداقل ۲ نقطه لازم است");

        try
        {
            var client = _httpClientFactory.CreateClient("OSRM");
            var coords = string.Join(';', request.Waypoints.Select(p =>
                $"{p.Longitude.ToString(System.Globalization.CultureInfo.InvariantCulture)},{p.Latitude.ToString(System.Globalization.CultureInfo.InvariantCulture)}"));
            var response = await client.GetAsync($"route/v1/driving/{coords}?overview=full&geometries=geojson");
            if (response.IsSuccessStatusCode)
            {
                var json = await response.Content.ReadFromJsonAsync<JsonElement>();
                var route = json.GetProperty("routes")[0];
                var distanceKm = Math.Round(route.GetProperty("distance").GetDouble() / 1000, 2);
                var durationMin = (int)Math.Ceiling(route.GetProperty("duration").GetDouble() / 60);
                var geometry = route.GetProperty("geometry").GetRawText();
                return await SaveRouteAsync(new DeliveryRouteDto
                {
                    OrderId = request.OrderId,
                    Title = request.Title,
                    TotalDistanceKm = distanceKm,
                    EstimatedDurationMin = durationMin,
                    Geometry = geometry,
                    Points = request.Waypoints.Select((p, i) => new RoutePointDto
                    {
                        Order = i + 1,
                        Latitude = p.Latitude,
                        Longitude = p.Longitude,
                        PointType = i == 0 ? "start" : i == request.Waypoints.Count - 1 ? "delivery" : "waypoint"
                    }).ToList()
                }, userId);
            }
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "OSRM unavailable, using Haversine fallback");
        }

        var totalDistance = 0.0;
        for (int i = 0; i < request.Waypoints.Count - 1; i++)
            totalDistance += HaversineKm(request.Waypoints[i].Latitude, request.Waypoints[i].Longitude, request.Waypoints[i + 1].Latitude, request.Waypoints[i + 1].Longitude);

        return await SaveRouteAsync(new DeliveryRouteDto
        {
            OrderId = request.OrderId,
            Title = request.Title,
            TotalDistanceKm = Math.Round(totalDistance, 2),
            EstimatedDurationMin = (int)Math.Ceiling(totalDistance / 0.6),
            Geometry = BuildLineGeometry(request.Waypoints),
            Points = request.Waypoints.Select((p, i) => new RoutePointDto
            {
                Order = i + 1,
                Latitude = p.Latitude,
                Longitude = p.Longitude,
                PointType = i == 0 ? "start" : i == request.Waypoints.Count - 1 ? "delivery" : "waypoint"
            }).ToList()
        }, userId);
    }

    public async Task<DeliveryRouteDto?> GetActiveRouteForOrderAsync(int orderId, int userId)
    {
        var order = await _db.Set<MapOrder>().FindAsync(orderId);
        if (order is null) return null;
        if (order.CreatedByUserId != userId && order.AssignedToUserId != userId)
            return null;

        var routes = _db.Set<DeliveryRoute>().Include(r => r.Points);
        var route = await routes.FirstOrDefaultAsync(r => r.OrderId == orderId);
        if (route is null) return null;
        return new DeliveryRouteDto
        {
            Id = route.Id,
            OrderId = route.OrderId,
            Title = route.Title,
            TotalDistanceKm = route.TotalDistanceKm,
            EstimatedDurationMin = route.EstimatedDurationMin,
            Geometry = route.Geometry,
            Points = route.Points.OrderBy(p => p.Order).Select(p => new RoutePointDto
            {
                Order = p.Order,
                Latitude = p.Latitude,
                Longitude = p.Longitude,
                PointType = p.PointType,
                Label = p.Label
            }).ToList()
        };
    }

    public async Task<DeliveryRouteDto> SaveRouteAsync(DeliveryRouteDto route, int userId)
    {
        var entity = new DeliveryRoute
        {
            OrderId = route.OrderId,
            CreatedByUserId = userId,
            Title = route.Title,
            TotalDistanceKm = route.TotalDistanceKm,
            EstimatedDurationMin = route.EstimatedDurationMin,
            Geometry = route.Geometry,
            Points = route.Points.Select(p => new RoutePoint
            {
                Order = p.Order,
                Latitude = p.Latitude,
                Longitude = p.Longitude,
                PointType = p.PointType,
                Label = p.Label
            }).ToList()
        };
        _db.Set<DeliveryRoute>().Add(entity);
        await _db.SaveChangesAsync();
        route.Id = entity.Id;
        return route;
    }

    public async Task<MapDashboardDto> GetDashboardAsync(int userId, int? halghehId = null)
    {
        var activeUsers = await GetSharingUsersAsync(halghehId);
        var activeOrders = await _db.Set<MapOrder>()
            .Where(o => o.Status != "delivered" && o.Status != "cancelled")
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();
        var routes = await _db.Set<DeliveryRoute>().Where(r => r.OrderId != null).ToListAsync();
        return new MapDashboardDto
        {
            ActiveUsers = activeUsers,
            ActiveOrders = activeOrders.Select(MapOrderToDto).ToList(),
            ActiveRoutes = routes.Select(r => new DeliveryRouteDto
            {
                Id = r.Id,
                OrderId = r.OrderId,
                Title = r.Title,
                TotalDistanceKm = r.TotalDistanceKm,
                EstimatedDurationMin = r.EstimatedDurationMin,
                Geometry = r.Geometry
            }).ToList()
        };
    }

    private static MapOrderDto MapOrderToDto(MapOrder o) => new()
    {
        Id = o.Id,
        OrderCode = o.OrderCode,
        Title = o.Title,
        Description = o.Description,
        AssignedToUserId = o.AssignedToUserId,
        PickupLatitude = o.PickupLatitude,
        PickupLongitude = o.PickupLongitude,
        PickupAddress = o.PickupAddress,
        DeliveryLatitude = o.DeliveryLatitude,
        DeliveryLongitude = o.DeliveryLongitude,
        DeliveryAddress = o.DeliveryAddress,
        Status = o.Status,
        CreatedAt = o.CreatedAt,
        DeliveredAt = o.DeliveredAt
    };

    private static string GenerateOrderCode()
    {
        var rand = new Random();
        var date = DateTime.UtcNow.ToString("yyMMdd");
        return $"VR-{date}-{rand.Next(1000, 9999)}";
    }

    public static double HaversineKm(double lat1, double lon1, double lat2, double lon2)
    {
        const double R = 6371.0;
        var dLat = ToRad(lat2 - lat1);
        var dLon = ToRad(lon2 - lon1);
        var a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                Math.Cos(ToRad(lat1)) * Math.Cos(ToRad(lat2)) *
                Math.Sin(dLon / 2) * Math.Sin(dLon / 2);
        return R * 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
    }

    private static double ToRad(double deg) => deg * Math.PI / 180;

    private static string BuildLineGeometry(List<GeoPointDto> points)
    {
        var coords = points.Select(p => new[] { p.Longitude, p.Latitude }).ToArray();
        return JsonSerializer.Serialize(new { type = "LineString", coordinates = coords });
    }
}
