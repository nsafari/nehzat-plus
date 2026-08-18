import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { ProfileService } from './profile.service';
import { NotificationService } from '../../core/services/notification.service';
import type {
  ProfileDto,
  UpdateProfileRequest,
  NotificationSettingsDto,
} from '../../core/models/lesson-planner.models';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnInit {
  private readonly profileService = inject(ProfileService);
  private readonly notify = inject(NotificationService);
  private readonly destroyRef = inject(DestroyRef);

  activeTab = signal<'info' | 'notifications' | 'account'>('info');
  profile = signal<ProfileDto | null>(null);
  notifications = signal<NotificationSettingsDto | null>(null);
  loading = signal(true);
  saving = signal(false);

  editModel: UpdateProfileRequest = {};

  ngOnInit(): void {
    this.loadProfile();
    this.loadNotifications();
  }

  setTab(tab: 'info' | 'notifications' | 'account'): void {
    this.activeTab.set(tab);
  }

  startEdit(): void {
    const p = this.profile();
    if (p) {
      this.editModel = {
        firstName: p.firstName,
        lastName: p.lastName,
        email: p.email ?? '',
        biography: p.biography ?? '',
        imageUrl: p.imageUrl ?? '',
      };
    }
  }

  saveProfile(): void {
    this.saving.set(true);
    this.profileService.updateProfile(this.editModel)
      .pipe(finalize(() => this.saving.set(false)), takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (dto) => {
          this.profile.set(dto);
          this.notify.show('پروفایل با موفقیت به‌روزرسانی شد', 'success');
        },
        error: () => this.notify.show('خطا در به‌روزرسانی پروفایل', 'error'),
      });
  }

  saveNotifications(): void {
    const n = this.notifications();
    if (!n) return;
    this.saving.set(true);
    this.profileService.updateNotificationSettings({
      newAssignment: n.newAssignment,
      submissionReviewed: n.submissionReviewed,
      newMember: n.newMember,
      sessionReminder: n.sessionReminder,
      systemAnnouncement: n.systemAnnouncement,
    })
      .pipe(finalize(() => this.saving.set(false)), takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (dto) => {
          this.notifications.set(dto);
          this.notify.show('تنظیمات اعلان‌ها ذخیره شد', 'success');
        },
        error: () => this.notify.show('خطا در ذخیره تنظیمات', 'error'),
      });
  }

  toggleNotification(key: keyof NotificationSettingsDto): void {
    const current = this.notifications();
    if (current) {
      this.notifications.set({ ...current, [key]: !current[key] });
    }
  }

  private loadProfile(): void {
    this.profileService.getProfile()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (dto) => { this.profile.set(dto); this.loading.set(false); },
        error: () => { this.notify.show('خطا در بارگذاری پروفایل', 'error'); this.loading.set(false); },
      });
  }

  private loadNotifications(): void {
    this.profileService.getNotificationSettings()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (dto) => this.notifications.set(dto),
      });
  }
}
