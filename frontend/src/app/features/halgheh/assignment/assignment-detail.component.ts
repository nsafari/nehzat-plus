import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AssignmentService } from '../../../core/services/assignment.service';
import { AssignmentDto, AssignmentSubmissionDto } from '../../../core/models/assignment.models';
import { SubmissionReviewComponent } from './submission-review.component';

@Component({
  selector: 'lp-assignment-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, SubmissionReviewComponent],
  template: `
    <div class="detail">
      <button class="back" (click)="close.emit()">← بازگشت</button>

      <h3>{{ assignment.title }}</h3>
      <p class="desc" *ngIf="assignment.description">{{ assignment.description }}</p>
      <p class="due" *ngIf="assignment.dueDate">⏰ مهلت: {{ assignment.dueDate | date: 'yyyy/MM/dd HH:mm' }}</p>

      <!-- Member: Submit answer -->
      <div *ngIf="!isModerator" class="member-panel">
        <h4>{{ myStatusTitle() }}</h4>
        <p class="status-note" *ngIf="assignment.mySubmissionStatus === 'rejected'">
          بازخورد: {{ rejectedFeedback() }}
        </p>
        <textarea [(ngModel)]="content" rows="5" placeholder="پاسخ خود را بنویسید..."
                  [disabled]="assignment.status !== 'active' || assignment.mySubmissionStatus === 'approved'"></textarea>
        <button class="btn btn-primary" [disabled]="!content.trim() || submitting()"
                (click)="submit()">{{ submitting() ? 'در حال ارسال...' : 'ارسال پاسخ' }}</button>
        <p class="hint" *ngIf="assignment.status !== 'active'">این تکلیف بسته شده است.</p>
        <p class="hint ok" *ngIf="assignment.mySubmissionStatus === 'approved'">پاسخ شما تأیید شده است. برای ویرایش با مودراتور هماهنگ کنید.</p>
      </div>

      <!-- Moderator: List of submissions -->
      <div *ngIf="isModerator" class="moderator-panel">
        <h4>پاسخ‌ها ({{ submissions().length }})</h4>
        <div class="empty" *ngIf="!submissions().length">هنوز پاسخی ارسال نشده است.</div>
        <div class="sub" *ngFor="let s of submissions()" (click)="reviewing.set(s)">
          <div class="row">
            <strong>{{ s.userName }}</strong>
            <span class="badge" [ngClass]="s.status">{{ subStatusLabel(s.status) }}</span>
          </div>
          <p class="content">{{ s.content }}</p>
          <p class="meta" *ngIf="s.feedback">بازخورد: {{ s.feedback }}</p>
        </div>
      </div>
    </div>

    <lp-submission-review
      *ngIf="reviewing()"
      [submission]="reviewing()!"
      (close)="reviewing.set(null)"
      (reviewed)="onReviewed($event)" />
  `,
  styles: [`
    .detail { padding: 4px 0; }
    .back { border: none; background: none; color: #6c5ce7; cursor: pointer; padding: 0 0 8px; font-size: 13px; }
    .desc { color: #555; margin: 8px 0; }
    .due { font-size: 13px; color: #888; }
    .member-panel, .moderator-panel { margin-top: 18px; border-top: 1px solid #eee; padding-top: 14px; }
    textarea { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px; font-family: inherit; margin-bottom: 10px; }
    textarea:disabled { background: #f5f5f5; }
    .btn-primary { background: #6c5ce7; color: #fff; border: none; border-radius: 8px; padding: 8px 18px; cursor: pointer; }
    .btn-primary:disabled { opacity: .5; cursor: default; }
    .hint { font-size: 12px; color: #999; margin-top: 8px; }
    .hint.ok { color: #2e7d32; }
    .status-note { background: #fdecea; color: #c62828; padding: 8px 10px; border-radius: 8px; font-size: 13px; }
    .sub { border: 1px solid #e0e0e0; border-radius: 8px; padding: 10px 12px; margin-bottom: 8px; cursor: pointer; }
    .row { display: flex; justify-content: space-between; align-items: center; }
    .content { margin: 6px 0; font-size: 13px; color: #444; }
    .meta { font-size: 12px; color: #777; }
    .badge { font-size: 11px; padding: 2px 8px; border-radius: 20px; }
    .badge.submitted { background: #fff3e0; color: #e65100; }
    .badge.approved { background: #e8f5e9; color: #2e7d32; }
    .badge.rejected { background: #fdecea; color: #c62828; }
    .empty { color: #999; text-align: center; padding: 16px 0; }
  `]
})
export class AssignmentDetailComponent {
  private service = inject(AssignmentService);

  @Input({ required: true }) halghehId = 0;
  @Input({ required: true }) assignment!: AssignmentDto;
  @Input() isModerator = false;
  @Output() close = new EventEmitter<void>();

  submissions = signal<AssignmentSubmissionDto[]>([]);
  reviewing = signal<AssignmentSubmissionDto | null>(null);
  content = '';
  submitting = signal(false);

  ngOnInit(): void {
    if (this.isModerator) this.loadSubmissions();
  }

  loadSubmissions(): void {
    this.service.getSubmissions(this.halghehId, this.assignment.id).subscribe({
      next: (list) => this.submissions.set(list),
      error: () => {}
    });
  }

  submit(): void {
    this.submitting.set(true);
    this.service.submit(this.halghehId, this.assignment.id, { content: this.content.trim() }).subscribe({
      next: () => {
        this.assignment.mySubmissionStatus = 'submitted';
        this.content = '';
        this.submitting.set(false);
      },
      error: () => this.submitting.set(false)
    });
  }

  onReviewed(updated: AssignmentSubmissionDto): void {
    this.submissions.update(list => list.map(s => s.id === updated.id ? updated : s));
    this.reviewing.set(null);
  }

  myStatusTitle(): string {
    return {
      approved: '✓ پاسخ شما تأیید شده',
      rejected: '✗ پاسخ شما رد شده',
      submitted: '⏳ پاسخ شما در انتظار بررسی است',
      '': 'ارسال پاسخ'
    }[this.assignment.mySubmissionStatus];
  }

  rejectedFeedback(): string {
    return '';
  }

  subStatusLabel(s: string): string {
    return { submitted: 'در انتظار بررسی', approved: 'تأیید شده', rejected: 'رد شده' }[s] ?? s;
  }
}
