import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import type { ProgressTrendPointDto } from '../../../../core/models/lesson-planner.models';
import { ProgressService } from '../../progress.service';
import { LeaderboardComponent } from '../leaderboard/leaderboard.component';
import { ReportCardComponent } from '../report-card/report-card.component';

interface TrendBar {
  x: number;
  y: number;
  height: number;
  value: number;
  series: string;
  color: string;
}

const BAR_WIDTH = 10;
const BAR_GAP = 4;
const VIEW_W = 900;
const VIEW_H = 200;
const BASELINE = VIEW_H - 24;
const MAX_BAR_H = VIEW_H - 34;

@Component({
  selector: 'app-progress-summary',
  standalone: true,
  imports: [LeaderboardComponent, ReportCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: block;
        padding: 1.5rem;
        max-width: 1200px;
        margin: 0 auto;
        direction: rtl;
      }
      .page-header {
        margin-bottom: 1.25rem;
      }
      .page-title {
        margin: 0;
        font-size: 1.6rem;
        color: var(--lp-text);
      }
      .page-subtitle {
        margin: 0.25rem 0 0;
        color: var(--lp-muted);
        font-size: 0.95rem;
      }
      .kpi-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin-bottom: 1.25rem;
      }
      .kpi-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.4rem;
        padding: 1.25rem 1rem;
        border: 1px solid var(--lp-border);
        border-radius: 0.75rem;
        background: var(--lp-surface);
      }
      .kpi-card--gold {
        border-top: 3px solid var(--lp-gold);
      }
      .kpi-icon {
        font-size: 1.5rem;
      }
      .kpi-label {
        color: var(--lp-muted);
        font-size: 0.9rem;
      }
      .kpi-value {
        color: var(--lp-primary);
        font-size: 1.6rem;
        font-weight: 700;
      }
      .panel {
        border: 1px solid var(--lp-border);
        border-radius: 0.75rem;
        background: var(--lp-surface);
        padding: 1.25rem;
        margin-bottom: 1.25rem;
      }
      .panel-title {
        margin: 0 0 1rem;
        font-size: 1.05rem;
        color: var(--lp-text);
        border-bottom: 2px solid var(--lp-gold);
        padding-bottom: 0.5rem;
      }
      .charts-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        gap: 1rem;
      }
      .trend-svg {
        width: 100%;
        height: auto;
        display: block;
      }
      .date-label {
        font-size: 12px;
        fill: var(--lp-muted);
      }
      .legend {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
        margin-top: 0.75rem;
        font-size: 0.8rem;
        color: var(--lp-muted);
      }
      .legend-item {
        display: flex;
        align-items: center;
        gap: 0.35rem;
      }
      .legend-dot {
        width: 0.6rem;
        height: 0.6rem;
        border-radius: 999px;
      }
      .reports-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 1rem;
      }
      .empty-state {
        padding: 2rem;
        border: 1px dashed var(--lp-border);
        border-radius: 0.75rem;
        text-align: center;
        color: var(--lp-muted);
        background: var(--lp-surface);
      }
      .error-state {
        color: var(--lp-danger);
      }
      .refresh-btn {
        margin-top: 1rem;
        padding: 0.5rem 1.25rem;
        border: 1px solid var(--lp-border);
        border-radius: 0.5rem;
        background: var(--lp-surface);
        color: var(--lp-text);
        cursor: pointer;
        font-size: 0.9rem;
      }
      .refresh-btn:hover {
        border-color: var(--lp-gold);
        color: var(--lp-gold);
      }
    `,
  ],
  template: `
    <header class="page-header">
      <h1 class="page-title">داشبورد پیشرفت</h1>
      <p class="page-subtitle">نمای کلی عملکرد متربیان و روند پیشرفت در دوره‌های اخیر</p>
    </header>

    @if (loading()) {
      <div class="empty-state">در حال بارگذاری…</div>
    } @else if (error()) {
      <div class="empty-state error-state">خطا در دریافت داده‌های پیشرفت</div>
      <button type="button" class="refresh-btn" (click)="reload()">تلاش مجدد</button>
    } @else if (dashboard(); as s) {
      <section class="kpi-grid" aria-label="شاخص‌های کلیدی">
        <div class="kpi-card kpi-card--gold">
          <span class="kpi-icon" aria-hidden="true">⭐</span>
          <span class="kpi-label">امتیاز تجربه</span>
          <span class="kpi-value">{{ fa(s.totalXp) }}</span>
        </div>
        <div class="kpi-card">
          <span class="kpi-icon" aria-hidden="true">📋</span>
          <span class="kpi-label">ارزیابی‌های در انتظار</span>
          <span class="kpi-value">{{ fa(s.pendingEvaluations) }}</span>
        </div>
        <div class="kpi-card">
          <span class="kpi-icon" aria-hidden="true">💬</span>
          <span class="kpi-label">پیام‌های خوانده‌نشده</span>
          <span class="kpi-value">{{ fa(s.unreadMessages) }}</span>
        </div>
        <div class="kpi-card">
          <span class="kpi-icon" aria-hidden="true">🔄</span>
          <span class="kpi-label">گردش‌کارهای باز</span>
          <span class="kpi-value">{{ fa(s.openWorkflows) }}</span>
        </div>
      </section>

      <div class="charts-grid">
        <section class="panel">
          <h2 class="panel-title">روند پیشرفت</h2>
          @if (s.trend.length) {
            <svg class="trend-svg" [attr.viewBox]="viewBox" role="img" aria-label="نمودار روند پیشرفت">
              @for (bar of bars(s.trend); track $index) {
                <rect
                  [attr.x]="bar.x"
                  [attr.y]="bar.y"
                  [attr.width]="BAR_WIDTH"
                  [attr.height]="bar.height"
                  [attr.fill]="bar.color"
                  rx="3"
                >
                  <title>{{ bar.series }}: {{ percent(bar.value) }}</title>
                </rect>
              }
              @for (point of s.trend; track $index) {
                <text
                  [attr.x]="labelX($index, s.trend.length)"
                  [attr.y]="BASELINE + 16"
                  text-anchor="middle"
                  class="date-label"
                >{{ shortDate(point.date) }}</text>
              }
            </svg>
            <div class="legend">
              <span class="legend-item"><span class="legend-dot" style="background: var(--lp-gold)"></span> نمره کلی</span>
              <span class="legend-item"><span class="legend-dot" style="background: var(--lp-primary)"></span> حضور</span>
              <span class="legend-item"><span class="legend-dot" style="background: var(--lp-accent-blue)"></span> تکالیف</span>
            </div>
          } @else {
            <div class="empty-state">هیچ داده‌ای برای نمودار موجود نیست</div>
          }
        </section>

        <section class="panel">
          <h2 class="panel-title">جدول برترین‌ها</h2>
          <app-leaderboard [entries]="s.leaderboard"></app-leaderboard>
        </section>
      </div>

      <section class="panel">
        <h2 class="panel-title">آخرین گزارش‌های پیشرفت</h2>
        @if (s.recentReports.length) {
          <div class="reports-grid">
            @for (report of s.recentReports; track report.id) {
              <app-report-card [report]="report"></app-report-card>
            }
          </div>
        } @else {
          <div class="empty-state">گزارشی ثبت نشده است</div>
        }
      </section>
    }
  `,
})
export class DashboardSummaryComponent implements OnInit {
  private readonly progressService = inject(ProgressService);
  private readonly destroyRef = inject(DestroyRef);

  readonly dashboard = this.progressService.dashboard;
  readonly loading = this.progressService.loading;
  readonly error = this.progressService.error;

  readonly BAR_WIDTH = BAR_WIDTH;
  readonly BASELINE = BASELINE;
  readonly viewBox = `0 0 ${VIEW_W} ${VIEW_H}`;

  ngOnInit(): void {
    this.progressService
      .loadDashboard()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  reload(): void {
    this.progressService.refresh();
  }

  fa(value: number): string {
    return (value ?? 0).toLocaleString('fa-IR');
  }

  percent(value: number): string {
    return `${Math.max(0, Math.min(100, value ?? 0)).toLocaleString('fa-IR', { maximumFractionDigits: 1 })}٪`;
  }

  shortDate(value: string): string {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '';
    return `${(d.getMonth() + 1).toLocaleString('fa-IR')}/${d.getDate().toLocaleString('fa-IR')}`;
  }

  bars(points: ProgressTrendPointDto[]): TrendBar[] {
    const n = Math.max(1, points.length);
    const groupWidth = VIEW_W / n;
    const series: { key: keyof ProgressTrendPointDto; label: string; color: string }[] = [
      { key: 'overallScore', label: 'نمره کلی', color: '#b8942e' },
      { key: 'attendanceRate', label: 'حضور', color: '#1a6b3c' },
      { key: 'assignmentCompletionRate', label: 'تکالیف', color: '#2d5a8a' },
    ];
    const result: TrendBar[] = [];

    points.forEach((point, i) => {
      const barsWidth = BAR_WIDTH * series.length + BAR_GAP * (series.length - 1);
      const startX = i * groupWidth + (groupWidth - barsWidth) / 2;
      series.forEach((s, j) => {
        const value = Math.max(0, Math.min(100, Number(point[s.key] ?? 0)));
        const height = (value / 100) * MAX_BAR_H;
        result.push({
          x: startX + j * (BAR_WIDTH + BAR_GAP),
          y: BASELINE - height,
          height,
          value,
          series: s.label,
          color: s.color,
        });
      });
    });
    return result;
  }

  labelX(index: number, count: number): number {
    const n = Math.max(1, count);
    return index * (VIEW_W / n) + VIEW_W / n / 2;
  }
}