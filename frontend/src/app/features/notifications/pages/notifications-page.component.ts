import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NotificationsService } from '../notifications.service';
import { NotificationService } from '../../../core/services/notification.service';
import type {
  NotificationDto,
  NotificationSummaryDto,
} from '../../../core/models/lesson-planner.models';

const TYPE_ICONS: Record<NotificationDto['type'], string> = {
  info: 'ℹ',
  warning: '⚠',
  success: '✓',
  error: '✕',
};

const TYPE_LABELS: Record<NotificationDto['type'], string> = {
  info: 'اطلاع',
  warning: 'هشدار',
  success: 'موفق',
  error: 'خطا',
};

@Component({
  selector: 'app-notifications-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications-page.component.html',
  styleUrls: ['./notifications-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsPageComponent implements OnInit {
  private readonly notifications = inject(NotificationsService);
  private readonly notify = inject(NotificationService);
  private readonly destroyRef = inject(DestroyRef);

  readonly typeIcons = TYPE_ICONS;
  readonly typeLabels = TYPE_LABELS;

  summary = signal<NotificationSummaryDto | null>(null);
  loading = signal(true);

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.loading.set(true);
    this.notifications
      .getNotifications(100)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (s) => {
          this.summary.set(s);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
          this.notify.show('خطا در بارگذاری اعلان‌ها', 'error');
        },
      });
  }

  markRead(n: NotificationDto): void {
    this.notifications
      .markRead(n.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.refresh(),
        error: () => this.notify.show('خطا در ثبت خوانده‌شدن', 'error'),
      });
  }

  markAllRead(): void {
    this.notifications
      .markAllRead()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.refresh(),
        error: () => this.notify.show('خطا در به‌روزرسانی اعلان‌ها', 'error'),
      });
  }

  deleteNotification(n: NotificationDto): void {
    this.notifications
      .deleteNotification(n.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.refresh(),
        error: () => this.notify.show('خطا در حذف اعلان', 'error'),
      });
  }

  formatTime(iso: string): string {
    return new Date(iso).toLocaleDateString('fa-IR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }
}
