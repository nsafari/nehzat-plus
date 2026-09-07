import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import type {
  MessagingConversationListDto,
  MessagingConversationDetailDto,
  CreateConversationRequest,
  MemberBriefDto,
  MemberDetailDto,
  MessagingMessageDto,
  SendMessageRequest,
  AttachmentDto,
  MessagePagedResponse,
  MarkReadRequest,
  UnreadCountDto,
} from '../../models/lesson-planner.models';

export const MOCK_SELF_USER_ID = 1;

const SENDER_NAMES: Record<number, string> = {
  1: 'علی احمدی',
  2: 'فاطمه محمدی',
  3: 'محمد رضایی',
  10: 'مدیر سیستم',
  11: 'آقای موسوی',
  12: 'خانم کریمی',
};

const MEMBERS: MemberBriefDto[] = [
  { userId: 1, fullName: 'علی احمدی', role: 'trainee' },
  { userId: 2, fullName: 'فاطمه محمدی', role: 'trainee' },
  { userId: 3, fullName: 'محمد رضایی', role: 'trainee' },
  { userId: 10, fullName: 'مدیر سیستم', role: 'manager' },
  { userId: 11, fullName: 'آقای موسوی', role: 'coach' },
  { userId: 12, fullName: 'خانم کریمی', role: 'headquarters' },
];

const MEMBER_DETAILS: MemberDetailDto[] = MEMBERS.map((member, index) => ({
  ...member,
  joinedAt: isoHoursAgo((index + 1) * 60),
}));

const ATTACHMENTS: AttachmentDto[] = [
  { id: 1, fileName: 'گزارش-هفتگی.pdf', fileUrl: '/files/report-weekly.pdf', fileSize: 245_760, mimeType: 'application/pdf' },
  { id: 2, fileName: 'تکلیف-ریاضی.docx', fileUrl: '/files/math-homework.docx', fileSize: 98_304, mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
];

function isoHoursAgo(hours: number): string {
  return new Date(Date.now() - hours * 3600_000).toISOString();
}

function seedMessages(
  conversationId: number,
  senderSequence: number[],
  texts: string[],
  startId: number,
): MessagingMessageDto[] {
  return texts.map((text, i) => {
    const senderId = senderSequence[i % senderSequence.length];
    return {
      id: startId + i,
      conversationId,
      senderId,
      senderName: SENDER_NAMES[senderId] ?? 'کاربر',
      content: text,
      messageType: 'text',
      isEdited: i === 2,
      isDeleted: false,
      attachments: i === 3 ? ATTACHMENTS : [],
      createdAt: isoHoursAgo((texts.length - i) * 2 + 1),
    };
  });
}

const SEED_MESSAGES: Record<number, MessagingMessageDto[]> = {
  1: seedMessages(
    1,
    [1, 2, 3, 10, 11],
    [
      'سلام به همه 👋',
      'سلام، وقت بخیر',
      'تکلیف امروز آماده شد.',
      'فایل‌ها را در پیوست ارسال کردم.',
      'ممنون از اطلاع‌رسانی.',
      'لطفاً تا فردا ساعت ۱۸ ارسال کنید.',
      'حتماً، ارسال می‌کنم.',
      'سؤال درباره بخش دوم داشتم.',
      'الان توضیح می‌دهم.',
      'عالی، متوجه شدم.',
      'کسی گزارش هفته را دیده؟',
      'بله من ارسال کردم.',
      'من هم ارسال کردم.',
      'جلسه فردا ساعت ۱۶ برگزار می‌شود.',
    ],
    1,
  ),
  2: seedMessages(
    2,
    [1, 11],
    [
      'سلام استاد، تکلیفم را ارسال کردم.',
      'سلام علی، ممنون.',
      'یک سؤال درباره تمرین ۳ داشتم.',
      'بچه‌ها عموماً با همون فرمول حل می‌کنند.',
      'پس فرمول ضرب میلادی است؟',
      'بله، دقیقاً.',
      'تشکر فراوان 🙏',
      'بسیار خوب، بررسی می‌کنم.',
      'هر زمان خواستید، سؤال کنید.',
      'تکلیف امروزت عالی بود، ادامه بده.',
    ],
    15,
  ),
  3: seedMessages(
    3,
    [10, 12],
    [
      'اعلامیه جدید',
      'لطفاً گزارش هفتگی را تا پایان هفته ارسال کنید.',
      'قالب گزارش در پیوست موجود است.',
      'خواهش می‌کنم در اسرع وقت اقدام کنید.',
      'هر سؤالی داشتید با دبیرخانه تماس بگیرید.',
      'سپاس از همکاری شما.',
    ],
    25,
  ),
};

const SEED_CONVERSATIONS: MessagingConversationListDto[] = [
  {
    id: 1,
    title: 'گفتگوی عمومی',
    type: 'group',
    unreadCount: 3,
    lastMessage: SEED_MESSAGES[1][SEED_MESSAGES[1].length - 1],
    members: MEMBERS,
    createdAt: isoHoursAgo(120),
    updatedAt: SEED_MESSAGES[1][SEED_MESSAGES[1].length - 1].createdAt,
  },
  {
    id: 2,
    title: 'مربی — علی',
    type: 'direct',
    unreadCount: 1,
    lastMessage: SEED_MESSAGES[2][SEED_MESSAGES[2].length - 1],
    members: [MEMBERS[0], MEMBERS[4]],
    createdAt: isoHoursAgo(240),
    updatedAt: SEED_MESSAGES[2][SEED_MESSAGES[2].length - 1].createdAt,
  },
  {
    id: 3,
    title: 'اعلامیه ستاد',
    type: 'announcement',
    unreadCount: 0,
    lastMessage: SEED_MESSAGES[3][SEED_MESSAGES[3].length - 1],
    members: MEMBERS.slice(0, 4),
    createdAt: isoHoursAgo(360),
    updatedAt: SEED_MESSAGES[3][SEED_MESSAGES[3].length - 1].createdAt,
  },
];

@Injectable({ providedIn: 'root' })
export class MockMessagingService {
  private nextMessageId = 31;
  private nextConversationId = 4;

  private readonly conversations: MessagingConversationListDto[] = SEED_CONVERSATIONS.map((c) => ({ ...c }));

  private readonly messagesByConversation: Record<number, MessagingMessageDto[]> = {
    1: [...SEED_MESSAGES[1]],
    2: [...SEED_MESSAGES[2]],
    3: [...SEED_MESSAGES[3]],
  };

  getConversations(): Observable<MessagingConversationListDto[]> {
    return of([...this.conversations]).pipe(delay(150));
  }

  getConversation(conversationId: number): Observable<MessagingConversationDetailDto> {
    const list = this.conversations.find((c) => c.id === conversationId);
    if (!list) {
      throw new Error('مکالمه یافت نشد');
    }
    const members = this.membersFor(conversationId);
    const result: MessagingConversationDetailDto = {
      id: list.id,
      title: list.title,
      type: list.type,
      maktabId: undefined,
      createdBy: this.createdByFor(conversationId),
      members,
      createdAt: list.createdAt,
    };
    return of(result).pipe(delay(150));
  }

  createConversation(payload: CreateConversationRequest): Observable<MessagingConversationDetailDto> {
    const id = this.nextConversationId++;
    const selectedDetails: MemberDetailDto[] = MEMBER_DETAILS.filter((m) => payload.memberIds.includes(m.userId));
    const now = new Date().toISOString();
    const list: MessagingConversationListDto = {
      id,
      title: payload.title || `مکالمه ${id}`,
      type: payload.type,
      unreadCount: 0,
      members: selectedDetails,
      createdAt: now,
      updatedAt: now,
    };
    this.conversations.unshift(list);
    this.messagesByConversation[id] = [];
    const result: MessagingConversationDetailDto = {
      id,
      title: list.title,
      type: list.type,
      maktabId: payload.maktabId,
      createdBy: MOCK_SELF_USER_ID,
      members: selectedDetails,
      createdAt: now,
    };
    return of(result).pipe(delay(150));
  }

  deleteConversation(conversationId: number): Observable<void> {
    const index = this.conversations.findIndex((c) => c.id === conversationId);
    if (index !== -1) {
      this.conversations.splice(index, 1);
    }
    delete this.messagesByConversation[conversationId];
    return of(void 0).pipe(delay(150));
  }

  getMessages(conversationId: number, page: number, pageSize: number): Observable<MessagePagedResponse> {
    const all = this.messagesByConversation[conversationId] ?? [];
    const start = (page - 1) * pageSize;
    const pageItems = all.slice(start, start + pageSize);
    const response: MessagePagedResponse = {
      messages: pageItems,
      totalCount: all.length,
      page,
      pageSize,
      hasMore: start + pageItems.length < all.length,
    };
    return of(response).pipe(delay(150));
  }

  sendMessage(conversationId: number, payload: SendMessageRequest): Observable<MessagingMessageDto> {
    const now = new Date().toISOString();
    const message: MessagingMessageDto = {
      id: this.nextMessageId++,
      conversationId,
      senderId: MOCK_SELF_USER_ID,
      senderName: SENDER_NAMES[MOCK_SELF_USER_ID] ?? 'کاربر',
      content: payload.content,
      messageType: payload.messageType,
      isEdited: false,
      isDeleted: false,
      attachments: [],
      createdAt: now,
      updatedAt: now,
    };
    if (!this.messagesByConversation[conversationId]) {
      this.messagesByConversation[conversationId] = [];
    }
    this.messagesByConversation[conversationId].push(message);
    const list = this.conversations.find((c) => c.id === conversationId);
    if (list) {
      list.lastMessage = message;
      list.updatedAt = message.createdAt;
    }
    return of(message).pipe(delay(150));
  }

  editMessage(conversationId: number, messageId: number, content: string): Observable<MessagingMessageDto> {
    const message = this.findMessage(conversationId, messageId);
    message.content = content;
    message.isEdited = true;
    message.updatedAt = new Date().toISOString();
    return of(message).pipe(delay(150));
  }

  deleteMessage(conversationId: number, messageId: number): Observable<void> {
    const list = this.messagesByConversation[conversationId];
    if (list) {
      const index = list.findIndex((m) => m.id === messageId);
      if (index !== -1) {
        list.splice(index, 1);
      }
    }
    return of(void 0).pipe(delay(150));
  }

  markMessagesRead(conversationId: number, payload: MarkReadRequest): Observable<void> {
    const list = this.conversations.find((c) => c.id === conversationId);
    if (list) {
      list.unreadCount = 0;
    }
    return of(void 0).pipe(delay(150));
  }

  getConversationUnreadCount(): Observable<UnreadCountDto> {
    const totalUnread = this.conversations.reduce((sum, c) => sum + c.unreadCount, 0);
    const perConversation = this.conversations.reduce<Record<number, number>>((acc, c) => {
      acc[c.id] = c.unreadCount;
      return acc;
    }, {});
    return of({ totalUnread, perConversation }).pipe(delay(150));
  }

  private membersFor(conversationId: number): MemberDetailDto[] {
    const list = this.conversations.find((c) => c.id === conversationId);
    return MEMBER_DETAILS.filter((m) => list?.members.some((member) => member.userId === m.userId));
  }

  private createdByFor(conversationId: number): number {
    if (conversationId === 1 || conversationId === 3) {
      return 10;
    }
    if (conversationId === 2) {
      return 11;
    }
    return MOCK_SELF_USER_ID;
  }

  private findMessage(conversationId: number, messageId: number): MessagingMessageDto {
    const list = this.messagesByConversation[conversationId] ?? [];
    const found = list.find((m) => m.id === messageId);
    if (!found) {
      throw new Error('پیام یافت نشد');
    }
    return found;
  }
}