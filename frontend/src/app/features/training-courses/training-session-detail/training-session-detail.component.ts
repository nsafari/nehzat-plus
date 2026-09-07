import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TrainingService } from '../training.service';
import {
  TrainingSession,
  TrainingContent,
  TrainingAssignment,
  TrainingProgress
} from '../training.models';

@Component({
  selector: 'app-training-session-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="session-detail-container" dir="rtl">
      <a routerLink=".." class="back-link">← بازگشت</a>

      @if (loading) {
        <div class="loading">در حال بارگذاری...</div>
      } @else if (session) {
        <header class="page-header">
          <div>
            <h1>{{ session.title }}</h1>
            <div class="meta">
              <span class="meta-item">{{ getTypeLabel(session.sessionType) }}</span>
              <span class="meta-item">{{ session.durationMinutes }} دقیقه</span>
              <span class="meta-item">جلسه شماره {{ session.sessionNumber }}</span>
            </div>
          </div>
          <div class="actions">
            <button class="btn btn-secondary" (click)="editMode = !editMode">
              {{ editMode ? 'لغو' : 'ویرایش' }}
            </button>
            <button class="btn btn-danger" (click)="deleteSession()">حذف</button>
          </div>
        </header>

        @if (editMode) {
          <div class="edit-form card">
            <h3>ویرایش جلسه</h3>
            <form (ngSubmit)="updateSession()">
              <div class="form-group">
                <label>عنوان</label>
                <input type="text" [(ngModel)]="editData.title" name="title">
              </div>
              <div class="form-group">
                <label>توضیحات</label>
                <textarea [(ngModel)]="editData.description" name="description" rows="3"></textarea>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>مدت (دقیقه)</label>
                  <input type="number" [(ngModel)]="editData.durationMinutes" name="durationMinutes">
                </div>
                <div class="form-group">
                  <label>نوع جلسه</label>
                  <select [(ngModel)]="editData.sessionType" name="sessionType">
                    <option value="Theoretical">تئوری</option>
                    <option value="Practical">عملی</option>
                    <option value="Workshop">کارگاه</option>
                    <option value="Evaluation">ارزیابی</option>
                  </select>
                </div>
              </div>
              <button type="submit" class="btn btn-success">ذخیره</button>
            </form>
          </div>
        }

        <div class="session-info card">
          <p>{{ session.description || 'بدون توضیحات' }}</p>
        </div>

        <div class="contents-section">
          <div class="section-header">
            <h2>محتواهای آموزشی</h2>
            <button class="btn btn-primary" (click)="showContentForm = !showContentForm">
              {{ showContentForm ? 'بستن' : 'افزودن محتوا' }}
            </button>
          </div>

          @if (showContentForm) {
            <div class="content-form card">
              <form (ngSubmit)="createContent()">
                <div class="form-group">
                  <label>نوع محتوا</label>
                  <select [(ngModel)]="newContent.contentType" name="contentType">
                    <option value="Text">متن ساده</option>
                    <option value="Structured">JSON ساختیافته</option>
                    <option value="Markdown">Markdown</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>متن محتوا</label>
                  <textarea
                    [(ngModel)]="newContent.rawText"
                    name="rawText"
                    rows="8"
                    placeholder="محتوای آموزشی را وارد کنید..."></textarea>
                </div>
                <button type="submit" class="btn btn-success" [disabled]="!newContent.rawText">
                  ذخیره محتوا
                </button>
              </form>
            </div>
          }

          @if (contents.length === 0) {
            <div class="empty-state card">
              <p>هنوز محتوایی اضافه نشده است</p>
            </div>
          } @else {
            <div class="contents-list">
              @for (content of contents; track content.id) {
                <div class="content-card card">
                  <div class="content-header">
                    <span class="content-type">{{ getContentTypeLabel(content.contentType) }}</span>
                    <span class="content-date">{{ content.importedAt | date:'shortDate' }}</span>
                  </div>
                  @if (content.rawText) {
                    <pre class="content-preview">{{ content.rawText | slice:0:300 }}{{ content.rawText.length > 300 ? '...' : '' }}</pre>
                  }
                  @if (content.sourceFile) {
                    <div class="source-file">
                      <span>فایل منبع: {{ content.sourceFile }}</span>
                    </div>
                  }
                </div>
              }
            </div>
          }
        </div>

        <div class="assignments-section">
          <div class="section-header">
            <h2>تکالیف</h2>
            <button class="btn btn-primary" (click)="showAssignmentForm = !showAssignmentForm">
              {{ showAssignmentForm ? 'بستن' : 'تکلیف جدید' }}
            </button>
          </div>

          @if (showAssignmentForm) {
            <div class="assignment-form card">
              <form (ngSubmit)="createAssignment()">
                <div class="form-group">
                  <label>عنوان تکلیف</label>
                  <input type="text" [(ngModel)]="newAssignment.title" name="title" required>
                </div>
                <div class="form-group">
                  <label>توضیحات</label>
                  <textarea [(ngModel)]="newAssignment.description" name="description" rows="3"></textarea>
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label>نوع تحویل</label>
                    <select [(ngModel)]="newAssignment.submissionType" name="submissionType">
                      <option value="Text">متنی</option>
                      <option value="File">فایل</option>
                      <option value="Link">لینک</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label>مهلت تحویل</label>
                    <input type="date" [(ngModel)]="newAssignment.deadline" name="deadline">
                  </div>
                </div>
                <button type="submit" class="btn btn-success">
                  ایجاد تکلیف
                </button>
              </form>
            </div>
          }

          @if (assignments.length === 0) {
            <div class="empty-state card">
              <p>هنوز تکلیفی تعریف نشده است</p>
            </div>
          } @else {
            <div class="assignments-list">
              @for (assignment of assignments; track assignment.id) {
                <div class="assignment-card card">
                  <div class="assignment-header">
                    <h3>{{ assignment.title }}</h3>
                    <span class="submission-count">{{ assignment.submissionsCount }} تحویل</span>
                  </div>
                  <p>{{ assignment.description || 'بدون توضیحات' }}</p>
                  <div class="assignment-meta">
                    <span>نوع: {{ getSubmissionTypeLabel(assignment.submissionType) }}</span>
                    @if (assignment.deadline) {
                      <span>مهلت: {{ assignment.deadline | date:'shortDate' }}</span>
                    }
                  </div>
                </div>
              }
            </div>
          }
        </div>

        <div class="progress-section">
          <div class="section-header">
            <h2>پیشرفت ثبت‌نامی‌ها</h2>
          </div>
          @if (progress.length === 0) {
            <div class="empty-state card">
              <p>هنوز پیشرفتی ثبت نشده است</p>
            </div>
          } @else {
            <div class="progress-list">
              @for (p of progress; track p.id) {
                <div class="progress-card card">
                  <div class="progress-header">
                    <span>{{ p.sessionTitle || '—' }}</span>
                    <span class="progress-status" [class]="p.status.toLowerCase()">
                      {{ getProgressStatusLabel(p.status) }}
                    </span>
                  </div>
                  @if (p.score !== null && p.score !== undefined) {
                    <div class="progress-score">نمره: {{ p.score }}</div>
                  }
                  @if (p.notes) {
                    <p class="progress-notes">{{ p.notes }}</p>
                  }
                  @if (p.completedAt) {
                    <small>تکمیل: {{ p.completedAt | date:'shortDate' }}</small>
                  }
                </div>
              }
            </div>
          }
        </div>
      } @else {
        <div class="not-found card">
          <p>جلسه یافت نشد</p>
          <a routerLink="/training-courses" class="btn btn-primary">بازگشت به لیست</a>
        </div>
      }
    </div>
  `,
  styles: [`
    .session-detail-container {
      padding: 24px;
      max-width: 900px;
      margin: 0 auto;
    }

    .back-link {
      color: var(--lp-primary, #1976d2);
      text-decoration: none;
      margin-bottom: 16px;
      display: inline-block;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 24px;
    }

    .page-header h1 { margin: 0 0 8px 0; }

    .meta { display: flex; gap: 16px; color: var(--lp-text-secondary, #666); font-size: 14px; }

    .card {
      background: var(--lp-surface, #fff);
      border: 1px solid var(--lp-border, #e0e0e0);
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 16px;
    }

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

    .actions { display: flex; gap: 8px; }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 24px 0 16px;
    }

    .section-header h2 { margin: 0; }

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

    .content-card .content-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }

    .content-type {
      background: var(--lp-primary, #1976d2);
      color: white;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 12px;
    }

    .content-date { color: var(--lp-text-secondary, #666); font-size: 13px; }

    .content-preview {
      background: var(--lp-background, #f5f5f5);
      padding: 12px;
      border-radius: 4px;
      white-space: pre-wrap;
      font-family: inherit;
      font-size: 14px;
      margin: 0;
      max-height: 200px;
      overflow-y: auto;
    }

    .source-file { margin-top: 8px; font-size: 13px; color: var(--lp-text-secondary, #666); }

    .assignment-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .assignment-header h3 { margin: 0; }

    .submission-count {
      background: var(--lp-primary, #1976d2);
      color: white;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 12px;
    }

    .assignment-meta {
      display: flex;
      gap: 16px;
      color: var(--lp-text-secondary, #666);
      font-size: 13px;
      margin-top: 8px;
    }

    .progress-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .progress-status {
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
    }

    .progress-status.notstarted { background: #9e9e9e; color: white; }
    .progress-status.inprogress { background: #ff9800; color: white; }
    .progress-status.completed { background: #4caf50; color: white; }
    .progress-status.failed { background: #f44336; color: white; }

    .progress-score {
      font-weight: bold;
      margin-bottom: 4px;
    }

    .progress-notes {
      color: var(--lp-text-secondary, #666);
      margin: 4px 0;
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
export class TrainingSessionDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private trainingService = inject(TrainingService);

  session: TrainingSession | null = null;
  contents: TrainingContent[] = [];
  assignments: TrainingAssignment[] = [];
  progress: TrainingProgress[] = [];
  loading = true;
  editMode = false;
  showContentForm = false;
  showAssignmentForm = false;

  editData: Partial<TrainingSession> = {};
  newContent: Partial<TrainingContent> = { contentType: 'Text', rawText: '' };
  newAssignment: Partial<TrainingAssignment> = {
    title: '',
    description: '',
    submissionType: 'Text',
    deadline: ''
  };

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('sessionId'));
    if (id) {
      this.loadSession(id);
      this.loadContents(id);
      this.loadAssignments(id);
      this.loadProgress(id);
    }
  }

  loadSession(id: number) {
    this.trainingService.getSessionById(id).subscribe({
      next: (session) => {
        this.session = session;
        this.editData = { ...session };
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  loadContents(sessionId: number) {
    this.trainingService.getContentsBySessionId(sessionId).subscribe({
      next: (contents) => { this.contents = contents; }
    });
  }

  loadAssignments(sessionId: number) {
    this.trainingService.getAssignmentsBySessionId(sessionId).subscribe({
      next: (assignments) => { this.assignments = assignments; }
    });
  }

  loadProgress(sessionId: number) {
    this.trainingService.getProgressBySessionId(sessionId).subscribe({
      next: (progress) => { this.progress = progress; }
    });
  }

  updateSession() {
    if (!this.session) return;
    this.trainingService.updateSession(this.session.id, this.editData).subscribe({
      next: (session) => {
        this.session = session;
        this.editMode = false;
      }
    });
  }

  deleteSession() {
    if (!this.session || !confirm('آیا از حذف جلسه اطمینان دارید؟')) return;
    this.trainingService.deleteSession(this.session.id).subscribe({
      next: () => { window.history.back(); }
    });
  }

  createContent() {
    if (!this.session || !this.newContent.rawText) return;
    this.trainingService.createContent(this.session.id, this.newContent).subscribe({
      next: () => {
        this.loadContents(this.session!.id);
        this.showContentForm = false;
        this.newContent = { contentType: 'Text', rawText: '' };
      }
    });
  }

  createAssignment() {
    if (!this.session || !this.newAssignment.title) return;
    this.trainingService.createAssignment(this.session.id, this.newAssignment).subscribe({
      next: () => {
        this.loadAssignments(this.session!.id);
        this.showAssignmentForm = false;
        this.newAssignment = { title: '', description: '', submissionType: 'Text', deadline: '' };
      }
    });
  }

  getTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      'Theoretical': 'تئوری',
      'Practical': 'عملی',
      'Workshop': 'کارگاه',
      'Evaluation': 'ارزیابی'
    };
    return labels[type] || type;
  }

  getContentTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      'Text': 'متن',
      'Structured': 'ساختیافته',
      'Markdown': 'Markdown',
      'File': 'فایل',
      'PDF': 'PDF',
      'Image': 'تصویر'
    };
    return labels[type] || type;
  }

  getSubmissionTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      'Text': 'متنی',
      'File': 'فایل',
      'Link': 'لینک'
    };
    return labels[type] || type;
  }

  getProgressStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      'NotStarted': 'شروع نشده',
      'InProgress': 'در حال انجام',
      'Completed': 'تکمیل شده',
      'Failed': 'عدم قبولی'
    };
    return labels[status] || status;
  }
}
