import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import type {
  NotificationDto,
  NotificationSummaryDto,
  SendNotificationRequest,
  RegisterDeviceRequest,
  UnreadCountDto,
} from '../../core/models/lesson-planner.models';
import { LESSON_PLANNER_API } from '../../core/services/lesson-planner-api.token';

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private readonly api = inject(LESSON_PLANNER_API);

  getNotifications(limit?: number): Observable<NotificationSummaryDto> {
    return this.api.getNotifications(limit);
  }

  markRead(id: number): Observable<void> {
    return this.api.markRead(id);
  }

  markAllRead(): Observable<{ count: number }> {
    return this.api.markAllRead();
  }

  deleteNotification(id: number): Observable<void> {
    return this.api.deleteNotification(id);
  }

  sendNotification(req: SendNotificationRequest): Observable<NotificationDto> {
    return this.api.sendNotification(req);
  }

  registerDevice(req: RegisterDeviceRequest): Observable<void> {
    return this.api.registerDevice(req);
  }

  getUnreadCount(): Observable<UnreadCountDto> {
    return this.api.getUnreadCount();
  }
}
