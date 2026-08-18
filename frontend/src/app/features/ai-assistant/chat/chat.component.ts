import { Component, OnInit, inject, signal, viewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiService, MessageDto, ConversationDto } from '../../../core/services/ai.service';
import { LpTripleDateComponent } from '../../../shared/components/lp-triple-date/lp-triple-date.component';

@Component({
  selector: 'lp-ai-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, LpTripleDateComponent],
  template: `
    <div class="ai-chat-container">
      <!-- Sidebar: Conversation List -->
      <aside class="conversation-sidebar" *ngIf="showSidebar()">
        <div class="sidebar-header">
          <h3>مکالمات</h3>
          <button class="btn-new-chat" (click)="startNewChat()">
            + مکالمه جدید
          </button>
        </div>

        <div class="conversation-list">
          <div *ngFor="let conv of conversations()"
               class="conversation-item"
               [class.active]="conv.id === activeConversationId()"
               (click)="loadConversation(conv.id)">
            <div class="conv-title">{{ conv.title || 'مکالمه جدید' }}</div>
            <div class="conv-meta">
              <span>{{ conv.messageCount }} پیام</span>
              <span>{{ conv.createdAt | date:'short' }}</span>
            </div>
          </div>
        </div>
      </aside>

      <!-- Main Chat Area -->
      <main class="chat-main">
        <div class="chat-header">
          <button class="btn-toggle-sidebar" (click)="toggleSidebar()">
            ☰
          </button>
          <h2>{{ activeConversationTitle() || 'دستیار هوشمند نهضت' }}</h2>
        </div>

        <!-- Messages -->
        <div class="messages-container" #messagesContainer>
          <div *ngIf="messages().length === 0" class="empty-state">
            <div class="empty-icon">🤖</div>
            <h3>از دستیار هوشمند بپرس</h3>
            <p>سوالات آموزشی خود را بپرسید. مثلاً:</p>
            <div class="suggestions">
              <button class="suggestion-chip" (click)="sendQuickQuestion('مفهوم توحید در قرآن چیست؟')">
                مفهوم توحید در قرآن
              </button>
              <button class="suggestion-chip" (click)="sendQuickQuestion('چطور می‌توانم برنامه مطالعه مؤثری داشته باشم؟')">
                برنامه مطالعه
              </button>
              <button class="suggestion-chip" (click)="sendQuickQuestion('شرح دعای مکارم الاخلاق')">
                شرح دعا
              </button>
            </div>
          </div>

          <div *ngFor="let msg of messages()"
               class="message"
               [class.user-message]="msg.role === 'user'"
               [class.assistant-message]="msg.role === 'assistant'">
            <div class="message-avatar">
              {{ msg.role === 'user' ? '👤' : '🤖' }}
            </div>
            <div class="message-content">
              <div class="message-text">{{ msg.content }}</div>
              <div *ngIf="msg.sources && msg.sources.length > 0" class="message-sources">
                <span class="sources-label">منابع:</span>
                <span *ngFor="let src of msg.sources" class="source-badge">
                  {{ src.title }}
                </span>
              </div>
              <div class="message-time">
                <lp-triple-date [date]="msg.createdAt" [showDetail]="true"></lp-triple-date>
              </div>
            </div>
          </div>

          <!-- Loading -->
          <div *ngIf="isLoading()" class="message assistant-message">
            <div class="message-avatar">🤖</div>
            <div class="message-content">
              <div class="typing-indicator">
                <span></span><span></span><span></span>
              </div>
            </div>
          </div>
        </div>

        <!-- Input -->
        <div class="chat-input-container">
          <div class="input-wrapper">
            <textarea
              [(ngModel)]="currentMessage"
              (keydown.enter)="sendMessage($event)"
              placeholder="سوال خود را بپرسید..."
              rows="1"
              class="chat-input">
            </textarea>
            <button class="btn-send" (click)="sendMessage()" [disabled]="!currentMessage.trim() || isLoading()">
              ارسال
            </button>
          </div>
          <div class="input-footer">
            <span>دستیار هوشمند ممکن است خطا داشته باشد. اطلاعات را تأیید کنید.</span>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .ai-chat-container {
      display: flex;
      height: calc(100vh - 120px);
      background: var(--lp-color-bg, #f5f5f5);
      border-radius: 12px;
      overflow: hidden;
    }

    .conversation-sidebar {
      width: 280px;
      background: var(--lp-color-surface, #fff);
      border-left: 1px solid var(--lp-color-border, #e0e0e0);
      display: flex;
      flex-direction: column;
    }

    .sidebar-header {
      padding: 16px;
      border-bottom: 1px solid var(--lp-color-border, #e0e0e0);
    }

    .sidebar-header h3 {
      margin: 0 0 12px 0;
      font-size: 16px;
    }

    .btn-new-chat {
      width: 100%;
      padding: 8px 16px;
      background: var(--lp-color-primary, #1a73e8);
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
    }

    .conversation-list {
      flex: 1;
      overflow-y: auto;
      padding: 8px;
    }

    .conversation-item {
      padding: 12px;
      border-radius: 8px;
      cursor: pointer;
      margin-bottom: 4px;
    }

    .conversation-item:hover {
      background: var(--lp-color-bg-hover, #f0f0f0);
    }

    .conversation-item.active {
      background: var(--lp-color-primary-light, #e8f0fe);
    }

    .conv-title {
      font-weight: 500;
      margin-bottom: 4px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .conv-meta {
      font-size: 12px;
      color: var(--lp-color-text-secondary, #666);
    }

    .chat-main {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .chat-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      background: var(--lp-color-surface, #fff);
      border-bottom: 1px solid var(--lp-color-border, #e0e0e0);
    }

    .chat-header h2 {
      margin: 0;
      font-size: 18px;
    }

    .btn-toggle-sidebar {
      background: none;
      border: none;
      font-size: 20px;
      cursor: pointer;
      padding: 4px 8px;
    }

    .messages-container {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: var(--lp-color-text-secondary, #666);
    }

    .empty-icon {
      font-size: 64px;
      margin-bottom: 16px;
    }

    .suggestions {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      justify-content: center;
      margin-top: 16px;
    }

    .suggestion-chip {
      padding: 8px 16px;
      background: var(--lp-color-surface, #fff);
      border: 1px solid var(--lp-color-border, #e0e0e0);
      border-radius: 20px;
      cursor: pointer;
      font-size: 14px;
    }

    .suggestion-chip:hover {
      background: var(--lp-color-primary-light, #e8f0fe);
      border-color: var(--lp-color-primary, #1a73e8);
    }

    .message {
      display: flex;
      gap: 12px;
      max-width: 80%;
    }

    .user-message {
      align-self: flex-end;
      flex-direction: row-reverse;
    }

    .assistant-message {
      align-self: flex-start;
    }

    .message-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      background: var(--lp-color-bg, #f0f0f0);
      flex-shrink: 0;
    }

    .message-content {
      background: var(--lp-color-surface, #fff);
      padding: 12px 16px;
      border-radius: 12px;
      box-shadow: 0 1px 2px rgba(0,0,0,0.1);
    }

    .user-message .message-content {
      background: var(--lp-color-primary, #1a73e8);
      color: white;
    }

    .message-text {
      line-height: 1.6;
      white-space: pre-wrap;
    }

    .message-sources {
      margin-top: 8px;
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      align-items: center;
    }

    .sources-label {
      font-size: 12px;
      color: var(--lp-color-text-secondary, #666);
    }

    .source-badge {
      font-size: 11px;
      padding: 2px 8px;
      background: var(--lp-color-bg, #f0f0f0);
      border-radius: 12px;
      color: var(--lp-color-text-secondary, #666);
    }

    .message-time {
      margin-top: 4px;
      font-size: 11px;
      opacity: 0.7;
    }

    .typing-indicator {
      display: flex;
      gap: 4px;
      padding: 8px 0;
    }

    .typing-indicator span {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--lp-color-text-secondary, #666);
      animation: typing 1.4s infinite;
    }

    .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
    .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }

    @keyframes typing {
      0%, 60%, 100% { opacity: 0.3; transform: scale(1); }
      30% { opacity: 1; transform: scale(1.2); }
    }

    .chat-input-container {
      padding: 16px;
      background: var(--lp-color-surface, #fff);
      border-top: 1px solid var(--lp-color-border, #e0e0e0);
    }

    .input-wrapper {
      display: flex;
      gap: 8px;
      align-items: flex-end;
    }

    .chat-input {
      flex: 1;
      padding: 12px 16px;
      border: 1px solid var(--lp-color-border, #e0e0e0);
      border-radius: 12px;
      resize: none;
      font-family: inherit;
      font-size: 14px;
      line-height: 1.5;
      max-height: 120px;
    }

    .chat-input:focus {
      outline: none;
      border-color: var(--lp-color-primary, #1a73e8);
    }

    .btn-send {
      padding: 12px 24px;
      background: var(--lp-color-primary, #1a73e8);
      color: white;
      border: none;
      border-radius: 12px;
      cursor: pointer;
      font-weight: 500;
    }

    .btn-send:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .input-footer {
      margin-top: 8px;
      text-align: center;
      font-size: 11px;
      color: var(--lp-color-text-secondary, #999);
    }
  `]
})
export class AiChatComponent implements OnInit, AfterViewChecked {
  private aiService = inject(AiService);
  private messagesContainer = viewChild<ElementRef>('messagesContainer');

  conversations = signal<ConversationDto[]>([]);
  messages = signal<MessageDto[]>([]);
  activeConversationId = signal<number | null>(null);
  activeConversationTitle = signal<string>('دستیار هوشمند نهضت');
  isLoading = signal(false);
  showSidebar = signal(true);
  currentMessage = '';

  ngOnInit(): void {
    this.loadConversations();
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  loadConversations(): void {
    this.aiService.getConversations().subscribe({
      next: (convs) => this.conversations.set(convs)
    });
  }

  loadConversation(id: number): void {
    this.activeConversationId.set(id);
    this.aiService.getConversation(id).subscribe({
      next: (conv) => {
        this.messages.set(conv.messages);
        this.activeConversationTitle.set(conv.title || 'مکالمه');
      }
    });
  }

  startNewChat(): void {
    this.activeConversationId.set(null);
    this.messages.set([]);
    this.activeConversationTitle.set('مکالمه جدید');
    this.currentMessage = '';
  }

  sendMessage(event?: Event): void {
    const keyEvent = event as KeyboardEvent | undefined;
    if (keyEvent) {
      if (keyEvent.shiftKey) return;
      keyEvent.preventDefault();
    }

    const message = this.currentMessage.trim();
    if (!message || this.isLoading()) return;

    const userMsg: MessageDto = {
      id: Date.now(),
      role: 'user',
      content: message,
      createdAt: new Date().toISOString()
    };
    this.messages.update(msgs => [...msgs, userMsg]);
    this.currentMessage = '';
    this.isLoading.set(true);

    this.aiService.chat({
      conversationId: this.activeConversationId() ?? undefined,
      message
    }).subscribe({
      next: (response) => {
        const assistantMsg: MessageDto = {
          id: Date.now() + 1,
          role: 'assistant',
          content: response.response,
          sources: response.sources,
          createdAt: response.createdAt
        };
        this.messages.update(msgs => [...msgs, assistantMsg]);
        this.activeConversationId.set(response.conversationId);
        this.isLoading.set(false);
        this.loadConversations();
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  sendQuickQuestion(question: string): void {
    this.currentMessage = question;
    this.sendMessage();
  }

  toggleSidebar(): void {
    this.showSidebar.update(v => !v);
  }

  private scrollToBottom(): void {
    const container = this.messagesContainer();
    if (container) {
      container.nativeElement.scrollTop = container.nativeElement.scrollHeight;
    }
  }
}
