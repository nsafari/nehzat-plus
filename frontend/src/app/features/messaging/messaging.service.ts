import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import type {
  MessagingConversationListDto,
  MessagingConversationDetailDto,
  CreateConversationRequest,
  MessagePagedResponse,
  MessagingMessageDto,
  SendMessageRequest,
  MarkReadRequest,
  UnreadCountDto,
} from '../../core/models/lesson-planner.models';
import { LESSON_PLANNER_API } from '../../core/services/lesson-planner-api.token';

@Injectable({ providedIn: 'root' })
export class MessagingService {
  private readonly api = inject(LESSON_PLANNER_API);

  getConversations(): Observable<MessagingConversationListDto[]> {
    return this.api.getConversations();
  }

  getConversation(conversationId: number): Observable<MessagingConversationDetailDto> {
    return this.api.getConversation(conversationId);
  }

  createConversation(payload: CreateConversationRequest): Observable<MessagingConversationDetailDto> {
    return this.api.createConversation(payload);
  }

  deleteConversation(conversationId: number): Observable<void> {
    return this.api.deleteConversation(conversationId);
  }

  getMessages(conversationId: number, page = 1, pageSize = 20): Observable<MessagePagedResponse> {
    return this.api.getMessages(conversationId, page, pageSize);
  }

  sendMessage(conversationId: number, payload: SendMessageRequest): Observable<MessagingMessageDto> {
    return this.api.sendMessage(conversationId, payload);
  }

  editMessage(conversationId: number, messageId: number, content: string): Observable<MessagingMessageDto> {
    return this.api.editMessage(conversationId, messageId, content);
  }

  deleteMessage(conversationId: number, messageId: number): Observable<void> {
    return this.api.deleteMessage(conversationId, messageId);
  }

  markMessagesRead(conversationId: number, payload: MarkReadRequest): Observable<void> {
    return this.api.markMessagesRead(conversationId, payload);
  }

  getConversationUnreadCount(): Observable<UnreadCountDto> {
    return this.api.getConversationUnreadCount();
  }
}