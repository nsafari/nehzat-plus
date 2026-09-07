import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TrainingService } from '../training.service';
import { TrainingCourse, TrainingStage, TrainingSession } from '../training.models';

@Component({
  selector: 'app-training-course-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="course-detail-container" dir="rtl">
      @if (loading) {
        <div class="loading">در حال بارگذاری...</div>
      } @else if (course) {
        <header class="page-header">
          <div>
            <h1>{{ course.title }}</h1>
            <span class="status-badge" [class]="course.status.toLowerCase()">{{ getStatusLabel(course.status) }}</span>
            <span class="year">{{ course.academicYear }}</span>
          </div>
          <div class="actions">
            <button class="btn btn-secondary" (click)="editMode = !editMode">
              {{ editMode ? 'لغو' : 'ویرایش' }}
            </button>
            <button class="btn btn-danger" (click)="deleteCourse()">حذف</button>
          </div>
        </header>

        @if (editMode) {
          <div class="edit-form card">
            <h3>ویرایش دوره</h3>
            <form (ngSubmit)="updateCourse()">
              <div class="form-group">
                <label>عنوان</label>
                <input type="text" [(ngModel)]="editData.title" name="title">
              </div>
              <div class="form-group">
                <label>توضیحات</label>
                <textarea [(ngModel)]="editData.description" name="description"></textarea>
              </div>
              <div class="form-group">
                <label>وضعیت</label>
                <select [(ngModel)]="editData.status" name="status">
                  <option value="Draft">پیش‌نویس</option>
                  <option value="Active">فعال</option>
                  <option value="Completed">تکمیل شده</option>
                  <option value="Archived">آرشیو</option>
                </select>
              </div>
              <button type="submit" class="btn btn-success">ذخیره</button>
            </form>
          </div>
        }

        <div class="course-info card">
          <p>{{ course.description || 'بدون توضیحات' }}</p>
          <div class="stats">
            <div class="stat">
              <span class="stat-value">{{ stages.length }}</span>
              <span class="stat-label">مرحله</span>
            </div>
            <div class="stat">
              <span class="stat-value">{{ course.enrollmentsCount }}</span>
              <span class="stat-label">ثبت‌نام</span>
            </div>
            @if (course.maxEnrollment) {
              <div class="stat">
                <span class="stat-value">{{ course.maxEnrollment }}</span>
                <span class="stat-label">حداکثر ظرفیت</span>
              </div>
            }
          </div>
        </div>

        <div class="stages-section">
          <div class="section-header">
            <h2>مراحل دوره</h2>
            <button class="btn btn-primary" (click)="showStageForm = !showStageForm">
              {{ showStageForm ? 'بستن' : 'مرحله جدید' }}
            </button>
          </div>

          @if (showStageForm) {
            <div class="stage-form card">
              <form (ngSubmit)="createStage()">
                <div class="form-group">
                  <label>عنوان مرحله</label>
                  <input type="text" [(ngModel)]="newStage.title" name="title" required>
                </div>
                <div class="form-group">
                  <label>توضیحات</label>
                  <textarea [(ngModel)]="newStage.description" name="description"></textarea>
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label>ترتیب</label>
                    <input type="number" [(ngModel)]="newStage.stageOrder" name="stageOrder">
                  </div>
                  <div class="form-group">
                    <label>
                      <input type="checkbox" [(ngModel)]="newStage.required" name="required">
                      اجباری
                    </label>
                  </div>
                </div>
                <button type="submit" class="btn btn-success" [disabled]="!newStage.title">ایجاد مرحله</button>
              </form>
            </div>
          }

          @if (stages.length === 0) {
            <div class="empty-state card">
              <p>هنوز مرحله‌ای تعریف نشده است</p>
            </div>
          } @else {
            <div class="stages-list">
              @for (stage of stages; track stage.id) {
                <div class="stage-card card" (click)="toggleStage(stage.id)" [class.expanded]="expandedStageId === stage.id">
                  <div class="stage-header">
                    <span class="stage-order">{{ stage.stageOrder }}</span>
                    <h3>{{ stage.title }}</h3>
                    @if (stage.required) {
                      <span class="required-badge">اجباری</span>
                    }
                    <span class="expand-icon">{{ expandedStageId === stage.id ? '▼' : '▶' }}</span>
                  </div>
                  <p>{{ stage.description || 'بدون توضیحات' }}</p>
                  <div class="stage-stats">
                    <span>{{ stage.sessionsCount }} جلسه</span>
                  </div>

                  @if (expandedStageId === stage.id) {
                    <div class="sessions-list" (click)="$event.stopPropagation()">
                      @if (stageSessions[stage.id]?.loading) {
                        <div class="loading-small">در حال بارگذاری...</div>
                      } @else if (stageSessions[stage.id]?.sessions?.length === 0) {
                        <div class="empty-small">هنوز جلسه‌ای تعریف نشده</div>
                      } @else {
                        @for (session of stageSessions[stage.id]?.sessions; track session.id) {
                          <div class="session-item" [routerLink]="['/training-courses', course!.id, 'sessions', session.id]">
                            <div class="session-info">
                              <span class="session-number">#{{ session.sessionNumber }}</span>
                              <span class="session-title">{{ session.title }}</span>
                            </div>
                            <div class="session-meta">
                              <span>{{ session.durationMinutes }} دقیقه</span>
                              <span>{{ getSessionTypeLabel(session.sessionType) }}</span>
                            </div>
                          </div>
                        }
                      }
                    </div>
                  }
                </div>
              }
            </div>
          }
        </div>
      } @else {
        <div class="not-found card">
          <p>دوره یافت نشد</p>
          <a routerLink="/training-courses" class="btn btn-primary">بازگشت به لیست</a>
        </div>
      }
    </div>
  `,
  styles: [`
    .course-detail-container {
      padding: 24px;
      max-width: 1000px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 24px;
    }

    .page-header h1 {
      margin: 0 0 8px 0;
    }

    .card {
      background: var(--lp-surface, #fff);
      border: 1px solid var(--lp-border, #e0e0e0);
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 16px;
    }

    .status-badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
      margin-left: 8px;
    }

    .status-badge.draft { background: #ff9800; color: white; }
    .status-badge.active { background: #4caf50; color: white; }
    .status-badge.completed { background: #2196f3; color: white; }
    .status-badge.archived { background: #9e9e9e; color: white; }

    .year { color: var(--lp-text-secondary, #666); }

    .actions { display: flex; gap: 8px; }

    .btn {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-family: inherit;
    }

    .btn-primary { background: var(--lp-primary, #1976d2); color: white; }
    .btn-secondary { background: var(--lp-secondary, #757575); color: white; }
    .btn-success { background: var(--lp-success, #4caf50); color: white; }
    .btn-danger { background: var(--lp-danger, #f44336); color: white; }

    .stats {
      display: flex;
      gap: 32px;
      margin-top: 16px;
    }

    .stat { text-align: center; }
    .stat-value { display: block; font-size: 24px; font-weight: bold; }
    .stat-label { color: var(--lp-text-secondary, #666); font-size: 14px; }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 24px 0 16px;
    }

    .form-group { margin-bottom: 16px; }
    .form-group label { display: block; margin-bottom: 4px; font-weight: 500; }
    .form-group input,
    .form-group textarea,
    .form-group select {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid var(--lp-border, #ddd);
      border-radius: 4px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .stages-list {
      display: grid;
      gap: 12px;
    }

    .stage-card {
      cursor: pointer;
      transition: transform 0.2s;
    }

    .expand-icon {
      margin-right: auto;
      color: var(--lp-text-secondary, #666);
      font-size: 12px;
    }

    .sessions-list {
      margin-top: 16px;
      border-top: 1px solid var(--lp-border, #e0e0e0);
      padding-top: 12px;
    }

    .session-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 12px;
      border-radius: 4px;
      cursor: pointer;
      transition: background 0.15s;
    }

    .session-item:hover {
      background: var(--lp-background, #f5f5f5);
    }

    .session-info {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .session-number {
      color: var(--lp-primary, #1976d2);
      font-weight: 600;
      min-width: 32px;
    }

    .session-meta {
      display: flex;
      gap: 12px;
      color: var(--lp-text-secondary, #666);
      font-size: 13px;
    }

    .loading-small,
    .empty-small {
      padding: 16px;
      text-align: center;
      color: var(--lp-text-secondary, #666);
      font-size: 14px;
    }

    .stage-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 8px;
    }

    .stage-order {
      background: var(--lp-primary, #1976d2);
      color: white;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
    }

    .stage-card h3 { margin: 0; flex: 1; }

    .required-badge {
      background: var(--lp-warning, #ff9800);
      color: white;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 12px;
    }

    .stage-stats {
      color: var(--lp-text-secondary, #666);
      font-size: 14px;
    }

    .loading,
    .empty-state,
    .not-found {
      text-align: center;
      padding: 40px;
      color: var(--lp-text-secondary, #666);
    }
  `]
})
export class TrainingCourseDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private trainingService = inject(TrainingService);

  course: TrainingCourse | null = null;
  stages: TrainingStage[] = [];
  loading = true;
  editMode = false;
  showStageForm = false;
  expandedStageId: number | null = null;

  stageSessions: Record<number, { loading: boolean; sessions: TrainingSession[] }> = {};

  editData: Partial<TrainingCourse> = {};
  newStage: Partial<TrainingStage> = {
    title: '',
    description: '',
    stageOrder: 1,
    required: true
  };

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadCourse(id);
      this.loadStages(id);
    }
  }

  loadCourse(id: number) {
    this.trainingService.getCourseById(id).subscribe({
      next: (course) => {
        this.course = course;
        this.editData = { ...course };
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  loadStages(courseId: number) {
    this.trainingService.getStagesByCourseId(courseId).subscribe({
      next: (stages) => {
        this.stages = stages;
      }
    });
  }

  updateCourse() {
    if (!this.course) return;
    this.trainingService.updateCourse(this.course.id, this.editData).subscribe({
      next: (course) => {
        this.course = course;
        this.editMode = false;
      }
    });
  }

  deleteCourse() {
    if (!this.course || !confirm('آیا از حذف دوره اطمینان دارید؟')) return;
    this.trainingService.deleteCourse(this.course.id).subscribe({
      next: () => {
        window.location.href = '/training-courses';
      }
    });
  }

  createStage() {
    if (!this.course || !this.newStage.title) return;
    this.trainingService.createStage(this.course.id, this.newStage).subscribe({
      next: () => {
        this.loadStages(this.course!.id);
        this.showStageForm = false;
        this.newStage = { title: '', description: '', stageOrder: this.stages.length + 1, required: true };
      }
    });
  }

  toggleStage(stageId: number) {
    if (this.expandedStageId === stageId) {
      this.expandedStageId = null;
      return;
    }
    this.expandedStageId = stageId;
    if (!this.stageSessions[stageId]) {
      this.stageSessions[stageId] = { loading: true, sessions: [] };
      this.trainingService.getSessionsByStageId(stageId).subscribe({
        next: (sessions) => {
          this.stageSessions[stageId] = { loading: false, sessions };
        },
        error: () => {
          this.stageSessions[stageId] = { loading: false, sessions: [] };
        }
      });
    }
  }

  getSessionTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      'Theoretical': 'تئوری',
      'Practical': 'عملی',
      'Workshop': 'کارگاه',
      'Evaluation': 'ارزیابی'
    };
    return labels[type] || type;
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
