namespace EducationalPlatform.Nehzat.Application.DTOs;

public class MessagingConversationListDto
{
    public int Id { get; set; }
    public string? Title { get; set; }
    public string Type { get; set; } = string.Empty;
    public int UnreadCount { get; set; }
    public MessagingMessageDto? LastMessage { get; set; }
    public List<MemberBriefDto> Members { get; set; } = new();
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class MessagingConversationDetailDto
{
    public int Id { get; set; }
    public string? Title { get; set; }
    public string Type { get; set; } = string.Empty;
    public int? MaktabId { get; set; }
    public int CreatedBy { get; set; }
    public List<MemberDetailDto> Members { get; set; } = new();
    public DateTime CreatedAt { get; set; }
}

public class CreateConversationRequest
{
    public string? Title { get; set; }
    public string Type { get; set; } = "direct";
    public int? MaktabId { get; set; }
    public List<int> MemberIds { get; set; } = new();
}

public class AddMemberRequest
{
    public int UserId { get; set; }
    public string Role { get; set; } = "member";
}

public class MemberBriefDto
{
    public int UserId { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; }
    public string Role { get; set; } = string.Empty;
}

public class MemberDetailDto : MemberBriefDto
{
    public DateTime? LastReadAt { get; set; }
    public DateTime JoinedAt { get; set; }
}
