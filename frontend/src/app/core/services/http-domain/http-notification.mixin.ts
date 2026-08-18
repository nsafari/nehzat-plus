import { Observable, map } from 'rxjs';
import type { HttpClient } from '@angular/common/http';
import type {
  NotificationDto,
  NotificationSummaryDto,
  SendNotificationRequest,
  RegisterDeviceRequest,
  UnreadCountDto,
} from '../../models/lesson-planner.models';

export interface HttpServiceContext {
  http: HttpClient;
  url(path: string): string;
}

export type Constructor<T = {}> = new (...args: any[]) => T;

export function WithNotification<TBase extends Constructor<HttpServiceContext>>(Base: TBase) {
  return class extends Base {
    getNotifications(limit = 20): Observable<NotificationSummaryDto> {
      return this.http.get<NotificationSummaryDto>(this.url(`/api/notifications?limit=${limit}`));
    }

    markRead(id: number): Observable<void> {
      return this.http.post<void>(this.url(`/api/notifications/${id}/read`), {});
    }

    markAllRead(): Observable<{ count: number }> {
      return this.http.post<{ count: number }>(this.url('/api/notifications/read-all'), {});
    }

    deleteNotification(id: number): Observable<void> {
      return this.http.delete<void>(this.url(`/api/notifications/${id}`));
    }

    sendNotification(req: SendNotificationRequest): Observable<NotificationDto> {
      return this.http.post<NotificationDto>(this.url('/api/notifications/send'), req);
    }

    registerDevice(req: RegisterDeviceRequest): Observable<void> {
      return this.http.post<void>(this.url('/api/notifications/devices'), req);
    }

    getUnreadCount(): Observable<UnreadCountDto> {
      return this.http
        .get<number>(this.url('/api/notifications/unread-count'))
        .pipe(map((count) => ({ totalUnread: count, perConversation: {} })));
    }
  };
}
