using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities;

[Table("Nehzat_user_message_reads")]
public class UserMessageRead
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public int UserId { get; set; }

    [ForeignKey(nameof(UserId))]
    public User? User { get; set; }

    public int MessageId { get; set; }

    [ForeignKey(nameof(MessageId))]
    public Message? Message { get; set; }

    public DateTime ReadAt { get; set; } = DateTime.UtcNow;
}
