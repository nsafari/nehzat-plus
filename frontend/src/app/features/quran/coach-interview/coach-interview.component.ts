import { Component, OnInit, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CoachInterviewDto, CreateCoachInterviewRequest, InterviewFilterDto } from '../../../core/models/quran-ring.models';
import { QuranRingService } from '../../../core/services/quran-ring.service';

@Component({
  selector: 'app-coach-interview',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h2 class="page-title">مصاحبه مربی</h2>
        <button class="btn btn-primary" (click)="toggleForm()">
          {{ showForm ? 'انصراف' : 'مصاحبه جدید' }}
        </button>
      </div>

      <!-- New Interview Form -->
      <div *ngIf="showForm" class="card form-card">
        <div class="card-body">
          <h3 class="form-title">مصاحبه جدید</h3>
          <form (ngSubmit)="submit()">
            <div *ngFor="let q of questions; let i = index" class="question-group">
              <label class="question-label" [for]="q.key">
                <span class="question-number">{{ i + 1 }}.</span>
                {{ q.label }}
              </label>
              <textarea
                class="question-textarea"
                [id]="q.key"
                [(ngModel)]="form[q.key]"
                [name]="q.key"
                rows="3"
                placeholder="پاسخ خود را بنویسید..."
              ></textarea>
            </div>
            <div class="form-actions">
              <button class="btn btn-primary" type="submit" [disabled]="submitting">
                {{ submitting ? 'در حال ارسال...' : 'ذخیره مصاحبه' }}
              </button>
              <button class="btn btn-secondary" type="button" (click)="toggleForm()">
                انصراف
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="loading">در حال بارگذاری...</div>

      <!-- Empty State -->
      <div *ngIf="!loading && interviews.length === 0 && !showForm" class="empty-state">
        مصاحبه‌ای ثبت نشده است.
      </div>

      <!-- Interview History -->
      <div *ngFor="let interview of interviews" class="card interview-card">
        <div class="card-body">
          <div class="interview-header">
            <span class="interview-date">{{ interview.interviewDate | date: 'yyyy/MM/dd' }}</span>
            <span class="interview-id">#{{ interview.id }}</span>
          </div>
          <div class="answers-grid">
            <ng-container *ngFor="let q of questions; let i = index">
              <div class="answer-item" *ngIf="getFieldValue(interview, q.key)">
                <span class="answer-label">{{ i + 1 }}. {{ q.label }}</span>
                <p class="answer-text">{{ getFieldValue(interview, q.key) }}</p>
              </div>
            </ng-container>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding: 1.5rem; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem; }
    .page-title { font-size: 1.375rem; font-weight: 600; color: var(--lp-text-primary); margin: 0; }
    .loading, .empty-state { text-align: center; padding: 3rem; color: var(--lp-text-secondary); }

    .card { background: var(--lp-card-bg); border: 1px solid var(--lp-border); border-radius: 8px; margin-bottom: 1rem; }
    .card-body { padding: 1.25rem; }

    .form-card { border-left: 4px solid var(--lp-primary); }
    .form-title { font-size: 1.125rem; font-weight: 600; color: var(--lp-text-primary); margin: 0 0 1.25rem 0; }

    .question-group { margin-bottom: 1.25rem; }
    .question-label { display: block; font-size: 0.9375rem; font-weight: 500; color: var(--lp-text-primary); margin-bottom: 0.5rem; }
    .question-number { color: var(--lp-primary); font-weight: 600; margin-left: 0.25rem; }
    .question-textarea { width: 100%; padding: 0.625rem 0.75rem; border: 1px solid var(--lp-border); border-radius: 6px; font-family: inherit; font-size: 0.875rem; color: var(--lp-text-primary); background: var(--lp-card-bg); resize: vertical; min-height: 80px; transition: border-color 0.15s; box-sizing: border-box; }
    .question-textarea:focus { outline: none; border-color: var(--lp-primary); box-shadow: 0 0 0 3px var(--lp-primary-light); }
    .question-textarea::placeholder { color: var(--lp-text-secondary); }

    .form-actions { display: flex; gap: 0.75rem; margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--lp-border); }

    .interview-card { border-left: 4px solid var(--lp-success); }
    .interview-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; padding-bottom: 0.75rem; border-bottom: 1px solid var(--lp-border); }
    .interview-date { font-size: 0.875rem; font-weight: 500; color: var(--lp-text-primary); }
    .interview-id { font-size: 0.75rem; color: var(--lp-text-secondary); background: var(--lp-muted-bg); padding: 0.125rem 0.5rem; border-radius: 4px; }

    .answers-grid { display: grid; gap: 1rem; }
    .answer-item { padding: 0.75rem; background: var(--lp-muted-bg); border-radius: 6px; }
    .answer-label { display: block; font-size: 0.8125rem; font-weight: 500; color: var(--lp-primary); margin-bottom: 0.375rem; }
    .answer-text { font-size: 0.875rem; color: var(--lp-text-primary); margin: 0; line-height: 1.6; white-space: pre-wrap; }

    .btn { padding: 0.5rem 1rem; border: none; border-radius: 6px; cursor: pointer; font-weight: 500; font-size: 0.875rem; transition: all 0.15s; }
    .btn-primary { background: var(--lp-primary); color: white; }
    .btn-primary:hover:not(:disabled) { background: var(--lp-primary-dark); }
    .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
    .btn-secondary { background: var(--lp-muted-bg); color: var(--lp-text-secondary); }
    .btn-secondary:hover { background: var(--lp-border); }
  `]
})
export class CoachInterviewComponent implements OnInit {
  @Input() ringId!: number;
  @Input() coachUserId!: number;

  private quranRingService = inject(QuranRingService);

  interviews: CoachInterviewDto[] = [];
  showForm = false;
  loading = false;
  submitting = false;
  form: Record<string, string> = {};

  questions = [
    { key: 'q1_ProcessSteps', label: 'فرآیند یادگیری قرآن در حلقه چیست؟' },
    { key: 'q2_PhoneticLayer', label: 'لایه لفظی چگونه اجرا می\u200cشود؟' },
    { key: 'q3_TranslationLayer', label: 'لایه ترجمه و مفاهیم چگونه اجرا می\u200cشود؟' },
    { key: 'q4_SpeedCategories', label: 'دسته\u200cبندی سرعت چگونه تعیین می\u200cشود؟' },
    { key: 'q5_MainChallenges', label: 'مهمترین چالش\u200cهای متربیان چیست؟' },
    { key: 'q6_CurrentSolutions', label: 'راه\u200cحل\u200cهای فعلی برای چالش\u200cها چیست؟' },
    { key: 'q7_DailyListening', label: 'استماع روزانه چگونه انجام می\u200cشود؟' },
    { key: 'q8_Memorization', label: 'حفظ چگونه انجام می\u200cشود؟' },
    { key: 'q9_Tajweed', label: 'تجوید چگونه آموزش داده می\u200cشود؟' },
    { key: 'q10_Vocabulary', label: 'لغت چگونه آموزش داده می\u200cشود؟' },
    { key: 'q11_Syntax', label: 'نحو چگونه آموزش داده می\u200cشود؟' },
    { key: 'q12_Tadabbor', label: 'تدبر چگونه انجام می\u200cشود؟' },
    { key: 'q13_Writing', label: 'کتابت چگونه انجام می\u200cشود؟' },
    { key: 'q14_Presentations', label: 'ارائه\u200cها چگونه برگزار می\u200cشوند؟' },
    { key: 'q15_Discussions', label: 'بحث\u200cهای گروهی چگونه برگزار می\u200cشوند؟' },
    { key: 'q16_ParentReports', label: 'گزارش به والدین چگونه انجام می\u200cشود؟' },
    { key: 'q17_Resources', label: 'منابع مورد استفاده چیست؟' },
    { key: 'q18_Needs', label: 'نیازهای مربی چیست؟' },
  ];

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    const filter: InterviewFilterDto = { ringId: this.ringId };
    if (this.coachUserId) {
      filter.coachUserId = this.coachUserId;
    }
    this.quranRingService.getCoachInterviews(filter).subscribe({
      next: (data) => {
        this.interviews = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (this.showForm) {
      this.resetForm();
    }
  }

  resetForm(): void {
    this.form = {};
    this.questions.forEach((q) => (this.form[q.key] = ''));
  }

  getFieldValue(interview: CoachInterviewDto, key: string): string {
    return (interview as unknown as Record<string, string>)[key] || '';
  }

  submit(): void {
    this.submitting = true;
    const req: CreateCoachInterviewRequest = {
      coachUserId: this.coachUserId,
      ringId: this.ringId,
      interviewDate: new Date().toISOString(),
      ...this.form,
    };
    this.quranRingService.createCoachInterview(req).subscribe({
      next: (result) => {
        this.interviews.unshift(result);
        this.showForm = false;
        this.submitting = false;
      },
      error: () => {
        this.submitting = false;
      },
    });
  }
}