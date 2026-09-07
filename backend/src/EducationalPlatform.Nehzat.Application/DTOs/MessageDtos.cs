namespace EducationalPlatform.Nehzat.Application.DTOs;

public class MessagingMessageDto
{
    public int Id { get; set; }
    public int ConversationId { get; set; }
    public int SenderId { get; set; }
    public string SenderName { get; set; } = string.Empty;
    public string? SenderAvatar { get; set; }
    public string Content { get; set; } = string.Empty;
    public string MessageType { get; set; } = "text";
    public int? ReplyToId { get; set; }
    public MessagingMessageDto? ReplyTo { get; set; }
    public bool IsEdited { get; set; }
    public bool IsDeleted { get; set; }
    public List<AttachmentDto> Attachments { get; set; } = new();
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

public class SendMessageRequest
{
    public int ConversationId { get; set; }
    public string Content { get; set; } = string.Empty;
    public string MessageType { get; set; } = "text";
    public int? ReplyToId { get; set; }
}

public class AttachmentDto
{
    public int Id { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string FileUrl { get; set; } = string.Empty;
    public long FileSize { get; set; }
    public string MimeType { get; set; } = string.Empty;
}

public class MessagePagedResponse
{
    public List<MessagingMessageDto> Messages { get; set; } = new();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public bool HasMore { get; set; }
}

public class MarkReadRequest
{
    public List<int> MessageIds { get; set; } = new();
}

public class UnreadCountDto
{
    public int TotalUnread { get; set; }
    public Dictionary<int, int> PerConversation { get; set; } = new();
}
