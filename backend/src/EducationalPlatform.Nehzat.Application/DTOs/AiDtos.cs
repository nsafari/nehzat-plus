namespace EducationalPlatform.Nehzat.Application.DTOs;

public class AiChatRequest
{
    public int? ConversationId { get; set; }
    public string Message { get; set; } = string.Empty;
    public int? MaktabId { get; set; }
    public int? SubjectId { get; set; }
}

public class AiChatResponse
{
    public int ConversationId { get; set; }
    public string Response { get; set; } = string.Empty;
    public List<SourceDto> Sources { get; set; } = new();
    public DateTime CreatedAt { get; set; }
}

public class SourceDto
{
    public int DocumentId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string DocumentType { get; set; } = string.Empty;
    public double RelevanceScore { get; set; }
}

public class ConversationDto
{
    public int Id { get; set; }
    public string? Title { get; set; }
    public int MessageCount { get; set; }
    public string? LastMessage { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class ConversationDetailDto
{
    public int Id { get; set; }
    public string? Title { get; set; }
    public List<MessageDto> Messages { get; set; } = new();
    public DateTime CreatedAt { get; set; }
}

public class MessageDto
{
    public int Id { get; set; }
    public string Role { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public List<SourceDto>? Sources { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class KnowledgeDocumentDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string DocumentType { get; set; } = string.Empty;
    public int? SubjectId { get; set; }
    public int? MaktabId { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateKnowledgeDocumentRequest
{
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string DocumentType { get; set; } = "manual";
    public int? SubjectId { get; set; }
    public int? MaktabId { get; set; }
}
