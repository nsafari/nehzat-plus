import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { LESSON_PLANNER_API } from '../../../../core/services/lesson-planner-api.token';
import { Course } from '../../../../core/models/lesson-planner.models';
import { PhaseConfig } from '../../../../core/tokens/phase.token';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  template: `
    <div class="course-container" dir="rtl">
      <div class="header-card">
        <h1>کتبارها</h1>
        <p class="subtitle">انتخاب کتاب برای مطالعه</p>
      </div>

      <div *ngIf="loading" class="loading-state">
        <div class="spinner"></div>
        <p>در حال بارگذاری کتاب‌ها...</p>
      </div>

      <div *ngIf="!loading && courses.length > 0" class="courses-grid">
        <div class="course-card" *ngFor="let course of courses" [routerLink]="['/courses', course.id]" class="course-card-link">
          <div class="course-card-header">
            <h3>{{ course.title }}</h3>
            <span class="course-status {{ course.status }}">{{ getStatusLabel(course.status) }}</span>
          </div>
          <div class="course-card-body">
            <p class="course-description">{{ course.description }}</p>
            <div class="course-meta">
              <span><mat-icon>schedule</mat-icon> {{ course.startDate | date:'yyyy' }}</span>
              <span><mat-icon>person</mat-icon> {{ course.instructor }}</span>
              <span><mat-icon>thumb_up</mat-icon> {{ course.maxStudents || 0 }} دانشجو</span>
            </div>
          </div>
          <div class="course-card-footer">
            <button mat-raised-button color="primary" class="enroll-btn">
              <mat-icon>auto_awesome</mat-icon>
              تفریح
            </button>
          </div>
        </div>
      </div>

      <div *ngIf="!loading && courses.length === 0" class="empty-state">
        <p>هنوز کتابی تعریف نشده است.</p>
        <button class="retry-btn" (click)="retry()">بارگذاری مجدد</button>
      </div>
    </div>
  `,
  styles: [`
    .course-container { padding: 20px; max-width: 1100px; margin: 0 auto; direction: rtl; }
    .header-card { margin-bottom: 24px; padding: 32px; background: linear-gradient(135deg, var(--lp-primary, #4a148c), var(--lp-accent, #7b1fa2)); color: #fff; border-radius: 12px; text-align: center; }
    .header-card h1 { margin: 0 0 8px; font-size: 28px; }
    .subtitle { margin: 0; opacity: 0.85; font-size: 14px; }
    .loading-state { text-align: center; padding: 60px 0; color: var(--lp-text-muted, #888); }
    .spinner { width: 40px; height: 40px; border: 4px solid var(--lp-border, #e0e0e0); border-top-color: var(--lp-primary, #4a148c); border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .error-state { text-align: center; padding: 40px; color: var(--lp-danger, #c62828); }
    .retry-btn { padding: 8px 20px; background: var(--lp-primary, #4a148c); color: #fff; border: none; border-radius: 6px; cursor: pointer; margin-top: 12px; }
    .courses-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px; }
    .course-card { background: var(--lp-surface, #fff); border: 1px solid var(--lp-border, #e0e0e0); border-radius: 12px; padding: 24px; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; }
    .course-card:hover { transform: translateY(-3px); box-shadow: 0 6px 20px rgba(0,0,0,0.1); }
    .course-card-header { margin-bottom: 16px; }
    .course-card-header h3 { margin: 0 0 4px; font-size: 18px; color: var(--lp-text, #333); }
    .course-status { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; text-transform: uppercase; }
    .course-status.active { background: var(--lp-primary, #4a148c); color: #fff; }
    .course-status.inactive { background: var(--lp-text-muted, #888); color: #fff; }
    .course-card-body { }
    .course-description { margin: 0 0 16px; font-size: 13px; color: var(--lp-text-muted, #666); line-height: 1.5; }
    .course-meta { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; font-size: 12px; color: var(--lp-text-muted, #888); }
    .course-meta span { }
    .course-card-footer { display: flex; justify-content: flex-end; }
    .enroll-btn { padding: 10px 24px; background: var(--lp-primary, #4a148c); color: #fff; border: none; border-radius: 8px; font-size: 14px; cursor: pointer; }
    .empty-state { text-align: center; padding: 60px 0; color: var(--lp-text-muted, #888); }
  `]
})
export class CourseListComponent implements OnInit {
  private api = inject(LESSON_PLANNER_API);
  private router = inject(Router);
  courses: Course[] = [];
  loading = true;

  ngOnInit(): void {
    this.loadCourses();
  }

  private loadCourses(): void {
    this.loading = true;
    this.api.getActiveCourses().subscribe({
      next: (data) => {
        this.courses = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  retry(): void {
    this.loadCourses();
  }

  getStatusLabel(status: string): string {
    if (status === 'active') return 'فعال';
    if (status === 'inactive') return 'غیرفعال';
    return status;
  }
}