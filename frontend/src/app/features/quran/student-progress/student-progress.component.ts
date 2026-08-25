import { Component, Input, OnInit, inject } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { forkJoin } from 'rxjs';
import { QuranRingService } from '../../../core/services/quran-ring.service';
import {
  StudentSpeedCategoryDto,
  StudentQuranSessionProgressDto,
  SpeedCategoryType,
  SessionStatus,
} from '../../../core/models/quran-ring.models';

@Component({
  selector: 'app-student-progress',
  standalone: true,
  imports: [NgFor, NgIf],
  template: `
    <div class="page-container">
      <!-- Page Header -->
      <div class="page-header">
        <h2 class="page-title">پیشرفت دانش‌آموز</h2>
        <div class="header-actions">
          <button class="btn btn-outline" (click)="load()" [disabled]="loading">
            {{ loading ? 'در حال بارگذاری...' : 'بروزرسانی' }}
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="loading-state">
        <div class="spinner"></div>
        <p>در حال بارگذاری اطلاعات...</p>
      </div>

      <ng-container *ngIf="!loading">
        <!-- Summary Stats -->
        <div class="stats-row">
          <div class="stat-card stat-completed">
            <span class="stat-value">{{ completedCount }}</span>
            <span class="stat-label">تکمیل شده</span>
          </div>
          <div class="stat-card stat-in-progress">
            <span class="stat-value">{{ inProgressCount }}</span>
            <span class="stat-label">در جریان</span>
          </div>
          <div class="stat-card stat-assessment">
            <span class="stat-value">{{ assessmentPendingCount }}</span>
            <span class="stat-label">در انتظار ارزیابی</span>
          </div>
          <div class="stat-card stat-total">
            <span class="stat-value">{{ sessions.length }}</span>
            <span class="stat-label">کل جلسات</span>
          </div>
        </div>

        <!-- Speed Category Card -->
        <div *ngIf="speedCategory" class="speed-card">
          <div class="speed-card-header">
            <h3>دسته سرعت حفظ</h3>
            <button class="btn btn-sm btn-outline" (click)="refreshSpeedCategory()" [disabled]="calculating">
              {{ calculating ? 'در حال محاسبه...' : 'محاسبه مجدد' }}
            </button>
          </div>

          <div class="speed-card-body">
            <div class="speed-main">
              <span class="speed-badge" [class]="'speed-' + speedCategory.category">
                {{ speedLabels[speedCategory.category] || speedCategory.category }}
              </span>
              <div *ngIf="speedCategory.previousCategory" class="prev-category">
                دسته قبلی: {{ speedCategory.previousCategory }}
              </div>
            </div>

            <div class="speed-details">
              <div class="detail-item">
                <span class="detail-label">خطوط روزانه</span>
                <div class="detail-value">
                  {{ speedCategory.actualDailyLines }} / {{ speedCategory.dailyLines }}
                </div>
                <div class="progress-bar-wrap sm">
                  <div class="progress-bar"
                       [style.width.%]="dailyLinesPercent"
                       [class.bar-green]="dailyLinesPercent >= 100"
                       [class.bar-yellow]="dailyLinesPercent >= 50 && dailyLinesPercent < 100"
                       [class.bar-red]="dailyLinesPercent < 50"></div>
                </div>
              </div>

              <div class="detail-item">
                <span class="detail-label">نمره تسلط</span>
                <div class="detail-value">{{ speedCategory.masteryScore ?? '-' }} / 10</div>
                <div class="progress-bar-wrap sm">
                  <div class="progress-bar"
                       [style.width.%]="masteryScoreWidth"
                       [class.bar-green]="(speedCategory.masteryScore ?? 0) >= 7"
                       [class.bar-yellow]="(speedCategory.masteryScore ?? 0) >= 4 && (speedCategory.masteryScore ?? 0) < 7"
                       [class.bar-red]="(speedCategory.masteryScore ?? 0) < 4"></div>
                </div>
              </div>

              <div class="detail-item">
                <span class="detail-label">روزهای فعال</span>
                <div class="detail-value">{{ speedCategory.activeDays }}</div>
              </div>
            </div>

            <div class="speed-badges">
              <span *ngIf="speedCategory.isEligibleForPromotion" class="badge badge-promotion">
                واجد شرایط ارتقا ↑
              </span>
              <span *ngIf="speedCategory.isAtRiskOfDemotion" class="badge badge-demotion">
                در خطر تنزل ↓
              </span>
              <span *ngIf="!speedCategory.isEligibleForPromotion && !speedCategory.isAtRiskOfDemotion"
                    class="badge badge-stable">
                پایدار
              </span>
            </div>

            <div *ngIf="speedCategory.changeReason" class="change-reason">
              <span class="detail-label">دلیل تغییر:</span> {{ speedCategory.changeReason }}
            </div>
          </div>
        </div>

        <!-- Empty speed category -->
        <div *ngIf="!speedCategory" class="empty-speed">
          <p>دسته سرعتی ثبت نشده است.</p>
          <button class="btn btn-primary" (click)="refreshSpeedCategory()" [disabled]="calculating">
            {{ calculating ? 'در حال محاسبه...' : 'محاسبه دسته سرعت' }}
          </button>
        </div>

        <!-- Session Progress Section -->
        <div class="sessions-section">
          <h3 class="section-title">جلسات</h3>

          <div *ngIf="sessions.length === 0" class="empty-state">
            جلسه‌ای یافت نشد.
          </div>

          <div class="progress-grid">
            <div *ngFor="let session of sessions" class="session-card"
                 [class.completed]="session.status === 'COMPLETED'"
                 [class.in-progress]="session.status === 'IN_PROGRESS'"
                 [class.failed]="session.status === 'FAILED'">

              <div class="session-header">
                <span class="session-id">#{{ session.sessionId }}</span>
                <span class="status-badge" [class]="'status-' + session.status">
                  {{ statusLabels[session.status] || session.status }}
                </span>
              </div>

              <div class="session-progress">
                <div class="progress-bar-wrap">
                  <div class="progress-bar" [style.width.%]="session.progressPercent"
                       [class.bar-green]="session.progressPercent >= 80"
                       [class.bar-yellow]="session.progressPercent >= 40 && session.progressPercent < 80"
                       [class.bar-red]="session.progressPercent < 40"></div>
                </div>
                <span class="progress-text">{{ session.progressPercent }}%</span>
              </div>

              <div class="session-details">
                <div class="detail-row">
                  <span class="detail-label">خط حفظ شده:</span>
                  <span class="detail-value">{{ session.linesMemorized }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">سطح تکمیل:</span>
                  <span class="detail-value">{{ session.surfacesCompleted }}</span>
                </div>
                <div *ngIf="session.assessmentScore !== undefined" class="detail-row assessment">
                  <span class="detail-label">نمره ارزیابی:</span>
                  <span class="detail-value score">{{ session.assessmentScore }}</span>
                </div>
              </div>

              <div *ngIf="session.coachNotes" class="session-notes">
                <span class="detail-label">یادداشت مربی:</span> {{ session.coachNotes }}
              </div>
            </div>
          </div>
        </div>
      </ng-container>
    </div>
  `,
  styles: [`
    /* ── Layout ── */
    .page-container { padding: 1.5rem; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem; }
    .page-title { font-size: 1.375rem; font-weight: 600; color: var(--lp-text-primary); margin: 0; }

    /* ── Loading / Empty ── */
    .loading-state { text-align: center; padding: 3rem; color: var(--lp-text-secondary); }
    .spinner { width: 32px; height: 32px; border: 3px solid var(--lp-border, #e2e8f0); border-top-color: var(--lp-primary, #2563eb); border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 1rem; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .empty-state, .empty-speed { text-align: center; padding: 2rem; color: var(--lp-text-secondary); background: var(--lp-card-bg, #fff); border: 1px solid var(--lp-border, #e2e8f0); border-radius: 8px; margin-bottom: 1rem; }

    /* ── Stats Row ── */
    .stats-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 1rem; margin-bottom: 1.5rem; }
    .stat-card { background: var(--lp-card-bg, #fff); border: 1px solid var(--lp-border, #e2e8f0); border-radius: 8px; padding: 1rem; text-align: center; }
    .stat-value { display: block; font-size: 1.75rem; font-weight: 700; color: var(--lp-text-primary); }
    .stat-label { font-size: 0.8125rem; color: var(--lp-text-secondary); }
    .stat-completed { border-top: 3px solid var(--lp-success, #22c55e); }
    .stat-completed .stat-value { color: var(--lp-success, #22c55e); }
    .stat-in-progress { border-top: 3px solid var(--lp-primary, #2563eb); }
    .stat-in-progress .stat-value { color: var(--lp-primary, #2563eb); }
    .stat-assessment { border-top: 3px solid var(--lp-warning, #f59e0b); }
    .stat-assessment .stat-value { color: var(--lp-warning, #f59e0b); }
    .stat-total { border-top: 3px solid var(--lp-text-secondary, #64748b); }

    /* ── Speed Category Card ── */
    .speed-card { background: var(--lp-card-bg, #fff); border: 1px solid var(--lp-border, #e2e8f0); border-radius: 8px; margin-bottom: 1.5rem; overflow: hidden; }
    .speed-card-header { display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.25rem; border-bottom: 1px solid var(--lp-border, #e2e8f0); }
    .speed-card-header h3 { margin: 0; font-size: 1rem; font-weight: 600; color: var(--lp-text-primary); }
    .speed-card-body { padding: 1.25rem; }

    .speed-main { display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; flex-wrap: wrap; }
    .prev-category { font-size: 0.8125rem; color: var(--lp-text-secondary); }

    /* Speed category badges */
    .speed-badge { display: inline-block; padding: 0.375rem 1rem; border-radius: 9999px; font-size: 0.875rem; font-weight: 600; }
    .speed-STAMINA { background: var(--lp-info-light, #dbeafe); color: var(--lp-info, #1e40af); }
    .speed-SEMI_SPEED { background: var(--lp-warning-light, #fef3c7); color: var(--lp-warning, #92400e); }
    .speed-SPEED { background: var(--lp-success-light, #dcfce7); color: var(--lp-success, #166534); }
    .speed-POINT_MEMORIZATION { background: #f3e8ff; color: #7c3aed; }

    /* Speed detail items */
    .speed-details { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1rem; }
    .detail-item { display: flex; flex-direction: column; gap: 0.25rem; }
    .detail-label { font-size: 0.75rem; color: var(--lp-text-secondary); }
    .detail-value { font-size: 0.9375rem; font-weight: 600; color: var(--lp-text-primary); }

    /* Progress bars */
    .progress-bar-wrap { background: var(--lp-muted-bg, #f1f5f9); border-radius: 9999px; height: 8px; overflow: hidden; }
    .progress-bar-wrap.sm { height: 6px; margin-top: 0.25rem; }
    .progress-bar { background: var(--lp-primary, #2563eb); height: 100%; transition: width 0.3s; }
    .bar-green { background: var(--lp-success, #22c55e); }
    .bar-yellow { background: var(--lp-warning, #f59e0b); }
    .bar-red { background: var(--lp-danger, #ef4444); }

    /* Promotion / Demotion badges */
    .speed-badges { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.75rem; }
    .badge { padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 500; }
    .badge-promotion { background: var(--lp-success-light, #dcfce7); color: var(--lp-success, #166534); }
    .badge-demotion { background: var(--lp-danger-light, #fee2e2); color: var(--lp-danger, #991b1b); }
    .badge-stable { background: var(--lp-muted-bg, #f1f5f9); color: var(--lp-text-secondary); }

    .change-reason { font-size: 0.8125rem; color: var(--lp-text-secondary); padding-top: 0.5rem; border-top: 1px solid var(--lp-border, #e2e8f0); }

    /* ── Sessions Section ── */
    .sessions-section { margin-top: 0.5rem; }
    .section-title { font-size: 1.125rem; font-weight: 600; color: var(--lp-text-primary); margin-bottom: 1rem; }

    .progress-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; }

    .session-card { background: var(--lp-card-bg, #fff); border: 1px solid var(--lp-border, #e2e8f0); border-radius: 8px; padding: 1rem; border-left: 4px solid var(--lp-border, #e2e8f0); transition: box-shadow 0.15s; }
    .session-card:hover { box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
    .session-card.completed { border-left-color: var(--lp-success, #22c55e); }
    .session-card.in-progress { border-left-color: var(--lp-primary, #2563eb); }
    .session-card.failed { border-left-color: var(--lp-danger, #ef4444); }

    .session-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
    .session-id { font-size: 0.75rem; font-weight: 600; color: var(--lp-text-secondary); }

    /* Status badges */
    .status-badge { padding: 0.125rem 0.5rem; border-radius: 4px; font-size: 0.7rem; font-weight: 500; }
    .status-NOT_STARTED { background: var(--lp-muted-bg, #f1f5f9); color: var(--lp-text-secondary); }
    .status-IN_PROGRESS { background: var(--lp-info-light, #dbeafe); color: var(--lp-info, #1e40af); }
    .status-COMPLETED { background: var(--lp-success-light, #dcfce7); color: var(--lp-success, #166534); }
    .status-ASSESSMENT_PENDING { background: var(--lp-warning-light, #fef3c7); color: var(--lp-warning, #92400e); }
    .status-FAILED { background: var(--lp-danger-light, #fee2e2); color: var(--lp-danger, #991b1b); }

    .session-progress { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem; }
    .session-progress .progress-bar-wrap { flex: 1; }
    .progress-text { font-size: 0.8125rem; font-weight: 600; color: var(--lp-text-primary); min-width: 36px; }

    .session-details { display: flex; flex-direction: column; gap: 0.375rem; margin-bottom: 0.5rem; }
    .detail-row { display: flex; justify-content: space-between; font-size: 0.8125rem; color: var(--lp-text-secondary); }
    .detail-row.assessment { font-weight: 600; }
    .detail-row .score { color: var(--lp-warning, #f59e0b); }

    .session-notes { font-size: 0.75rem; color: var(--lp-text-secondary); padding-top: 0.5rem; border-top: 1px solid var(--lp-border, #e2e8f0); margin-top: 0.5rem; }

    /* ── Buttons ── */
    .btn { padding: 0.5rem 1rem; border: none; border-radius: 6px; cursor: pointer; font-weight: 500; font-size: 0.875rem; transition: all 0.15s; }
    .btn-sm { padding: 0.25rem 0.625rem; font-size: 0.75rem; }
    .btn-primary { background: var(--lp-primary, #2563eb); color: white; }
    .btn-primary:hover:not(:disabled) { background: var(--lp-primary-dark, #1d4ed8); }
    .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
    .btn-outline { background: transparent; border: 1px solid var(--lp-border, #e2e8f0); color: var(--lp-text-secondary); }
    .btn-outline:hover:not(:disabled) { background: var(--lp-muted-bg, #f1f5f9); }
    .btn-outline:disabled { opacity: 0.6; cursor: not-allowed; }
  `]
})
export class StudentProgressComponent implements OnInit {
  @Input() ringId!: number;
  @Input() studentId!: number;

  private quranRingService = inject(QuranRingService);

  speedCategory: StudentSpeedCategoryDto | null = null;
  sessions: StudentQuranSessionProgressDto[] = [];
  loading = false;
  calculating = false;

  readonly speedLabels: Record<SpeedCategoryType, string> = {
    STAMINA: 'استقامتی (پایه)',
    SEMI_SPEED: 'نیمه\u200cسرعتی',
    SPEED: 'سرعتی',
    POINT_MEMORIZATION: 'حفظ نقطه\u200cای'
  };

  readonly statusLabels: Record<SessionStatus, string> = {
    NOT_STARTED: 'شروع نشده',
    IN_PROGRESS: 'در جریان',
    COMPLETED: 'تکمیل شده',
    ASSESSMENT_PENDING: 'در انتظار ارزیابی',
    FAILED: 'ناموفق'
  };

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    if (!this.ringId || !this.studentId) return;
    this.loading = true;

    forkJoin({
      speedCategory: this.quranRingService.getStudentSpeedCategory(this.studentId, this.ringId),
      sessions: this.quranRingService.getStudentProgress({
        studentId: this.studentId,
        ringId: this.ringId,
      }),
    }).subscribe({
      next: (result) => {
        this.speedCategory = result.speedCategory;
        this.sessions = result.sessions;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  refreshSpeedCategory(): void {
    if (!this.studentId || !this.ringId) return;
    this.calculating = true;
    this.quranRingService.calculateSpeedCategory(this.studentId, this.ringId).subscribe({
      next: (result) => {
        this.speedCategory = result;
        this.calculating = false;
      },
      error: () => {
        this.calculating = false;
      },
    });
  }

  get completedCount(): number {
    return this.sessions.filter((s) => s.status === 'COMPLETED').length;
  }

  get inProgressCount(): number {
    return this.sessions.filter((s) => s.status === 'IN_PROGRESS').length;
  }

  get assessmentPendingCount(): number {
    return this.sessions.filter((s) => s.status === 'ASSESSMENT_PENDING').length;
  }

  get masteryScoreWidth(): number {
    const score = this.speedCategory?.masteryScore;
    if (score === undefined || score === null) return 0;
    return (score / 10) * 100;
  }

  get dailyLinesPercent(): number {
    if (!this.speedCategory) return 0;
    const target = this.speedCategory.dailyLines || 1;
    return Math.min((this.speedCategory.actualDailyLines / target) * 100, 100);
  }
}