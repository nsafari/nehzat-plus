using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities;

[Table("ai_messages", Schema = "nehzat")]
public class AiMessage
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public int ConversationId { get; set; }

    [MaxLength(20)]
    public string Role { get; set; } = string.Empty;

    public string Content { get; set; } = string.Empty;

    public string? SourcesJson { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [ForeignKey(nameof(ConversationId))]
    public AiConversation Conversation { get; set; } = null!;
}
