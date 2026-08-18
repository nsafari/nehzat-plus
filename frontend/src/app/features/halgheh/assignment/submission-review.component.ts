import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AssignmentService } from '../../../core/services/assignment.service';
import { AssignmentSubmissionDto, ReviewSubmissionPayload } from '../../../core/models/assignment.models';

@Component({
  selector: 'lp-submission-review',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="overlay" (click)="close.emit()">
      <div class="modal" (click)="$event.stopPropagation()">
        <h3>بررسی پاسخ — {{ submission.userName }}</h3>

        <div class="quote">{{ submission.content }}</div>
        <p class="meta">ارسال: {{ submission.submittedAt | date: 'yyyy/MM/dd HH:mm' }}</p>

        <label>وضعیت</label>
        <select [(ngModel)]="form.status">
          <option value="approved">✓ تأیید</option>
          <option value="rejected">✗ رد</option>
        </select>

        <label>بازخورد</label>
        <textarea [(ngModel)]="form.feedback" rows="3" placeholder="توضیح کوتاه برای عضو..."></textarea>

        <label>نمره (۰ تا ۲۰ — اختیاری)</label>
        <input type="number" min="0" max="20" [(ngModel)]="form.grade" />

        <div class="actions">
          <button class="btn" (click)="close.emit()">انصراف</button>
          <button class="btn btn-primary" [disabled]="saving()" (click)="save()">
            {{ saving() ? 'در حال ذخیره...' : 'ثبت بررسی' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .overlay { position: fixed; inset: 0; background: rgba(0,0,0,.4); display: flex; align-items: center; justify-content: center; z-index: 60; }
    .modal { background: #fff; border-radius: 12px; padding: 20px; width: 100%; max-width: 460px; max-height: 90vh; overflow-y: auto; }
    .quote { background: #f7f7f7; border-radius: 8px; padding: 10px 12px; font-size: 13px; white-space: pre-wrap; margin: 10px 0; }
    .meta { font-size: 12px; color: #888; margin-bottom: 10px; }
    label { display: block; font-size: 13px; margin: 12px 0 4px; }
    select, input, textarea { width: 100%; padding: 8px 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px; font-family: inherit; }
    .actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 18px; }
    .btn { border: 1px solid #ddd; background: #fff; border-radius: 8px; padding: 8px 16px; cursor: pointer; }
    .btn-primary { background: #6c5ce7; color: #fff; border-color: #6c5ce7; }
    .btn-primary:disabled { opacity: .5; cursor: default; }
  `]
})
export class SubmissionReviewComponent {
  private service = inject(AssignmentService);

  @Input({ required: true }) submission!: AssignmentSubmissionDto;
  @Output() close = new EventEmitter<void>();
  @Output() reviewed = new EventEmitter<AssignmentSubmissionDto>();

  form: ReviewSubmissionPayload = { status: 'approved', feedback: '', grade: undefined };
  saving = signal(false);

  ngOnInit(): void {
    this.form.status = this.submission.status === 'approved' ? 'approved' : 'rejected';
    this.form.feedback = this.submission.feedback ?? '';
    this.form.grade = this.submission.grade;
  }

  save(): void {
    this.saving.set(true);
    this.service.review(this.submission.id, {
      status: this.form.status,
      feedback: this.form.feedback || undefined,
      grade: this.form.grade ?? undefined
    }).subscribe({
      next: (updated) => this.reviewed.emit(updated),
      error: () => this.saving.set(false)
    });
  }
}
