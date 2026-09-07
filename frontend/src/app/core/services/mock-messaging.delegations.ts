import { Observable } from 'rxjs';
import { MockLessonPlannerApiBase, type MockApiCtor } from './mock-lesson-planner-base';
import type {
  MessagingConversationListDto,
  MessagingConversationDetailDto,
  CreateConversationRequest,
  MessagePagedResponse,
  MessagingMessageDto,
  SendMessageRequest,
  MarkReadRequest,
  UnreadCountDto,
} from './mock-lesson-planner-models';

export function withMessaging<T extends MockApiCtor>(Base: T) {
  return class extends Base {
    getConversations(): Observable<MessagingConversationListDto[]> {
      return this.messaging.getConversations();
    }

    getConversation(conversationId: number): Observable<MessagingConversationDetailDto> {
      return this.messaging.getConversation(conversationId);
    }

    createConversation(payload: CreateConversationRequest): Observable<MessagingConversationDetailDto> {
      return this.messaging.createConversation(payload);
    }

    deleteConversation(conversationId: number): Observable<void> {
      return this.messaging.deleteConversation(conversationId);
    }

    getMessages(conversationId: number, page: number, pageSize: number): Observable<MessagePagedResponse> {
      return this.messaging.getMessages(conversationId, page, pageSize);
    }

    sendMessage(conversationId: number, payload: SendMessageRequest): Observable<MessagingMessageDto> {
      return this.messaging.sendMessage(conversationId, payload);
    }

    editMessage(conversationId: number, messageId: number, content: string): Observable<MessagingMessageDto> {
      return this.messaging.editMessage(conversationId, messageId, content);
    }

    deleteMessage(conversationId: number, messageId: number): Observable<void> {
      return this.messaging.deleteMessage(conversationId, messageId);
    }

    markMessagesRead(conversationId: number, payload: MarkReadRequest): Observable<void> {
      return this.messaging.markMessagesRead(conversationId, payload);
    }

    getConversationUnreadCount(): Observable<UnreadCountDto> {
      return this.messaging.getConversationUnreadCount();
    }
  };
}