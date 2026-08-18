using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Domain.Entities;
using EducationalPlatform.Nehzat.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace EducationalPlatform.Nehzat.Infrastructure.Services;

public class MessageService : IMessageService
{
    private readonly AppDbContext _dbContext;
    private readonly ILogger<MessageService> _logger;

    public MessageService(AppDbContext dbContext, ILogger<MessageService> logger)
    {
        _dbContext = dbContext;
        _logger = logger;
    }

    public async Task<MessagePagedResponse> GetMessagesAsync(int conversationId, int userId, int page = 1, int pageSize = 50)
    {
        var isMember = await _dbContext.ConversationMembers
            .AnyAsync(cm => cm.ConversationId == conversationId && cm.UserId == userId);

        if (!isMember)
            throw new UnauthorizedAccessException("شما عضو این مکالمه نیستید.");

        var query = _dbContext.Messages
            .Where(m => m.ConversationId == conversationId && !m.IsDeleted)
            .Include(m => m.Sender)
            .Include(m => m.Attachments)
            .Include(m => m.ReplyTo).ThenInclude(r => r!.Sender)
            .OrderByDescending(m => m.CreatedAt);

        var totalCount = await query.CountAsync();
        var messages = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new MessagePagedResponse
        {
            Messages = messages.Select(MapToMessageDto).OrderBy(m => m.CreatedAt).ToList(),
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize,
            HasMore = (page * pageSize) < totalCount
        };
    }

    public async Task<MessagingMessageDto> SendMessageAsync(int userId, SendMessageRequest request)
    {
        var isMember = await _dbContext.ConversationMembers
            .AnyAsync(cm => cm.ConversationId == request.ConversationId && cm.UserId == userId);

        if (!isMember)
            throw new UnauthorizedAccessException("شما عضو این مکالمه نیستید.");

        var conversation = await _dbContext.Conversations
            .FirstOrDefaultAsync(c => c.Id == request.ConversationId && c.IsActive);

        if (conversation == null)
            throw new KeyNotFoundException("مکالمه یافت نشد.");

        if (request.ReplyToId.HasValue)
        {
            var replyExists = await _dbContext.Messages
                .AnyAsync(m => m.Id == request.ReplyToId && m.ConversationId == request.ConversationId);
            if (!replyExists)
                throw new ArgumentException("پیام مورد نظر برای پاسخ یافت نشد.");
        }

        var message = new Message
        {
            ConversationId = request.ConversationId,
            SenderId = userId,
            Content = request.Content,
            MessageType = request.MessageType,
            ReplyToId = request.ReplyToId,
            CreatedAt = DateTime.UtcNow
        };

        _dbContext.Messages.Add(message);
        conversation.UpdatedAt = DateTime.UtcNow;
        await _dbContext.SaveChangesAsync();

        var savedMessage = await _dbContext.Messages
            .Include(m => m.Sender)
            .Include(m => m.Attachments)
            .Include(m => m.ReplyTo).ThenInclude(r => r!.Sender)
            .FirstAsync(m => m.Id == message.Id);

        return MapToMessageDto(savedMessage);
    }

    public async Task<MessagingMessageDto> EditMessageAsync(int messageId, int userId, string newContent)
    {
        var message = await _dbContext.Messages
            .Include(m => m.Sender)
            .Include(m => m.Attachments)
            .Include(m => m.ReplyTo).ThenInclude(r => r!.Sender)
            .FirstOrDefaultAsync(m => m.Id == messageId && !m.IsDeleted);

        if (message == null)
            throw new KeyNotFoundException("پیام یافت نشد.");

        if (message.SenderId != userId)
            throw new UnauthorizedAccessException("شما نمی‌توانید پیام دیگران را ویرایش کنید.");

        if (message.MessageType == "system")
            throw new InvalidOperationException("پیام سیستمی قابل ویرایش نیست.");

        message.Content = newContent;
        message.IsEdited = true;
        message.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync();

        return MapToMessageDto(message);
    }

    public async Task DeleteMessageAsync(int messageId, int userId)
    {
        var message = await _dbContext.Messages
            .FirstOrDefaultAsync(m => m.Id == messageId && !m.IsDeleted);

        if (message == null)
            throw new KeyNotFoundException("پیام یافت نشد.");

        var isAdmin = await _dbContext.ConversationMembers
            .AnyAsync(cm => cm.ConversationId == message.ConversationId && cm.UserId == userId && cm.Role == "admin");

        if (message.SenderId != userId && !isAdmin)
            throw new UnauthorizedAccessException("شما مجاز به حذف این پیام نیستید.");

        message.IsDeleted = true;
        message.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync();
    }

    public async Task MarkAsReadAsync(int conversationId, int userId, MarkReadRequest request)
    {
        var membership = await _dbContext.ConversationMembers
            .FirstOrDefaultAsync(cm => cm.ConversationId == conversationId && cm.UserId == userId);

        if (membership == null)
            throw new KeyNotFoundException("عضویت یافت نشد.");

        membership.LastReadAt = DateTime.UtcNow;
        await _dbContext.SaveChangesAsync();
    }

    public async Task<int> GetUnreadCountAsync(int conversationId, int userId)
    {
        var membership = await _dbContext.ConversationMembers
            .FirstOrDefaultAsync(cm => cm.ConversationId == conversationId && cm.UserId == userId);

        if (membership == null) return 0;

        return await _dbContext.Messages
            .CountAsync(m => m.ConversationId == conversationId &&
                        !m.IsDeleted &&
                        m.SenderId != userId &&
                        (membership.LastReadAt == null || m.CreatedAt > membership.LastReadAt));
    }

    private MessagingMessageDto MapToMessageDto(Message message)
    {
        var dto = new MessagingMessageDto
        {
            Id = message.Id,
            ConversationId = message.ConversationId,
            SenderId = message.SenderId,
            SenderName = $"{message.Sender.FirstName} {message.Sender.LastName}",
            SenderAvatar = message.Sender.ImageUrl,
            Content = message.IsDeleted ? "این پیام حذف شده است." : message.Content,
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

        if (message.ReplyTo != null)
        {
            dto.ReplyTo = new MessagingMessageDto
            {
                Id = message.ReplyTo.Id,
                SenderId = message.ReplyTo.SenderId,
                SenderName = $"{message.ReplyTo.Sender.FirstName} {message.ReplyTo.Sender.LastName}",
                Content = message.ReplyTo.Content.Length > 100
                    ? message.ReplyTo.Content.Substring(0, 100) + "..."
                    : message.ReplyTo.Content,
                CreatedAt = message.ReplyTo.CreatedAt
            };
        }

        return dto;
    }
}
