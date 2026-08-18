import { Component, EventEmitter, Input, Output, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssignmentService } from '../../../core/services/assignment.service';
import { AssignmentDto } from '../../../core/models/assignment.models';

@Component({
  selector: 'lp-assignment-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="head">
      <h3>تکالیف</h3>
      <button class="btn btn-primary" (click)="create.emit()" *ngIf="isModerator">+ تکلیف جدید</button>
    </div>

    <div class="empty" *ngIf="!items.length && !loading">
      <p>هنوز تکلیفی ثبت نشده است.</p>
    </div>

    <div class="list">
      <div class="card" *ngFor="let a of items" (click)="open.emit(a)">
        <div class="row">
          <strong class="title">{{ a.title }}</strong>
          <span class="badge" [ngClass]="a.status">{{ statusLabel(a.status) }}</span>
        </div>
        <p class="desc" *ngIf="a.description">{{ a.description }}</p>
        <div class="meta">
          <span *ngIf="a.dueDate">⏰ مهلت: {{ a.dueDate | date: 'yyyy/MM/dd' }}</span>
          <span *ngIf="isModerator">📝 {{ a.submissionCount }} پاسخ</span>
          <span *ngIf="!isModerator" class="my-status" [ngClass]="a.mySubmissionStatus">
            {{ myStatusLabel(a.mySubmissionStatus) }}
          </span>
        </div>
      </div>
    </div>

    <div class="pager" *ngIf="totalPages > 1">
      <button [disabled]="page <= 1" (click)="load(page - 1)">قبلی</button>
      <span>{{ page }} / {{ totalPages }}</span>
      <button [disabled]="page >= totalPages" (click)="load(page + 1)">بعدی</button>
    </div>
  `,
  styles: [`
    .head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .head h3 { margin: 0; font-size: 16px; }
    .list { display: flex; flex-direction: column; gap: 10px; }
    .card { border: 1px solid #e0e0e0; border-radius: 10px; padding: 12px 14px; cursor: pointer; background: #fff; }
    .card:hover { border-color: #6c5ce7; }
    .row { display: flex; justify-content: space-between; align-items: center; gap: 8px; }
    .title { font-size: 14px; }
    .desc { color: #666; font-size: 13px; margin: 6px 0; }
    .meta { display: flex; gap: 14px; font-size: 12px; color: #888; }
    .badge { font-size: 11px; padding: 2px 8px; border-radius: 20px; }
    .badge.active { background: #e8f5e9; color: #2e7d32; }
    .badge.closed { background: #eceff1; color: #546e7a; }
    .badge.draft { background: #fff3e0; color: #e65100; }
    .my-status.approved { color: #2e7d32; }
    .my-status.rejected { color: #c62828; }
    .my-status.submitted { color: #e65100; }
    .empty { text-align: center; color: #999; padding: 24px 0; }
    .pager { display: flex; justify-content: center; align-items: center; gap: 12px; margin-top: 14px; }
    .pager button { border: 1px solid #ddd; background: #fff; border-radius: 6px; padding: 4px 12px; cursor: pointer; }
    .pager button:disabled { opacity: .4; cursor: default; }
    .btn-primary { background: #6c5ce7; color: #fff; border: none; border-radius: 8px; padding: 8px 16px; cursor: pointer; }
  `]
})
export class AssignmentListComponent implements OnInit {
  private service = inject(AssignmentService);

  @Input({ required: true }) halghehId = 0;
  @Input() isModerator = false;
  @Output() open = new EventEmitter<AssignmentDto>();
  @Output() create = new EventEmitter<void>();

  items: AssignmentDto[] = [];
  page = 1;
  totalPages = 1;
  loading = false;

  ngOnInit(): void {
    this.load(1);
  }

  load(p: number): void {
    this.loading = true;
    this.service.getByHalgheh(this.halghehId, p, 20).subscribe({
      next: (res) => {
        this.items = res.items;
        this.page = res.page;
        this.totalPages = Math.max(1, Math.ceil(res.totalCount / res.pageSize));
      },
      error: () => {},
      complete: () => this.loading = false
    });
  }

  statusLabel(s: string): string {
    return { active: 'فعال', closed: 'بسته شده', draft: 'پیش‌نویس' }[s] ?? s;
  }

  myStatusLabel(s: string): string {
    return {
      submitted: '⏳ ارسال شده — در انتظار بررسی',
      approved: '✓ تأیید شده',
      rejected: '✗ رد شده',
      '': '— ارسال نشده'
    }[s] ?? '';
  }
}
