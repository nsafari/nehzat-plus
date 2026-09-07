import { Component, OnInit, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { StudentInterviewDto, CreateStudentInterviewRequest, InterviewFilterDto } from '../../../core/models/quran-ring.models';
import { QuranRingService } from '../../../core/services/quran-ring.service';

@Component({
  selector: 'app-student-interview',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h2 class="page-title">مصاحبه متربی</h2>
        <div class="header-actions">
          <button class="btn btn-primary" (click)="toggleForm()">
            {{ showForm ? 'بستن فرم' : '+ مصاحبه جدید' }}
          </button>
        </div>
      </div>

      <!-- Loading -->
      <div *ngIf="loading" class="loading-state">
        <div class="spinner"></div>
        <span>در حال بارگذاری...</span>
      </div>

      <!-- Empty state -->
      <div *ngIf="!loading && interviews.length === 0 && !showForm" class="empty-state">
        <div class="empty-icon">📝</div>
        <p>هنوز مصاحبه‌ای ثبت نشده است.</p>
        <button class="btn btn-primary" (click)="toggleForm()">اولین مصاحبه را ثبت کنید</button>
      </div>

      <!-- New Interview Form -->
      <div *ngIf="showForm" class="card form-card">
        <div class="card-header">
          <h3>فرم مصاحبه جدید</h3>
          <span class="form-date">{{ todayDate }}</span>
        </div>
        <div class="card-body">
          <div *ngIf="submitting" class="submitting-overlay">
            <div class="spinner"></div>
            <span>در حال ارسال...</span>
          </div>

          <form (ngSubmit)="submit()" class="interview-form">
            <div *ngFor="let q of questions; let i = index" class="question-group">
              <label class="question-label">
                <span class="question-number">S{{ i + 1 }}</span>
                {{ q.label }}
              </label>
              <textarea
                class="form-control"
                [id]="q.key"
                [(ngModel)]="form[q.key]"
                [name]="q.key"
                rows="3"
                placeholder="پاسخ خود را بنویسید..."
              ></textarea>
            </div>

            <div class="form-actions">
              <button type="button" class="btn btn-secondary" (click)="resetForm()" [disabled]="submitting">انصراف</button>
              <button type="submit" class="btn btn-primary" [disabled]="submitting">
                {{ submitting ? 'در حال ارسال...' : 'ذخیره مصاحبه' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Interview List -->
      <div *ngIf="!loading && interviews.length > 0" class="interview-list">
        <div *ngFor="let interview of interviews" class="card interview-card">
          <div class="card-header">
            <div class="interview-meta">
              <span class="interview-date">{{ interview.interviewDate | date: 'yyyy/MM/dd' }}</span>
              <span class="interview-id">#{{ interview.id }}</span>
            </div>
          </div>
          <div class="card-body">
            <div class="answers-grid">
              <div *ngFor="let q of questions; let i = index" class="answer-item">
                <div class="answer-label">
                  <span class="question-number">S{{ i + 1 }}</span>
                  {{ q.label }}
                </div>
                <div class="answer-value">{{ getValue(interview, q.key) || '—' }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .page-container { padding: 1.5rem; }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .page-title {
      font-size: 1.375rem;
      font-weight: 600;
      color: var(--lp-text-primary);
      margin: 0;
    }

    /* Loading */
    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
      padding: 4rem 2rem;
      color: var(--lp-text-secondary);
      font-size: 0.875rem;
    }

    .spinner {
      width: 24px;
      height: 24px;
      border: 3px solid var(--lp-border, #e2e8f0);
      border-top-color: var(--lp-primary, #2563eb);
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* Empty state */
    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      color: var(--lp-text-secondary);
    }

    .empty-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .empty-state p {
      margin-bottom: 1.5rem;
      font-size: 0.9375rem;
    }

    /* Cards */
    .card {
      background: var(--lp-card-bg, #fff);
      border: 1px solid var(--lp-border, #e2e8f0);
      border-radius: 8px;
      overflow: hidden;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.875rem 1.25rem;
      background: var(--lp-muted-bg, #f8fafc);
      border-bottom: 1px solid var(--lp-border, #e2e8f0);
    }

    .card-header h3 {
      margin: 0;
      font-size: 1rem;
      font-weight: 600;
      color: var(--lp-text-primary);
    }

    .card-body {
      padding: 1.25rem;
    }

    /* Form */
    .form-card {
      margin-bottom: 1.5rem;
      border-left: 4px solid var(--lp-primary, #2563eb);
    }

    .form-date {
      font-size: 0.8125rem;
      color: var(--lp-text-secondary);
    }

    .submitting-overlay {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem;
      margin-bottom: 1rem;
      background: var(--lp-primary-light, #eff6ff);
      border-radius: 6px;
      color: var(--lp-primary, #2563eb);
      font-size: 0.8125rem;
    }

    /* Form questions */
    .interview-form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .question-group {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
    }

    .question-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--lp-text-primary);
    }

    .question-number {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 28px;
      height: 22px;
      padding: 0 0.375rem;
      background: var(--lp-primary-light, #dbeafe);
      color: var(--lp-primary, #2563eb);
      border-radius: 4px;
      font-size: 0.7rem;
      font-weight: 600;
      flex-shrink: 0;
    }

    .form-control {
      width: 100%;
      padding: 0.5rem 0.75rem;
      border: 1px solid var(--lp-border, #e2e8f0);
      border-radius: 6px;
      font-size: 0.875rem;
      font-family: inherit;
      color: var(--lp-text-primary);
      background: var(--lp-card-bg, #fff);
      resize: vertical;
      transition: border-color 0.15s;
      box-sizing: border-box;
    }

    .form-control:focus {
      outline: none;
      border-color: var(--lp-primary, #2563eb);
      box-shadow: 0 0 0 3px var(--lp-primary-light, #dbeafe);
    }

    .form-control::placeholder {
      color: var(--lp-text-tertiary, #94a3b8);
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      padding-top: 0.75rem;
      border-top: 1px solid var(--lp-border, #e2e8f0);
    }

    /* Buttons */
    .btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      font-size: 0.875rem;
      font-family: inherit;
      transition: all 0.15s;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-primary {
      background: var(--lp-primary, #2563eb);
      color: #fff;
    }

    .btn-primary:hover:not(:disabled) {
      background: var(--lp-primary-dark, #1d4ed8);
    }

    .btn-secondary {
      background: var(--lp-muted-bg, #f1f5f9);
      color: var(--lp-text-secondary);
    }

    .btn-secondary:hover:not(:disabled) {
      background: var(--lp-border, #e2e8f0);
    }

    /* Interview list */
    .interview-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .interview-card {
      border-left: 4px solid var(--lp-success, #22c55e);
    }

    .interview-meta {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .interview-date {
      font-size: 0.8125rem;
      font-weight: 500;
      color: var(--lp-text-primary);
    }

    .interview-id {
      font-size: 0.75rem;
      color: var(--lp-text-tertiary, #94a3b8);
    }

    /* Answers grid */
    .answers-grid {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .answer-item {
      padding: 0.625rem 0.75rem;
      background: var(--lp-muted-bg, #f8fafc);
      border-radius: 6px;
      border: 1px solid var(--lp-border, #e2e8f0);
    }

    .answer-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.8125rem;
      font-weight: 500;
      color: var(--lp-text-secondary);
      margin-bottom: 0.25rem;
    }

    .answer-value {
      font-size: 0.875rem;
      color: var(--lp-text-primary);
      line-height: 1.5;
      white-space: pre-wrap;
    }
  `]
})
export class StudentInterviewComponent implements OnInit {
  @Input() studentId!: number;
  @Input() ringId!: number;
  @Input() interviewerUserId!: number;

  private quranRingService = inject(QuranRingService);
  private route = inject(ActivatedRoute);

  interviews: StudentInterviewDto[] = [];
  showForm = false;
  loading = false;
  submitting = false;
  form: Record<string, string> = {};

  questions = [
    { key: 's1_DailyListening', label: 'هر روز گوش می‌دهی؟' },
    { key: 's2_FamilyListening', label: 'با خانواده گوش می‌دهی؟' },
    { key: 's3_MemorizedSurahs', label: 'کدام سوره‌ها را حفظ کرده‌ای؟' },
    { key: 's4_DailyProcess', label: 'فرآیند روزانه قرآنت چیست؟' },
    { key: 's5_TimeSpent', label: 'چقدر وقت برای قرآن می‌گذاری؟' },
    { key: 's6_Difficulties', label: 'سختی‌هایت چیست؟' },
    { key: 's7_EasyParts', label: 'بخش‌های آسان چیست؟' },
    { key: 's8_SelfSpeedCategory', label: 'خودت را در کدام دسته سرعتی می‌بینی؟' },
    { key: 's9_Motivation', label: 'انگیزه‌ات از قرآن چیست؟' },
    { key: 's10_Goal', label: 'هدفت از قرآن چیست؟' },
    { key: 's11_Tadabbor', label: 'تدبر چیست؟' },
    { key: 's12_Writing', label: 'کتابت چیست؟' },
    { key: 's13_Books', label: 'چه کتاب‌هایی می‌خوانی؟' },
    { key: 's14_Discussion', label: 'در بحث‌ها شرکت می‌کنی؟' },
    { key: 's15_Presentations', label: 'ارائه می‌دهی؟' },
    { key: 's16_FamilyOpinion', label: 'خانواده‌ات درباره قرآنت چه می‌گویند؟' },
    { key: 's17_Needs', label: 'چه چیزی نیاز داری؟' },
    { key: 's18_Satisfaction', label: 'از قرآنت راضی هستی؟' },
    { key: 's19_Suggestion', label: 'پیشنهادت چیست؟' },
  ];

  get todayDate(): string {
    return new Date().toLocaleDateString('fa-IR');
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const ringId = params.get('ringId');
      const studentId = params.get('studentId');
      if (ringId && !this.ringId) {
        this.ringId = +ringId;
      }
      if (studentId && !this.studentId) {
        this.studentId = +studentId;
      }
    });
    this.resetForm();
    this.load();
  }

  load(): void {
    if (!this.studentId) return;
    this.loading = true;
    const filter: InterviewFilterDto & { studentId?: number } = {
      ringId: this.ringId,
      studentId: this.studentId,
      page: 1,
      pageSize: 100,
    };
    this.quranRingService.getStudentInterviews(filter).subscribe({
      next: (data) => {
        this.interviews = data.sort((a, b) =>
          new Date(b.interviewDate).getTime() - new Date(a.interviewDate).getTime()
        );
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
    this.questions.forEach((q) => {
      this.form[q.key] = '';
    });
    this.submitting = false;
  }

  submit(): void {
    if (!this.studentId || !this.ringId) return;
    this.submitting = true;

    const req: CreateStudentInterviewRequest = {
      studentId: this.studentId,
      ringId: this.ringId,
      interviewerUserId: this.interviewerUserId,
      interviewDate: new Date().toISOString(),
      s1_DailyListening: this.form['s1_DailyListening'] || undefined,
      s2_FamilyListening: this.form['s2_FamilyListening'] || undefined,
      s3_MemorizedSurahs: this.form['s3_MemorizedSurahs'] || undefined,
      s4_DailyProcess: this.form['s4_DailyProcess'] || undefined,
      s5_TimeSpent: this.form['s5_TimeSpent'] || undefined,
      s6_Difficulties: this.form['s6_Difficulties'] || undefined,
      s7_EasyParts: this.form['s7_EasyParts'] || undefined,
      s8_SelfSpeedCategory: this.form['s8_SelfSpeedCategory'] || undefined,
      s9_Motivation: this.form['s9_Motivation'] || undefined,
      s10_Goal: this.form['s10_Goal'] || undefined,
      s11_Tadabbor: this.form['s11_Tadabbor'] || undefined,
      s12_Writing: this.form['s12_Writing'] || undefined,
      s13_Books: this.form['s13_Books'] || undefined,
      s14_Discussion: this.form['s14_Discussion'] || undefined,
      s15_Presentations: this.form['s15_Presentations'] || undefined,
      s16_FamilyOpinion: this.form['s16_FamilyOpinion'] || undefined,
      s17_Needs: this.form['s17_Needs'] || undefined,
      s18_Satisfaction: this.form['s18_Satisfaction'] || undefined,
      s19_Suggestion: this.form['s19_Suggestion'] || undefined,
    };

    this.quranRingService.createStudentInterview(req).subscribe({
      next: (created) => {
        this.interviews = [created, ...this.interviews];
        this.resetForm();
        this.showForm = false;
      },
      error: () => {
        this.submitting = false;
      },
    });
  }

  getValue(interview: StudentInterviewDto, key: string): string {
    return (interview as unknown as Record<string, unknown>)[key] as string || '';
  }
}
