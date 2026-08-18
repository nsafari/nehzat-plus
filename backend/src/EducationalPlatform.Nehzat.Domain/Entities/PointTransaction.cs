using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities;

[Table("point_transactions", Schema = "nehzat")]
public class PointTransaction
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public int UserId { get; set; }

    [ForeignKey(nameof(UserId))]
    public User User { get; set; } = null!;

    public int Amount { get; set; }

    [Column(TypeName = "nvarchar(300)")]
    public string Reason { get; set; } = string.Empty;

    [Column(TypeName = "varchar(50)")]
    public string? ReferenceType { get; set; }

    public int? ReferenceId { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}