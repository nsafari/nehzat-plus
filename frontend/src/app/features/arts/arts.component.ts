import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, finalize } from 'rxjs';

import type {
  Artwork,
  ArtworkType,
  CalligraphySample,
  CreateArtworkPayload,
  CreateCalligraphySamplePayload,
  CreateMusicRecordPayload,
  MusicRecord
} from '../../core/models/lesson-planner.models';
import { LESSON_PLANNER_API } from '../../core/services/lesson-planner-api.token';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';

type ArtsView = 'gallery' | 'music' | 'calligraphy';

const TYPE_LABELS: Record<string, string> = {
  painting: 'نقاشی',
  craft: 'صنایع دستی',
  music: 'سرود و تلاوت',
  calligraphy: 'خوشنویسی'
};

const VIEW_ICONS: Record<ArtsView, string> = {
  gallery: '🎨',
  music: '🎵',
  calligraphy: '✒️'
};

@Component({
  selector: 'app-arts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './arts.component.html',
  styleUrls: ['./arts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArtsComponent implements OnInit {
  private readonly api = inject(LESSON_PLANNER_API);
  private readonly authService = inject(AuthService);
  private readonly notify = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  activeView: ArtsView = 'gallery';
  loading = true;
  saving = false;

  artworks: Artwork[] = [];
  musicRecords: MusicRecord[] = [];
  calligraphySamples: CalligraphySample[] = [];

  showUploadModal = false;
  selectedArtwork: Artwork | null = null;
  selectedCalligraphy: CalligraphySample | null = null;
  activeMusicId: number | null = null;

  uploadTitle = '';
  uploadType: ArtworkType = 'painting';
  uploadStyle = '';
  uploadArtistName = '';
  uploadGenre = '';
  uploadDescription = '';
  uploadTags = '';
  uploadIsPublic = true;
  uploadPreviewUrl = '';
  uploadFileName = '';

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (!user) {
      void this.router.navigateByUrl('/auth/login');
      return;
    }
    this.loadAll();
  }

  private loadAll(): void {
    this.loading = true;
    let pending = 3;

    const done = () => {
      pending--;
      if (pending <= 0) {
        this.loading = false;
      }
    };

    this.api.getArtworks().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (items) => {
        this.artworks = items;
        done();
      },
      error: () => done()
    });

    this.api.getMusicRecords().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (items) => {
        this.musicRecords = items;
        done();
      },
      error: () => done()
    });

    this.api.getCalligraphySamples().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (items) => {
        this.calligraphySamples = items;
        done();
      },
      error: () => done()
    });
  }

  switchView(view: ArtsView): void {
    this.activeView = view;
    this.closeModals();
  }

  getViewIcon(): string {
    return VIEW_ICONS[this.activeView];
  }

  typeLabel(type: string | undefined): string {
    return TYPE_LABELS[type ?? ''] ?? type ?? '';
  }

  openLightbox(artwork: Artwork): void {
    this.selectedArtwork = artwork;
  }

  closeLightbox(): void {
    this.selectedArtwork = null;
  }

  openCalligraphyDetail(sample: CalligraphySample): void {
    this.selectedCalligraphy = sample;
  }

  closeCalligraphyDetail(): void {
    this.selectedCalligraphy = null;
  }

  openUploadModal(): void {
    this.resetUploadForm();
    this.showUploadModal = true;
  }

  closeModals(): void {
    this.showUploadModal = false;
    this.selectedArtwork = null;
    this.selectedCalligraphy = null;
    this.uploadPreviewUrl = '';
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.uploadFileName = file.name;
    this.readFileAsDataUrl(file)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((dataUrl) => {
        this.uploadPreviewUrl = dataUrl;
      });
  }

  onToggleMusic(record: MusicRecord): void {
    this.activeMusicId = this.activeMusicId === record.id ? null : record.id;
  }

  onLikeArtwork(artwork: Artwork): void {
    this.api.likeArtwork(artwork.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        artwork.likeCount = res.likeCount;
        this.artworks = [...this.artworks];
      },
      error: () => this.notify.show('خطا در ثبت پسند', 'error')
    });
  }

  onLikeMusic(record: MusicRecord): void {
    this.api.likeMusicRecord(record.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        record.likeCount = res.likeCount;
        this.musicRecords = [...this.musicRecords];
      },
      error: () => this.notify.show('خطا در ثبت پسند', 'error')
    });
  }

  onLikeCalligraphy(sample: CalligraphySample): void {
    this.api.likeCalligraphySample(sample.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        sample.likeCount = res.likeCount;
        this.calligraphySamples = [...this.calligraphySamples];
      },
      error: () => this.notify.show('خطا در ثبت پسند', 'error')
    });
  }

  onSubmit(): void {
    if (this.saving) return;
    if (!this.uploadPreviewUrl) {
      this.notify.show('لطفاً یک فایل انتخاب کنید', 'error');
      return;
    }
    if (!this.uploadTitle.trim()) {
      this.notify.show('عنوان اثر را وارد کنید', 'error');
      return;
    }

    this.saving = true;
    const source$: Observable<unknown> =
      this.activeView === 'gallery'
        ? this.submitArtwork()
        : this.activeView === 'music'
          ? this.submitMusic()
          : this.submitCalligraphy();

    source$
      .pipe(finalize(() => (this.saving = false)))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.notify.show('اثر شما با موفقیت ثبت شد', 'success');
          this.showUploadModal = false;
          this.uploadPreviewUrl = '';
          this.loadAll();
        },
        error: (error) => {
          this.notify.show(error?.error?.message ?? 'خطا در ثبت اثر', 'error');
        }
      });
  }

  private submitArtwork(): Observable<Artwork> {
    const payload: CreateArtworkPayload = {
      title: this.uploadTitle.trim(),
      type: this.uploadType,
      fileUrl: this.uploadPreviewUrl,
      description: this.uploadDescription || null,
      tags: this.uploadTags || null,
      isPublic: this.uploadIsPublic
    };
    return this.api.uploadArtwork(payload);
  }

  private submitMusic(): Observable<MusicRecord> {
    const payload: CreateMusicRecordPayload = {
      title: this.uploadTitle.trim(),
      audioUrl: this.uploadPreviewUrl,
      artistName: this.uploadArtistName || null,
      durationSeconds: null,
      genre: this.uploadGenre || null,
      description: this.uploadDescription || null,
      tags: this.uploadTags || null,
      isPublic: this.uploadIsPublic
    };
    return this.api.uploadMusicRecord(payload);
  }

  private submitCalligraphy(): Observable<CalligraphySample> {
    const payload: CreateCalligraphySamplePayload = {
      title: this.uploadTitle.trim(),
      imageUrl: this.uploadPreviewUrl,
      style: this.uploadStyle || null,
      description: this.uploadDescription || null,
      tags: this.uploadTags || null,
      isPublic: this.uploadIsPublic
    };
    return this.api.uploadCalligraphySample(payload);
  }

  private resetUploadForm(): void {
    this.uploadTitle = '';
    this.uploadType = 'painting';
    this.uploadStyle = '';
    this.uploadArtistName = '';
    this.uploadGenre = '';
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
}