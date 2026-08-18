import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AssignmentService } from '../../../core/services/assignment.service';
import { AssignmentDto, CreateAssignmentPayload, UpdateAssignmentPayload } from '../../../core/models/assignment.models';

@Component({
  selector: 'lp-assignment-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="overlay" (click)="close.emit()">
      <div class="modal" (click)="$event.stopPropagation()">
        <h3>{{ assignment ? 'ویرایش تکلیف' : 'تکلیف جدید' }}</h3>

        <label>عنوان *</label>
        <input [(ngModel)]="form.title" placeholder="مثلاً: حل تمرین فصل ۳" />

        <label>توضیحات</label>
        <textarea [(ngModel)]="form.description" rows="4" placeholder="جزئیات تکلیف..."></textarea>

        <label>مهلت ارسال</label>
        <input type="datetime-local" [(ngModel)]="form.dueDate" />

        <div class="actions">
          <button class="btn" (click)="close.emit()">انصراف</button>
          <button class="btn btn-primary" [disabled]="!form.title.trim() || saving()" (click)="save()">
            {{ saving() ? 'در حال ذخیره...' : 'ذخیره' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .overlay { position: fixed; inset: 0; background: rgba(0,0,0,.4); display: flex; align-items: center; justify-content: center; z-index: 50; }
    .modal { background: #fff; border-radius: 12px; padding: 20px; width: 100%; max-width: 460px; }
    label { display: block; font-size: 13px; margin: 12px 0 4px; }
    input, textarea { width: 100%; padding: 8px 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px; font-family: inherit; }
    .actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 18px; }
    .btn { border: 1px solid #ddd; background: #fff; border-radius: 8px; padding: 8px 16px; cursor: pointer; }
    .btn-primary { background: #6c5ce7; color: #fff; border-color: #6c5ce7; }
    .btn-primary:disabled { opacity: .5; cursor: default; }
  `]
})
export class AssignmentFormComponent {
  private service = inject(AssignmentService);

  @Input({ required: true }) halghehId = 0;
  @Input() assignment: AssignmentDto | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  form = { title: '', description: '', dueDate: '' };
  saving = signal(false);

  ngOnInit(): void {
    if (this.assignment) {
      this.form.title = this.assignment.title;
      this.form.description = this.assignment.description ?? '';
      this.form.dueDate = this.toLocalInputValue(this.assignment.dueDate);
    }
  }

  save(): void {
    this.saving.set(true);
    const payload: CreateAssignmentPayload = {
      title: this.form.title.trim(),
      description: this.form.description || undefined,
      dueDate: this.form.dueDate ? new Date(this.form.dueDate).toISOString() : undefined
    };

    const request = this.assignment
      ? this.service.update(this.halghehId, this.assignment.id, { ...payload, status: this.assignment.status })
      : this.service.create(this.halghehId, payload);

    request.subscribe({
      next: () => this.saved.emit(),
      error: () => this.saving.set(false)
    });
  }

  private toLocalInputValue(iso?: string): string {
    if (!iso) return '';
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }
}
