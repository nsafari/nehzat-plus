import { Component, OnInit, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuranRingService } from '../../../core/services/quran-ring.service';
import { TadabborEntryDto, CreateTadabborEntryRequest, UpdateTadabborEntryRequest, TadabborFilterDto } from '../../../core/models/quran-ring.models';

@Component({
  selector: 'app-tadabbor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="tadabbor-page">
      <header class="page-header">
        <h1 class="page-title">تدبر قرآنی</h1>
        <p class="page-subtitle">ثبت نامه‌ها در قرآن کریم</p>
      </header>

      <div class="action-bar">
        <button class="btn btn-primary" (click)="openCreateForm()">اضافه ورود جدید</button>
      </div>

      <div class="filter-bar" *ngIf="entries.length > 0">
        <label class="filter-label">فیلتر:</label>
        <input type="number" class="filter-input" [(ngModel)]="filterSurahId" placeholder="شماره سوره" (ngModelChange)="onFilterChange()" />
      </div>

      <div class="entry-form card" *ngIf="showForm">
        <h3 class="form-title">{{ editingId ? 'ویرایش' : 'اضافه جدید' }}</h3>
        <div class="form-grid">
          <div class="form-group">
            <label>شماره سوره</label>
            <input type="number" [(ngModel)]="form.surahId" class="form-input" />
          </div>
          <div class="form-group">
            <label>شماره آیه</label>
            <input type="number" [(ngModel)]="form.ayahNumber" class="form-input" />
          </div>
          <div class="form-group full-width">
            <label>کلمه</label>
            <input type="text" [(ngModel)]="form.word" class="form-input" />
          </div>
          <div class="form-group full-width">
            <label>چرا این کلمه?</label>
            <textarea [(ngModel)]="form.whyThisWord" class="form-textarea" rows="3"></textarea>
          </div>
          <div class="form-group full-width">
            <label>مصطلحات اصلی (JSON)</label>
            <textarea [(ngModel)]="form.synonymsJson" class="form-textarea" rows="2"></textarea>
          </div>
          <div class="form-group full-width">
            <label>تفاوت با مصطلحات اصلی</label>
            <textarea [(ngModel)]="form.differenceFromSynonyms" class="form-textarea" rows="2"></textarea>
          </div>
          <div class="form-group full-width">
            <label>مثبت جلالاین</label>
            <textarea [(ngModel)]="form.jalalainReference" class="form-textarea" rows="2"></textarea>
          </div>
          <div class="form-group full-width">
            <label>بازشجو دنجانی</label>
            <textarea [(ngModel)]="form.studentNote" class="form-textarea" rows="2"></textarea>
          </div>
          <div class="form-group full-width">
            <label>نظر مربی</label>
            <textarea [(ngModel)]="form.coachNote" class="form-textarea" rows="2"></textarea>
          </div>
        </div>

        <div class="form-actions">
          <button class="btn btn-primary" (click)="saveEntry()" [disabled]="saving">{{ saving ? 'در حال ذخیره...' : (editingId ? 'به‌رسانی' : 'ذخیره') }}</button>
          <button class="btn btn-secondary" (click)="cancelForm()">لغو</button>
        </div>
        <div class="form-error" *ngIf="errorMessage">{{ errorMessage }}</div>
      </div>

      <div class="loading" *ngIf="loading">
        <div class="spinner"></div>
        <p>در حال بارگذاری...</p>
      </div>

      <div class="empty-state" *ngIf="!loading && entries.length === 0 && !showForm">
        <div class="empty-icon">دد</div>
        <h3>هنوز ورودی ثبت نشده است</h3>
        <p>برای شروع تدبر قرآنی کلیک کنید.</p>
      </div>

      <div class="entries-grid" *ngIf="!loading && entries.length > 0">
        <div class="entry-card card" *ngFor="let entry of entries; trackBy: trackById">
          <div class="card-header">
            <span class="entry-word">{{ entry.word }}</span>
            <span class="entry-ref">سوره {{ entry.surahId }} آیه {{ entry.ayahNumber }}</span>
          </div>
          <div class="card-body">
            <div class="field-row" *ngIf="entry.whyThisWord">
              <span class="field-label">چرا این کلمه:</span>
              <span class="field-value">{{ entry.whyThisWord }}</span>
            </div>
            <div class="field-row" *ngIf="entry.synonymsJson">
              <span class="field-label">مصطلحات:</span>
              <div class="tags">
                <span class="tag" *ngFor="let s of parseSynonyms(entry.synonymsJson)">{{ s }}</span>
              </div>
            </div>
            <div class="field-row" *ngIf="entry.differenceFromSynonyms">
              <span class="field-label">تفاوت با مصطلحات:</span>
              <span class="field-value">{{ entry.differenceFromSynonyms }}</span>
            </div>
            <div class="field-row" *ngIf="entry.jalalainReference">
              <span class="field-label">مثبت جلالاین:</span>
              <span class="field-value">{{ entry.jalalainReference }}</span>
            </div>
            <div class="note-row student-note" *ngIf="entry.studentNote">
              <span class="note-label">بازشجو دنجانی:</span>
              <span class="note-value">{{ entry.studentNote }}</span>
            </div>
            <div class="note-row coach-note" *ngIf="entry.coachNote">
              <span class="note-label">نظر مربی:</span>
              <span class="note-value">{{ entry.coachNote }}</span>
            </div>
          </div>
          <div class="card-footer">
            <button class="btn-icon btn-edit" (click)="openEditForm(entry)" title="ویرایش">✏️</button>
            <button class="btn-icon btn-delete" (click)="deleteEntry(entry)" title="حذف">🗑️</button>
          </div>
        </div>
      </div>

      <div class="pagination" *ngIf="totalPages > 1">
        <button class="btn btn-secondary" (click)="goToPage(currentPage - 1)" [disabled]="currentPage <= 1">به عنوان</button>
        <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
        <button class="btn btn-secondary" (click)="goToPage(currentPage + 1)" [disabled]="currentPage >= totalPages">به جلو</button>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; direction: rtl; font-family: var(--lp-font, 'Vazirmatn', 'Tahoma', sans-serif); }
    .tadabbor-page { max-width: 960px; margin: 0 auto; padding: 24px 16px; }
    .page-header { margin-bottom: 24px; }
    .page-title { font-size: 1.75rem; font-weight: 700; color: var(--lp-text, #1e1b14); margin: 0 0 4px; }
    .page-subtitle { font-size: 0.9rem; color: var(--lp-text-muted, #7a7468); margin: 0; }
    .card { background: var(--lp-surface, #fff); border: 1px solid var(--lp-border, #ddd5c5); border-radius: var(--lp-radius-card, 20px); padding: 20px; }
    .action-bar { margin-bottom: 16px; }
    .btn { padding: 10px 20px; border: none; border-radius: var(--lp-radius-button, 12px); font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
    .btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .btn-primary { background: var(--lp-primary, #1a6b3c); color: #fff; }
    .btn-primary:hover:not(:disabled) { background: var(--lp-primary-hover, #14522d); }
    .btn-secondary { background: var(--lp-border, #ddd5c5); color: var(--lp-text, #1e1b14); }
    .btn-secondary:hover:not(:disabled) { background: var(--lp-text-muted, #7a7468); color: #fff; }
    .filter-bar { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; padding: 12px 16px; background: var(--lp-surface, #fff); border: 1px solid var(--lp-border, #ddd5c5); border-radius: var(--lp-radius-card, 20px); }
    .filter-label { font-weight: 600; color: var(--lp-text-muted, #7a7468); }
    .filter-input { width: 120px; padding: 8px 12px; border: 1px solid var(--lp-border, #ddd5c5); border-radius: var(--lp-radius-input, 12px); font-size: 0.9rem; }
    .entry-form { margin-bottom: 24px; }
    .form-title { font-size: 1.1rem; font-weight: 700; color: var(--lp-text, #1e1b14); margin: 0 0 16px; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .form-group { display: flex; flex-direction: column; gap: 6px; }
    .form-group.full-width { grid-column: 1 / -1; }
    .form-group label { font-size: 0.85rem; font-weight: 600; color: var(--lp-text-muted, #7a7468); }
    .form-input, .form-textarea { padding: 10px 14px; border: 1px solid var(--lp-border, #ddd5c5); border-radius: var(--lp-radius-input, 12px); font-size: 0.9rem; font-family: inherit; transition: border-color 0.2s; }
    .form-input:focus, .form-textarea:focus { outline: none; border-color: var(--lp-primary, #1a6b3c); box-shadow: 0 0 0 3px var(--lp-primary-light, #e8f5e9); }
    .form-textarea { resize: vertical; min-height: 60px; }
    .form-actions { display: flex; gap: 12px; margin-top: 16px; }
    .form-error { margin-top: 12px; padding: 10px; background: #fef2f2; border: 1px solid var(--lp-danger, #b91c1c); border-radius: 8px; color: var(--lp-danger, #b91c1c); font-size: 0.85rem; }
    .loading { display: flex; flex-direction: column; align-items: center; padding: 48px; gap: 16px; }
    .spinner { width: 32px; height: 32px; border: 3px solid var(--lp-border, #ddd5c5); border-top-color: var(--lp-primary, #1a6b3c); border-radius: 50%; animation: spin 0.8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .empty-state { text-align: center; padding: 48px 24px; color: var(--lp-text-muted, #7a7468); }
    .empty-icon { font-size: 3rem; margin-bottom: 12px; }
    .entries-grid { display: grid; gap: 16px; }
    .entry-card { border-right: 4px solid var(--lp-primary, #1a6b3c); transition: transform 0.2s, box-shadow 0.2s; }
    .entry-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
    .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid var(--lp-border, #ddd5c5); }
    .entry-word { font-size: 1.2rem; font-weight: 700; color: var(--lp-primary, #1a6b3c); }
    .entry-ref { font-size: 0.85rem; color: var(--lp-text-muted, #7a7468); }
    .card-body { display: flex; flex-direction: column; gap: 10px; }
    .field-row { display: flex; flex-direction: column; gap: 4px; }
    .field-label { font-size: 0.8rem; font-weight: 600; color: var(--lp-text-muted, #7a7468); }
    .field-value { font-size: 0.9rem; color: var(--lp-text, #1e1b14); line-height: 1.5; }
    .tags { display: flex; flex-wrap: wrap; gap: 6px; }
    .tag { padding: 4px 10px; background: var(--lp-primary-light, #e8f5e9); color: var(--lp-primary, #1a6b3c); border-radius: 16px; font-size: 0.8rem; font-weight: 500; }
    .note-row { padding: 10px 12px; border-radius: 8px; margin-top: 4px; }
    .student-note { border-right: 3px solid var(--lp-accent-blue, #2d5a8a); background: #f0f7ff; }
    .coach-note { border-right: 3px solid var(--lp-gold, #b8942e); background: var(--lp-gold-light, #faf3e0); }
    .note-label { font-size: 0.8rem; font-weight: 600; color: var(--lp-text-muted, #7a7468); }
    .note-value { font-size: 0.9rem; color: var(--lp-text, #1e1b14); line-height: 1.5; }
    .card-footer { display: flex; gap: 8px; margin-top: 16px; padding-top: 12px; border-top: 1px solid var(--lp-border, #ddd5c5); }
    .btn-icon { padding: 8px; border: none; background: transparent; cursor: pointer; border-radius: 8px; font-size: 1.1rem; transition: background 0.2s; }
    .btn-edit:hover { background: var(--lp-primary-light, #e8f5e9); }
    .btn-delete:hover { background: #fef2f2; }
    .pagination { display: flex; justify-content: center; align-items: center; gap: 16px; margin-top: 24px; }
    .page-info { font-size: 0.9rem; color: var(--lp-text-muted, #7a7468); }
  `]
})
export class TadabborComponent implements OnInit {
  @Input() studentId!: number;

  private service = inject(QuranRingService);

  entries: TadabborEntryDto[] = [];
  loading = false;
  showForm = false;
  editingId: number | null = null;
  saving = false;
  errorMessage = '';
  filterSurahId: number | null = null;
  currentPage = 1;
  totalPages = 1;
  pageSize = 20;

  form = {
    surahId: 0,
    ayahId: 0,
    ayahNumber: 0,
    word: '',
    whyThisWord: '',
    synonymsJson: '',
    differenceFromSynonyms: '',
    jalalainReference: '',
    studentNote: '',
    coachNote: ''
  };

  ngOnInit(): void {
    this.loadEntries();
  }

  loadEntries(): void {
    this.loading = true;
    const filter: TadabborFilterDto = { page: this.currentPage, pageSize: this.pageSize };
    if (this.studentId) filter.studentId = this.studentId;
    if (this.filterSurahId) filter.surahId = this.filterSurahId;
    this.service.getTadabborEntries(filter).subscribe({
      next: (res) => {
        this.entries = res ?? [];
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadEntries();
  }

  openCreateForm(): void {
    this.editingId = null;
    this.form = { surahId: 0, ayahId: 0, ayahNumber: 0, word: '', whyThisWord: '', synonymsJson: '', differenceFromSynonyms: '', jalalainReference: '', studentNote: '', coachNote: '' };
    this.errorMessage = '';
    this.showForm = true;
  }

  openEditForm(entry: TadabborEntryDto): void {
    this.editingId = entry.id;
    this.form = {
      surahId: entry.surahId,
      ayahId: entry.ayahId,
      ayahNumber: entry.ayahNumber,
      word: entry.word,
      whyThisWord: entry.whyThisWord,
      synonymsJson: entry.synonymsJson ?? '',
      differenceFromSynonyms: entry.differenceFromSynonyms ?? '',
      jalalainReference: entry.jalalainReference ?? '',
      studentNote: entry.studentNote ?? '',
      coachNote: entry.coachNote ?? ''
    };
    this.errorMessage = '';
    this.showForm = true;
  }

  cancelForm(): void {
    this.showForm = false;
    this.editingId = null;
    this.errorMessage = '';
  }

  saveEntry(): void {
    this.saving = true;
    this.errorMessage = '';

    if (this.editingId) {
      const req: UpdateTadabborEntryRequest = {
        word: this.form.word,
        whyThisWord: this.form.whyThisWord,
        synonymsJson: this.form.synonymsJson || undefined,
        differenceFromSynonyms: this.form.differenceFromSynonyms || undefined,
        jalalainReference: this.form.jalalainReference || undefined,
        studentNote: this.form.studentNote || undefined,
        coachNote: this.form.coachNote || undefined
      };
      this.service.updateTadabborEntry(this.editingId, req).subscribe({
        next: () => { this.saving = false; this.showForm = false; this.loadEntries(); },
        error: (err) => { this.saving = false; this.errorMessage = err?.error?.message ?? 'خطا در به‌رسانی'; }
      });
    } else {
      const req: CreateTadabborEntryRequest = {
        studentId: this.studentId,
        surahId: this.form.surahId,
        ayahId: this.form.ayahId,
        ayahNumber: this.form.ayahNumber,
        word: this.form.word,
        whyThisWord: this.form.whyThisWord,
        synonymsJson: this.form.synonymsJson || undefined,
        differenceFromSynonyms: this.form.differenceFromSynonyms || undefined,
        jalalainReference: this.form.jalalainReference || undefined,
        studentNote: this.form.studentNote || undefined,
        coachNote: this.form.coachNote || undefined
      };
      this.service.createTadabborEntry(req).subscribe({
        next: () => { this.saving = false; this.showForm = false; this.loadEntries(); },
        error: (err) => { this.saving = false; this.errorMessage = err?.error?.message ?? 'خطا در اضافه'; }
      });
    }
  }

  deleteEntry(entry: TadabborEntryDto): void {
    if (!window.confirm('آیا از حذف این ورود مطمئن هستید?')) return;
    this.service.deleteTadabborEntry(entry.id).subscribe({
      next: () => this.loadEntries(),
      error: () => {}
    });
  }

  parseSynonyms(json: string): string[] {
    if (!json) return [];
    try {
      const arr = JSON.parse(json);
      if (Array.isArray(arr)) {
        return arr.map((s: any) => s.word ?? s.name ?? String(s));
      }
      return [];
    } catch {
      return [];
    }
  }

  trackById(_index: number, item: TadabborEntryDto): number {
    return item.id;
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadEntries();
  }
}