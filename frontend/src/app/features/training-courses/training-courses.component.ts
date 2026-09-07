import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TrainingService } from './training.service';
import { TrainingCourse } from './training.models';

@Component({
  selector: 'app-training-courses',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="training-courses-container" dir="rtl">
      <header class="page-header">
        <h1>دوره‌های تربیت مربی</h1>
        <button class="btn btn-primary" (click)="showCreateForm = !showCreateForm">
          {{ showCreateForm ? 'بستن' : 'دوره جدید' }}
        </button>
      </header>

      @if (showCreateForm) {
        <div class="create-form card">
          <h3>ایجاد دوره جدید</h3>
          <form (ngSubmit)="createCourse()">
            <div class="form-group">
              <label>عنوان دوره</label>
              <input type="text" [(ngModel)]="newCourse.title" name="title" required>
            </div>
            <div class="form-group">
              <label>توضیحات</label>
              <textarea [(ngModel)]="newCourse.description" name="description"></textarea>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>سال تحصیلی</label>
                <input type="text" [(ngModel)]="newCourse.academicYear" name="academicYear" placeholder="1403-1404">
              </div>
              <div class="form-group">
                <label>حداکثر ظرفیت</label>
                <input type="number" [(ngModel)]="newCourse.maxEnrollment" name="maxEnrollment">
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>تاریخ شروع</label>
                <input type="date" [(ngModel)]="newCourse.startDate" name="startDate">
              </div>
              <div class="form-group">
                <label>تاریخ پایان</label>
                <input type="date" [(ngModel)]="newCourse.endDate" name="endDate">
              </div>
            </div>
            <button type="submit" class="btn btn-success" [disabled]="!newCourse.title">ایجاد دوره</button>
          </form>
        </div>
      }

      <div class="filters card">
        <input type="text" [(ngModel)]="searchQuery" placeholder="جستجوی دوره..." (input)="searchCourses()">
        <select [(ngModel)]="filterStatus" (change)="filterCourses()">
          <option value="">همه وضعیت‌ها</option>
          <option value="Draft">پیش‌نویس</option>
          <option value="Active">فعال</option>
          <option value="Completed">تکمیل شده</option>
          <option value="Archived">آرشیو</option>
        </select>
      </div>

      @if (loading) {
        <div class="loading">در حال بارگذاری...</div>
      } @else if (courses.length === 0) {
        <div class="empty-state card">
          <p>هیچ دوره‌ای یافت نشد</p>
        </div>
      } @else {
        <div class="courses-grid">
          @for (course of courses; track course.id) {
            <div class="course-card card" [routerLink]="['/training-courses', course.id]">
              <div class="course-header">
                <span class="status-badge" [class]="course.status.toLowerCase()">{{ getStatusLabel(course.status) }}</span>
                <span class="year">{{ course.academicYear }}</span>
              </div>
              <h3>{{ course.title }}</h3>
              <p class="description">{{ course.description || 'بدون توضیحات' }}</p>
              <div class="course-stats">
                <span><strong>{{ course.stagesCount }}</strong> مرحله</span>
                <span><strong>{{ course.enrollmentsCount }}</strong> ثبت‌نام</span>
              </div>
              <div class="course-dates">
                @if (course.startDate) {
                  <span>شروع: {{ course.startDate | date:'jy/jm/jd' }}</span>
                }
                @if (course.endDate) {
                  <span>پایان: {{ course.endDate | date:'jy/jm/jd' }}</span>
                }
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .training-courses-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .card {
      background: var(--lp-surface, #fff);
      border: 1px solid var(--lp-border, #e0e0e0);
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 16px;
    }

    .create-form .form-group {
      margin-bottom: 16px;
    }

    .create-form label {
      display: block;
      margin-bottom: 4px;
      font-weight: 500;
    }

    .create-form input,
    .create-form textarea {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid var(--lp-border, #ddd);
      border-radius: 4px;
      font-family: inherit;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .btn {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-family: inherit;
    }

    .btn-primary {
      background: var(--lp-primary, #1976d2);
      color: white;
    }

    .btn-success {
      background: var(--lp-success, #4caf50);
      color: white;
    }

    .filters {
      display: flex;
      gap: 16px;
      margin-bottom: 24px;
    }

    .filters input,
    .filters select {
      padding: 8px 12px;
      border: 1px solid var(--lp-border, #ddd);
      border-radius: 4px;
    }

    .filters input {
      flex: 1;
    }

    .courses-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }

    .course-card {
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .course-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .course-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;
    }

    .status-badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
    }

    .status-badge.draft {
      background: #ff9800;
      color: white;
    }

    .status-badge.active {
      background: #4caf50;
      color: white;
    }

    .status-badge.completed {
      background: #2196f3;
      color: white;
    }

    .status-badge.archived {
      background: #9e9e9e;
      color: white;
    }

    .year {
      color: var(--lp-text-secondary, #666);
      font-size: 14px;
    }

    .course-card h3 {
      margin: 0 0 8px 0;
      font-size: 18px;
    }

    .description {
      color: var(--lp-text-secondary, #666);
      font-size: 14px;
      margin-bottom: 12px;
    }

    .course-stats {
      display: flex;
      gap: 16px;
      margin-bottom: 8px;
      font-size: 14px;
    }

    .course-dates {
      display: flex;
      gap: 16px;
      font-size: 12px;
      color: var(--lp-text-secondary, #888);
    }

    .loading,
    .empty-state {
      text-align: center;
      padding: 40px;
      color: var(--lp-text-secondary, #666);
    }
  `]
})
export class TrainingCoursesComponent implements OnInit {
  private trainingService = inject(TrainingService);

  courses: TrainingCourse[] = [];
  loading = true;
  showCreateForm = false;
  searchQuery = '';
  filterStatus = '';

  newCourse: Partial<TrainingCourse> = {
    title: '',
    description: '',
    academicYear: '',
    maxEnrollment: undefined,
    startDate: undefined,
    endDate: undefined
  };

  ngOnInit() {
    this.loadCourses();
  }

  loadCourses() {
    this.loading = true;
    this.trainingService.getCourses().subscribe({
      next: (courses) => {
        this.courses = courses;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  searchCourses() {
    if (!this.searchQuery) {
      this.loadCourses();
      return;
    }
    this.trainingService.searchCourses(this.searchQuery).subscribe({
      next: (result) => {
        this.courses = result.courses;
      }
    });
  }

  filterCourses() {
    if (!this.filterStatus) {
      this.loadCourses();
      return;
    }
    this.trainingService.filterCoursesByStatus(this.filterStatus).subscribe({
      next: (courses) => {
        this.courses = courses;
      }
    });
  }

  createCourse() {
    if (!this.newCourse.title) return;
    this.trainingService.createCourse(this.newCourse).subscribe({
      next: () => {
        this.loadCourses();
        this.showCreateForm = false;
        this.newCourse = {};
      }
    });
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      'Draft': 'پیش‌نویس',
      'Active': 'فعال',
      'Completed': 'تکمیل شده',
      'Archived': 'آرشیو'
    };
    return labels[status] || status;
  }
}
