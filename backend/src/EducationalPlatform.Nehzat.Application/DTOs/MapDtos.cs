namespace EducationalPlatform.Nehzat.Application.DTOs;

public class GeoPointDto
{
    public double Latitude { get; set; }
    public double Longitude { get; set; }
}

public class UserLocationDto
{
    public int UserId { get; set; }
    public string? FullName { get; set; }
    public string? ImageUrl { get; set; }
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public double? Speed { get; set; }
    public bool IsSharing { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class UpdateLocationRequest
{
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public double? Accuracy { get; set; }
    public double? Speed { get; set; }
    public double? Heading { get; set; }
    public bool IsSharing { get; set; } = true;
}

public class MapOrderDto
{
    public int Id { get; set; }
    public string OrderCode { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int? AssignedToUserId { get; set; }
    public string? AssignedToName { get; set; }
    public double PickupLatitude { get; set; }
    public double PickupLongitude { get; set; }
    public string? PickupAddress { get; set; }
    public double DeliveryLatitude { get; set; }
    public double DeliveryLongitude { get; set; }
    public string? DeliveryAddress { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime? DeliveredAt { get; set; }
}

public class CreateMapOrderRequest
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int? HalghehId { get; set; }
    public GeoPointDto Pickup { get; set; } = new();
    public string? PickupAddress { get; set; }
    public GeoPointDto Delivery { get; set; } = new();
    public string? DeliveryAddress { get; set; }
}

public class OrderTrackingPointDto
{
    public int Id { get; set; }
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public double? Speed { get; set; }
    public string? Note { get; set; }
    public DateTime RecordedAt { get; set; }
}

public class UpdateOrderStatusRequest
{
    public string Status { get; set; } = string.Empty;
    public string? Note { get; set; }
    public GeoPointDto? CurrentLocation { get; set; }
}

public class AssignOrderRequest
{
    public int OrderId { get; set; }
    public int AssignedToUserId { get; set; }
}

public class DeliveryRouteDto
{
    public int Id { get; set; }
    public int? OrderId { get; set; }
    public string Title { get; set; } = string.Empty;
    public double TotalDistanceKm { get; set; }
    public int? EstimatedDurationMin { get; set; }
    public string Geometry { get; set; } = string.Empty;
    public List<RoutePointDto> Points { get; set; } = new();
}

public class RoutePointDto
{
    public int Order { get; set; }
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public string PointType { get; set; } = string.Empty;
    public string? Label { get; set; }
}

public class PlanRouteRequest
{
    public List<GeoPointDto> Waypoints { get; set; } = new();
    public int? OrderId { get; set; }
    public string Title { get; set; } = string.Empty;
}

public class MapDashboardDto
{
    public List<UserLocationDto> ActiveUsers { get; set; } = new();
    public List<MapOrderDto> ActiveOrders { get; set; } = new();
    public List<DeliveryRouteDto> ActiveRoutes { get; set; } = new();
}
