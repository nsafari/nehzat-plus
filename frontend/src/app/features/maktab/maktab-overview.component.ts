import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MaktabService } from '../../core/services/maktab.service';
import { MaktabDto } from '../../core/models/maktab.models';

@Component({
  selector: 'app-maktab-overview',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="maktab-overview">
      <div class="page-header">
        <h2>مکتب‌ها</h2>
        <button class="btn btn-primary" (click)="showCreateModal.set(true)">+ مکتب جدید</button>
      </div>

      <!-- جستجو -->
      <div class="search-bar">
        <input type="text" [(ngModel)]="searchQuery" placeholder="جستجو در مکتب‌ها..."
          (input)="filterMaktabs()" class="form-control" />
      </div>

      <!-- لیست مکتب‌ها -->
      <div class="maktab-grid" *ngIf="!loading()">
        <div class="maktab-card" *ngFor="let maktab of filteredMaktabs()"
          [class.maktab-owned]="maktab.myRole === 'owner'">

          <div class="card-header">
            <h3 class="maktab-name">{{ maktab.name }}</h3>
            <span class="badge" [class]="'badge-' + maktab.status">{{ statusLabel(maktab.status) }}</span>
          </div>

          <div class="card-body">
            <p *ngIf="maktab.description" class="maktab-desc">{{ maktab.description }}</p>
            <div class="maktab-meta">
              <span *ngIf="maktab.city">📍 {{ maktab.city }}</span>
              <span>👥 {{ maktab.memberCount }} عضو</span>
              <span *ngIf="maktab.myRole">🔑 {{ roleLabel(maktab.myRole) }}</span>
            </div>
            <div class="maktab-invite" *ngIf="maktab.inviteCode">
              <small>کد دعوت: <code>{{ maktab.inviteCode }}</code></small>
            </div>
          </div>

          <div class="card-actions">
            <a [routerLink]="['/maktabs', maktab.id]" class="btn btn-sm">مشاهده</a>
            <button class="btn btn-sm btn-danger" *ngIf="maktab.myRole === 'owner'"
              (click)="confirmDelete(maktab)">حذف</button>
          </div>
        </div>
      </div>

      <!-- حالت بارگذاری -->
      <div *ngIf="loading()" class="loading">
        <div class="spinner"></div>
        <p>در حال بارگذاری...</p>
      </div>

      <!-- حالت خالی -->
      <div *ngIf="!loading() && filteredMaktabs().length === 0" class="empty-state">
        <p>مکتبی یافت نشد</p>
        <button class="btn btn-primary" (click)="showCreateModal.set(true)">اولین مکتب خود را بسازید</button>
      </div>

      <!-- مودال ایجاد مکتب -->
      <div class="modal-overlay" *ngIf="showCreateModal()" (click)="showCreateModal.set(false)">
        <div class="modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>مکتب جدید</h3>
            <button class="close-btn" (click)="showCreateModal.set(false)">&times;</button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label>نام مکتب *</label>
              <input type="text" [(ngModel)]="newMaktab.name" class="form-control" placeholder="مثال: مکتب نور" />
            </div>
            <div class="form-group">
              <label>توضیحات</label>
              <textarea [(ngModel)]="newMaktab.description" class="form-control" rows="3"></textarea>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>شهر</label>
                <input type="text" [(ngModel)]="newMaktab.city" class="form-control" />
              </div>
              <div class="form-group">
                <label>تلفن</label>
                <input type="text" [(ngModel)]="newMaktab.phone" class="form-control" />
              </div>
            </div>
            <div class="form-group">
              <label class="checkbox-label">
                <input type="checkbox" [(ngModel)]="newMaktab.isPublic" />
                مکتب عمومی باشد
              </label>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn" (click)="showCreateModal.set(false)">انصراف</button>
            <button class="btn btn-primary" (click)="createMaktab()" [disabled]="creating()">
              {{ creating() ? 'در حال ایجاد...' : 'ایجاد مکتب' }}
            </button>
          </div>
        </div>
      </div>

      <!-- مودال عضویت با کد دعوت -->
      <div class="modal-overlay" *ngIf="showJoinModal()" (click)="showJoinModal.set(false)">
        <div class="modal modal-sm" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>عضویت در مکتب</h3>
            <button class="close-btn" (click)="showJoinModal.set(false)">&times;</button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label>کد دعوت را وارد کنید</label>
              <input type="text" [(ngModel)]="joinCode" class="form-control" placeholder="کد دعوت" />
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn" (click)="showJoinModal.set(false)">انصراف</button>
            <button class="btn btn-primary" (click)="joinMaktab()" [disabled]="joining()">
              {{ joining() ? 'در حال عضویت...' : 'عضویت' }}
            </button>
          </div>
        </div>
      </div>

      <!-- نوار پایین -->
      <div class="bottom-bar">
        <button class="btn btn-outline" (click)="showJoinModal.set(true)">عضویت با کد دعوت</button>
      </div>

      <!-- پیام‌ها -->
      <div class="toast" *ngIf="toast()" [class.toast-error]="toastType() === 'error'">
        {{ toast() }}
      </div>
    </div>
  `,
  styles: [`
    .maktab-overview { padding: 20px; max-width: 1200px; margin: 0 auto; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .page-header h2 { margin: 0; color: var(--lp-primary, #1a365d); }
    .search-bar { margin-bottom: 20px; }
    .search-bar input { width: 100%; padding: 10px 16px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 14px; }
    .maktab-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 20px; }
    .maktab-card { border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; background: #fff; transition: box-shadow 0.2s; }
    .maktab-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
    .maktab-owned { border-color: var(--lp-primary, #1a365d); border-width: 2px; }
    .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .maktab-name { margin: 0; font-size: 18px; color: #1a365d; }
    .badge { padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: 500; }
    .badge-active { background: #c6f6d5; color: #22543d; }
    .badge-inactive { background: #fed7d7; color: #822727; }
    .badge-archived { background: #e2e8f0; color: #4a5568; }
    .card-body { margin-bottom: 16px; }
    .maktab-desc { color: #718096; font-size: 14px; margin: 0 0 12px 0; }
    .maktab-meta { display: flex; gap: 16px; font-size: 13px; color: #4a5568; flex-wrap: wrap; }
    .maktab-invite { margin-top: 8px; }
    .maktab-invite code { background: #f7fafc; padding: 2px 8px; border-radius: 4px; font-size: 13px; direction: ltr; }
    .card-actions { display: flex; gap: 8px; }
    .btn { padding: 8px 16px; border: 1px solid #e2e8f0; border-radius: 8px; background: #fff; cursor: pointer; font-size: 14px; }
    .btn-primary { background: var(--lp-primary, #1a365d); color: #fff; border-color: var(--lp-primary, #1a365d); }
    .btn-danger { background: #e53e3e; color: #fff; border-color: #e53e3e; }
    .btn-outline { background: transparent; }
    .btn-sm { padding: 4px 12px; font-size: 13px; }
    .loading { text-align: center; padding: 60px 0; }
    .spinner { width: 40px; height: 40px; border: 3px solid #e2e8f0; border-top-color: var(--lp-primary, #1a365d); border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .empty-state { text-align: center; padding: 60px 0; color: #718096; }
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .modal { background: #fff; border-radius: 12px; width: 100%; max-width: 500px; max-height: 90vh; overflow-y: auto; }
    .modal-sm { max-width: 380px; }
    .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; border-bottom: 1px solid #e2e8f0; }
    .modal-header h3 { margin: 0; }
    .close-btn { background: none; border: none; font-size: 24px; cursor: pointer; color: #718096; }
    .modal-body { padding: 20px; }
    .modal-footer { padding: 16px 20px; border-top: 1px solid #e2e8f0; display: flex; gap: 8px; justify-content: flex-end; }
    .form-group { margin-bottom: 16px; }
    .form-group label { display: block; margin-bottom: 4px; font-size: 14px; font-weight: 500; }
    .form-control { width: 100%; padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 14px; box-sizing: border-box; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .checkbox-label { display: flex; align-items: center; gap: 8px; }
    .bottom-bar { margin-top: 24px; text-align: center; }
    .toast { position: fixed; bottom: 20px; right: 20px; padding: 12px 20px; background: #48bb78; color: #fff; border-radius: 8px; z-index: 1100; animation: fadeIn 0.3s; }
    .toast-error { background: #e53e3e; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class MaktabOverviewComponent implements OnInit {
  private maktabService = inject(MaktabService);

  maktabs = signal<MaktabDto[]>([]);
  loading = signal(true);
  creating = signal(false);
  joining = signal(false);
  showCreateModal = signal(false);
  showJoinModal = signal(false);
  toast = signal('');
  toastType = signal<'success' | 'error'>('success');

  searchQuery = '';
  joinCode = '';
  filteredMaktabs = signal<MaktabDto[]>([]);

  newMaktab = {
    name: '',
    description: '',
    city: '',
    phone: '',
    isPublic: false,
  };

  ngOnInit() {
    this.loadMaktabs();
  }

  loadMaktabs() {
    this.loading.set(true);
    this.maktabService.getAll().subscribe({
      next: (data) => {
        this.maktabs.set(data);
        this.filteredMaktabs.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.showToast('خطا در بارگذاری مکتب‌ها', 'error');
        this.loading.set(false);
      }
    });
  }

  filterMaktabs() {
    const q = this.searchQuery.toLowerCase();
    this.filteredMaktabs.set(
      this.maktabs().filter(m =>
        m.name.toLowerCase().includes(q) ||
        (m.description && m.description.toLowerCase().includes(q)) ||
        (m.city && m.city.toLowerCase().includes(q))
      )
    );
  }

  createMaktab() {
    if (!this.newMaktab.name.trim()) {
      this.showToast('نام مکتب الزامی است', 'error');
      return;
    }
    this.creating.set(true);
    this.maktabService.create(this.newMaktab).subscribe({
      next: () => {
        this.showToast('مکتب با موفقیت ایجاد شد');
        this.showCreateModal.set(false);
        this.resetNewMaktab();
        this.loadMaktabs();
        this.creating.set(false);
      },
      error: () => {
        this.showToast('خطا در ایجاد مکتب', 'error');
        this.creating.set(false);
      }
    });
  }

  joinMaktab() {
    if (!this.joinCode.trim()) {
      this.showToast('کد دعوت را وارد کنید', 'error');
      return;
    }
    this.joining.set(true);
    this.maktabService.joinByInviteCode(this.joinCode).subscribe({
      next: () => {
        this.showToast('با موفقیت عضو شدید');
        this.showJoinModal.set(false);
        this.joinCode = '';
        this.loadMaktabs();
        this.joining.set(false);
      },
      error: () => {
        this.showToast('کد دعوت نامعتبر است', 'error');
        this.joining.set(false);
      }
    });
  }

  confirmDelete(maktab: MaktabDto) {
    if (confirm(`آیا از حذف «${maktab.name}» اطمینان دارید؟`)) {
      this.maktabService.delete(maktab.id).subscribe({
        next: () => {
          this.showToast('مکتب حذف شد');
          this.loadMaktabs();
        },
        error: () => this.showToast('خطا در حذف مکتب', 'error')
      });
    }
  }

  statusLabel(status: string) {
    const labels: Record<string, string> = { active: 'فعال', inactive: 'غیرفعال', archived: 'بایگانی' };
    return labels[status] || status;
  }

  roleLabel(role: string) {
    const labels: Record<string, string> = { owner: 'مالک', manager: 'مدیر', member: 'عضو' };
    return labels[role] || role;
  }

  private resetNewMaktab() {
    this.newMaktab = { name: '', description: '', city: '', phone: '', isPublic: false };
  }

  private showToast(msg: string, type: 'success' | 'error' = 'success') {
    this.toast.set(msg);
    this.toastType.set(type);
    setTimeout(() => this.toast.set(''), 3000);
  }
}
