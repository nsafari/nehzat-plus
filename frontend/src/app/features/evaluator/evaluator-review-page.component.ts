import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';

import type { AssessmentAnalytics, EvaluationRecord } from '../../core/models/lesson-planner.models';
import { LESSON_PLANNER_API } from '../../core/services/lesson-planner-api.token';

interface ReviewCard {
  record: EvaluationRecord;
  analytics: AssessmentAnalytics | null;
  verdict: 'قبول' | 'رد' | 'نامشخص';
  reason: string;
  overriddenVerdict: 'قبول' | 'رد' | null;
  overriddenScore: number | null;
  showOverride: boolean;
}

@Component({
  selector: 'app-evaluator-review-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="review-page">
      <h2>بازبینی ارزیابی خودکار</h2>

      <div class="loading" *ngIf="loading">در حال بارگذاری...</div>
      <div class="empty" *ngIf="!loading && cards.length === 0">داده‌ای برای بازبینی وجود ندارد.</div>

      <div class="review-cards" *ngIf="!loading && cards.length > 0">
        <div class="review-card" *ngFor="let card of cards">
          <div class="card-header">
            <div>
              <strong>{{ card.record.targetName }}</strong>
              <span class="badge" [ngClass]="card.record.targetType">{{ targetTypeLabel(card.record.targetType) }}</span>
            </div>
            <span class="verdict" [ngClass]="card.overriddenVerdict ? 'verdict-override' : (card.verdict === 'قبول' ? 'verdict-pass' : card.verdict === 'رد' ? 'verdict-fail' : 'verdict-unknown')">
              {{ card.overriddenVerdict ?? card.verdict }}
            </span>
          </div>

          <div class="card-body">
            <div class="meta-row">
              <span>ارزیاب: {{ card.record.evaluatorName || card.record.evaluatorId }}</span>
              <span>نمره: {{ card.record.score }}</span>
              <span>تاریخ: {{ card.record.evaluationDate | date:'yyyy/MM/dd' }}</span>
            </div>

            <div class="scores-section" *ngIf="card.analytics">
              <div class="analytics-summary">
                <span>نمره میانگین: {{ card.analytics.averageScore | number:'1.0-1' }}</span>
                <span>نرخ قبولی: {{ card.analytics.passRate | number:'1.0-1' }}٪</span>
              </div>
              <div class="q-scores" *ngIf="card.analytics.questionStats.length > 0">
                <div *ngFor="let q of card.analytics.questionStats; let i = index" class="q-score-item">
                  <span>سوال {{ i + 1 }}: {{ q.correctRate | number:'1.0-1' }}٪</span>
                  <div class="q-bar-wrap">
                    <div class="q-bar" [style.width.%]="q.correctRate"></div>
                  </div>
                </div>
              </div>
            </div>

            <div class="empty-mini" *ngIf="!card.analytics">بدون داده تحلیل</div>

            <p class="reason" *ngIf="card.reason">{{ card.reason }}</p>

            <div class="override-section">
              <button type="button" class="btn-toggle" (click)="card.showOverride = !card.showOverride">
                {{ card.showOverride ? 'بستن کنترل' : 'بازنویسی دستی' }}
              </button>

              <div class="override-controls" *ngIf="card.showOverride">
                <label class="field">
                  <span>حکم</span>
                  <select [(ngModel)]="card.overriddenVerdict">
                    <option [ngValue]="null">بدون تغییر</option>
                    <option value="قبول">قبول</option>
                    <option value="رد">رد</option>
                  </select>
                </label>
                <label class="field">
                  <span>نمره جایگزین</span>
                  <input type="number" [(ngModel)]="card.overriddenScore" min="0" max="100" placeholder="نمره..." />
                </label>
              </div>

              <button type="button" class="btn-recompute" (click)="recompute(card)">محاسبه مجدد</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .review-page { display: grid; gap: 1rem; }
    .review-page h2 { margin: 0; font-size: 1.1rem; color: var(--lp-text, #1e1b14); }
    .loading, .empty { color: var(--lp-muted, #7a7468); text-align: center; padding: 2rem 0; font-size: 0.9rem; }

    .review-cards { display: grid; gap: 1rem; }
    .review-card {
      background: var(--lp-surface, #fff); border: 1px solid var(--lp-border, #ddd5c5);
      border-radius: 14px; overflow: hidden;
    }
    .card-header {
      display: flex; justify-content: space-between; align-items: center;
      padding: 0.75rem 1rem; background: var(--lp-bg, #f8f9fa); border-bottom: 1px solid var(--lp-border, #e5e7eb);
    }
    .card-body { padding: 1rem; display: flex; flex-direction: column; gap: 0.75rem; }

    .badge { font-size: 0.72rem; padding: 0.15rem 0.5rem; border-radius: 999px; font-weight: 500; margin-right: 0.4rem; }
    .badge.coach { background: #dbeafe; color: #1e40af; }
    .badge.student { background: #dcfce7; color: #166534; }
    .badge.branch { background: #fef3c7; color: #92400e; }

    .verdict {
      font-weight: 700; font-size: 0.9rem; padding: 0.25rem 0.75rem; border-radius: 999px;
    }
    .verdict-pass { background: #dcfce7; color: #166534; }
    .verdict-fail { background: #fee2e2; color: #991b1b; }
    .verdict-unknown { background: #f0ece4; color: #5b5348; }
    .verdict-override { background: #dbeafe; color: #1e40af; }

    .meta-row { display: flex; flex-wrap: wrap; gap: 0.75rem; font-size: 0.85rem; color: var(--lp-muted, #6b7280); }

    .scores-section { display: flex; flex-direction: column; gap: 0.5rem; }
    .analytics-summary { display: flex; gap: 1rem; font-size: 0.85rem; }
    .q-scores { display: grid; gap: 0.3rem; }
    .q-score-item { display: flex; align-items: center; gap: 0.5rem; font-size: 0.82rem; }
    .q-bar-wrap { flex: 1; height: 6px; background: var(--lp-border, #e5e7eb); border-radius: 999px; overflow: hidden; }
    .q-bar { height: 100%; background: var(--lp-primary, #1a6b3c); border-radius: 999px; }

    .empty-mini { color: var(--lp-muted, #7a7468); font-size: 0.85rem; font-style: italic; }

    .reason { margin: 0; font-size: 0.88rem; color: var(--lp-text, #1e1b14); }

    .override-section { display: flex; flex-wrap: wrap; gap: 0.75rem; align-items: flex-end; }
    .btn-toggle {
      background: var(--lp-surface, #fff); border: 1px solid var(--lp-border, #ddd5c5);
      border-radius: 10px; padding: 0.4rem 0.85rem; cursor: pointer; font: inherit; font-size: 0.85rem; font-weight: 500;
      color: var(--lp-text, #1e1b14);
    }
    .btn-toggle:hover { border-color: var(--lp-gold, #b8942e); }

    .override-controls { display: flex; gap: 0.75rem; flex-wrap: wrap; }
    .field { display: grid; gap: 0.3rem; }
    .field span { font-size: 0.82rem; font-weight: 500; color: var(--lp-text, #1e1b14); }
    .field input, .field select {
      border: 1px solid var(--lp-border, #ddd5c5); border-radius: 10px;
      padding: 0.45rem 0.6rem; font: inherit; background: var(--lp-surface, #fff); color: var(--lp-text, #1e1b14);
    }

    .btn-recompute {
      background: var(--lp-gold, #b8942e); color: #fff; border: none;
      border-radius: 10px; padding: 0.4rem 0.85rem; cursor: pointer; font: inherit; font-weight: 600; font-size: 0.85rem;
    }
    .btn-recompute:hover { background: var(--lp-gold-hover, #a07f25); }
  `]
})
export class EvaluatorReviewPageComponent implements OnInit {
  private readonly api = inject(LESSON_PLANNER_API);
  private readonly destroyRef = inject(DestroyRef);

  cards: ReviewCard[] = [];
  loading = false;

  ngOnInit(): void {
    this.loading = true;
    this.api.getEvaluationRecords().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (records) => {
        this.cards = records.map((r) => ({
          record: r,
          analytics: null,
          verdict: this.computeVerdict(r),
          reason: this.computeReason(r),
          overriddenVerdict: null,
          overriddenScore: null,
          showOverride: false,
        }));
        this.loading = false;
        this.loadAnalyticsForCards();
      },
      error: () => { this.cards = []; this.loading = false; }
    });
  }

  loadAnalyticsForCards(): void {
    this.api.getAssessments().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (assessments) => {
        for (const card of this.cards) {
          const assessment = assessments[0];
          if (assessment) {
            this.api.getAssessmentAnalytics(assessment.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
              next: (data) => { card.analytics = data; },
            });
          }
        }
      }
    });
  }

  computeVerdict(record: EvaluationRecord): 'قبول' | 'رد' | 'نامشخص' {
    if (record.score >= 60) return 'قبول';
    if (record.score > 0) return 'رد';
    return 'نامشخص';
  }

  computeReason(record: EvaluationRecord): string {
    if (record.score >= 80) return 'عملکرد عالی با نمره بالای ۸۰';
    if (record.score >= 60) return 'عملکرد قابل قبول';
    if (record.score > 0) return 'نمره زیر حد نصاب — نیاز به بازنگری';
    return 'داده کافی برای قضاوت وجود ندارد';
  }

  recompute(card: ReviewCard): void {
    const score = card.overriddenScore ?? card.record.score;
    if (score >= 60) {
      card.verdict = 'قبول';
    } else if (score > 0) {
      card.verdict = 'رد';
    } else {
      card.verdict = 'نامشخص';
    }
  }

  targetTypeLabel(type: string): string {
    const labels: Record<string, string> = { coach: 'مربی', student: 'متربی', branch: 'شعبه' };
    return labels[type] ?? type;
  }
}
