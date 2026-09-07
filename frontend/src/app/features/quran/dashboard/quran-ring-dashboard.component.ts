import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuranRingService } from '../../../core/services/quran-ring.service';
import {
  QuranRingDashboardDto,
  SpeedCategoryType,
} from '../../../core/models/quran-ring.models';

@Component({
  selector: 'app-quran-ring-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <!-- Page Header -->
      <div class="page-header">
        <h1 class="page-title">داشبورد حلقه قرآن</h1>
        <button class="btn btn-secondary" (click)="load()" [disabled]="loading">
          {{ loading ? 'در حال بارگذاری...' : 'بروزرسانی' }}
        </button>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="loading">
        <div class="loading-spinner"></div>
        <span>در حال بارگذاری داشبورد...</span>
      </div>

      <!-- Empty State -->
      <div *ngIf="!loading && !dashboard" class="empty-state">
        <span class="empty-icon">📊</span>
        <p>داده‌ای برای نمایش وجود ندارد.</p>
      </div>

      <!-- Dashboard Content -->
      <ng-container *ngIf="!loading && dashboard">
        <!-- Main Stat Cards Row -->
        <div class="stat-grid">
          <div class="stat-card stat-card--rings">
            <div class="stat-card__icon">🔗</div>
            <div class="stat-card__body">
              <span class="stat-card__value">{{ dashboard.totalRings }}</span>
              <span class="stat-card__label">تعداد حلقه‌ها</span>
            </div>
          </div>
          <div class="stat-card stat-card--sessions">
            <div class="stat-card__icon">📋</div>
            <div class="stat-card__body">
              <span class="stat-card__value">{{ dashboard.totalSessions }}</span>
              <span class="stat-card__label">تعداد جلسات</span>
            </div>
          </div>
          <div class="stat-card stat-card--students">
            <div class="stat-card__icon">👥</div>
            <div class="stat-card__body">
              <span class="stat-card__value">{{ dashboard.totalStudents }}</span>
              <span class="stat-card__label">تعداد متربیان</span>
            </div>
          </div>
          <div class="stat-card stat-card--progress">
            <div class="stat-card__icon">📈</div>
            <div class="stat-card__body">
              <span class="stat-card__value">{{ dashboard.averageProgressPercent | number:'1.0-1' }}%</span>
              <span class="stat-card__label">میانگین پیشرفت</span>
            </div>
          </div>
        </div>

        <!-- Speed Category Distribution -->
        <div class="section-header">
          <h2 class="section-title">توزیع دسته سرعت متربیان</h2>
        </div>
        <div class="speed-grid">
          <div *ngFor="let cat of speedCategories" class="speed-card">
            <div class="speed-card__header">
              <span class="speed-card__dot" [style.background]="speedColors[cat]"></span>
              <span class="speed-card__label">{{ speedLabels[cat] }}</span>
            </div>
            <div class="speed-card__count">{{ dashboard.studentsBySpeedCategory[cat] || 0 }}</div>
            <div class="speed-bar">
              <div class="speed-bar__fill" [style.width.%]="getSpeedPercent(cat)" [style.background]="speedColors[cat]"></div>
            </div>
            <span class="speed-card__percent">{{ getSpeedPercent(cat) | number:'1.0-1' }}%</span>
          </div>
        </div>

        <!-- Quick Stats Row -->
        <div class="section-header">
          <h2 class="section-title">آمار سریع</h2>
        </div>
        <div class="quick-grid">
          <div class="quick-card quick-card--assessments">
            <div class="quick-card__icon">📝</div>
            <div class="quick-card__body">
              <span class="quick-card__value">{{ dashboard.upcomingAssessments }}</span>
              <span class="quick-card__label">ارزیابی‌های پیش رو</span>
            </div>
          </div>
          <div class="quick-card quick-card--today">
            <div class="quick-card__icon">✅</div>
            <div class="quick-card__body">
              <span class="quick-card__value">{{ dashboard.completedSessionsToday }}</span>
              <span class="quick-card__label">تکمیل شده امروز</span>
            </div>
          </div>
        </div>
      </ng-container>
    </div>
  `,
  styles: [`
    /* ===== Page Layout ===== */
    .page-container {
      padding: 1.5rem;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .page-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--lp-text-primary);
      margin: 0;
    }

    /* ===== Loading / Empty ===== */
    .loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      padding: 4rem 2rem;
      color: var(--lp-text-secondary);
      font-size: 0.9375rem;
    }

    .loading-spinner {
      width: 32px;
      height: 32px;
      border: 3px solid var(--lp-border, #e2e8f0);
      border-top-color: var(--lp-primary, #2563eb);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      padding: 4rem 2rem;
      color: var(--lp-text-secondary);
      text-align: center;
    }

    .empty-icon {
      font-size: 2.5rem;
      line-height: 1;
    }

    /* ===== Buttons ===== */
    .btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      font-size: 0.875rem;
      transition: all 0.15s;
    }

    .btn-secondary {
      background: var(--lp-secondary, #64748b);
      color: white;
    }

    .btn-secondary:hover:not(:disabled) {
      background: var(--lp-secondary-dark, #475569);
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    /* ===== Main Stat Cards Grid ===== */
    .stat-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      background: var(--lp-card-bg, #fff);
      border: 1px solid var(--lp-border, #e2e8f0);
      border-radius: 10px;
      padding: 1.25rem;
      transition: box-shadow 0.2s;
    }

    .stat-card:hover {
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
    }

    .stat-card__icon {
      width: 48px;
      height: 48px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.375rem;
      flex-shrink: 0;
    }

    .stat-card--rings .stat-card__icon {
      background: var(--lp-primary-light, #dbeafe);
    }

    .stat-card--sessions .stat-card__icon {
      background: var(--lp-success-light, #dcfce7);
    }

    .stat-card--students .stat-card__icon {
      background: var(--lp-warning-light, #fef3c7);
    }

    .stat-card--progress .stat-card__icon {
      background: #ede9fe;
    }

    .stat-card__body {
      display: flex;
      flex-direction: column;
    }

    .stat-card__value {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--lp-text-primary);
      line-height: 1.2;
    }

    .stat-card__label {
      font-size: 0.8125rem;
      color: var(--lp-text-secondary);
      margin-top: 0.125rem;
    }

    /* ===== Section Header ===== */
    .section-header {
      margin-bottom: 0.75rem;
    }

    .section-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--lp-text-primary);
      margin: 0;
    }

    /* ===== Speed Category Grid ===== */
    .speed-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .speed-card {
      background: var(--lp-card-bg, #fff);
      border: 1px solid var(--lp-border, #e2e8f0);
      border-radius: 10px;
      padding: 1rem 1.25rem;
      transition: box-shadow 0.2s;
    }

    .speed-card:hover {
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
    }

    .speed-card__header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }

    .speed-card__dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .speed-card__label {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--lp-text-primary);
    }

    .speed-card__count {
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--lp-text-primary);
      line-height: 1.2;
      margin-bottom: 0.5rem;
    }

    .speed-bar {
      height: 6px;
      background: var(--lp-muted-bg, #f1f5f9);
      border-radius: 9999px;
      overflow: hidden;
      margin-bottom: 0.375rem;
    }

    .speed-bar__fill {
      height: 100%;
      border-radius: 9999px;
      transition: width 0.4s ease;
    }

    .speed-card__percent {
      font-size: 0.75rem;
      color: var(--lp-text-secondary);
    }

    /* ===== Quick Stats Row ===== */
    .quick-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 1rem;
    }

    .quick-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      background: var(--lp-card-bg, #fff);
      border: 1px solid var(--lp-border, #e2e8f0);
      border-radius: 10px;
      padding: 1.25rem;
      transition: box-shadow 0.2s;
    }

    .quick-card:hover {
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
    }

    .quick-card__icon {
      width: 44px;
      height: 44px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      flex-shrink: 0;
    }

    .quick-card--assessments .quick-card__icon {
      background: var(--lp-warning-light, #fef3c7);
    }

    .quick-card--today .quick-card__icon {
      background: var(--lp-success-light, #dcfce7);
    }

    .quick-card__body {
      display: flex;
      flex-direction: column;
    }

    .quick-card__value {
      font-size: 1.375rem;
      font-weight: 700;
      color: var(--lp-text-primary);
      line-height: 1.2;
    }

    .quick-card__label {
      font-size: 0.8125rem;
      color: var(--lp-text-secondary);
      margin-top: 0.125rem;
    }

    /* ===== Responsive ===== */
    @media (max-width: 640px) {
      .page-container { padding: 1rem; }
      .stat-grid { grid-template-columns: repeat(2, 1fr); }
      .speed-grid { grid-template-columns: repeat(2, 1fr); }
      .stat-card__value { font-size: 1.25rem; }
      .speed-card__count { font-size: 1.375rem; }
    }
  `]
})
export class QuranRingDashboardComponent implements OnInit {
  private quranRingService = inject(QuranRingService);

  dashboard: QuranRingDashboardDto | null = null;
  loading = false;
  ringFilter: number | null = null;

  readonly speedCategories: SpeedCategoryType[] = [
    'STAMINA',
    'SEMI_SPEED',
    'SPEED',
    'POINT_MEMORIZATION',
  ];

  readonly speedLabels: Record<SpeedCategoryType, string> = {
    STAMINA: 'استقامتی',
    SEMI_SPEED: 'نیمه‌سرعتی',
    SPEED: 'سرعتی',
    POINT_MEMORIZATION: 'نقطه‌ای',
  };

  readonly speedColors: Record<SpeedCategoryType, string> = {
    STAMINA: '#3b82f6',
    SEMI_SPEED: '#f59e0b',
    SPEED: '#22c55e',
    POINT_MEMORIZATION: '#8b5cf6',
  };

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.quranRingService.getDashboard(this.ringFilter ?? undefined).subscribe({
      next: (data) => {
        this.dashboard = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  getSpeedPercent(category: SpeedCategoryType): number {
    if (!this.dashboard) return 0;
    const total = this.dashboard.totalStudents;
    if (total === 0) return 0;
    const count = this.dashboard.studentsBySpeedCategory[category] || 0;
    return (count / total) * 100;
  }
}
