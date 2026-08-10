import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import type {
  PortfolioItem,
  UploadPortfolioItemPayload
} from '../../core/models/lesson-planner.models';
import { LESSON_PLANNER_API } from '../../core/services/lesson-planner-api.token';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';

type PortfolioView = 'gallery' | 'upload';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PortfolioComponent implements OnInit {
  private readonly api = inject(LESSON_PLANNER_API);
  private readonly authService = inject(AuthService);
  private readonly notify = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  activeView: PortfolioView = 'gallery';
  loading = true;
  saving = false;

  items: PortfolioItem[] = [];

  showUploadModal = false;
  uploadTitle = '';
  uploadType: UploadPortfolioItemPayload['type'] = 'other';
  uploadDescription = '';
  uploadTags = '';
  uploadIsPublic = true;
  uploadPreviewUrl = '';
  uploadFileName = '';

  typeOptions: { value: string; label: string }[] = [
    { value: 'artwork', label: 'هنری' },
    { value: 'music', label: 'موسیقی' },
    { value: 'writing', label: 'نوشتاری' },
    { value: 'project', label: 'پروژه‌ای' },
    { value: 'certificate', label: 'گواهی' },
    { value: 'other', label: 'سایر' }
  ];

  constructor() {
    const user = this.authService.getCurrentUser();
    if (!user) {
      void this.router.navigateByUrl('/auth/login');
    }
  }

  ngOnInit(): void {
    this.loadItems();
  }

  private loadItems(): void {
    this.loading = true;
    this.api.getPortfolioItems().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (items) => {
        this.items = items;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  switchView(view: PortfolioView): void {
    this.activeView = view;
    if (view === 'upload') {
      this.resetUploadForm();
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.uploadFileName = file.name;
    this.readFileAsDataUrl(file).subscribe((dataUrl) => {
      this.uploadPreviewUrl = dataUrl;
    });
  }

  onLike(item: PortfolioItem): void {
    item.likeCount += 1;
    this.items = [...this.items];
  }

  submitUpload(): void {
    if (this.saving || !this.uploadTitle.trim()) {
      this.notify.show('عنوان اثر را وارد کنید', 'error');
      return;
    }
    if (!this.uploadPreviewUrl) {
      this.notify.show('لطفاً یک فایل انتخاب کنید', 'error');
      return;
    }

    this.saving = true;
    const payload: UploadPortfolioItemPayload = {
      title: this.uploadTitle.trim(),
      type: this.uploadType,
      fileUrl: this.uploadPreviewUrl,
      description: this.uploadDescription.trim() || null,
      tags: this.uploadTags.trim() || null,
      isPublic: this.uploadIsPublic
    };

    this.api.uploadPortfolioItem(payload).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (item) => {
        this.items = [item, ...this.items];
        this.showUploadModal = false;
        this.activeView = 'gallery';
        this.uploadPreviewUrl = '';
        this.notify.show('اثر شما با موفقیت اضافه شد', 'success');
      },
      error: () => this.notify.show('خطا در بارگذاری اثر', 'error'),
      complete: () => { this.saving = false; }
    });
  }

  private resetUploadForm(): void {
    this.uploadTitle = '';
    this.uploadType = 'other';
    this.uploadDescription = '';
    this.uploadTags = '';
    this.uploadIsPublic = true;
    this.uploadPreviewUrl = '';
    this.uploadFileName = '';
  }

  private readFileAsDataUrl(file: File): Observable<string> {
    return new Observable((subscriber) => {
      const reader = new FileReader();
      reader.onload = () => subscriber.next(reader.result as string);
      reader.onerror = () => subscriber.error(reader.error ?? new Error('File read failed'));
      reader.readAsDataURL(file);
    });
  }

  getItemTypeIcon(type: string): string {
    const icons: Record<string, string> = {
      artwork: '🎨',
      music: '🎵',
      writing: '✍️',
      project: '📁',
      certificate: '🏆',
      other: '📄'
    };
    return icons[type] ?? '📄';
  }

  getItemTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      artwork: 'هنری',
      music: 'موسیقی',
      writing: 'نوشتاری',
      project: 'پروژه‌ای',
      certificate: 'گواهی',
      other: 'سایر'
    };
    return labels[type] ?? 'سایر';
  }

  backToDashboard(): void {
    void this.router.navigateByUrl('/dashboard');
  }
}
