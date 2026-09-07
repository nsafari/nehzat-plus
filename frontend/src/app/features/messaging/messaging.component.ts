import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { NotificationService } from '../../core/services/notification.service';
import type {
  MessagingConversationListDto,
  MessagingConversationDetailDto,
  CreateConversationRequest,
  MessagingMessageDto,
} from '../../core/models/lesson-planner.models';
import { MessagingService } from './messaging.service';

const SELF_USER_ID = 1;
const PAGE_SIZE = 20;

const CANDIDATE_MEMBERS = [
  { userId: 2, fullName: 'فاطمه محمدی' },
  { userId: 3, fullName: 'محمد رضایی' },
  { userId: 11, fullName: 'آقای موسوی' },
];

@Component({
  selector: 'app-messaging',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './messaging.component.html',
  styleUrls: ['./messaging.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessagingComponent implements OnInit {
  private readonly messagingService = inject(MessagingService);
  private readonly notify = inject(NotificationService);
  private readonly destroyRef = inject(DestroyRef);

  readonly selfUserId = SELF_USER_ID;
  readonly candidateMembers = CANDIDATE_MEMBERS;

  conversations = signal<MessagingConversationListDto[]>([]);
  activeConversation = signal<MessagingConversationDetailDto | null>(null);
  messages = signal<MessagingMessageDto[]>([]);

  unreadTotal = signal(0);
  loading = signal(true);
  loadingMessages = signal(false);
  loadingMore = signal(false);
  sending = signal(false);
  hasMore = signal(false);
  page = 1;

  showCreate = signal(false);
  creating = signal(false);
  newTitle = signal('');
  newType = signal<'direct' | 'group' | 'announcement'>('group');
  selectedMemberIds = signal<number[]>([]);

  draft = signal('');
  editingMessageId = signal<number | null>(null);
  editDraft = signal('');

  ngOnInit(): void {
    this.loadConversations();
    this.loadUnreadCount();
  }

  loadConversations(): void {
    this.loading.set(true);
    this.messagingService
      .getConversations()
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (list) => this.conversations.set(list),
        error: () => this.notify.show('خطا در دریافت گفتگوها', 'error'),
      });
  }

  loadUnreadCount(): void {
    this.messagingService
      .getConversationUnreadCount()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (dto) => this.unreadTotal.set(dto.totalUnread),
        error: () => undefined,
      });
  }

  selectConversation(conversationId: number): void {
    if (this.activeConversation()?.id === conversationId && this.messages().length) {
      return;
    }
    this.showCreate.set(false);
    this.loadingMessages.set(true);
    this.activeConversation.set(null);
    this.messages.set([]);
    this.page = 1;
    this.hasMore.set(false);

    this.messagingService
      .getConversation(conversationId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (detail) => this.activeConversation.set(detail),
        error: () => this.notify.show('خطا در دریافت گفتگو', 'error'),
      });

    this.messagingService
      .getMessages(conversationId, 1, PAGE_SIZE)
      .pipe(
        finalize(() => this.loadingMessages.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (response) => {
          this.messages.set(response.messages);
          this.hasMore.set(response.hasMore);
          if (response.messages.length) {
            this.markRead(conversationId, response.messages.map((m) => m.id));
          }
        },
        error: () => this.notify.show('خطا در دریافت پیام‌ها', 'error'),
      });
  }

  loadMoreMessages(): void {
    const conv = this.activeConversation();
    if (!conv || this.loadingMore()) {
      return;
    }
    this.loadingMore.set(true);
    this.messagingService
      .getMessages(conv.id, this.page + 1, PAGE_SIZE)
      .pipe(
        finalize(() => this.loadingMore.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (response) => {
          this.page += 1;
          this.hasMore.set(response.hasMore);
          this.messages.set([...response.messages, ...this.messages()]);
        },
        error: () => this.notify.show('خطا در دریافت پیام‌های قدیمی‌تر', 'error'),
      });
  }

  sendMessage(): void {
    const conv = this.activeConversation();
    const content = this.draft().trim();
    if (!conv || !content || this.sending()) {
      return;
    }
    this.sending.set(true);
    this.messagingService
      .sendMessage(conv.id, { conversationId: conv.id, content, messageType: 'text' })
      .pipe(
        finalize(() => this.sending.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (message) => {
          this.messages.update((list) => [...list, message]);
          this.draft.set('');
          this.conversations.update((list) =>
            list.map((c) =>
              c.id === conv.id
                ? { ...c, lastMessage: message, updatedAt: message.createdAt, unreadCount: 0 }
                : c,
            ),
          );
        },
        error: () => this.notify.show('خطا در ارسال پیام', 'error'),
      });
  }

  startCreate(): void {
    this.showCreate.set(true);
    this.newTitle.set('');
    this.newType.set('group');
    this.selectedMemberIds.set([]);
  }

  cancelCreate(): void {
    this.showCreate.set(false);
  }

  toggleMember(userId: number): void {
    this.selectedMemberIds.update((ids) =>
      ids.includes(userId) ? ids.filter((id) => id !== userId) : [...ids, userId],
    );
  }

  createConversation(): void {
    if (this.creating()) {
      return;
    }
    const payload: CreateConversationRequest = {
      title: this.newTitle().trim() || 'گفتگوی جدید',
      type: this.newType(),
      memberIds: this.selectedMemberIds(),
    };
    this.creating.set(true);
    this.messagingService
      .createConversation(payload)
      .pipe(
        finalize(() => this.creating.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (created) => {
          const listItem: MessagingConversationListDto = {
            id: created.id,
            title: created.title,
            type: created.type,
            unreadCount: 0,
            members: created.members,
            createdAt: created.createdAt,
            updatedAt: created.createdAt,
          };
          this.conversations.update((list) => [listItem, ...list]);
          this.showCreate.set(false);
          this.notify.show('گفتگو ایجاد شد', 'success');
          this.selectConversation(created.id);
        },
        error: () => this.notify.show('خطا در ایجاد گفتگو', 'error'),
      });
  }

  deleteConversation(conversationId: number): void {
    this.messagingService
      .deleteConversation(conversationId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.conversations.update((list) => list.filter((c) => c.id !== conversationId));
          if (this.activeConversation()?.id === conversationId) {
            this.activeConversation.set(null);
            this.messages.set([]);
          }
          this.notify.show('گفتگو حذف شد', 'success');
        },
        error: () => this.notify.show('خطا در حذف گفتگو', 'error'),
      });
  }

  startEdit(message: MessagingMessageDto): void {
    this.editingMessageId.set(message.id);
    this.editDraft.set(message.content);
  }

  cancelEdit(): void {
    this.editingMessageId.set(null);
    this.editDraft.set('');
  }

  saveEdit(): void {
    const conv = this.activeConversation();
    const messageId = this.editingMessageId();
    const content = this.editDraft().trim();
    if (!conv || messageId === null || !content) {
      return;
    }
    this.messagingService
      .editMessage(conv.id, messageId, content)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updated) => {
          this.messages.update((list) => list.map((m) => (m.id === updated.id ? updated : m)));
          this.editingMessageId.set(null);
          this.editDraft.set('');
        },
        error: () => this.notify.show('خطا در ویرایش پیام', 'error'),
      });
  }

  deleteMessage(messageId: number): void {
    const conv = this.activeConversation();
    if (!conv) {
      return;
    }
    this.messagingService
      .deleteMessage(conv.id, messageId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.messages.update((list) => list.filter((m) => m.id !== messageId));
          if (this.editingMessageId() === messageId) {
            this.editingMessageId.set(null);
          }
        },
        error: () => this.notify.show('خطا در حذف پیام', 'error'),
      });
  }

  formatTime(iso?: string): string {
    if (!iso) {
      return '';
    }
    const date = new Date(iso);
    const now = new Date();
    const sameDay = date.toDateString() === now.toDateString();
    const time = date.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
    if (sameDay) {
      return time;
    }
    const day = date.toLocaleDateString('fa-IR', { day: 'numeric', month: 'short' });
    return `${day} ${time}`;
  }

  trackByConversation(_index: number, item: MessagingConversationListDto): number {
    return item.id;
  }

  trackByMessage(_index: number, item: MessagingMessageDto): number {
    return item.id;
  }

  private markRead(conversationId: number, messageIds: number[]): void {
    this.messagingService
      .markMessagesRead(conversationId, { messageIds })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.conversations.update((list) =>
          list.map((c) => (c.id === conversationId ? { ...c, unreadCount: 0 } : c)),
        );
        this.loadUnreadCount();
      });
  }
}