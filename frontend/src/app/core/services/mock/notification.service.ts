import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import type {
  NotificationDto,
  NotificationSummaryDto,
  SendNotificationRequest,
  RegisterDeviceRequest,
  UnreadCountDto,
} from '../../models/lesson-planner.models';

const SEED: NotificationDto[] = [
  {
    id: 5,
    type: 'success',
    title: 'ثبت تکلیف روزانه',
    body: 'تکلیف امروز با موفقیت ثبت شد و در انتظار بررسی است.',
    link: '/dashboard',
    createdAt: new Date(Date.now() - 1 * 3600_000).toISOString(),
    isRead: false,
  },
  {
    id: 4,
    type: 'info',
    title: 'یادآور جلسه',
    body: 'جلسه حلقه مطالعه امروز ساعت ۱۶ برگزار می‌شود.',
    link: '/halghehs',
    createdAt: new Date(Date.now() - 3 * 3600_000).toISOString(),
    isRead: false,
  },
  {
    id: 3,
    type: 'warning',
    title: 'مهلت ارسال',
    body: 'مهلت ارسال تکلیف فردا به پایان می‌رسد.',
    createdAt: new Date(Date.now() - 26 * 3600_000).toISOString(),
    isRead: false,
  },
  {
    id: 2,
    type: 'error',
    title: 'خطای همگام‌سازی',
    body: 'همگام‌سازی داده‌ها با مشکل مواجه شد. لطفاً دوباره تلاش کنید.',
    createdAt: new Date(Date.now() - 50 * 3600_000).toISOString(),
    isRead: true,
    readAt: new Date(Date.now() - 40 * 3600_000).toISOString(),
  },
  {
    id: 1,
    type: 'success',
    title: 'دستاورد جدید',
    body: 'نشان پیشرفت هفتگی را دریافت کردید.',
    link: '/dashboard',
    createdAt: new Date(Date.now() - 74 * 3600_000).toISOString(),
    isRead: true,
    readAt: new Date(Date.now() - 70 * 3600_000).toISOString(),
  },
];

@Injectable({ providedIn: 'root' })
export class MockNotificationService {
  private notifications: NotificationDto[] = SEED.map((n) => ({ ...n }));
  private nextId = 6;
  private deviceTokens: string[] = [];

  getNotifications(limit = 20): Observable<NotificationSummaryDto> {
    const today = new Date().toDateString();
    const recent = [...this.notifications]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, limit);
    return of({
      totalCount: this.notifications.length,
      unreadCount: this.notifications.filter((n) => !n.isRead).length,
      todayCount: this.notifications.filter((n) => new Date(n.createdAt).toDateString() === today).length,
      recent,
    }).pipe(delay(200));
  }

  markRead(id: number): Observable<void> {
    const item = this.notifications.find((n) => n.id === id);
    if (item && !item.isRead) {
      item.isRead = true;
      item.readAt = new Date().toISOString();
    }
    return of(void 0).pipe(delay(200));
  }

  markAllRead(): Observable<{ count: number }> {
    let count = 0;
    this.notifications.forEach((n) => {
      if (!n.isRead) {
        n.isRead = true;
        n.readAt = new Date().toISOString();
        count++;
      }
    });
    return of({ count }).pipe(delay(200));
  }

  deleteNotification(id: number): Observable<void> {
    this.notifications = this.notifications.filter((n) => n.id !== id);
    return of(void 0).pipe(delay(200));
  }

  sendNotification(req: SendNotificationRequest): Observable<NotificationDto> {
    const created: NotificationDto = {
      id: this.nextId++,
      type: req.type,
      title: req.title,
      body: req.body,
      link: req.link,
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    this.notifications = [...this.notifications, created];
    return of(created).pipe(delay(200));
  }

  registerDevice(req: RegisterDeviceRequest): Observable<void> {
    if (req.deviceToken && !this.deviceTokens.includes(req.deviceToken)) {
      this.deviceTokens = [...this.deviceTokens, req.deviceToken];
    }
    return of(void 0).pipe(delay(200));
  }

  getUnreadCount(): Observable<UnreadCountDto> {
    const unreadCount = this.notifications.filter((n) => !n.isRead).length;
    return of({ totalUnread: unreadCount, perConversation: {} }).pipe(delay(200));
  }
}