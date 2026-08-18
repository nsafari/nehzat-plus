import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HalghehService } from '../../core/services/halgheh.service';
import { HalghehFullDto } from '../../core/models/halgheh.models';

@Component({
  selector: 'lp-halgheh-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1 class="page-title">حلقه‌ها</h1>
        <button class="btn btn-primary" (click)="showCreate = !showCreate">
          {{ showCreate ? 'انصراف' : '+ حلقه جدید' }}
        </button>
      </div>

      <!-- Create Form -->
      <div *ngIf="showCreate" class="card" style="margin-bottom: 1.5rem;">
        <div class="card-body">
          <h3>ایجاد حلقه جدید</h3>
          <div class="form-group">
            <label>نام حلقه</label>
            <input class="form-control" [(ngModel)]="newName" placeholder="نام حلقه">
          </div>
          <div class="form-group">
            <label>توضیحات</label>
            <textarea class="form-control" [(ngModel)]="newDescription" rows="2"></textarea>
          </div>
          <div class="form-group">
            <label>حداکثر اعضا</label>
            <input class="form-control" type="number" [(ngModel)]="newMaxMembers" placeholder="اختیاری">
          </div>
          <div class="form-actions">
            <button class="btn btn-primary" (click)="create()" [disabled]="!newName.trim() || creating">
              {{ creating ? 'در حال ایجاد...' : 'ایجاد حلقه' }}
            </button>
            <span *ngIf="error" class="text-danger">{{ error }}</span>
          </div>
        </div>
      </div>

      <!-- Halgheh List -->
      <div *ngIf="loading" class="loading">در حال بارگذاری...</div>

      <div *ngIf="!loading && halghehs.length === 0" class="empty-state">
        هنوز حلقه‌ای ایجاد نشده است.
      </div>

      <div *ngFor="let h of halghehs" class="card halgheh-card" (click)="open(h)">
        <div class="card-body">
          <div class="halgheh-header">
            <h3>{{ h.name }}</h3>
            <span class="badge" [class]="'badge-' + h.status">{{ statusLabel(h.status) }}</span>
          </div>
          <p *ngIf="h.description" class="text-muted">{{ h.description }}</p>
          <div class="halgheh-meta">
            <span>ناظم: {{ h.moderatorName }}</span>
            <span>{{ h.memberCount }} عضو</span>
            <span *ngIf="h.myRole" class="badge badge-info">{{ roleLabel(h.myRole) }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding: 1.5rem; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    .page-title { font-size: 1.5rem; font-weight: 600; }
    .card { background: var(--lp-card-bg, #fff); border: 1px solid var(--lp-border, #e2e8f0); border-radius: 8px; padding: 1rem; margin-bottom: 0.75rem; cursor: pointer; transition: box-shadow 0.2s; }
    .card:hover { box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .card-body { padding: 0; }
    .form-group { margin-bottom: 1rem; }
    .form-group label { display: block; margin-bottom: 0.25rem; font-weight: 500; }
    .form-control { width: 100%; padding: 0.5rem; border: 1px solid var(--lp-border, #ccc); border-radius: 4px; }
    .form-actions { display: flex; align-items: center; gap: 1rem; }
    .btn { padding: 0.5rem 1rem; border: none; border-radius: 4px; cursor: pointer; font-weight: 500; }
    .btn-primary { background: var(--lp-primary, #2563eb); color: white; }
    .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
    .halgheh-header { display: flex; justify-content: space-between; align-items: center; }
    .halgheh-meta { display: flex; gap: 1rem; font-size: 0.875rem; color: var(--lp-text-secondary, #64748b); margin-top: 0.5rem; }
    .badge { padding: 0.125rem 0.5rem; border-radius: 9999px; font-size: 0.75rem; }
    .badge-active { background: #dcfce7; color: #166534; }
    .badge-inactive { background: #fee2e2; color: #991b1b; }
    .badge-info { background: #dbeafe; color: #1e40af; }
    .text-muted { color: var(--lp-text-secondary, #64748b); }
    .text-danger { color: var(--lp-danger, #dc2626); }
    .loading, .empty-state { text-align: center; padding: 2rem; color: var(--lp-text-secondary, #64748b); }
  `]
})
export class HalghehListComponent implements OnInit {
  private halghehService = inject(HalghehService);

  @Input() maktabId!: number;
  @Output() onOpen = new EventEmitter<HalghehFullDto>();

  halghehs: HalghehFullDto[] = [];
  loading = true;
  showCreate = false;
  creating = false;
  error = '';

  newName = '';
  newDescription = '';
  newMaxMembers: number | null = null;

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;
    this.halghehService.getAllByMaktab(this.maktabId).subscribe({
      next: (data) => { this.halghehs = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  create() {
    if (!this.newName.trim() || !this.maktabId) return;
    this.creating = true;
    this.error = '';
    this.halghehService.create({
      maktabId: this.maktabId,
      name: this.newName.trim(),
      description: this.newDescription.trim() || undefined,
      maxMembers: this.newMaxMembers || undefined,
    }).subscribe({
      next: (h) => {
        this.halghehs.unshift(h);
        this.showCreate = false;
        this.newName = '';
        this.newDescription = '';
        this.newMaxMembers = null;
        this.creating = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'خطا در ایجاد حلقه';
        this.creating = false;
      }
    });
  }

  open(h: HalghehFullDto) {
    this.onOpen.emit(h);
  }

  statusLabel(s: string): string {
    return s === 'active' ? 'فعال' : s === 'inactive' ? 'غیرفعال' : s;
  }

  roleLabel(r: string): string {
    return r === 'moderator' ? 'ناظم' : r === 'member' ? 'عضو' : r;
  }
}
