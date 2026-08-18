using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities;

[Table("Nehzat_user_locations")]
public class UserLocation
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public double? Accuracy { get; set; }
    public double? Speed { get; set; }
    public double? Heading { get; set; }
    public bool IsSharing { get; set; } = false;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

[Table("Nehzat_map_orders")]
public class MapOrder
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Column(TypeName = "nvarchar(20)")]
    public string OrderCode { get; set; } = string.Empty;

    public int? CreatedByUserId { get; set; }
    public int? AssignedToUserId { get; set; }
    public int? HalghehId { get; set; }

    [Column(TypeName = "nvarchar(200)")]
    public string Title { get; set; } = string.Empty;

    [Column(TypeName = "nvarchar(max)")]
    public string? Description { get; set; }

    public double PickupLatitude { get; set; }
    public double PickupLongitude { get; set; }
    [Column(TypeName = "nvarchar(500)")]
    public string? PickupAddress { get; set; }

    public double DeliveryLatitude { get; set; }
    public double DeliveryLongitude { get; set; }
    [Column(TypeName = "nvarchar(500)")]
    public string? DeliveryAddress { get; set; }

    [Column(TypeName = "nvarchar(20)")]
    public string Status { get; set; } = "pending";

    public DateTime? AcceptedAt { get; set; }
    public DateTime? AssignedAt { get; set; }
    public DateTime? PickedUpAt { get; set; }
    public DateTime? DeliveredAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public List<OrderTrackingPoint> TrackingPoints { get; set; } = new();
}

[Table("Nehzat_order_tracking_points")]
public class OrderTrackingPoint
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }
    public int OrderId { get; set; }
    public MapOrder Order { get; set; } = null!;
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public double? Speed { get; set; }
    [Column(TypeName = "nvarchar(500)")]
    public string? Note { get; set; }
    public DateTime RecordedAt { get; set; } = DateTime.UtcNow;
}

[Table("Nehzat_delivery_routes")]
public class DeliveryRoute
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }
    public int? OrderId { get; set; }
    public int? CreatedByUserId { get; set; }

    [Column(TypeName = "nvarchar(200)")]
    public string Title { get; set; } = string.Empty;

    public double TotalDistanceKm { get; set; }
    public int? EstimatedDurationMin { get; set; }

    [Column(TypeName = "nvarchar(max)")]
    public string Geometry { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public List<RoutePoint> Points { get; set; } = new();
}

[Table("Nehzat_route_points")]
public class RoutePoint
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }
    public int RouteId { get; set; }
    public DeliveryRoute Route { get; set; } = null!;
    public int Order { get; set; }
    public double Latitude { get; set; }
    public double Longitude { get; set; }

    [Column(TypeName = "nvarchar(20)")]
    public string PointType { get; set; } = "waypoint";

    [Column(TypeName = "nvarchar(200)")]
    public string? Label { get; set; }
}
