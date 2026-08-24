import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { VocabularyApi } from '@core/services/lesson-planner-api.interface';
import { LessonPlannerApi } from '@core/services/lesson-planner-api.interface';
import { VocabularyTextDto } from '@core/models/lesson-planner.models';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ApiMessageResponse } from '@core/models/lesson-planner.models';

@Component({
  selector: 'app-vocabulary-text-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="vocab-text-list page-container">
      <header class="page-header">
        <h1>متن‌های لغوی</h1>
        <div class="actions">
          <button class="btn btn-primary" (click)="createText()">
            <i class="fas fa-plus"></i> crear متن جدید
          </button>
        </div>
      </header>

      @if (isLoading) {
        <div class="loading-state">
          <span>در حال بارگذاری...</span>
        </div>
      } @else if (texts.length === 0) {
        <div class="empty-state">
          <i class="fas fa-folder-open"></i>
          <p>هنوز متن لغوي وجود ندارد</p>
          <button class="btn btn-secondary" (click)="createText()"> ilk متن را اضافه کنید</button>
        </div>
      } @else {
        <div class="texts-grid">
          @for (text of texts; track text.id) {
          <div class="text-card card" [routerLink]="['/vocabulary/texts', text.id]">
            <div class="text-header">
              <h3>{{ text.title }}</h3>
              <p class="text-meta">{{ text.language || 'فارسی' }}</p>
            </div>
            <div class="text-body">
              <p>{{ text.description || 'توضیحات موجود نیست' }}</p>
            </div>
            <div class="text-footer">
              <span>{{ text.wordCount || 0 }} لغت</span>
              <span>{{ text.isPublished ? 'نشر شده' : 'Draft' }}</span>
            </div>
          </div>
          }
        </div>
      }
    </div>
  `
})
export class VocabularyTextListComponent implements OnInit {
  private api = inject(LessonPlannerApi);
  private destroy$ = new Subject<void>();
  
  texts: VocabularyTextDto[] = [];
  isLoading = true;
  error: string | null = null;

  ngOnInit(): void {
    this.loadTexts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadTexts(): void {
    this.isLoading = true;
    this.api.getVocabularyTexts().pipe(takeUntil(this.destroy$)).subscribe({
      next: (result) => {
        this.texts = result || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading texts:', err);
        this.error = 'خطا در بارگذاری متن‌ها';
        this.isLoading = false;
      }
    });
  }

  createText(): void {
    // Navigate to create text form or show dialog
    console.log('Create text clicked');
  }
}