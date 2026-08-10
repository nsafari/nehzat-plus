import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import type {
  Assessment,
  AssessmentQuestion,
  CreateEvaluationPayload,
  Evaluator,
  EvaluationRecord
} from '../../core/models/lesson-planner.models';
import { LESSON_PLANNER_API } from '../../core/services/lesson-planner-api.token';
import { AuthService } from '../../core/services/auth.service';

interface RubricCriterion {
  question: AssessmentQuestion | null;
  label: string;
  maxPoints: number;
  selectedScore: number;
}

interface RubricLevel {
  label: string;
  fraction: number;
}

@Component({
  selector: 'app-evaluator-form-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="form-page">
      <div class="loading" *ngIf="loading">در حال بارگذاری...</div>

      <div class="empty" *ngIf="!loading && !prefilledRecord && assessments.length === 0">
        ارزیابی‌ای برای ثبت وجود ندارد.
      </div>

      <div class="split-pane" *ngIf="!loading">
        <!-- LEFT: Submission / Assessment Info -->
        <div class="pane-left">
          <h3 class="pane-title">اطلاعات ارزیابی</h3>

          <div class="info-card" *ngIf="selectedAssessment">
            <div class="info-row"><span class="info-label">عنوان:</span><span>{{ selectedAssessment.title }}</span></div>
            <div class="info-row"><span class="info-label">نوع:</span><span>{{ selectedAssessment.type }}</span></div>
            <div class="info-row"><span class="info-label">حداکثر نمره:</span><span>{{ selectedAssessment.maxScore }}</span></div>
            <div class="info-row"><span class="info-label">تاریخ:</span><span>{{ selectedAssessment.assessmentDate | date:'yyyy/MM/dd' }}</span></div>
            <div class="info-row"><span class="info-label">وضعیت:</span><span class="badge" [ngClass]="selectedAssessment.status">{{ statusLabel(selectedAssessment.status) }}</span></div>
          </div>

          <div class="info-card" *ngIf="prefilledRecord">
            <div class="info-row"><span class="info-label">هدف:</span><span>{{ prefilledRecord.targetName }}</span></div>
            <div class="info-row"><span class="info-label">نوع هدف:</span><span>{{ targetTypeLabel(prefilledRecord.targetType) }}</span></div>
            <div class="info-row"><span class="info-label">نمره قبلی:</span><span>{{ prefilledRecord.score }}</span></div>
            <div class="info-row"><span class="info-label">تاریخ:</span><span>{{ prefilledRecord.evaluationDate | date:'yyyy/MM/dd' }}</span></div>
          </div>

          <label class="field" *ngIf="!prefilledRecord">
            <span>انتخاب ارزیابی</span>
            <select [(ngModel)]="selectedAssessmentId" (ngModelChange)="onAssessmentSelect($event)">
              <option [value]="0" disabled>انتخاب ارزیابی...</option>
              <option *ngFor="let a of assessments" [value]="a.id">{{ a.title }}</option>
            </select>
          </label>

          <div class="field" *ngIf="!prefilledRecord">
            <span>ارزیاب</span>
            <select [(ngModel)]="evaluatorId">
              <option *ngFor="let e of evaluators" [value]="e.id">{{ e.firstName }} {{ e.lastName }} ({{ e.username }})</option>
            </select>
          </div>

          <div class="field" *ngIf="!prefilledRecord">
            <span>نوع هدف</span>
            <select [(ngModel)]="targetType">
              <option value="coach">مربی</option>
              <option value="student">متربی</option>
              <option value="branch">شعبه</option>
            </select>
          </div>

          <div class="field" *ngIf="!prefilledRecord">
            <span>نام هدف</span>
            <input type="text" [(ngModel)]="targetName" placeholder="نام شخص یا شعبه" />
          </div>

          <div class="field" *ngIf="!prefilledRecord">
            <span>شناسه هدف</span>
            <input type="number" [(ngModel)]="targetId" min="1" placeholder="شناسه عددی" />
          </div>
        </div>

        <!-- RIGHT: Rubric Scoring Panel -->
        <div class="pane-right">
          <h3 class="pane-title">شبکه امتیازدهی</h3>

          <div class="empty" *ngIf="criteria.length === 0">
            معیاری برای امتیازدهی وجود ندارد. یک ارزیابی انتخاب کنید.
          </div>

          <div class="rubric-grid" *ngIf="criteria.length > 0">
            <div class="rubric-header">
              <span class="rubric-criterion-col">معیار</span>
              <span class="rubric-level" *ngFor="let level of levels">{{ level.label }}</span>
            </div>
            <div class="rubric-row" *ngFor="let c of criteria; let i = index">
              <span class="rubric-criterion-label">{{ c.label }}</span>
              <button *ngFor="let level of levels" type="button"
                class="rubric-cell" [class.selected]="c.selectedScore === Math.round(c.maxPoints * level.fraction)"
                (click)="selectScore(i, level.fraction)">
                {{ Math.round(c.maxPoints * level.fraction) }}
              </button>
            </div>
          </div>

          <div class="score-live" *ngIf="criteria.length > 0">
            <span>مجموع نمره:</span>
            <strong class="total-score">{{ totalScore }}</strong>
            <span class="max-score">/ {{ maxPossibleScore }}</span>
          </div>

          <div class="field" *ngIf="criteria.length > 0">
            <span>تاریخ ارزیابی</span>
            <input type="date" [(ngModel)]="evaluationDate" />
          </div>

          <div class="field" *ngIf="criteria.length > 0">
            <span>بازخورد</span>
            <textarea rows="3" [(ngModel)]="feedback" placeholder="توضیحات ارزیابی..."></textarea>
          </div>

          <button type="button" class="btn-primary" (click)="onSubmit()" [disabled]="submitting || criteria.length === 0">
            {{ submitting ? 'در حال ثبت...' : 'ثبت ارزیابی' }}
          </button>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .form-page { display: grid; gap: 1rem; }
    .loading, .empty { color: var(--lp-muted, #7a7468); text-align: center; padding: 2rem 0; font-size: 0.9rem; }

    .split-pane { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
    @media (max-width: 768px) { .split-pane { grid-template-columns: 1fr; } }

    .pane-left, .pane-right {
      background: var(--lp-surface, #fff); border: 1px solid var(--lp-border, #ddd5c5);
      border-radius: 14px; padding: 1.25rem; display: flex; flex-direction: column; gap: 0.75rem;
    }
    .pane-title { margin: 0 0 0.5rem; font-size: 1rem; color: var(--lp-text, #1e1b14); }

    .info-card { background: var(--lp-bg, #f8f9fa); border-radius: 10px; padding: 0.75rem; }
    .info-row { display: flex; justify-content: space-between; padding: 0.3rem 0; font-size: 0.88rem; }
    .info-label { color: var(--lp-muted, #6b7280); }

    .field { display: grid; gap: 0.3rem; }
    .field span { font-size: 0.85rem; font-weight: 500; color: var(--lp-text, #1e1b14); }
    .field input, .field select, .field textarea {
      border: 1px solid var(--lp-border, #ddd5c5); border-radius: 10px;
      padding: 0.55rem 0.7rem; font: inherit; background: var(--lp-surface, #fff); color: var(--lp-text, #1e1b14);
    }
    .field input:focus, .field select:focus, .field textarea:focus {
      outline: none; border-color: var(--lp-gold, #b8942e); box-shadow: 0 0 0 3px rgba(184,148,46,0.12);
    }

    .rubric-grid { display: grid; gap: 0.25rem; }
    .rubric-header, .rubric-row { display: grid; grid-template-columns: 2fr repeat(3, 1fr); gap: 0.25rem; align-items: center; }
    .rubric-header {
      background: var(--lp-bg, #f8f9fa); padding: 0.5rem 0.75rem; border-radius: 10px;
      font-weight: 600; font-size: 0.8rem; color: var(--lp-muted, #6b7280);
    }
    .rubric-level { text-align: center; }
    .rubric-row { padding: 0.4rem 0.75rem; }
    .rubric-criterion-label { font-size: 0.85rem; color: var(--lp-text, #1e1b14); }

    .rubric-cell {
      text-align: center; padding: 0.4rem 0.25rem; border: 1px solid var(--lp-border, #ddd5c5);
      border-radius: 8px; cursor: pointer; font: inherit; font-size: 0.82rem; font-weight: 500;
      background: var(--lp-surface, #fff); color: var(--lp-text, #1e1b14); transition: all 0.15s;
    }
    .rubric-cell:hover { border-color: var(--lp-gold, #b8942e); background: rgba(184,148,46,0.04); }
    .rubric-cell.selected {
      background: var(--lp-primary, #1a6b3c); color: #fff; border-color: var(--lp-primary, #1a6b3c);
    }

    .score-live {
      display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem;
      background: var(--lp-bg, #f8f9fa); border-radius: 10px; font-size: 0.9rem;
    }
    .total-score { font-size: 1.3rem; color: var(--lp-primary, #1a6b3c); }
    .max-score { color: var(--lp-muted, #6b7280); }

    .btn-primary {
      background: var(--lp-primary, #1a6b3c); color: #fff; border: 0; border-radius: 12px;
      padding: 0.7rem 1rem; cursor: pointer; font: inherit; font-weight: 600;
    }
    .btn-primary:hover:not(:disabled) { background: var(--lp-primary-hover, #155c32); }
    .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

    .badge { font-size: 0.75rem; padding: 0.15rem 0.5rem; border-radius: 999px; font-weight: 500; }
    .badge.draft { background: #fef3c7; color: #92400e; }
    .badge.published { background: #eaf5ed; color: #065f46; }
    .badge.completed { background: #dbeafe; color: #1e40af; }
    .badge.archived { background: #f0ece4; color: #5b5348; }
  `]
})
export class EvaluatorFormPageComponent implements OnInit {
  private readonly api = inject(LESSON_PLANNER_API);
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly Math = Math;

  assessments: Assessment[] = [];
  evaluators: Evaluator[] = [];
  selectedAssessment: Assessment | null = null;
  prefilledRecord: EvaluationRecord | null = null;
  criteria: RubricCriterion[] = [];
  levels: RubricLevel[] = [
    { label: 'ضعیف', fraction: 0.25 },
    { label: 'متوسط', fraction: 0.5 },
    { label: 'خوب', fraction: 0.75 },
    { label: 'عالی', fraction: 1.0 },
  ];

  selectedAssessmentId = 0;
  evaluatorId = 1;
  targetType: 'coach' | 'student' | 'branch' = 'coach';
  targetName = '';
  targetId = 1;
  evaluationDate = new Date().toISOString().split('T')[0];
  feedback = '';
  submitting = false;
  loading = true;

  get totalScore(): number {
    return this.criteria.reduce((sum, c) => sum + c.selectedScore, 0);
  }

  get maxPossibleScore(): number {
    return this.criteria.reduce((sum, c) => sum + c.maxPoints, 0);
  }

  ngOnInit(): void {
    const recordId = this.route.snapshot.paramMap.get('id');
    if (recordId) {
      this.loadRecordForPrefill(Number(recordId));
    } else {
      this.loadInitialData();
    }
  }

  loadInitialData(): void {
    this.loading = true;
    this.api.getEvaluators().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (evaluators) => {
        this.evaluators = evaluators;
        const match = evaluators.find((e) => e.username === this.authService.getCurrentUser()?.username);
        if (match) this.evaluatorId = match.id;
      }
    });
    this.api.getAssessments().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (assessments) => { this.assessments = assessments; this.loading = false; },
      error: () => { this.assessments = []; this.loading = false; }
    });
  }

  loadRecordForPrefill(recordId: number): void {
    this.api.getEvaluationRecords().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (records) => {
        this.prefilledRecord = records.find((r) => r.id === recordId) ?? null;
        if (this.prefilledRecord) {
          this.targetName = this.prefilledRecord.targetName;
          this.targetType = this.prefilledRecord.targetType;
          this.targetId = this.prefilledRecord.targetId;
          this.evaluatorId = this.prefilledRecord.evaluatorId;
          this.evaluationDate = this.prefilledRecord.evaluationDate;
        }
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  onAssessmentSelect(id: number): void {
    if (!id) { this.selectedAssessment = null; this.criteria = []; return; }
    const found = this.assessments.find((a) => a.id === id);
    if (found) {
      this.selectedAssessment = found;
      this.buildCriteria(found);
    }
  }

  buildCriteria(assessment: Assessment): void {
    if (assessment.questions?.length) {
      this.criteria = assessment.questions.map((q) => ({
        question: q,
        label: q.questionText,
        maxPoints: q.points,
        selectedScore: 0,
      }));
    } else {
      this.criteria = [{ question: null, label: 'امتیاز کلی', maxPoints: assessment.maxScore, selectedScore: 0 }];
    }
  }

  selectScore(index: number, fraction: number): void {
    this.criteria[index].selectedScore = Math.round(this.criteria[index].maxPoints * fraction);
  }

  onSubmit(): void {
    if (this.criteria.length === 0) return;
    this.submitting = true;

    const payload: CreateEvaluationPayload = {
      evaluatorId: this.evaluatorId,
      targetType: this.targetType,
      targetName: this.targetName,
      targetId: this.targetId,
      score: this.totalScore,
      evaluationDate: this.evaluationDate,
      feedback: this.feedback
    };

    this.api.createEvaluation(payload).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.submitting = false;
        void this.router.navigate(['/evaluator/queue']);
      },
      error: () => { this.submitting = false; }
    });
  }

  targetTypeLabel(type: string): string {
    const labels: Record<string, string> = { coach: 'مربی', student: 'متربی', branch: 'شعبه' };
    return labels[type] ?? type;
  }

  statusLabel(status: string): string {
    const labels: Record<string, string> = { draft: 'پیش‌نویس', published: 'منتشر شده', completed: 'تکمیل شده', archived: 'آرشیو شده' };
    return labels[status] ?? status;
  }
}
