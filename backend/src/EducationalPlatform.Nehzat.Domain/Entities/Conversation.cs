using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities;

public class Conversation
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [StringLength(300)]
    public string? Title { get; set; }

    [Required]
    [StringLength(20)]
    public string Type { get; set; } = "direct";

    public int? MaktabId { get; set; }

    public int CreatedBy { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    [ForeignKey(nameof(MaktabId))]
    public Maktab? Maktab { get; set; }

    [ForeignKey(nameof(CreatedBy))]
    public User Creator { get; set; } = null!;

    public ICollection<ConversationMember> Members { get; set; } = new List<ConversationMember>();

    public ICollection<Message> Messages { get; set; } = new List<Message>();
}
