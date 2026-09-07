using EducationalPlatform.Nehzat.Application.DTOs;

namespace EducationalPlatform.Nehzat.Application.Interfaces;

public interface IMessageService
{
    Task<MessagePagedResponse> GetMessagesAsync(int conversationId, int userId, int page = 1, int pageSize = 50);
    Task<MessagingMessageDto> SendMessageAsync(int userId, SendMessageRequest request);
    Task<MessagingMessageDto> EditMessageAsync(int messageId, int userId, string newContent);
    Task DeleteMessageAsync(int messageId, int userId);
    Task MarkAsReadAsync(int conversationId, int userId, MarkReadRequest request);
    Task<int> GetUnreadCountAsync(int conversationId, int userId);
}
