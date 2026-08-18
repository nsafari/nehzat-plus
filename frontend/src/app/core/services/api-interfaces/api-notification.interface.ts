import { Observable } from 'rxjs';
import type {
  NotificationDto,
  NotificationSummaryDto,
  SendNotificationRequest,
  RegisterDeviceRequest,
  UnreadCountDto,
} from '../../models/lesson-planner.models';

export abstract class NotificationApi {
  abstract getNotifications(limit?: number): Observable<NotificationSummaryDto>;
  abstract markRead(id: number): Observable<void>;
  abstract markAllRead(): Observable<{ count: number }>;
  abstract deleteNotification(id: number): Observable<void>;
  abstract sendNotification(req: SendNotificationRequest): Observable<NotificationDto>;
  abstract registerDevice(req: RegisterDeviceRequest): Observable<void>;
  abstract getUnreadCount(): Observable<UnreadCountDto>;
}
