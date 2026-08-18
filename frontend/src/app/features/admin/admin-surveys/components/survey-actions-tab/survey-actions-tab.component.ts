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
  CreateIssueActionPayload,
  IssueAction,
} from '../../../../../core/models/lesson-planner.models';

@Component({
  selector: 'app-survey-actions-tab',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div>
      <h4 style="margin: 0.5rem 0">افزودن اقدام جدید</h4>
      <form [formGroup]="actionForm" class="editor-form" (ngSubmit)="add.emit(rawForm)">
        <label>عنوان <input type="text" formControlName="title" /></label>
        <label>توضیحات <textarea formControlName="description" rows="2"></textarea></label>
        <label>دسته‌بندی <input type="text" formControlName="category" /></label>
        <label>
          اولویت
          <select formControlName="priority">
            <option value="critical">بحرانی</option>
            <option value="high">بالا</option>
            <option value="medium">متوسط</option>
            <option value="low">پایین</option>
          </select>
        </label>
        <label>تاریخ هدف <input type="date" formControlName="targetDate" /></label>
        <label>KPI <input type="text" formControlName="kpiDefinition" placeholder="شاخص عملکرد" /></label>
        <div class="row-actions">
          <button type="submit" class="btn btn-secondary" [disabled]="actionForm.invalid || saving">
            {{ saving ? '...' : 'افزودن اقدام' }}
          </button>
        </div>
      </form>

      <h4 style="margin: 0.75rem 0 0.5rem">لیست اقدامات</h4>
      @if (loading) {
        <p class="muted">در حال دریافت...</p>
      } @else if (actions.length === 0) {
        <p class="muted">اقدامی ثبت نشده است.</p>
      } @else {
        <div class="action-list">
          @for (action of actions; track action.id) {
            <div class="action-item">
              <div class="action-header">
                <span class="action-title">{{ action.title }}</span>
                <span class="status-chip" [ngClass]="actionStatusClass(action.status)">
                  {{ actionStatusLabel(action.status) }}
                </span>
              </div>
              <p class="action-desc">{{ action.description }}</p>
              <div class="action-meta">
                <span class="tag">{{ action.category }}</span>
                <span class="tag" [ngClass]="priorityClass(action.priority)">
                  {{ actionPriorityLabel(action.priority) }}
                </span>
                @if (action.targetDate) {
                  <span class="list-meta">مهلت: {{ action.targetDate }}</span>
                }
              </div>
              <div class="row-actions" style="margin-top: 0.5rem">
                <button type="button" class="btn btn-sm btn-secondary" [disabled]="saving" (click)="update.emit({ action, status: 'in_progress' })">شروع</button>
                <button type="button" class="btn btn-sm btn-success" [disabled]="saving" (click)="update.emit({ action, status: 'completed' })">تکمیل</button>
                <button type="button" class="btn btn-sm btn-danger" [disabled]="saving" (click)="update.emit({ action, status: 'cancelled' })">لغو</button>
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
    .btn-success { border-color: var(--lp-success); color: var(--lp-success); }
    .btn-danger { border-color: var(--lp-danger); color: var(--lp-danger); }
    .btn-sm { padding: 0.2rem 0.5rem; font-size: 0.78rem; }
    .btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .muted { color: var(--lp-muted); font-size: 0.85rem; }
    .action-list { display: grid; gap: 0.5rem; }
    .action-item { border: 1px solid var(--lp-border); border-radius: 12px; padding: 0.6rem; }
    .action-header { display: flex; justify-content: space-between; align-items: center; gap: 0.5rem; margin-bottom: 0.3rem; }
    .action-title { font-weight: 600; }
    .status-chip { padding: 0.1rem 0.5rem; border-radius: 999px; font-size: 0.75rem; font-weight: 600; }
    .status-chip--draft { background: #fef3c7; color: #92400e; }
    .status-chip--active { background: #dcfce7; color: #166534; }
    .status-chip--closed { background: #fee2e2; color: #991b2b; }
    .status-chip--archived { background: #e0e7ff; color: #3730a3; }
    .action-desc { font-size: 0.85rem; color: var(--lp-muted); margin: 0.2rem 0; }
    .action-meta { display: flex; gap: 0.35rem; flex-wrap: wrap; align-items: center; font-size: 0.8rem; }
    .tag { background: var(--lp-primary-light); color: var(--lp-primary); padding: 0.1rem 0.4rem; border-radius: 6px; font-size: 0.75rem; }
    .list-meta { color: var(--lp-muted); }
    .status-chip--active { background: #dcfce7; color: #166534; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SurveyActionsTabComponent {
  private readonly fb = inject(FormBuilder);

  @Input() actions: IssueAction[] = [];
  @Input() loading = false;
  @Input() saving = false;

  @Output() add = new EventEmitter<CreateIssueActionPayload>();
  @Output() update = new EventEmitter<{ action: IssueAction; status: string }>();

  actionForm = this.fb.nonNullable.group({
    title: ['', Validators.required],
    description: [''],
    category: ['', Validators.required],
    priority: ['medium'],
    targetDate: [''],
    kpiDefinition: [''],
  });

  get rawForm(): CreateIssueActionPayload {
    return this.actionForm.getRawValue() as unknown as CreateIssueActionPayload;
  }

  actionStatusClass(status: string): string {
    switch (status) {
      case 'proposed':
        return 'status-chip--draft';
      case 'approved':
      case 'in_progress':
        return 'status-chip--active';
      case 'completed':
        return 'status-chip--closed';
      case 'cancelled':
        return 'status-chip--archived';
      default:
        return '';
    }
  }

  actionStatusLabel(status: string): string {
    switch (status) {
      case 'proposed':
        return 'پیشنهاد';
      case 'approved':
        return 'تایید';
      case 'in_progress':
        return 'در حال انجام';
      case 'completed':
        return 'تکمیل';
      case 'cancelled':
        return 'لغو';
      default:
        return status;
    }
  }

  actionPriorityLabel(priority: string): string {
    switch (priority) {
      case 'critical':
        return 'بحرانی';
      case 'high':
        return 'بالا';
      case 'medium':
        return 'متوسط';
      case 'low':
        return 'پایین';
      default:
        return priority;
    }
  }

  priorityClass(priority: string): string {
    switch (priority) {
      case 'critical':
        return 'status-chip--active';
      case 'high':
        return 'status-chip--closed';
      default:
        return '';
    }
  }

  resetForm(): void {
    this.actionForm.reset({
      title: '',
      description: '',
      category: '',
      priority: 'medium',
      targetDate: '',
      kpiDefinition: '',
    });
  }
}
