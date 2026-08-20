using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities;

[Table("Nehzat_qr_sessions")]
public class QrSession
{
    [Key]
    [Column(TypeName = "nvarchar(100)")]
    public string QrSessionId { get; set; } = string.Empty;

    [Column(TypeName = "nvarchar(20)")]
    public string Status { get; set; } = "pending";

    [Column(TypeName = "nvarchar(100)")]
    public string? ScannedByUsername { get; set; }

    [Column(TypeName = "nvarchar(500)")]
    public string? ConfirmedToken { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime ExpiresAt { get; set; }
    public DateTime? ScannedAt { get; set; }
    public DateTime? ConfirmedAt { get; set; }
}
