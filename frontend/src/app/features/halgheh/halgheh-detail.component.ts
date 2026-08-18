import { Component, Input, Output, EventEmitter, OnInit, inject, SimpleChanges, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HalghehService } from '../../core/services/halgheh.service';
import { HalghehFullDto, HalghehMemberDto, PaginatedResult } from '../../core/models/halgheh.models';
import { AssignmentListComponent } from './assignment/assignment-list.component';
import { AssignmentDetailComponent } from './assignment/assignment-detail.component';
import { AssignmentFormComponent } from './assignment/assignment-form.component';
import { AssignmentDto } from '../../core/models/assignment.models';

@Component({
  selector: 'lp-halgheh-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, AssignmentListComponent, AssignmentDetailComponent, AssignmentFormComponent],
  template: `
    <div class="page-container" *ngIf="halgheh">
      <div class="page-header">
        <div>
          <button class="btn-back" (click)="goBack()">← بازگشت</button>
          <h1 class="page-title">{{ halgheh.name }}</h1>
          <span class="badge" [class]="'badge-' + halgheh.status">{{ statusLabel(halgheh.status) }}</span>
        </div>
        <div class="header-actions" *ngIf="halgheh.myRole === 'moderator'">
          <button class="btn btn-secondary" (click)="showEdit = !showEdit">
            {{ showEdit ? 'انصراف' : 'ویرایش' }}
          </button>
        </div>
      </div>

      <p *ngIf="halgheh.description" class="description">{{ halgheh.description }}</p>

      <!-- Edit Form -->
      <div *ngIf="showEdit" class="card" style="margin-bottom: 1.5rem;">
        <div class="card-body">
          <h3>ویرایش حلقه</h3>
          <div class="form-group">
            <label>نام</label>
            <input class="form-control" [(ngModel)]="editName">
          </div>
          <div class="form-group">
            <label>توضیحات</label>
            <textarea class="form-control" [(ngModel)]="editDescription" rows="2"></textarea>
          </div>
          <div class="form-group">
            <label>حداکثر اعضا</label>
            <input class="form-control" type="number" [(ngModel)]="editMaxMembers">
          </div>
          <div class="form-group">
            <label>وضعیت</label>
            <select class="form-control" [(ngModel)]="editStatus">
              <option value="active">فعال</option>
              <option value="inactive">غیرفعال</option>
            </select>
          </div>
          <div class="form-actions">
            <button class="btn btn-primary" (click)="saveEdit()" [disabled]="saving">ذخیره</button>
            <button class="btn btn-danger" (click)="deleteHalgheh()" [disabled]="saving">حذف حلقه</button>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="tabs">
        <button [class.active]="tab === 'members'" (click)="tab = 'members'; loadMembers()">اعضا ({{ halgheh.memberCount }})</button>
        <button [class.active]="tab === 'join'" (click)="tab = 'join'" *ngIf="halgheh.myRole === ''">عضویت</button>
        <button [class.active]="tab === 'leave'" (click)="tab = 'leave'" *ngIf="halgheh.myRole === 'member'">ترک حلقه</button>
        <button [class.active]="tab === 'assignments'" (click)="tab = 'assignments'; selectedAssignment.set(null)">تکالیف</button>
      </div>

      <!-- Members Tab -->
      <div *ngIf="tab === 'members'" class="card">
        <div class="card-body">
          <div class="member-list">
            <div *ngFor="let m of members" class="member-item">
              <div class="member-info">
                <strong>{{ m.firstName }} {{ m.lastName }}</strong>
                <span class="badge badge-role">{{ roleLabel(m.role) }}</span>
                <span class="text-muted">{{ m.joinedAt | date:'jY/jM/jD' }}</span>
              </div>
              <div class="member-actions" *ngIf="halgheh.myRole === 'moderator' && m.role !== 'moderator'">
                <button class="btn btn-sm" (click)="changeRole(m, 'moderator')">ناظم کردن</button>
                <button class="btn btn-sm btn-danger" (click)="removeMember(m)">حذف</button>
              </div>
            </div>
            <div *ngIf="members.length === 0" class="text-muted" style="text-align:center; padding:1rem;">عضوی نیست</div>
          </div>
          <!-- Pagination -->
          <div class="pagination" *ngIf="memberPages > 1">
            <button [disabled]="memberPage <= 1" (click)="prevPage()">قبلی</button>
            <span>{{ memberPage }} / {{ memberPages }}</span>
            <button [disabled]="memberPage >= memberPages" (click)="nextPage()">بعدی</button>
          </div>
        </div>
      </div>

      <!-- Join Tab -->
      <div *ngIf="tab === 'join'" class="card">
        <div class="card-body" style="text-align: center;">
          <p>آیا می‌خواهید به این حلقه بپیوندید؟</p>
          <button class="btn btn-primary" (click)="join()" [disabled]="joining">
            {{ joining ? 'در حال عضویت...' : 'عضویت در حلقه' }}
          </button>
          <span *ngIf="joinError" class="text-danger">{{ joinError }}</span>
        </div>
      </div>

      <!-- Leave Tab -->
      <div *ngIf="tab === 'leave'" class="card">
        <div class="card-body" style="text-align: center;">
          <p>آیا مطمئنید که می‌خواهید این حلقه را ترک کنید؟</p>
          <button class="btn btn-danger" (click)="leave()" [disabled]="leaving">
            {{ leaving ? 'در حال ترک...' : 'ترک حلقه' }}
          </button>
        </div>
      </div>

      <!-- Assignments Tab -->
      <div *ngIf="tab === 'assignments'">
        <lp-assignment-list
          *ngIf="!selectedAssignment()"
          [halghehId]="halgheh.id"
          [isModerator]="halgheh.myRole === 'moderator'"
          (open)="openAssignment($event)"
          (create)="showAssignmentForm.set(true)" />

        <lp-assignment-detail
          *ngIf="selectedAssignment()"
          [halghehId]="halgheh.id"
          [assignment]="selectedAssignment()!"
          [isModerator]="halgheh.myRole === 'moderator'"
          (close)="closeAssignment()" />

        <lp-assignment-form
          *ngIf="showAssignmentForm()"
          [halghehId]="halgheh.id"
          (close)="showAssignmentForm.set(false)"
          (saved)="showAssignmentForm.set(false)" />
      </div>
    </div>

    <div *ngIf="loading" class="loading">در حال بارگذاری...</div>
  `,
  styles: [`
    .page-container { padding: 1.5rem; }
    .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; }
    .page-title { font-size: 1.5rem; font-weight: 600; margin: 0.5rem 0; }
    .btn-back { background: none; border: none; color: var(--lp-primary, #2563eb); cursor: pointer; font-size: 0.875rem; }
    .description { color: var(--lp-text-secondary, #64748b); margin-bottom: 1.5rem; }
    .card { background: var(--lp-card-bg, #fff); border: 1px solid var(--lp-border, #e2e8f0); border-radius: 8px; padding: 1rem; margin-bottom: 1rem; }
    .card-body { padding: 0; }
    .form-group { margin-bottom: 1rem; }
    .form-group label { display: block; margin-bottom: 0.25rem; font-weight: 500; }
    .form-control { width: 100%; padding: 0.5rem; border: 1px solid var(--lp-border, #ccc); border-radius: 4px; }
    .form-actions { display: flex; gap: 0.5rem; }
    .btn { padding: 0.5rem 1rem; border: none; border-radius: 4px; cursor: pointer; font-weight: 500; }
    .btn-primary { background: var(--lp-primary, #2563eb); color: white; }
    .btn-secondary { background: var(--lp-secondary, #6b7280); color: white; }
    .btn-danger { background: var(--lp-danger, #dc2626); color: white; }
    .btn-sm { padding: 0.25rem 0.5rem; font-size: 0.75rem; }
    .btn:disabled { opacity: 0.6; cursor: not-allowed; }
    .tabs { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
    .tabs button { padding: 0.5rem 1rem; border: 1px solid var(--lp-border, #ccc); border-radius: 4px; background: white; cursor: pointer; }
    .tabs button.active { background: var(--lp-primary, #2563eb); color: white; border-color: var(--lp-primary, #2563eb); }
    .member-list { display: flex; flex-direction: column; gap: 0.5rem; }
    .member-item { display: flex; justify-content: space-between; align-items: center; padding: 0.5rem; border-bottom: 1px solid var(--lp-border, #f1f5f9); }
    .member-info { display: flex; align-items: center; gap: 0.5rem; }
    .member-actions { display: flex; gap: 0.25rem; }
    .badge { padding: 0.125rem 0.5rem; border-radius: 9999px; font-size: 0.75rem; }
    .badge-active { background: #dcfce7; color: #166534; }
    .badge-inactive { background: #fee2e2; color: #991b1b; }
    .badge-role { background: #dbeafe; color: #1e40af; }
    .text-muted { color: var(--lp-text-secondary, #64748b); }
    .text-danger { color: var(--lp-danger, #dc2626); }
    .loading { text-align: center; padding: 2rem; color: var(--lp-text-secondary, #64748b); }
    .pagination { display: flex; justify-content: center; align-items: center; gap: 1rem; margin-top: 1rem; }
    .pagination button { padding: 0.25rem 0.75rem; }
  `]
})
export class HalghehDetailComponent implements OnInit {
  private halghehService = inject(HalghehService);

  @Input() halgheh: HalghehFullDto | null = null;
  @Output() close = new EventEmitter<void>();

  loading = true;
  tab = 'members';

  // Members
  members: HalghehMemberDto[] = [];
  memberPage = 1;
  memberPages = 1;

  // Edit
  showEdit = false;
  saving = false;
  editName = '';
  editDescription = '';
  editMaxMembers: number | null = null;
  editStatus = '';

  // Join/Leave
  joining = false;
  joinError = '';
  leaving = false;

  // Assignments
  selectedAssignment = signal<AssignmentDto | null>(null);
  showAssignmentForm = signal(false);

  ngOnInit() {
    if (this.halgheh) {
      this.editName = this.halgheh.name;
      this.editDescription = this.halgheh.description || '';
      this.editMaxMembers = this.halgheh.maxMembers || null;
      this.editStatus = this.halgheh.status;
      this.loading = false;
      this.loadMembers();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['halgheh'] && this.halgheh && !changes['halgheh'].firstChange) {
      this.editName = this.halgheh.name;
      this.editDescription = this.halgheh.description || '';
      this.editMaxMembers = this.halgheh.maxMembers || null;
      this.editStatus = this.halgheh.status;
      this.loadMembers();
    }
  }

  loadMembers() {
    if (!this.halgheh) return;
    this.halghehService.getMembers(this.halgheh.id, {
      page: this.memberPage,
      pageSize: 20,
    }).subscribe({
      next: (result) => {
        this.members = result.items;
        this.memberPages = result.totalPages;
      }
    });
  }

  saveEdit() {
    if (!this.halgheh) return;
    this.saving = true;
    this.halghehService.update(this.halgheh.id, {
      name: this.editName,
      description: this.editDescription || undefined,
      maxMembers: this.editMaxMembers || undefined,
      status: this.editStatus,
    }).subscribe({
      next: (h) => {
        this.halgheh = h;
        this.showEdit = false;
        this.saving = false;
      },
      error: () => { this.saving = false; }
    });
  }

  deleteHalgheh() {
    if (!this.halgheh || !confirm('آیا از حذف این حلقه مطمئنید؟')) return;
    this.saving = true;
    this.halghehService.delete(this.halgheh.id).subscribe({
      next: () => this.goBack(),
      error: () => { this.saving = false; }
    });
  }

  join() {
    if (!this.halgheh) return;
    this.joining = true;
    this.joinError = '';
    this.halghehService.join(this.halgheh.id).subscribe({
      next: (h) => {
        this.halgheh = h;
        this.tab = 'members';
        this.loadMembers();
        this.joining = false;
      },
      error: (err) => {
        this.joinError = err.error?.message || 'خطا در عضویت';
        this.joining = false;
      }
    });
  }

  leave() {
    if (!this.halgheh) return;
    this.leaving = true;
    this.halghehService.leave(this.halgheh.id).subscribe({
      next: () => {
        this.halgheh!.myRole = '';
        this.tab = 'join';
        this.loadMembers();
        this.leaving = false;
      },
      error: () => { this.leaving = false; }
    });
  }

  changeRole(member: HalghehMemberDto, newRole: string) {
    if (!this.halgheh) return;
    this.halghehService.changeMemberRole(this.halgheh.id, member.userId, newRole).subscribe({
      next: () => this.loadMembers()
    });
  }

  removeMember(member: HalghehMemberDto) {
    if (!this.halgheh || !confirm(`آیا از حذف ${member.firstName} ${member.lastName} مطمئنید؟`)) return;
    this.halghehService.removeMember(this.halgheh.id, member.userId).subscribe({
      next: () => this.loadMembers()
    });
  }

  prevPage() {
    if (this.memberPage > 1) {
      this.memberPage--;
      this.loadMembers();
    }
  }

  nextPage() {
    if (this.memberPage < this.memberPages) {
      this.memberPage++;
      this.loadMembers();
    }
  }

  goBack() {
    this.close.emit();
  }

  openAssignment(a: AssignmentDto): void {
    this.selectedAssignment.set(a);
  }

  closeAssignment(): void {
    this.selectedAssignment.set(null);
  }

  statusLabel(s: string): string {
    return s === 'active' ? 'فعال' : s === 'inactive' ? 'غیرفعال' : s;
  }

  roleLabel(r: string): string {
    return r === 'moderator' ? 'ناظم' : r === 'member' ? 'عضو' : r;
  }
}
