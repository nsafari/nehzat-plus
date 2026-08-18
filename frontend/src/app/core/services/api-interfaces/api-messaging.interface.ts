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

export abstract class MessagingApi {
  abstract getConversations(): Observable<MessagingConversationListDto[]>;
  abstract getConversation(conversationId: number): Observable<MessagingConversationDetailDto>;
  abstract createConversation(payload: CreateConversationRequest): Observable<MessagingConversationDetailDto>;
  abstract deleteConversation(conversationId: number): Observable<void>;
  abstract getMessages(conversationId: number, page: number, pageSize: number): Observable<MessagePagedResponse>;
  abstract sendMessage(conversationId: number, payload: SendMessageRequest): Observable<MessagingMessageDto>;
  abstract editMessage(conversationId: number, messageId: number, content: string): Observable<MessagingMessageDto>;
  abstract deleteMessage(conversationId: number, messageId: number): Observable<void>;
  abstract markMessagesRead(conversationId: number, payload: MarkReadRequest): Observable<void>;
  abstract getConversationUnreadCount(): Observable<UnreadCountDto>;
}