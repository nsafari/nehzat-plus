import { Constructor, HttpServiceContext } from './base';
import { Observable } from 'rxjs';
import {
  MessagingConversationListDto,
  MessagingConversationDetailDto,
  CreateConversationRequest,
  MessagePagedResponse,
  MessagingMessageDto,
  SendMessageRequest,
  MarkReadRequest,
  UnreadCountDto,
} from '../../models/lesson-planner.models';

export function WithMessaging<TBase extends Constructor<HttpServiceContext>>(Base: TBase) {
  return class extends Base {
    getConversations(): Observable<MessagingConversationListDto[]> {
      return this.http.get<MessagingConversationListDto[]>(this.url('/api/conversations'));
    }

    getConversation(conversationId: number): Observable<MessagingConversationDetailDto> {
      return this.http.get<MessagingConversationDetailDto>(this.url(`/api/conversations/${conversationId}`));
    }

    createConversation(payload: CreateConversationRequest): Observable<MessagingConversationDetailDto> {
      return this.http.post<MessagingConversationDetailDto>(this.url('/api/conversations'), payload);
    }

    deleteConversation(conversationId: number): Observable<void> {
      return this.http.delete<void>(this.url(`/api/conversations/${conversationId}`));
    }

    getMessages(conversationId: number, page: number, pageSize: number): Observable<MessagePagedResponse> {
      const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
      return this.http.get<MessagePagedResponse>(
        this.url(`/api/conversations/${conversationId}/messages?${params.toString()}`),
      );
    }

    sendMessage(conversationId: number, payload: SendMessageRequest): Observable<MessagingMessageDto> {
      return this.http.post<MessagingMessageDto>(
        this.url(`/api/conversations/${conversationId}/messages`),
        payload,
      );
    }

    editMessage(conversationId: number, messageId: number, content: string): Observable<MessagingMessageDto> {
      return this.http.put<MessagingMessageDto>(
        this.url(`/api/conversations/${conversationId}/messages/${messageId}`),
        { content },
      );
    }

    deleteMessage(conversationId: number, messageId: number): Observable<void> {
      return this.http.delete<void>(this.url(`/api/conversations/${conversationId}/messages/${messageId}`));
    }

    markMessagesRead(conversationId: number, payload: MarkReadRequest): Observable<void> {
      return this.http.post<void>(this.url(`/api/conversations/${conversationId}/messages/read`), payload);
    }

    getConversationUnreadCount(): Observable<UnreadCountDto> {
      return this.http.get<UnreadCountDto>(this.url('/api/conversations/unread'));
    }
  };
}