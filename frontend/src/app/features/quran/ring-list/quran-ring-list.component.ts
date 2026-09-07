import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { QuranRingService } from '../../../core/services/quran-ring.service';
import {
  QuranRingDto,
  QuranRingFilterDto,
  CreateQuranRingRequest,
  UpdateQuranRingRequest,
} from '../../../core/models/quran-ring.models';

@Component({
  selector: 'lp-quran-ring-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1 class="page-title">حلقه‌های قرآنی</h1>
        <button class="btn btn-primary" (click)="showCreate = !showCreate">
          {{ showCreate ? 'انصراف' : '+ حلقه جدید' }}
        </button>
      </div>

      <!-- Filter Bar -->
      <div class="card filter-bar">
        <div class="filter-row">
          <div class="form-group">
            <label>جستجو</label>
            <input class="form-control" type="text" [(ngModel)]="filter.search" placeholder="نام یا کد حلقه..." (input)="applyFilter()">
          </div>
          <div class="form-group">
            <label>گروه سنی</label>
            <select class="form-control" [(ngModel)]="filter.ageGroup" (change)="applyFilter()">
              <option value="">همه</option>
              <option value="NOVICE">نوآموز (۳-۶ سال)</option>
              <option value="CHILD">کودک (۶-۱۲ سال)</option>
              <option value="TEEN">نوجوان (۱۰-۲۰ سال)</option>
            </select>
          </div>
          <div class="form-group">
            <label>جنسیت</label>
            <select class="form-control" [(ngModel)]="filter.gender" (change)="applyFilter()">
              <option value="">همه</option>
              <option value="MIXED">مختلط</option>
              <option value="BOYS">پسرانه</option>
              <option value="GIRLS">دخترانه</option>
            </select>
          </div>
          <div class="form-group">
            <label>وضعیت</label>
            <select class="form-control" [(ngModel)]="filter.isActive" (change)="applyFilter()">
              <option value="">همه</option>
              <option value="true">فعال</option>
              <option value="false">غیرفعال</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Create Form -->
      <div *ngIf="showCreate" class="card" style="margin-bottom: 1.5rem;">
        <div class="card-body">
          <h3>ایجاد حلقه جدید</h3>
          <div class="form-row">
            <div class="form-group">
              <label>کد حلقه *</label>
              <input class="form-control" [(ngModel)]="newRing.code" placeholder="مثال: RING_3">
            </div>
            <div class="form-group">
              <label>نام حلقه *</label>
              <input class="form-control" [(ngModel)]="newRing.name" placeholder="مثال: حلقه ۳">
            </div>
          </div>
          <div class="form-group">
            <label>توضیحات</label>
            <textarea class="form-control" [(ngModel)]="newRing.description" rows="2"></textarea>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>گروه سنی *</label>
              <select class="form-control" [(ngModel)]="newRing.ageGroup">
                <option value="NOVICE">نوآموز (۳-۶ سال)</option>
                <option value="CHILD">کودک (۶-۱۲ سال)</option>
                <option value="TEEN">نوجوان (۱۰-۲۰ سال)</option>
              </select>
            </div>
            <div class="form-group">
              <label>جنسیت</label>
              <select class="form-control" [(ngModel)]="newRing.gender">
                <option value="MIXED">مختلط</option>
                <option value="BOYS">پسرانه</option>
                <option value="GIRLS">دخترانه</option>
              </select>
            </div>
            <div class="form-group">
              <label>حداقل سن</label>
              <input class="form-control" type="number" [(ngModel)]="newRing.minAge" min="3" max="20">
            </div>
            <div class="form-group">
              <label>حداکثر سن</label>
              <input class="form-control" type="number" [(ngModel)]="newRing.maxAge" min="3" max="20">
            </div>
            <div class="form-group">
              <label>ترتیب نمایش</label>
              <input class="form-control" type="number" [(ngModel)]="newRing.sortOrder" min="1">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group checkbox-group">
              <label class="checkbox-label">
                <input type="checkbox" [(ngModel)]="newRing.hasSpecializedPath">
                <span>مسیر تخصصی دارد</span>
              </label>
            </div>
            <div class="form-group" *ngIf="newRing.hasSpecializedPath">
              <label>تعداد دوره‌های تخصصی</label>
              <input class="form-control" type="number" [(ngModel)]="newRing.specializedPeriods" min="1">
            </div>
            <div class="form-group" *ngIf="newRing.hasSpecializedPath">
              <label>درصد زمان تخصصی</label>
              <input class="form-control" type="number" [(ngModel)]="newRing.specializedTimePercent" min="1" max="100">
            </div>
          </div>
          <div class="form-actions">
            <button class="btn btn-primary" (click)="createRing()" [disabled]="creating || !newRing.code.trim() || !newRing.name.trim()">
              {{ creating ? 'در حال ایجاد...' : 'ایجاد حلقه' }}
            </button>
            <span *ngIf="createError" class="text-danger">{{ createError }}</span>
          </div>
        </div>
      </div>

      <!-- Loading / Empty -->
      <div *ngIf="loading" class="loading">در حال بارگذاری...</div>
      <div *ngIf="!loading && rings.length === 0" class="empty-state">
        هنوز حلقه‌ای ایجاد نشده است.
      </div>

      <!-- Rings Grid -->
      <div class="rings-grid" *ngIf="!loading && rings.length > 0">
        <div *ngFor="let ring of rings" class="card ring-card" [routerLink]="['/quran/rings', ring.id]">
          <div class="card-body">
            <div class="ring-header">
              <div>
                <h3 class="ring-name">{{ ring.name }}</h3>
                <span class="ring-code">{{ ring.code }}</span>
              </div>
              <span class="badge" [class]="'badge-' + (ring.isActive ? 'active' : 'inactive')">
                {{ ring.isActive ? 'فعال' : 'غیرفعال' }}
              </span>
            </div>
            <p *ngIf="ring.description" class="text-muted">{{ ring.description }}</p>
            <div class="ring-meta">
              <span class="meta-item">
                <span class="meta-label">گروه سنی:</span>
                <span class="meta-value">{{ ageGroupLabel(ring.ageGroup) }}</span>
              </span>
              <span class="meta-item">
                <span class="meta-label">جنسیت:</span>
                <span class="meta-value">{{ genderLabel(ring.gender) }}</span>
              </span>
              <span class="meta-item" *ngIf="ring.minAge || ring.maxAge">
                <span class="meta-label">بازه سنی:</span>
                <span class="meta-value">{{ ring.minAge || 0 }} - {{ ring.maxAge || 0 }} سال</span>
              </span>
              <span class="meta-item" *ngIf="ring.hasSpecializedPath">
                <span class="badge badge-specialized">تخصصی ({{ ring.specializedTimePercent }}%)</span>
              </span>
            </div>
            <div class="ring-stats">
              <span class="stat">
                <span class="stat-value">{{ ring.sessions?.length || 0 }}</span>
                <span class="stat-label">جلسه</span>
              </span>
              <span class="stat">
                <span class="stat-value">{{ ring.resources?.length || 0 }}</span>
                <span class="stat-label">منبع</span>
              </span>
              <span class="stat">
                <span class="stat-value">{{ ring.ringSurahs?.length || 0 }}</span>
                <span class="stat-label">سوره</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div *ngIf="totalPages > 1" class="pagination">
        <button class="btn btn-secondary" (click)="changePage(page - 1)" [disabled]="page <= 1">قبلی</button>
        <span class="page-info">صفحه {{ page }} از {{ totalPages }}</span>
        <button class="btn btn-secondary" (click)="changePage(page + 1)" [disabled]="page >= totalPages">بعدی</button>
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding: 1.5rem; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    .page-title { font-size: 1.5rem; font-weight: 600; color: var(--lp-text-primary); }
    .card { background: var(--lp-card-bg, #fff); border: 1px solid var(--lp-border, #e2e8f0); border-radius: 8px; padding: 1rem; margin-bottom: 1rem; }
    .filter-bar { padding: 1rem; }
    .filter-row { display: flex; gap: 1rem; flex-wrap: wrap; }
    .filter-row .form-group { flex: 1; min-width: 180px; }
    .form-row { display: flex; gap: 1rem; flex-wrap: wrap; }
    .form-row .form-group { flex: 1; min-width: 150px; }
    .form-group { margin-bottom: 1rem; }
    .form-group label { display: block; margin-bottom: 0.375rem; font-weight: 500; font-size: 0.875rem; color: var(--lp-text-primary); }
    .form-control { width: 100%; padding: 0.5rem 0.75rem; border: 1px solid var(--lp-border, #ccc); border-radius: 6px; font-size: 0.875rem; background: var(--lp-input-bg, #fff); color: var(--lp-text-primary); }
    .form-control:focus { outline: none; border-color: var(--lp-primary, #2563eb); box-shadow: 0 0 0 3px var(--lp-primary-light, #dbeafe); }
    .checkbox-group { display: flex; align-items: flex-end; }
    .checkbox-label { display: flex; align-items: center; gap: 0.5rem; cursor: pointer; font-weight: 500; }
    .checkbox-label input { width: 1rem; height: 1rem; accent-color: var(--lp-primary, #2563eb); }
    .form-actions { display: flex; align-items: center; gap: 1rem; margin-top: 0.5rem; }
    .btn { padding: 0.5rem 1rem; border: none; border-radius: 6px; cursor: pointer; font-weight: 500; font-size: 0.875rem; transition: all 0.15s; }
    .btn-primary { background: var(--lp-primary, #2563eb); color: white; }
    .btn-primary:hover:not(:disabled) { background: var(--lp-primary-dark, #1d4ed8); }
    .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
    .btn-secondary { background: var(--lp-secondary, #64748b); color: white; }
    .btn-secondary:hover:not(:disabled) { background: var(--lp-secondary-dark, #475569); }
    .text-danger { color: var(--lp-danger, #dc2626); font-size: 0.875rem; }
    .text-muted { color: var(--lp-text-secondary, #64748b); font-size: 0.875rem; }
    .loading, .empty-state { text-align: center; padding: 3rem; color: var(--lp-text-secondary, #64748b); }

    /* Ring Cards */
    .rings-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1rem; }
    .ring-card { cursor: pointer; transition: all 0.2s; border-left: 4px solid var(--lp-primary, #2563eb); }
    .ring-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.1); }
    .ring-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem; }
    .ring-name { font-size: 1.125rem; font-weight: 600; margin: 0 0 0.25rem; color: var(--lp-text-primary); }
    .ring-code { font-size: 0.75rem; color: var(--lp-text-secondary); background: var(--lp-muted-bg, #f1f5f9); padding: 0.125rem 0.5rem; border-radius: 4px; }
    .ring-meta { display: flex; flex-wrap: wrap; gap: 1rem; margin: 0.75rem 0; font-size: 0.8125rem; }
    .meta-item { display: flex; align-items: center; gap: 0.375rem; color: var(--lp-text-secondary); }
    .meta-label { font-weight: 500; }
    .meta-value { color: var(--lp-text-primary); }
    .ring-stats { display: flex; justify-content: space-around; padding-top: 1rem; border-top: 1px solid var(--lp-border, #e2e8f0); margin-top: 0.5rem; }
    .stat { text-align: center; }
    .stat-value { display: block; font-size: 1.25rem; font-weight: 600; color: var(--lp-primary, #2563eb); }
    .stat-label { font-size: 0.75rem; color: var(--lp-text-secondary); }

    /* Badges */
    .badge { padding: 0.25rem 0.625rem; border-radius: 9999px; font-size: 0.7rem; font-weight: 500; }
    .badge-active { background: var(--lp-success-light, #dcfce7); color: var(--lp-success, #166534); }
    .badge-inactive { background: var(--lp-danger-light, #fee2e2); color: var(--lp-danger, #991b1b); }
    .badge-specialized { background: var(--lp-warning-light, #fef3c7); color: var(--lp-warning, #92400e); }

    /* Pagination */
    .pagination { display: flex; justify-content: center; align-items: center; gap: 1rem; margin-top: 1.5rem; }
    .page-info { font-size: 0.875rem; color: var(--lp-text-secondary); }
  `]
})
export class QuranRingListComponent implements OnInit {
  private quranRingService = inject(QuranRingService);

  rings: QuranRingDto[] = [];
  loading = false;
  totalPages = 1;
  page = 1;
  pageSize = 10;

  showCreate = false;
  creating = false;
  createError = '';

  filter: QuranRingFilterDto = {
    search: '',
    ageGroup: '',
    gender: '',
    isActive: undefined,
    page: 1,
    pageSize: 10
  };

  newRing: CreateQuranRingRequest = {
    code: '',
    name: '',
    description: '',
    ageGroup: 'CHILD',
    gender: 'MIXED',
    sortOrder: 1,
    hasSpecializedPath: false
  };

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;
    this.filter.page = this.page;
    this.filter.pageSize = this.pageSize;
    this.quranRingService.getAllRings(this.filter).subscribe({
      next: (data) => {
        this.rings = data;
        this.loading = false;
        // In real app, get total count from response headers or separate endpoint
        this.totalPages = Math.max(1, Math.ceil(data.length / this.pageSize));
      },
      error: () => { this.loading = false; }
    });
  }

  applyFilter() {
    this.page = 1;
    this.load();
  }

  changePage(newPage: number) {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.page = newPage;
      this.load();
    }
  }

  createRing() {
    if (!this.newRing.code.trim() || !this.newRing.name.trim()) return;
    this.creating = true;
    this.createError = '';
    this.quranRingService.createRing(this.newRing).subscribe({
      next: (ring) => {
        this.rings.unshift(ring);
        this.showCreate = false;
        this.resetNewRing();
        this.creating = false;
      },
      error: (err) => {
        this.createError = err.error?.message || 'خطا در ایجاد حلقه';
        this.creating = false;
      }
    });
  }

  resetNewRing() {
    this.newRing = {
      code: '',
      name: '',
      description: '',
      ageGroup: 'CHILD',
      gender: 'MIXED',
      sortOrder: 1,
      hasSpecializedPath: false
    };
  }

  ageGroupLabel(group: string): string {
    const labels: Record<string, string> = {
      'NOVICE': 'نوآموز (۳-۶ سال)',
      'CHILD': 'کودک (۶-۱۲ سال)',
      'TEEN': 'نوجوان (۱۰-۲۰ سال)'
    };
    return labels[group] || group;
  }

  genderLabel(gender?: string): string {
    const labels: Record<string, string> = {
      'MIXED': 'مختلط',
      'BOYS': 'پسرانه',
      'GIRLS': 'دخترانه'
    };
    return labels[gender || ''] || 'مشخص نشده';
  }
}