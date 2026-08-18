using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Domain.Entities;
using EducationalPlatform.Nehzat.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace EducationalPlatform.Nehzat.Infrastructure.Services;

public class ConversationService : IConversationService
{
    private readonly AppDbContext _dbContext;
    private readonly ILogger<ConversationService> _logger;

    public ConversationService(AppDbContext dbContext, ILogger<ConversationService> logger)
    {
        _dbContext = dbContext;
        _logger = logger;
    }

    public async Task<List<MessagingConversationListDto>> GetUserConversationsAsync(int userId)
    {
        var conversationIds = await _dbContext.ConversationMembers
            .Where(cm => cm.UserId == userId)
            .Select(cm => cm.ConversationId)
            .ToListAsync();

        var conversations = await _dbContext.Conversations
            .Where(c => conversationIds.Contains(c.Id) && c.IsActive)
            .Include(c => c.Members).ThenInclude(m => m.User)
            .Include(c => c.Messages)
            .OrderByDescending(c => c.UpdatedAt)
            .ToListAsync();

        var result = new List<MessagingConversationListDto>();

        foreach (var conv in conversations)
        {
            var lastMessage = conv.Messages
                .Where(m => !m.IsDeleted)
                .OrderByDescending(m => m.CreatedAt)
                .FirstOrDefault();

            var myMembership = conv.Members.First(m => m.UserId == userId);

            var unreadCount = conv.Messages
                .Count(m => !m.IsDeleted &&
                       m.SenderId != userId &&
                       (myMembership.LastReadAt == null || m.CreatedAt > myMembership.LastReadAt));

            result.Add(new MessagingConversationListDto
            {
                Id = conv.Id,
                Title = conv.Title ?? GetConversationTitle(conv, userId),
                Type = conv.Type,
                UnreadCount = unreadCount,
                LastMessage = lastMessage != null ? MapToMessageDto(lastMessage) : null,
                Members = conv.Members.Select(m => new MemberBriefDto
                {
                    UserId = m.UserId,
                    FullName = $"{m.User.FirstName} {m.User.LastName}",
                    AvatarUrl = m.User.ImageUrl,
                    Role = m.Role
                }).ToList(),
                CreatedAt = conv.CreatedAt,
                UpdatedAt = conv.UpdatedAt
            });
        }

        return result.OrderByDescending(c => c.UpdatedAt).ToList();
    }

    public async Task<MessagingConversationDetailDto?> GetConversationAsync(int conversationId, int userId)
    {
        var isMember = await _dbContext.ConversationMembers
            .AnyAsync(cm => cm.ConversationId == conversationId && cm.UserId == userId);

        if (!isMember) return null;

        var conversation = await _dbContext.Conversations
            .Include(c => c.Members).ThenInclude(m => m.User)
            .FirstOrDefaultAsync(c => c.Id == conversationId && c.IsActive);

        if (conversation == null) return null;

        return new MessagingConversationDetailDto
        {
            Id = conversation.Id,
            Title = conversation.Title,
            Type = conversation.Type,
            MaktabId = conversation.MaktabId,
            CreatedBy = conversation.CreatedBy,
            Members = conversation.Members.Select(m => new MemberDetailDto
            {
                UserId = m.UserId,
                FullName = $"{m.User.FirstName} {m.User.LastName}",
                AvatarUrl = m.User.ImageUrl,
                Role = m.Role,
                LastReadAt = m.LastReadAt,
                JoinedAt = m.JoinedAt
            }).ToList(),
            CreatedAt = conversation.CreatedAt
        };
    }

    public async Task<MessagingConversationDetailDto> CreateConversationAsync(int userId, CreateConversationRequest request)
    {
        var validUserIds = new List<int> { userId };
        validUserIds.AddRange(request.MemberIds.Distinct());

        var existingUsers = await _dbContext.Users
            .Where(u => validUserIds.Contains(u.Id))
            .Select(u => u.Id)
            .ToListAsync();

        if (existingUsers.Count != validUserIds.Count)
            throw new ArgumentException("یک یا چند کاربر نامعتبر هستند.");

        if (request.Type == "direct" && request.MemberIds.Count == 1)
        {
            var existingConv = await FindExistingDirectConversationAsync(userId, request.MemberIds[0]);
            if (existingConv != null)
                return await GetConversationAsync(existingConv.Id, userId)
                       ?? throw new InvalidOperationException("مکالمه یافت نشد.");
        }

        var conversation = new Conversation
        {
            Title = request.Type == "direct" ? null : request.Title,
            Type = request.Type,
            MaktabId = request.MaktabId,
            CreatedBy = userId,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _dbContext.Conversations.Add(conversation);
        await _dbContext.SaveChangesAsync();

        _dbContext.ConversationMembers.Add(new ConversationMember
        {
            ConversationId = conversation.Id,
            UserId = userId,
            Role = "admin",
            JoinedAt = DateTime.UtcNow
        });

        foreach (var memberId in request.MemberIds.Distinct())
        {
            if (memberId != userId)
            {
                _dbContext.ConversationMembers.Add(new ConversationMember
                {
                    ConversationId = conversation.Id,
                    UserId = memberId,
                    Role = "member",
                    JoinedAt = DateTime.UtcNow
                });
            }
        }

        await _dbContext.SaveChangesAsync();

        var memberNames = await _dbContext.Users
            .Where(u => request.MemberIds.Contains(u.Id))
            .Select(u => $"{u.FirstName} {u.LastName}")
            .ToListAsync();

        var creatorName = await _dbContext.Users
            .Where(u => u.Id == userId)
            .Select(u => $"{u.FirstName} {u.LastName}")
            .FirstAsync();

        _dbContext.Messages.Add(new Message
        {
            ConversationId = conversation.Id,
            SenderId = userId,
            Content = request.Type == "direct"
                ? "مکالمه شروع شد"
                : $"گروه «{request.Title ?? "بدون عنوان"}» توسط {creatorName} ایجاد شد. اعضا: {string.Join("، ", memberNames)}",
            MessageType = "system",
            CreatedAt = DateTime.UtcNow
        });

        await _dbContext.SaveChangesAsync();

        return await GetConversationAsync(conversation.Id, userId)
               ?? throw new InvalidOperationException("خطا در ایجاد مکالمه.");
    }

    public async Task<MessagingConversationDetailDto> AddMemberAsync(int conversationId, int userId, AddMemberRequest request)
    {
        var conversation = await _dbContext.Conversations
            .FirstOrDefaultAsync(c => c.Id == conversationId && c.IsActive);

        if (conversation == null)
            throw new KeyNotFoundException("مکالمه یافت نشد.");

        var isAdmin = await _dbContext.ConversationMembers
            .AnyAsync(cm => cm.ConversationId == conversationId && cm.UserId == userId && cm.Role == "admin");

        if (!isAdmin)
            throw new UnauthorizedAccessException("فقط مدیر گروه می‌تواند عضو اضافه کند.");

        var alreadyMember = await _dbContext.ConversationMembers
            .AnyAsync(cm => cm.ConversationId == conversationId && cm.UserId == request.UserId);

        if (alreadyMember)
            throw new InvalidOperationException("کاربر قبلاً عضو این مکالمه است.");

        _dbContext.ConversationMembers.Add(new ConversationMember
        {
            ConversationId = conversationId,
            UserId = request.UserId,
            Role = request.Role,
            JoinedAt = DateTime.UtcNow
        });

        conversation.UpdatedAt = DateTime.UtcNow;

        var userInfo = await _dbContext.Users
            .Where(u => u.Id == request.UserId)
            .Select(u => $"{u.FirstName} {u.LastName}")
            .FirstAsync();

        _dbContext.Messages.Add(new Message
        {
            ConversationId = conversationId,
            SenderId = userId,
            Content = $"{userInfo} به گروه پیوست.",
            MessageType = "system",
            CreatedAt = DateTime.UtcNow
        });

        await _dbContext.SaveChangesAsync();

        return await GetConversationAsync(conversationId, userId)
               ?? throw new InvalidOperationException("خطا در به‌روزرسانی مکالمه.");
    }

    public async Task RemoveMemberAsync(int conversationId, int memberId, int requesterId)
    {
        var conversation = await _dbContext.Conversations
            .FirstOrDefaultAsync(c => c.Id == conversationId && c.IsActive);

        if (conversation == null)
            throw new KeyNotFoundException("مکالمه یافت نشد.");

        var isAdmin = await _dbContext.ConversationMembers
            .AnyAsync(cm => cm.ConversationId == conversationId && cm.UserId == requesterId && cm.Role == "admin");

        if (!isAdmin && requesterId != memberId)
            throw new UnauthorizedAccessException("شما مجاز به حذف این عضو نیستید.");

        var member = await _dbContext.ConversationMembers
            .FirstOrDefaultAsync(cm => cm.ConversationId == conversationId && cm.UserId == memberId);

        if (member == null)
            throw new KeyNotFoundException("عضو یافت نشد.");

        _dbContext.ConversationMembers.Remove(member);
        conversation.UpdatedAt = DateTime.UtcNow;

        var userInfo = await _dbContext.Users
            .Where(u => u.Id == memberId)
            .Select(u => $"{u.FirstName} {u.LastName}")
            .FirstAsync();

        _dbContext.Messages.Add(new Message
        {
            ConversationId = conversationId,
            SenderId = requesterId,
            Content = $"{userInfo} از گروه خارج شد.",
            MessageType = "system",
            CreatedAt = DateTime.UtcNow
        });

        await _dbContext.SaveChangesAsync();
    }

    public async Task DeleteConversationAsync(int conversationId, int userId)
    {
        var conversation = await _dbContext.Conversations
            .FirstOrDefaultAsync(c => c.Id == conversationId && c.IsActive);

        if (conversation == null)
            throw new KeyNotFoundException("مکالمه یافت نشد.");

        var isAdmin = await _dbContext.ConversationMembers
            .AnyAsync(cm => cm.ConversationId == conversationId && cm.UserId == userId && cm.Role == "admin");

        if (!isAdmin)
            throw new UnauthorizedAccessException("فقط مدیر می‌تواند مکالمه را حذف کند.");

        conversation.IsActive = false;
        conversation.UpdatedAt = DateTime.UtcNow;
        await _dbContext.SaveChangesAsync();
    }

    public async Task<UnreadCountDto> GetUnreadCountAsync(int userId)
    {
        var memberships = await _dbContext.ConversationMembers
            .Where(cm => cm.UserId == userId)
            .ToListAsync();

        var membershipDict = memberships.ToDictionary(m => m.ConversationId, m => m.LastReadAt);
        var conversationIds = membershipDict.Keys.ToList();

        var messages = await _dbContext.Messages
            .Where(m => conversationIds.Contains(m.ConversationId) &&
                        !m.IsDeleted &&
                        m.SenderId != userId)
            .Select(m => new { m.ConversationId, m.CreatedAt })
            .ToListAsync();

        var result = new UnreadCountDto { PerConversation = new Dictionary<int, int>() };

        foreach (var membership in memberships)
        {
            var lastReadAt = membership.LastReadAt;
            var unread = messages.Count(m =>
                m.ConversationId == membership.ConversationId &&
                (lastReadAt == null || m.CreatedAt > lastReadAt));

            if (unread > 0)
            {
                result.PerConversation[membership.ConversationId] = unread;
                result.TotalUnread += unread;
            }
        }

        return result;
    }

    private async Task<Conversation?> FindExistingDirectConversationAsync(int userId1, int userId2)
    {
        var user1Conversations = await _dbContext.ConversationMembers
            .Where(cm => cm.UserId == userId1)
            .Select(cm => cm.ConversationId)
            .ToListAsync();

        var user2Conversations = await _dbContext.ConversationMembers
            .Where(cm => cm.UserId == userId2)
            .Select(cm => cm.ConversationId)
            .ToListAsync();

        var commonIds = user1Conversations.Intersect(user2Conversations).ToList();

        return await _dbContext.Conversations
            .Where(c => commonIds.Contains(c.Id) && c.Type == "direct" && c.IsActive)
            .FirstOrDefaultAsync();
    }

    private string GetConversationTitle(Conversation conversation, int currentUserId)
    {
        if (!string.IsNullOrEmpty(conversation.Title))
            return conversation.Title;

        var otherMembers = conversation.Members
            .Where(m => m.UserId != currentUserId)
            .Select(m => $"{m.User.FirstName} {m.User.LastName}")
            .ToList();

        return otherMembers.Count switch
        {
            0 => "مکالمه",
            1 => otherMembers[0],
            _ => $"{otherMembers[0]} و {otherMembers.Count - 1} نفر دیگر"
        };
    }

    private MessagingMessageDto MapToMessageDto(Message message)
    {
        return new MessagingMessageDto
        {
            Id = message.Id,
            ConversationId = message.ConversationId,
            SenderId = message.SenderId,
            SenderName = $"{message.Sender.FirstName} {message.Sender.LastName}",
            SenderAvatar = message.Sender.ImageUrl,
            Content = message.Content,
            MessageType = message.MessageType,
            ReplyToId = message.ReplyToId,
            IsEdited = message.IsEdited,
            IsDeleted = message.IsDeleted,
            Attachments = message.Attachments.Select(a => new AttachmentDto
            {
                Id = a.Id,
                FileName = a.FileName,
                FileUrl = a.FilePath,
                FileSize = a.FileSize,
                MimeType = a.MimeType
            }).ToList(),
            CreatedAt = message.CreatedAt,
            UpdatedAt = message.UpdatedAt
        };
    }
}
