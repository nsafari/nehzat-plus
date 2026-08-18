import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AiChatRequest {
  conversationId?: number;
  message: string;
  maktabId?: number;
  subjectId?: number;
}

export interface SourceDto {
  documentId: number;
  title: string;
  documentType: string;
  relevanceScore: number;
}

export interface AiChatResponse {
  conversationId: number;
  response: string;
  sources: SourceDto[];
  createdAt: string;
}

export interface ConversationDto {
  id: number;
  title: string | null;
  messageCount: number;
  lastMessage: string | null;
  createdAt: string;
}

export interface MessageDto {
  id: number;
  role: 'user' | 'assistant' | 'system';
  content: string;
  sources?: SourceDto[];
  createdAt: string;
}

export interface ConversationDetailDto {
  id: number;
  title: string | null;
  messages: MessageDto[];
  createdAt: string;
}

export interface KnowledgeDocumentDto {
  id: number;
  title: string;
  content: string;
  documentType: string;
  subjectId?: number;
  maktabId?: number;
  isActive: boolean;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class AiService {
  private http = inject(HttpClient);
  private baseUrl = '/api/ai';

  chat(request: AiChatRequest): Observable<AiChatResponse> {
    return this.http.post<AiChatResponse>(`${this.baseUrl}/chat`, request);
  }

  getConversations(): Observable<ConversationDto[]> {
    return this.http.get<ConversationDto[]>(`${this.baseUrl}/conversations`);
  }

  getConversation(id: number): Observable<ConversationDetailDto> {
    return this.http.get<ConversationDetailDto>(`${this.baseUrl}/conversations/${id}`);
  }

  deleteConversation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/conversations/${id}`);
  }

  getKnowledgeDocuments(maktabId?: number): Observable<KnowledgeDocumentDto[]> {
    const params = maktabId ? { maktabId: maktabId.toString() } : undefined;
    return this.http.get<KnowledgeDocumentDto[]>(`${this.baseUrl}/knowledge`, { params });
  }

  createKnowledgeDocument(data: {
    title: string;
    content: string;
    documentType: string;
    subjectId?: number;
    maktabId?: number;
  }): Observable<KnowledgeDocumentDto> {
    return this.http.post<KnowledgeDocumentDto>(`${this.baseUrl}/knowledge`, data);
  }

  deleteKnowledgeDocument(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/knowledge/${id}`);
  }
}
