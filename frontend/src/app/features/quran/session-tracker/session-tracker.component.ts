import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuranRingService } from '../../../core/services/quran-ring.service';
import {
  QuranRingSessionDto,
  QuranSessionStepDto,
  StudentQuranSessionProgressDto,
  StudentStepProgressDto,
  StepType,
  SessionStatus,
  StepStatus,
  StartSessionRequest,
  UpdateSessionProgressRequest,
  UpdateStepProgressRequest,
} from '../../../core/models/quran-ring.models';

@Component({
  selector: 'lp-session-tracker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h2 class="page-title">پیگیری جلسات</h2>
        <div class="header-actions">
          <label class="student-label">
            شناسه متربی:
            <input class="form-control student-input" type="number" [(ngModel)]="studentId" (change)="load()">
          </label>
        </div>
      </div>

      <div *ngIf="loading" class="loading">در حال بارگذاری...</div>
      <div *ngIf="!loading && sessions.length === 0" class="empty-state">جلسه‌ای برای این حلقه یافت نشد.</div>

      <div *ngFor="let session of sessions" class="card session-card" [class.assessment]="session.isAssessment">
        <div class="card-body">
          <div class="session-header">
            <div class="session-title">
              <span class="session-number">جلسه {{ session.sessionNumber }}</span>
              <h3>{{ session.title }}</h3>
              <span *ngIf="session.isAssessment" class="badge badge-assessment">ارزیابی</span>
              <span *ngIf="session.half === 'FIRST'" class="badge badge-half">نیمه اول</span>
              <span *ngIf="session.half === 'SECOND'" class="badge badge-half">نیمه دوم</span>
            </div>
            <div class="session-meta">
              <span>{{ session.surfaces }} سطح</span>
              <span>{{ session.estimatedMinutes }} دقیقه</span>
            </div>
          </div>

          <!-- Progress for this session -->
          <div *ngIf="getProgress(session) as progress" class="progress-section">
            <div class="progress-bar-wrap">
              <div class="progress-bar" [style.width.%]="progress.progressPercent"></div>
            </div>
            <div class="progress-stats">
              <span>پیشرفت: {{ progress.progressPercent }}%</span>
              <span>خط حفظ شده: {{ progress.linesMemorized }}</span>
              <span>سطح تکمیل: {{ progress.surfacesCompleted }}/{{ session.surfaces }}</span>
              <span *ngIf="progress.assessmentScore !== undefined" class="assessment-score">نمره: {{ progress.assessmentScore }}</span>
              <span class="status-badge" [class]="'status-' + progress.status">{{ statusLabel(progress.status) }}</span>
            </div>

            <!-- 7 Steps -->
            <div class="steps-grid">
              <div *ngFor="let step of session.steps; let i = index" class="step-item"
                   [class.completed]="getStepProgress(progress, step.id)?.status === 'COMPLETED'"
                   [class.in-progress]="getStepProgress(progress, step.id)?.status === 'IN_PROGRESS'">
                <div class="step-info">
                  <span class="step-order">{{ i + 1 }}</span>
                  <span class="step-title">{{ step.title }}</span>
                  <span class="step-time">{{ step.estimatedMinutes }}د</span>
                </div>
                <div class="step-actions">
                  <button class="btn btn-sm" [class.btn-primary]="getStepProgress(progress, step.id)?.status !== 'COMPLETED'"
                          (click)="toggleStep(progress, step)">
                    {{ getStepProgress(progress, step.id)?.status === 'COMPLETED' ? 'تکمیل ✓' : 'تکمیل' }}
                  </button>
                  <input class="score-input" type="number" min="0" max="10" placeholder="نمره"
                         [ngModel]="getStepProgress(progress, step.id)?.score"
                         (ngModelChange)="updateStepScore(progress, step, $event)">
                </div>
              </div>
            </div>

            <!-- Session controls -->
            <div class="session-controls">
              <div class="control-row">
                <label>خط حفظ شده:</label>
                <input class="form-control sm" type="number" min="0" [(ngModel)]="progress.linesMemorized" (change)="saveProgress(progress)">
              </div>
              <div class="control-row">
                <label>سطح تکمیل:</label>
                <input class="form-control sm" type="number" min="0" [max]="session.surfaces" [(ngModel)]="progress.surfacesCompleted" (change)="saveProgress(progress)">
              </div>
              <div class="control-row">
                <label>درصد:</label>
                <input class="form-control sm" type="number" min="0" max="100" [(ngModel)]="progress.progressPercent" (change)="saveProgress(progress)">
              </div>
              <button class="btn btn-success" (click)="completeSession(progress)" [disabled]="progress.status === 'COMPLETED'">
                {{ progress.status === 'COMPLETED' ? 'تکمیل شده' : 'تکمیل جلسه' }}
              </button>
            </div>
          </div>

          <!-- No progress yet - show start button -->
          <div *ngIf="!getProgress(session)" class="no-progress">
            <button class="btn btn-primary" (click)="startSession(session)" [disabled]="!studentId">شروع جلسه</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding: 1.5rem; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem; }
    .page-title { font-size: 1.375rem; font-weight: 600; color: var(--lp-text-primary); margin: 0; }
    .student-label { font-size: 0.875rem; color: var(--lp-text-secondary); display: flex; align-items: center; gap: 0.5rem; }
    .student-input { width: 100px; padding: 0.375rem 0.5rem; border: 1px solid var(--lp-border, #ccc); border-radius: 6px; }
    .loading, .empty-state { text-align: center; padding: 3rem; color: var(--lp-text-secondary); }

    .session-card { margin-bottom: 1rem; border-left: 4px solid var(--lp-primary, #2563eb); }
    .session-card.assessment { border-left-color: var(--lp-warning, #f59e0b); background: var(--lp-warning-light, #fffbeb); }
    .session-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem; }
    .session-title { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; }
    .session-number { font-size: 0.75rem; font-weight: 600; color: var(--lp-primary, #2563eb); background: var(--lp-primary-light, #dbeafe); padding: 0.125rem 0.5rem; border-radius: 4px; }
    .session-title h3 { margin: 0; font-size: 1.0625rem; color: var(--lp-text-primary); }
    .session-meta { display: flex; gap: 1rem; font-size: 0.8125rem; color: var(--lp-text-secondary); }

    .badge { padding: 0.125rem 0.5rem; border-radius: 9999px; font-size: 0.7rem; font-weight: 500; }
    .badge-assessment { background: var(--lp-warning, #f59e0b); color: white; }
    .badge-half { background: var(--lp-muted-bg, #f1f5f9); color: var(--lp-text-secondary); }

    .progress-section { margin-top: 0.75rem; }
    .progress-bar-wrap { background: var(--lp-muted-bg, #f1f5f9); border-radius: 9999px; height: 8px; overflow: hidden; margin-bottom: 0.5rem; }
    .progress-bar { background: var(--lp-primary, #2563eb); height: 100%; transition: width 0.3s; }
    .progress-stats { display: flex; flex-wrap: wrap; gap: 1rem; font-size: 0.8125rem; color: var(--lp-text-secondary); margin-bottom: 1rem; }
    .assessment-score { font-weight: 600; color: var(--lp-warning, #f59e0b); }
    .status-badge { padding: 0.125rem 0.5rem; border-radius: 4px; font-size: 0.7rem; font-weight: 500; }
    .status-NOT_STARTED { background: var(--lp-muted-bg, #f1f5f9); color: var(--lp-text-secondary); }
    .status-IN_PROGRESS { background: var(--lp-info-light, #dbeafe); color: var(--lp-info, #1e40af); }
    .status-COMPLETED { background: var(--lp-success-light, #dcfce7); color: var(--lp-success, #166534); }
    .status-ASSESSMENT_PENDING { background: var(--lp-warning-light, #fef3c7); color: var(--lp-warning, #92400e); }
    .status-FAILED { background: var(--lp-danger-light, #fee2e2); color: var(--lp-danger, #991b1b); }

    .steps-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 0.5rem; margin-bottom: 1rem; }
    .step-item { background: var(--lp-card-bg, #fff); border: 1px solid var(--lp-border, #e2e8f0); border-radius: 6px; padding: 0.625rem; }
    .step-item.completed { border-color: var(--lp-success, #22c55e); background: var(--lp-success-light, #f0fdf4); }
    .step-item.in-progress { border-color: var(--lp-info, #3b82f6); }
    .step-info { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; }
    .step-order { width: 20px; height: 20px; border-radius: 50%; background: var(--lp-primary, #2563eb); color: white; font-size: 0.7rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .step-title { font-size: 0.875rem; font-weight: 500; color: var(--lp-text-primary); }
    .step-time { font-size: 0.7rem; color: var(--lp-text-secondary); margin-right: auto; }
    .step-actions { display: flex; align-items: center; gap: 0.5rem; }
    .score-input { width: 60px; padding: 0.25rem; border: 1px solid var(--lp-border, #ccc); border-radius: 4px; font-size: 0.75rem; }

    .session-controls { display: flex; flex-wrap: wrap; gap: 1rem; align-items: flex-end; padding-top: 0.75rem; border-top: 1px solid var(--lp-border, #e2e8f0); }
    .control-row { display: flex; flex-direction: column; gap: 0.25rem; }
    .control-row label { font-size: 0.75rem; color: var(--lp-text-secondary); }
    .form-control.sm { width: 80px; padding: 0.375rem; border: 1px solid var(--lp-border, #ccc); border-radius: 4px; font-size: 0.8125rem; }

    .btn { padding: 0.5rem 1rem; border: none; border-radius: 6px; cursor: pointer; font-weight: 500; font-size: 0.875rem; transition: all 0.15s; }
    .btn-sm { padding: 0.25rem 0.625rem; font-size: 0.75rem; }
    .btn-primary { background: var(--lp-primary, #2563eb); color: white; }
    .btn-primary:hover:not(:disabled) { background: var(--lp-primary-dark, #1d4ed8); }
    .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
    .btn-success { background: var(--lp-success, #22c55e); color: white; }
    .btn-success:hover:not(:disabled) { background: var(--lp-success-dark, #16a34a); }
    .btn-success:disabled { opacity: 0.6; cursor: not-allowed; }
    .no-progress { margin-top: 0.75rem; }
  `]
})
export class SessionTrackerComponent implements OnInit {
  private quranRingService = inject(QuranRingService);

  @Input() ringId!: number;
  @Input() studentId: number | null = null;

  sessions: QuranRingSessionDto[] = [];
  loading = false;

  private progressMap = new Map<number, StudentQuranSessionProgressDto>();

  ngOnInit() {
    this.load();
  }

  load() {
    if (!this.ringId) return;
    this.loading = true;
    this.quranRingService.getSessionsByRing(this.ringId).subscribe({
      next: (sessions) => {
        this.sessions = sessions.sort((a, b) => a.sessionNumber - b.sessionNumber);
        this.loadProgress();
      },
      error: () => { this.loading = false; }
    });
  }

  private loadProgress() {
    if (!this.studentId) {
      this.loading = false;
      return;
    }
    const filter = { studentId: this.studentId, ringId: this.ringId };
    this.quranRingService.getStudentProgress(filter).subscribe({
      next: (progressList) => {
        this.progressMap.clear();
        progressList.forEach((p) => this.progressMap.set(p.sessionId, p));
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  getProgress(session: QuranRingSessionDto): StudentQuranSessionProgressDto | undefined {
    return this.progressMap.get(session.id);
  }

  getStepProgress(progress: StudentQuranSessionProgressDto, stepId: number): StudentStepProgressDto | undefined {
    return progress.stepProgress?.find((sp) => sp.stepId === stepId);
  }

  startSession(session: QuranRingSessionDto) {
    if (!this.studentId) return;
    const req: StartSessionRequest = { studentId: this.studentId, sessionId: session.id };
    this.quranRingService.startSession(req).subscribe({
      next: (progress) => {
        this.progressMap.set(session.id, progress);
      },
      error: (err) => console.error('Failed to start session', err)
    });
  }

  toggleStep(progress: StudentQuranSessionProgressDto, step: QuranSessionStepDto) {
    const existing = this.getStepProgress(progress, step.id);
    const newStatus: StepStatus = existing?.status === 'COMPLETED' ? 'NOT_STARTED' : 'COMPLETED';
    const req: UpdateStepProgressRequest = { status: newStatus };
    this.quranRingService.updateStepProgress(existing?.id ?? 0, req).subscribe({
      next: (updated) => {
        if (progress.stepProgress) {
          const idx = progress.stepProgress.findIndex((sp) => sp.stepId === step.id);
          if (idx >= 0) progress.stepProgress[idx] = updated;
          else progress.stepProgress.push(updated);
        }
      },
      error: (err) => console.error('Failed to update step', err)
    });
  }

  updateStepScore(progress: StudentQuranSessionProgressDto, step: QuranSessionStepDto, score: number) {
    const existing = this.getStepProgress(progress, step.id);
    if (!existing) return;
    const req: UpdateStepProgressRequest = { score };
    this.quranRingService.updateStepProgress(existing.id, req).subscribe({
      next: (updated) => {
        const idx = progress.stepProgress?.findIndex((sp) => sp.stepId === step.id);
        if (idx !== undefined && idx >= 0 && progress.stepProgress) {
          progress.stepProgress[idx] = updated;
        }
      },
      error: (err) => console.error('Failed to update step score', err)
    });
  }

  saveProgress(progress: StudentQuranSessionProgressDto) {
    const req: UpdateSessionProgressRequest = {
      status: progress.status,
      progressPercent: progress.progressPercent,
      linesMemorized: progress.linesMemorized,
      surfacesCompleted: progress.surfacesCompleted,
    };
    this.quranRingService.updateSessionProgress(progress.id, req).subscribe({
      error: (err) => console.error('Failed to save progress', err)
    });
  }

  completeSession(progress: StudentQuranSessionProgressDto) {
    this.quranRingService.completeSession(progress.id).subscribe({
      next: (updated) => {
        this.progressMap.set(updated.sessionId, updated);
      },
      error: (err) => console.error('Failed to complete session', err)
    });
  }

  statusLabel(status: string): string {
    const labels: Record<string, string> = {
      'NOT_STARTED': 'شروع نشده',
      'IN_PROGRESS': 'در جریان',
      'COMPLETED': 'تکمیل شده',
      'ASSESSMENT_PENDING': 'در انتظار ارزیابی',
      'FAILED': 'ناموفق'
    };
    return labels[status] || status;
  }
}
