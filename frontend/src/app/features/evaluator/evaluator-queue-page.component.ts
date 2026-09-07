import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import type { EvaluationRecord } from '../../core/models/lesson-planner.models';
import { LESSON_PLANNER_API } from '../../core/services/lesson-planner-api.token';

@Component({
  selector: 'app-evaluator-queue-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="queue-page">
      <div class="page-head">
        <h2>فهرست ارزیابی</h2>
        <button type="button" class="btn-refresh" (click)="loadRecords()" [disabled]="loading">
          {{ loading ? 'در حال بارگذاری...' : 'به‌روزرسانی' }}
        </button>
      </div>

      <div class="filters">
        <input type="text" class="search-input" placeholder="جستجو..." [(ngModel)]="searchQuery" (ngModelChange)="filterRecords()" />
        <select class="filter-select" [(ngModel)]="statusFilter" (ngModelChange)="filterRecords()">
          <option value="">همه وضعیت‌ها</option>
          <option value="draft">پیش‌نویس</option>
          <option value="published">منتشر شده</option>
          <option value="completed">تکمیل شده</option>
          <option value="archived">آرشیو شده</option>
        </select>
        <button type="button" class="btn-export" (click)="exportCsv()" [disabled]="filteredRecords.length === 0">
          خروجی CSV
        </button>
      </div>

      <div class="loading" *ngIf="loading">در حال بارگذاری سوابق...</div>
      <div class="empty" *ngIf="!loading && filteredRecords.length === 0">هنوز ارزیابی‌ای ثبت نشده است.</div>

      <div class="records-table" *ngIf="!loading && filteredRecords.length > 0">
        <div class="table-header">
          <span class="col-target">هدف</span>
          <span class="col-type">نوع</span>
          <span class="col-evaluator">ارزیاب</span>
          <span class="col-score">نمره</span>
          <span class="col-date">تاریخ</span>
          <span class="col-actions">عملیات</span>
        </div>
        <div class="table-row" *ngFor="let r of filteredRecords">
          <span class="col-target">{{ r.targetName }}</span>
          <span class="col-type"><span class="badge" [ngClass]="r.targetType">{{ targetTypeLabel(r.targetType) }}</span></span>
          <span class="col-evaluator">{{ r.evaluatorName || r.evaluatorId }}</span>
          <span class="col-score">{{ r.score }}</span>
          <span class="col-date">{{ r.evaluationDate | date:'yyyy/MM/dd' }}</span>
          <span class="col-actions">
            <a class="btn-link-sm" [routerLink]="['/evaluator/form', r.id]">فرم</a>
            <a class="btn-link-sm" routerLink="/evaluator/review">بازبینی</a>
            <button type="button" class="btn-delete-sm" (click)="deleteRecord(r.id)" [disabled]="actionLoading">حذف</button>
          </span>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .queue-page { display: grid; gap: 1rem; }
    .page-head { display: flex; justify-content: space-between; align-items: center; }
    .page-head h2 { margin: 0; font-size: 1.1rem; color: var(--lp-text, #1e1b14); }
    .btn-refresh {
      background: var(--lp-surface, #fff); border: 1px solid var(--lp-border, #ddd5c5);
      border-radius: 10px; padding: 0.35rem 0.75rem; cursor: pointer; font: inherit; font-size: 0.85rem;
      color: var(--lp-text, #1e1b14);
    }
    .btn-refresh:hover:not(:disabled) { border-color: var(--lp-gold, #b8942e); }
    .btn-refresh:disabled { opacity: 0.5; cursor: not-allowed; }

    .filters { display: flex; gap: 0.75rem; flex-wrap: wrap; }
    .search-input, .filter-select {
      border: 1px solid var(--lp-border, #ddd5c5); border-radius: 10px;
      padding: 0.5rem 0.75rem; font: inherit; background: var(--lp-surface, #fff);
      color: var(--lp-text, #1e1b14); font-size: 0.9rem;
    }
    .search-input:focus, .filter-select:focus {
      outline: none; border-color: var(--lp-gold, #b8942e); box-shadow: 0 0 0 3px rgba(184,148,46,0.12);
    }
    .btn-export {
      background: var(--lp-primary, #1a6b3c); color: #fff; border: none;
      border-radius: 10px; padding: 0.5rem 1rem; cursor: pointer; font: inherit; font-weight: 600; font-size: 0.85rem;
    }
    .btn-export:hover:not(:disabled) { background: var(--lp-primary-hover, #155c32); }
    .btn-export:disabled { opacity: 0.5; cursor: not-allowed; }

    .loading, .empty { color: var(--lp-muted, #7a7468); text-align: center; padding: 2rem 0; font-size: 0.9rem; }

    .records-table { background: var(--lp-surface, #fff); border: 1px solid var(--lp-border, #ddd5c5); border-radius: 14px; overflow: hidden; }
    .table-header, .table-row {
      display: grid; grid-template-columns: 2fr 1fr 1.5fr 0.8fr 1fr 1.5fr;
      gap: 0.5rem; padding: 0.75rem 1rem; align-items: center;
    }
    .table-header {
      background: var(--lp-bg, #f8f9fa); font-weight: 600; font-size: 0.82rem;
      color: var(--lp-muted, #6b7280); border-bottom: 1px solid var(--lp-border, #ddd5c5);
    }
    .table-row { border-bottom: 1px solid var(--lp-border, #e5e7eb); font-size: 0.88rem; color: var(--lp-text, #1e1b14); }
    .table-row:last-child { border-bottom: none; }
    .col-actions { display: flex; gap: 0.4rem; }

    .badge {
      font-size: 0.72rem; padding: 0.15rem 0.5rem; border-radius: 999px; font-weight: 500;
    }
    .badge.coach { background: #dbeafe; color: #1e40af; }
    .badge.student { background: #dcfce7; color: #166534; }
    .badge.branch { background: #fef3c7; color: #92400e; }

    .btn-link-sm {
      background: var(--lp-surface, #fff); border: 1px solid var(--lp-border, #ddd5c5);
      border-radius: 8px; padding: 0.25rem 0.5rem; cursor: pointer; font: inherit;
      font-size: 0.78rem; color: var(--lp-primary, #1a6b3c); text-decoration: none; font-weight: 500;
    }
    .btn-link-sm:hover { border-color: var(--lp-primary, #1a6b3c); }
    .btn-delete-sm {
      background: #fee2e2; color: #991b1b; border: none; border-radius: 8px;
      padding: 0.25rem 0.5rem; cursor: pointer; font: inherit; font-size: 0.78rem; font-weight: 600;
    }
    .btn-delete-sm:hover:not(:disabled) { background: #fecaca; }
    .btn-delete-sm:disabled { opacity: 0.5; cursor: not-allowed; }
  `]
})
export class EvaluatorQueuePageComponent implements OnInit {
  private readonly api = inject(LESSON_PLANNER_API);
  private readonly destroyRef = inject(DestroyRef);

  records: EvaluationRecord[] = [];
  filteredRecords: EvaluationRecord[] = [];
  loading = false;
  actionLoading = false;
  searchQuery = '';
  statusFilter = '';

  ngOnInit(): void {
    this.loadRecords();
  }

  loadRecords(): void {
    this.loading = true;
    this.api.getEvaluationRecords().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (records) => { this.records = records; this.filterRecords(); this.loading = false; },
      error: () => { this.records = []; this.filteredRecords = []; this.loading = false; }
    });
  }

  filterRecords(): void {
    const q = this.searchQuery.toLowerCase();
    this.filteredRecords = this.records.filter((r) => {
      const matchesSearch = !q || r.targetName.toLowerCase().includes(q) || (r.evaluatorName ?? '').toLowerCase().includes(q);
      const matchesStatus = !this.statusFilter || r.targetType === this.statusFilter;
      return matchesSearch && matchesStatus;
    });
  }

  deleteRecord(id: number): void {
    if (this.actionLoading) return;
    if (!confirm('آیا از حذف این ارزیابی اطمینان دارید؟')) return;
    this.actionLoading = true;
    this.api.deleteEvaluation(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => { this.records = this.records.filter((r) => r.id !== id); this.filterRecords(); this.actionLoading = false; },
      error: () => { this.actionLoading = false; }
    });
  }

  targetTypeLabel(type: string): string {
    const labels: Record<string, string> = { coach: 'مربی', student: 'متربی', branch: 'شعبه' };
    return labels[type] ?? type;
  }

  exportCsv(): void {
    const header = 'هدف,نوع,ارزیاب,نمره,تاریخ,بازخورد';
    const rows = this.filteredRecords.map((r) =>
      [r.targetName, this.targetTypeLabel(r.targetType), r.evaluatorName ?? String(r.evaluatorId), String(r.score), r.evaluationDate, (r.feedback ?? '').replace(/,/g, '؛')].join(',')
    );
    const csv = '\uFEFF' + header + '\n' + rows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `evaluations-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }
}
