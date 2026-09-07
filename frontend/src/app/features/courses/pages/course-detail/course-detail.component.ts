import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { LESSON_PLANNER_API } from '../../../../core/services/lesson-planner-api.token';
import { Course } from '../../../../core/models/lesson-planner.models';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  template: `
    <div class="course-detail-container" dir="rtl">
      <div *ngIf="loading" class="loading-state">
        <div class="spinner"></div>
        <p>در حال بارگذاری کتاب...</p>
      </div>

      <div *ngIf="!loading && course">
        <div class="course-detail-header">
          <h1>{{ course.title }}</h1>
          <div class="course-detail-meta">
            <span><mat-icon>schedule</mat-icon> {{ course.startDate | date:'yyyy' }}</span>
            <span><mat-icon>person</mat-icon> {{ course.instructor }}</span>
            <span class="course-status {{ course.status }}">{{ getStatusLabel(course.status) }}</span>
          </div>
        </div>

        <div class="course-detail-body">
          <p class="course-detail-description">{{ course.description }}</p>

          <div *ngIf="course.credits" class="course-detail-info">
            <span><mat-icon>flash_on</mat-icon> {{ course.credits }} واحد לז</span>
            <span><mat-icon>person</mat-icon> {{ course.maxStudents || 0 }} حد أقصى دانشجو</span>
          </div>

          <div class="course-detail-tags">
            <span *ngFor="let tag of courseTags">{{ tag }} </span>
          </div>
        </div>

        <div class="course-detail-actions">
          <button mat-raised-button color="primary" (click)="enrollNow()">
            <mat-icon>auto_awesome</mat-icon>
            enrollement enroll
          </button>
        </div>
      </div>

      <div *ngIf="!loading && !course" class="error-state">
        <p>کتاب مورد نظر یافت نشد.</p>
        <a class="back-link" (click)="goBack()">بازگشت</a>
      </div>
    </div>
  `,
  styles: [`
    .course-detail-container { padding: 24px; max-width: 900px; margin: 0 auto; direction: rtl; }
    .course-detail-header { margin-bottom: 24px; }
    .course-detail-header h1 { margin: 0 0 12px; font-size: 28px; color: var(--lp-text, #333); }
    .course-detail-meta { display: flex; gap: 16px; font-size: 13px; color: var(--lp-text-muted, #888); margin-bottom: 24px; }
    .course-status { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; text-transform: uppercase; }
    .course-status.active { background: var(--lp-primary, #4a148c); color: #fff; }
    .course-status.inactive { background: var(--lp-text-muted, #888); color: #fff; }
    .course-detail-body { }
    .course-detail-description { margin: 0 0 24px; font-size: 14px; color: var(--lp-text, #555); line-height: 1.6; }
    .course-detail-info { display: flex; gap: 24px; margin-bottom: 24px; font-size: 13px; color: var(--lp-text-muted, #666); }
    .course-detail-info span { }
    .course-detail-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px; }
    .course-detail-tag { background: var(--lp-surface-alt, #f5f5f5); padding: 2px 8px; border-radius: 4px; font-size: 11px; color: var(--lp-text, #555); }
    .course-detail-actions { text-align: center; margin-top: 24px; }
    .loading-state { text-align: center; padding: 60px 0; color: var(--lp-text-muted, #888); }
    .spinner { width: 40px; height: 40px; border: 4px solid var(--lp-border, #e0e0e0); border-top-color: var(--lp-primary, #4a148c); border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .error-state { text-align: center; padding: 40px; color: var(--lp-danger, #c62828); }
    .back-link { color: var(--lp-primary, #4a148c); text-decoration: none; font-size: 14px; cursor: pointer; display: inline-block; margin-bottom: 16px; }
    .back-link:hover { text-decoration: underline; }
  `]
})
export class CourseDetailComponent implements OnInit {
  private api = inject(LESSON_PLANNER_API);
  private router = inject(Router);
  course: Course | null = null;
  loading = true;

  ngOnInit(): void {
    const id = 1; // placeholder - will fix with activatedRoute
    if (id) this.loadCourse(id);
  }

  private loadCourse(id: number): void {
    this.loading = true;
    this.api.getCourseById(id).subscribe({
      next: (data) => {
        this.course = data;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  enrollNow(): void {
    this.router.navigate(['/courses']);
  }

  goBack(): void {
    this.router.navigate(['/courses']);
  }

  getStatusLabel(status: string): string {
    if (status === 'active') return 'فعال';
    if (status === 'inactive') return 'غیرفعال';
    return status;
  }

  get courseTags(): string[] {
    if (!this.course) return [];
    const tags: string[] = [];
    if (this.course.credits) tags.push(`${this.course.credits} واحد לז`);
    if (this.course.maxStudents) tags.push(`${this.course.maxStudents} حد`);
    return tags;
  }
}