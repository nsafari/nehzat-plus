using EducationalPlatform.Nehzat.Application.DTOs;

namespace EducationalPlatform.Nehzat.Application.Interfaces;

public interface IConversationService
{
    Task<List<MessagingConversationListDto>> GetUserConversationsAsync(int userId);
    Task<MessagingConversationDetailDto?> GetConversationAsync(int conversationId, int userId);
    Task<MessagingConversationDetailDto> CreateConversationAsync(int userId, CreateConversationRequest request);
    Task<MessagingConversationDetailDto> AddMemberAsync(int conversationId, int userId, AddMemberRequest request);
    Task RemoveMemberAsync(int conversationId, int memberId, int requesterId);
    Task DeleteConversationAsync(int conversationId, int userId);
    Task<UnreadCountDto> GetUnreadCountAsync(int userId);
}
