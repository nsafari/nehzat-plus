import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DashboardService } from '../dashboard.service';
import { NotificationService } from '../../../core/services/notification.service';
import type { DashboardSummaryDto } from '../../../core/models/lesson-planner.models';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPageComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);
  private readonly notify = inject(NotificationService);
  private readonly destroyRef = inject(DestroyRef);

  summary = signal<DashboardSummaryDto | null>(null);
  loading = signal(true);
  error = signal(false);

  ngOnInit(): void {
    this.dashboardService.getDashboard()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (s) => {
          this.summary.set(s);
          this.loading.set(false);
        },
        error: () => {
          this.error.set(true);
          this.loading.set(false);
          this.notify.show('خطا در بارگذاری داشبورد', 'error');
        },
      });
  }

  maxTrendScore(): number {
    const trend = this.summary()?.trend ?? [];
    return trend.reduce((max, t) => Math.max(max, t.overallScore), 0) || 100;
  }

  barHeight(score: number): number {
    return Math.max(8, Math.round((score / this.maxTrendScore()) * 100));
  }

  percent(value: number): string {
    return `${Math.max(0, Math.min(100, value)).toLocaleString('fa-IR', { maximumFractionDigits: 1 })}٪`;
  }

  number(value: number): string {
    return value.toLocaleString('fa-IR');
  }

  trendDate(date: string): string {
    const d = new Date(date);
    return `${(d.getMonth() + 1).toLocaleString('fa-IR')}/${d.getDate().toLocaleString('fa-IR')}`;
  }
}