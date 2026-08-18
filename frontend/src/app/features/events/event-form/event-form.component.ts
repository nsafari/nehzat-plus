import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService, EventDetailDto } from '../../../core/services/event.service';

@Component({
  selector: 'lp-event-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="event-form-container">
      <div class="form-header">
        <button class="btn-back" (click)="goBack()">← بازگشت</button>
        <h2>{{ isEditMode() ? 'ویرایش رویداد' : 'رویداد جدید' }}</h2>
      </div>

      <form (ngSubmit)="onSubmit()" #eventForm="ngForm" class="event-form">
        <!-- عنوان -->
        <div class="form-group">
          <label for="title">عنوان رویداد <span class="required">*</span></label>
          <input
            id="title"
            type="text"
            [(ngModel)]="formData.title"
            name="title"
            required
            minlength="3"
            #titleField="ngModel"
            placeholder="مثلاً: مراسم جشن نیمه شعبان"
            class="form-input"
          />
          <div *ngIf="titleField.invalid && titleField.touched" class="error-text">
            عنوان حداقل ۳ حرف الزامی است.
          </div>
        </div>

        <!-- نوع رویداد -->
        <div class="form-group">
          <label for="eventType">نوع رویداد</label>
          <select id="eventType" [(ngModel)]="formData.eventType" name="eventType" class="form-input">
            <option value="meeting">🤝 جلسه</option>
            <option value="class">📚 کلاس</option>
            <option value="ceremony">🎉 مراسم</option>
            <option value="workshop">🛠️ کارگاه</option>
            <option value="exam">📝 آزمون</option>
          </select>
        </div>

        <!-- توضیحات -->
        <div class="form-group">
          <label for="description">توضیحات</label>
          <textarea
            id="description"
            [(ngModel)]="formData.description"
            name="description"
            rows="4"
            placeholder="جزئیات رویداد..."
            class="form-input"
          ></textarea>
        </div>

        <!-- زمان شروع -->
        <div class="form-row">
          <div class="form-group">
            <label for="startAt">زمان شروع <span class="required">*</span></label>
            <input
              id="startAt"
              type="datetime-local"
              [(ngModel)]="formData.startAt"
              name="startAt"
              required
              #startField="ngModel"
              class="form-input"
            />
            <div *ngIf="startField.invalid && startField.touched" class="error-text">
              زمان شروع الزامی است.
            </div>
          </div>

          <div class="form-group">
            <label for="endAt">زمان پایان (اختیاری)</label>
            <input
              id="endAt"
              type="datetime-local"
              [(ngModel)]="formData.endAt"
              name="endAt"
              class="form-input"
            />
          </div>
        </div>

        <!-- مکان -->
        <div class="form-row">
          <div class="form-group">
            <label for="location">مکان</label>
            <input
              id="location"
              type="text"
              [(ngModel)]="formData.location"
              name="location"
              placeholder="مثلاً: سالن اجتماعات"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="capacity">ظرفیت (اختیاری)</label>
            <input
              id="capacity"
              type="number"
              [(ngModel)]="formData.capacity"
              name="capacity"
              min="1"
              placeholder="مثلاً: ۵۰"
              class="form-input"
            />
          </div>
        </div>

        <!-- آنلاین -->
        <div class="form-group checkbox-group">
          <label class="checkbox-label">
            <input type="checkbox" [(ngModel)]="formData.isOnline" name="isOnline" (ngModelChange)="onOnlineChange()" />
            <span>رویداد آنلاین</span>
          </label>
        </div>

        <div *ngIf="formData.isOnline" class="form-group">
          <label for="onlineLink">لینک آنلاین <span class="required">*</span></label>
          <input
            id="onlineLink"
            type="url"
            [(ngModel)]="formData.onlineLink"
            name="onlineLink"
            required
            #onlineLinkField="ngModel"
            placeholder="https://meet.google.com/..."
            class="form-input"
          />
          <div *ngIf="onlineLinkField.invalid && onlineLinkField.touched" class="error-text">
            لینک معتبر وارد کنید.
          </div>
        </div>

        <!-- نیاز به ثبت‌نام -->
        <div class="form-group checkbox-group">
          <label class="checkbox-label">
            <input type="checkbox" [(ngModel)]="formData.requiresRegistration" name="requiresRegistration" />
            <span>نیاز به ثبت‌نام دارد</span>
          </label>
        </div>

        <!-- ارسال برای تأیید -->
        <div class="form-group checkbox-group">
          <label class="checkbox-label">
            <input type="checkbox" [(ngModel)]="formData.submitForApproval" name="submitForApproval" />
            <span>ارسال برای تأیید مدیر (گردش کار)</span>
          </label>
        </div>

        <!-- خطا -->
        <div *ngIf="errorMessage()" class="error-box">
          {{ errorMessage() }}
        </div>

        <!-- دکمه‌ها -->
        <div class="form-actions">
          <button type="button" class="btn-cancel" (click)="goBack()">انصراف</button>
          <button type="submit" class="btn-submit" [disabled]="isSubmitting() || eventForm.invalid">
            {{ isSubmitting() ? 'در حال ذخیره...' : (isEditMode() ? 'ذخیره تغییرات' : 'ایجاد رویداد') }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .event-form-container { padding: 20px; max-width: 700px; margin: 0 auto; }
    .form-header { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; }
    .form-header h2 { margin: 0; font-size: 22px; }
    .btn-back { padding: 8px 16px; background: var(--lp-color-surface, #fff); border: 1px solid var(--lp-color-border, #e0e0e0); border-radius: 8px; cursor: pointer; font-size: 14px; }
    .btn-back:hover { background: var(--lp-color-bg-hover, #f0f0f0); }

    .event-form { background: var(--lp-color-surface, #fff); padding: 24px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
    .form-group { margin-bottom: 20px; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

    label { display: block; font-size: 14px; font-weight: 500; margin-bottom: 8px; color: var(--lp-color-text, #333); }
    .required { color: #e53935; }

    .form-input {
      width: 100%;
      padding: 10px 14px;
      border: 1px solid var(--lp-color-border, #e0e0e0);
      border-radius: 8px;
      font-family: inherit;
      font-size: 14px;
      box-sizing: border-box;
      background: var(--lp-color-surface, #fff);
    }
    .form-input:focus { outline: none; border-color: var(--lp-color-primary, #1a73e8); box-shadow: 0 0 0 3px rgba(26, 115, 232, 0.1); }
    .form-input.ng-invalid.ng-touched { border-color: #e53935; }
    textarea.form-input { resize: vertical; min-height: 100px; }

    .error-text { color: #e53935; font-size: 12px; margin-top: 6px; }
    .error-box { background: #fdecea; color: #c62828; padding: 12px 16px; border-radius: 8px; border-right: 4px solid #e53935; margin-bottom: 16px; font-size: 14px; }

    .checkbox-group { margin-bottom: 16px; }
    .checkbox-label { display: flex; align-items: center; gap: 10px; font-weight: 400; cursor: pointer; }
    .checkbox-label input[type="checkbox"] { width: 18px; height: 18px; accent-color: var(--lp-color-primary, #1a73e8); cursor: pointer; }

    .form-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px; padding-top: 20px; border-top: 1px solid var(--lp-color-border, #eee); }
    .btn-cancel { padding: 10px 24px; background: var(--lp-color-surface, #fff); border: 1px solid var(--lp-color-border, #e0e0e0); border-radius: 8px; cursor: pointer; font-size: 14px; }
    .btn-cancel:hover { background: var(--lp-color-bg-hover, #f0f0f0); }
    .btn-submit { padding: 10px 24px; background: var(--lp-color-primary, #1a73e8); color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 500; }
    .btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }

    @media (max-width: 600px) {
      .form-row { grid-template-columns: 1fr; }
    }
  `]
})
export class EventFormComponent implements OnInit {
  private eventService = inject(EventService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  isEditMode = signal(false);
  isSubmitting = signal(false);
  errorMessage = signal('');

  private eventId: number | null = null;

  formData = {
    title: '',
    description: '',
    eventType: 'meeting',
    location: '',
    isOnline: false,
    onlineLink: '',
    startAt: '',
    endAt: '',
    capacity: null as number | null,
    requiresRegistration: true,
    submitForApproval: true
  };

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.eventId = Number(idParam);
      this.isEditMode.set(true);
      this.loadEvent(this.eventId);
    }
  }

  loadEvent(id: number): void {
    this.eventService.getEvent(id).subscribe({
      next: (ev) => this.populateForm(ev),
      error: () => this.router.navigate(['/events'])
    });
  }

  populateForm(ev: EventDetailDto): void {
    this.formData.title = ev.title;
    this.formData.description = ev.description || '';
    this.formData.eventType = ev.eventType;
    this.formData.location = ev.location || '';
    this.formData.isOnline = ev.isOnline;
    this.formData.onlineLink = ev.onlineLink || '';
    this.formData.startAt = this.toLocalInputValue(ev.startAt);
    this.formData.endAt = ev.endAt ? this.toLocalInputValue(ev.endAt) : '';
    this.formData.capacity = ev.capacity ?? null;
    this.formData.requiresRegistration = ev.requiresRegistration;
    this.formData.submitForApproval = false;
  }

  onOnlineChange(): void {
    if (!this.formData.isOnline) this.formData.onlineLink = '';
  }

  onSubmit(): void {
    if (this.isSubmitting()) return;
    this.errorMessage.set('');

    if (!this.formData.title.trim()) {
      this.errorMessage.set('عنوان الزامی است.');
      return;
    }

    if (!this.formData.startAt) {
      this.errorMessage.set('زمان شروع الزامی است.');
      return;
    }

    if (this.formData.isOnline && !this.formData.onlineLink) {
      this.errorMessage.set('برای رویداد آنلاین، لینک الزامی است.');
      return;
    }

    if (this.formData.endAt && this.formData.endAt < this.formData.startAt) {
      this.errorMessage.set('زمان پایان نمی‌تواند قبل از شروع باشد.');
      return;
    }

    const request = {
      title: this.formData.title.trim(),
      description: this.formData.description?.trim() || undefined,
      eventType: this.formData.eventType,
      location: this.formData.isOnline ? undefined : this.formData.location?.trim() || undefined,
      isOnline: this.formData.isOnline,
      onlineLink: this.formData.isOnline ? this.formData.onlineLink.trim() : undefined,
      startAt: new Date(this.formData.startAt).toISOString(),
      endAt: this.formData.endAt ? new Date(this.formData.endAt).toISOString() : undefined,
      capacity: this.formData.capacity,
      requiresRegistration: this.formData.requiresRegistration,
      submitForApproval: this.formData.submitForApproval
    };

    this.isSubmitting.set(true);

    const observable = this.isEditMode() && this.eventId
      ? this.eventService.updateEvent(this.eventId, request)
      : this.eventService.createEvent(request);

    observable.subscribe({
      next: (ev) => this.router.navigate(['/events', ev.id]),
      error: (err) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(err.error?.message || 'خطا در ذخیره رویداد. دوباره تلاش کنید.');
      }
    });
  }

  goBack(): void { this.router.navigate(['/events']); }

  private toLocalInputValue(iso: string): string {
    const date = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }
}
