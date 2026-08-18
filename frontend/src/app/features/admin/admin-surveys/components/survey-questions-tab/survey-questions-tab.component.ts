import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import type {
  CreateIssueQuestionPayload,
  IssueSurveyQuestion,
} from '../../../../../core/models/lesson-planner.models';

@Component({
  selector: 'app-survey-questions-tab',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div>
      <h4 style="margin: 0.5rem 0">افزودن سوال جدید</h4>
      <form [formGroup]="questionForm" class="editor-form" (ngSubmit)="add.emit()">
        <label>متن سوال <textarea formControlName="questionText" rows="2"></textarea></label>
        <label>دسته‌بندی <input type="text" formControlName="category" /></label>
        <label>زیرمجموعه <input type="text" formControlName="subCategory" /></label>
        <label>مخاطب <input type="text" formControlName="targetAudience" /></label>
        <label>ترتیب <input type="number" formControlName="sortOrder" min="0" /></label>
        <div class="row-actions">
          <button type="submit" class="btn btn-secondary" [disabled]="questionForm.invalid || saving">
            {{ saving ? '...' : 'افزودن سوال' }}
          </button>
        </div>
      </form>

      <h4 style="margin: 0.75rem 0 0.5rem">لیست سوالات</h4>
      @if (loading) {
        <p class="muted">در حال دریافت...</p>
      } @else if (questions.length === 0) {
        <p class="muted">سوالی اضافه نشده است.</p>
      } @else {
        <div class="question-list">
          @for (q of questions; track q.id) {
            <div class="question-item">
              <div class="question-header">
                <span class="question-order">#{{ q.sortOrder }}</span>
                <span class="question-text">{{ q.questionText }}</span>
                <button type="button" class="btn-remove" (click)="remove.emit(q)" title="حذف">✕</button>
              </div>
              <div class="question-meta">
                <span class="tag">{{ q.category }}</span>
                @if (q.subCategory) {
                  <span class="tag">{{ q.subCategory }}</span>
                }
                @if (q.targetAudience) {
                  <span class="tag">{{ q.targetAudience }}</span>
                }
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .editor-form { display: grid; gap: 0.5rem; margin-bottom: 0.75rem; }
    .editor-form label { display: grid; gap: 0.25rem; font-size: 0.85rem; }
    .editor-form input, .editor-form textarea, .editor-form select { width: 100%; padding: 0.35rem 0.5rem; border: 1px solid var(--lp-border); border-radius: 8px; }
    .row-actions { display: flex; gap: 0.5rem; margin-top: 0.5rem; }
    .btn { border: 1px solid var(--lp-border); background: var(--lp-surface); border-radius: 8px; padding: 0.3rem 0.7rem; cursor: pointer; font-size: 0.85rem; }
    .btn-secondary { border-color: var(--lp-primary); color: var(--lp-primary); }
    .btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .muted { color: var(--lp-muted); font-size: 0.85rem; }
    .question-list { display: grid; gap: 0.5rem; }
    .question-item { border: 1px solid var(--lp-border); border-radius: 12px; padding: 0.6rem; }
    .question-header { display: flex; align-items: center; gap: 0.5rem; }
    .question-order { font-weight: 600; color: var(--lp-muted); }
    .question-text { flex: 1; font-size: 0.9rem; }
    .btn-remove { border: 0; background: transparent; color: var(--lp-danger); cursor: pointer; font-size: 1.1rem; line-height: 1; padding: 0.1rem 0.4rem; border-radius: 6px; }
    .question-meta { display: flex; gap: 0.35rem; margin-top: 0.3rem; flex-wrap: wrap; }
    .tag { background: var(--lp-primary-light); color: var(--lp-primary); padding: 0.1rem 0.4rem; border-radius: 6px; font-size: 0.75rem; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SurveyQuestionsTabComponent {
  private readonly fb = inject(FormBuilder);

  @Input() questions: IssueSurveyQuestion[] = [];
  @Input() loading = false;
  @Input() saving = false;

  @Output() add = new EventEmitter<CreateIssueQuestionPayload>();
  @Output() remove = new EventEmitter<IssueSurveyQuestion>();

  questionForm = this.fb.nonNullable.group({
    questionText: ['', Validators.required],
    category: ['', Validators.required],
    subCategory: [''],
    targetAudience: [''],
    sortOrder: [0, Validators.required],
  });

  get rawForm(): CreateIssueQuestionPayload {
    return this.questionForm.getRawValue() as unknown as CreateIssueQuestionPayload;
  }

  resetForm(): void {
    this.questionForm.reset({
      questionText: '',
      category: '',
      subCategory: '',
      targetAudience: '',
      sortOrder: 0,
    });
  }
}
