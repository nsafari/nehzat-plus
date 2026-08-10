import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import type { Assessment, AssessmentAnalytics, EvaluationRecord } from '../../core/models/lesson-planner.models';
import { LESSON_PLANNER_API } from '../../core/services/lesson-planner-api.token';

interface ScoreBand {
  label: string;
  min: number;
  max: number;
  count: number;
}

@Component({
  selector: 'app-evaluator-analytics-page',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="analytics-page">
      <h2>تحلیل ارزیابیها</h2>

      <div class="assessment-select">
        <label class="field">
          <span>انتخاب ارزیابی</span>
          <select (change)="onSelectAssessment($event)" [disabled]="loadingAssessments">
            <option [value]="0" disabled>انتخاب ارزیابی...</option>
            <option *ngFor="let a of assessments" [value]="a.id">{{ a.title }}</option>
          </select>
        </label>
      </div>

      <div class="loading" *ngIf="loadingAssessments">در حال بارگذاری ارزیابی‌ها...</div>
      <div class="empty" *ngIf="!loadingAssessments && assessments.length === 0">ارزیابی‌ای برای تحلیل وجود ندارد.</div>
      <div class="loading" *ngIf="loadingAnalytics">در حال بارگذاری تحلیل...</div>

      <div class="analytics-content" *ngIf="analytics">
        <div class="analytics-head">
          <h3>{{ analytics.assessment.title }}</h3>
          <span class="badge" [ngClass]="analytics.assessment.status">{{ statusLabel(analytics.assessment.status) }}</span>
        </div>

        <div class="analytics-stats">
          <div class="stat-box">
            <span class="stat-label">تعداد متربیان</span>
            <span class="stat-value">{{ analytics.totalStudents }}</span>
          </div>
          <div class="stat-box">
            <span class="stat-label">تکمیل شده</span>
            <span class="stat-value">{{ analytics.completedCount }}</span>
          </div>
          <div class="stat-box">
            <span class="stat-label">نرخ تکمیل</span>
            <span class="stat-value">{{ analytics.completionRate | number:'1.0-1' }}٪</span>
          </div>
          <div class="stat-box">
            <span class="stat-label">میانگین نمره</span>
            <span class="stat-value">{{ analytics.averageScore | number:'1.0-1' }}</span>
          </div>
          <div class="stat-box">
            <span class="stat-label">نرخ قبولی</span>
            <span class="stat-value">{{ analytics.passRate | number:'1.0-1' }}٪</span>
          </div>
        </div>

        <div class="question-stats" *ngIf="analytics.questionStats.length > 0">
          <h3>آمار سوالات</h3>
          <div *ngFor="let q of analytics.questionStats; let i = index" class="q-stat-item">
            <div class="q-stat-top">
              <span class="q-stat-num">سوال {{ i + 1 }}</span>
              <span class="q-stat-diff" [ngClass]="q.difficulty">{{ difficultyLabel(q.difficulty) }}</span>
              <span class="q-stat-points">{{ q.points }} امتیاز</span>
            </div>
            <p class="q-stat-text">{{ q.questionText }}</p>
            <div class="q-stat-bar-wrap">
              <div class="q-stat-bar" [style.width.%]="q.correctRate"></div>
              <span class="q-stat-rate">{{ q.correctRate | number:'1.0-1' }}٪ صحیح</span>
            </div>
          </div>
        </div>
      </div>

      <div class="score-distribution" *ngIf="scoreBands.length > 0">
        <h3>توزیع نمرات</h3>
        <div class="band-chart">
          <div class="band-row" *ngFor="let band of scoreBands">
            <span class="band-label">{{ band.label }}</span>
            <div class="band-bar-wrap">
              <div class="band-bar" [style.width.%]="getBandPercent(band)"></div>
            </div>
            <span class="band-count">{{ band.count }}</span>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .analytics-page { display: grid; gap: 1.25rem; }
    .analytics-page h2 { margin: 0; font-size: 1.1rem; color: var(--lp-text, #1e1b14); }
    .analytics-page h3 { margin: 0 0 0.5rem; font-size: 0.95rem; color: var(--lp-text, #1e1b14); }
    .loading, .empty { color: var(--lp-muted, #7a7468); text-align: center; padding: 2rem 0; font-size: 0.9rem; }

    .assessment-select { max-width: 400px; }
    .field { display: grid; gap: 0.3rem; }
    .field span { font-size: 0.85rem; font-weight: 500; color: var(--lp-text, #1e1b14); }
    .field select {
      border: 1px solid var(--lp-border, #ddd5c5); border-radius: 10px;
      padding: 0.55rem 0.7rem; font: inherit; background: var(--lp-surface, #fff); color: var(--lp-text, #1e1b14);
    }
    .field select:focus { outline: none; border-color: var(--lp-gold, #b8942e); box-shadow: 0 0 0 3px rgba(184,148,46,0.12); }

    .analytics-content {
      background: var(--lp-surface, #fff); border: 1px solid var(--lp-border, #ddd5c5);
      border-radius: 14px; padding: 1.25rem;
    }
    .analytics-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
    .analytics-head h3 { margin: 0; }

    .analytics-stats {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 0.75rem; margin-bottom: 1rem;
    }
    .stat-box {
      background: var(--lp-bg, #f8f9fa); border: 1px solid var(--lp-border, #ddd5c5);
      border-radius: 12px; padding: 0.65rem; display: flex; flex-direction: column; gap: 0.2rem; text-align: center;
    }
    .stat-label { font-size: 0.78rem; color: var(--lp-muted, #7a7468); }
    .stat-value { font-size: 1.1rem; font-weight: 700; color: var(--lp-text, #1e1b14); }

    .question-stats { margin-top: 0.5rem; }
    .q-stat-item {
      border: 1px solid var(--lp-border, #ddd5c5); border-radius: 12px;
      padding: 0.65rem; margin-bottom: 0.5rem;
    }
    .q-stat-top { display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.3rem; }
    .q-stat-num { font-weight: 600; font-size: 0.85rem; }
    .q-stat-diff { font-size: 0.72rem; padding: 0.1rem 0.4rem; border-radius: 999px; }
    .q-stat-diff.easy { background: #dcfce7; color: #166534; }
    .q-stat-diff.medium { background: #fef3c7; color: #92400e; }
    .q-stat-diff.hard { background: #fee2e2; color: #991b1b; }
    .q-stat-points { font-size: 0.8rem; color: var(--lp-muted, #7a7468); margin-right: auto; }
    .q-stat-text { margin: 0.3rem 0; font-size: 0.88rem; color: var(--lp-text, #1e1b14); }
    .q-stat-bar-wrap { display: flex; align-items: center; gap: 0.5rem; margin-top: 0.3rem; }
    .q-stat-bar { height: 6px; border-radius: 999px; background: var(--lp-primary, #1a6b3c); min-width: 2px; }
    .q-stat-rate { font-size: 0.78rem; color: var(--lp-muted, #7a7468); }

    .score-distribution {
      background: var(--lp-surface, #fff); border: 1px solid var(--lp-border, #ddd5c5);
      border-radius: 14px; padding: 1.25rem;
    }
    .band-chart { display: grid; gap: 0.5rem; }
    .band-row { display: grid; grid-template-columns: 100px 1fr 40px; gap: 0.75rem; align-items: center; }
    .band-label { font-size: 0.85rem; color: var(--lp-text, #1e1b14); }
    .band-bar-wrap { height: 10px; background: var(--lp-border, #e5e7eb); border-radius: 999px; overflow: hidden; }
    .band-bar { height: 100%; background: var(--lp-primary, #1a6b3c); border-radius: 999px; }
    .band-count { font-size: 0.85rem; font-weight: 600; color: var(--lp-text, #1e1b14); text-align: center; }

    .badge { font-size: 0.75rem; padding: 0.15rem 0.5rem; border-radius: 999px; font-weight: 500; }
    .badge.draft { background: #fef3c7; color: #92400e; }
    .badge.published { background: #eaf5ed; color: #065f46; }
    .badge.completed { background: #dbeafe; color: #1e40af; }
    .badge.archived { background: #f0ece4; color: #5b5348; }
  `]
})
export class EvaluatorAnalyticsPageComponent implements OnInit {
  private readonly api = inject(LESSON_PLANNER_API);
  private readonly destroyRef = inject(DestroyRef);

  assessments: Assessment[] = [];
  analytics: AssessmentAnalytics | null = null;
  scoreBands: ScoreBand[] = [];
  loadingAssessments = false;
  loadingAnalytics = false;

  ngOnInit(): void {
    this.loadingAssessments = true;
    this.api.getAssessments().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (assessments) => { this.assessments = assessments; this.loadingAssessments = false; },
      error: () => { this.assessments = []; this.loadingAssessments = false; }
    });
    this.computeScoreDistribution();
  }

  onSelectAssessment(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const id = Number(select.value);
    if (!id) { this.analytics = null; return; }
    this.loadAnalytics(id);
  }

  loadAnalytics(assessmentId: number): void {
    this.loadingAnalytics = true;
    this.analytics = null;
    this.api.getAssessmentAnalytics(assessmentId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data) => { this.analytics = data; this.loadingAnalytics = false; },
      error: () => { this.analytics = null; this.loadingAnalytics = false; }
    });
  }

  computeScoreDistribution(): void {
    this.api.getEvaluationRecords().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (records) => {
        this.scoreBands = [
          { label: 'عالی (۸۰-۱۰۰)', min: 80, max: 100, count: 0 },
          { label: 'خوب (۶۰-۷۹)', min: 60, max: 79, count: 0 },
          { label: 'متوسط (۴۰-۵۹)', min: 40, max: 59, count: 0 },
          { label: 'ضعیف (۰-۳۹)', min: 0, max: 39, count: 0 },
        ];
        for (const r of records) {
          for (const band of this.scoreBands) {
            if (r.score >= band.min && r.score <= band.max) { band.count++; break; }
          }
        }
      }
    });
  }

  getBandPercent(band: ScoreBand): number {
    const total = this.scoreBands.reduce((s, b) => s + b.count, 0);
    return total > 0 ? (band.count / total) * 100 : 0;
  }

  statusLabel(status: string): string {
    const labels: Record<string, string> = { draft: 'پیش‌نویس', published: 'منتشر شده', completed: 'تکمیل شده', archived: 'آرشیو شده' };
    return labels[status] ?? status;
  }

  difficultyLabel(difficulty: string): string {
    const labels: Record<string, string> = { easy: 'آسان', medium: 'متوسط', hard: 'سخت' };
    return labels[difficulty] ?? difficulty;
  }
}
