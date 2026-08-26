import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DashboardService } from '../dashboard.service';
import { CourseService } from '../../core/services/course.service';
import { AuthService } from '@core/services/auth.service';
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
  private readonly courseService = inject(CourseService);
  private readonly authService = inject(AuthService);
  private readonly notify = inject(NotificationService);
  private readonly destroyRef = inject(DestroyRef);

  summary = signal<DashboardSummaryDto | null>(null);
  loading = signal(true);
  error = signal(false);
  isAdminLevel = false;
  loadingQuran = false;
  quranError = false;

  ngOnInit(): void {
    // ✅ تشخیص نقش felhaszn - admin/manager/headquarters
    this.isAdminLevel = this.authService.hasRole('admin')
      || this.authService.hasRole('manager')
      || this.authService.hasRole('headquarters');

    // ✅ بارگذاری Quran stats فقط برای نقش‌های مجاز
    if (this.isAdminLevel) {
      this.loadQuranStats();
    }

    // ✅ بارگذاری dashboard مشترک (همه نقش‌ها)
    this.loadDashboard();
  }

  loadDashboard() {
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

  loadQuranStats() {
    this.loadingQuran = true;
    this.quranError = false;
    this.courseService.getStats('quran').subscribe({
      next: (data) => {
        // store in summary or separate signal as needed
        this.loadingQuran = false;
      },
      error: () => {
        // 401s swallowed by ErrorInterceptor; show gentle message for trainees
        this.quranError = true;
        this.loadingQuran = false;
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