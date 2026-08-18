import { Observable } from 'rxjs';
import { MockLessonPlannerApiBase, type MockApiCtor } from './mock-lesson-planner-base';
import type {
  NotificationDto,
  NotificationSummaryDto,
  SendNotificationRequest,
  RegisterDeviceRequest,
  UnreadCountDto,
} from './mock-lesson-planner-models';

export function withNotification<T extends MockApiCtor>(Base: T) {
  return class extends Base {
    getNotifications(limit?: number): Observable<NotificationSummaryDto> {
      return this.notification.getNotifications(limit);
    }
    markRead(id: number): Observable<void> {
      return this.notification.markRead(id);
    }
    markAllRead(): Observable<{ count: number }> {
      return this.notification.markAllRead();
    }
    deleteNotification(id: number): Observable<void> {
      return this.notification.deleteNotification(id);
    }
    sendNotification(req: SendNotificationRequest): Observable<NotificationDto> {
      return this.notification.sendNotification(req);
    }
    registerDevice(req: RegisterDeviceRequest): Observable<void> {
      return this.notification.registerDevice(req);
    }
    getUnreadCount(): Observable<UnreadCountDto> {
      return this.notification.getUnreadCount();
    }
  };
}
