import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

import type {
  Assignment,
  AssignmentAttachment,
  AssignmentSubmission,
  Course,
  StudentAssignmentGateState
} from '../../core/models/lesson-planner.models';
import { LESSON_PLANNER_API } from '../../core/services/lesson-planner-api.token';
import { resolveMediaUrl } from '../../core/services/api-url.util';
import { AuthService } from '../../core/services/auth.service';

type TimelinePosition = 'past' | 'today' | 'future';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <main class="lp-shell lp-page">
      <header class="lp-topbar">
        <div>
          <h1>داشبورد دانش‌آموز</h1>
          <p class="muted">خوش آمدید {{ username }}</p>
        </div>
        <button type="button" class="lp-link-btn" (click)="logout()">
          خروج
        </button>
      </header>

      @if (errorMessage) {
        <p class="lp-error">{{ errorMessage }}</p>
      }
      @if (successMessage) {
        <p class="lp-success">{{ successMessage }}</p>
      }

      <section class="dashboard-grid">
        <aside class="lp-card">
          <h2>دروس فعال</h2>
          @if (loadingCourses) {
            <p class="muted">در حال دریافت دروس...</p>
          } @else if (activeCourses.length === 0) {
            <p class="muted">درسی برای شما فعال نشده است.</p>
          } @else {
            <div class="course-list">
              @for (course of activeCourses; track course.id) {
                <button
                  type="button"
                  class="course-btn"
                  [class.is-active]="course.id === selectedCourse?.id"
                  (click)="selectCourse(course)"
                >
                  <span>{{ course.title }}</span>
                  <small class="muted">{{ course.courseCode }}</small>
                </button>
              }
            </div>
          }
        </aside>

        <section class="lp-card">
          @if (selectedCourse) {
            <h2>{{ selectedCourse.title }}</h2>
            <p class="muted">
              مدرس: {{ selectedCourse.instructor }} |
              از {{ selectedCourse.startDate }} تا {{ selectedCourse.endDate }}
            </p>
            <p>{{ selectedCourse.description }}</p>
          } @else {
            <h2>یک درس را انتخاب کنید</h2>
            <p class="muted">برای مشاهده تایم‌لاین تکالیف، یکی از دروس فعال را انتخاب نمایید.</p>
          }

          <h3 class="section-title">تایم‌لاین تکالیف</h3>
          @if (loadingAssignments) {
            <p class="muted">در حال دریافت تکالیف...</p>
          } @else if (assignments.length === 0) {
            <p class="muted">تکلیفی برای این درس ثبت نشده است.</p>
          } @else {
            <div class="timeline">
              @for (assignment of assignments; track assignment.id) {
                <button
                  type="button"
                  class="timeline-item"
                  [class.is-past]="timelinePosition(assignment) === 'past'"
                  [class.is-today]="timelinePosition(assignment) === 'today'"
                  [class.is-future]="timelinePosition(assignment) === 'future'"
                  (click)="openAssignment(assignment)"
                >
                  <span class="timeline-date">{{ assignment.assignmentDate }}</span>
                  <strong>{{ assignment.title }}</strong>
                  <small class="muted">{{ assignment.type || 'daily' }}</small>
                </button>
              }
            </div>
          }
        </section>
      </section>

      <section class="lp-card">
        <h2>تحویل‌های من</h2>
        @if (loadingSubmissions) {
          <p class="muted">در حال دریافت تحویل‌ها...</p>
        } @else if (courseSubmissions.length === 0) {
          <p class="muted">هنوز تحویلی برای این درس ثبت نشده است.</p>
        } @else {
          <div class="submission-grid">
            @for (submission of courseSubmissions; track submission.id) {
              <article class="submission-card">
                <h4>{{ assignmentTitleById(submission.assignmentId) }}</h4>
                <p class="muted">تاریخ: {{ submission.submissionDate }}</p>
                <p class="muted">وضعیت: {{ submission.status }}</p>
                @if (submission.dailyScore !== undefined) {
                  <p class="muted">نمره روزانه: {{ submission.dailyScore }}</p>
                }
                @if (submission.notes) {
                  <p>{{ submission.notes }}</p>
                }
                @if (resolveAudioUrl(submission.audioFileUrl); as audioUrl) {
                  <audio controls [src]="audioUrl"></audio>
                }
              </article>
            }
          </div>
        }
      </section>

      @if (selectedAssignment) {
        <div class="modal-backdrop" (click)="closeAssignment()">
          <section class="modal-panel" (click)="$event.stopPropagation()">
            <header class="modal-header">
              <div>
                <h3>{{ selectedAssignment.title }}</h3>
                <p class="muted">{{ selectedAssignment.description }}</p>
              </div>
              <button type="button" class="lp-link-btn" (click)="closeAssignment()">بستن</button>
            </header>

            <div class="modal-body">
              <section>
                <h4>پیوست‌ها</h4>
                @if (selectedAssignment.attachments?.length) {
                  <ul class="attachment-list">
                    @for (attachment of selectedAssignment.attachments; track attachment.id) {
                      <li>
                        <strong>{{ attachment.title }}</strong>
                        <span class="muted">({{ attachment.kind }})</span>
                      </li>
                    }
                  </ul>
                } @else {
                  <p class="muted">پیوستی برای این تکلیف ثبت نشده است.</p>
                }
              </section>

              <section class="gate-box">
                <h4>پیش‌نیاز ضبط صدا</h4>
                @if (primaryInstructionAudioUrl) {
                  <audio
                    #instructionAudio
                    controls
                    [src]="primaryInstructionAudioUrl"
                    (play)="onInstructionAudioPlay(instructionAudio)"
                    (timeupdate)="onInstructionAudioTimeUpdate(instructionAudio)"
                    (ended)="onInstructionAudioEnded(instructionAudio)"
                    (error)="onInstructionAudioError()"
                  ></audio>
                  <p class="muted">
                    دفعات گوش‌دادن:
                    {{ assignmentProgress?.currentListenCount ?? 0 }}
                    /
                    {{ assignmentProgress?.requiredListenCount ?? 3 }}
                  </p>
                } @else {
                  <p class="muted">
                    فایل صوتی آموزشی موجود نیست؛ ضبط برای این تکلیف بدون پیش‌نیاز گوش‌دادن فعال است.
                  </p>
                }
              </section>

              <section>
                <h4>ضبط و ارسال پاسخ</h4>
                <div class="recording-actions">
                  <button
                    type="button"
                    class="lp-btn lp-btn-secondary"
                    [disabled]="isRecording || !isRecordingUnlocked"
                    (click)="startRecording()"
                  >
                    شروع ضبط
                  </button>
                  <button
                    type="button"
                    class="lp-btn lp-btn-secondary"
                    [disabled]="!isRecording"
                    (click)="stopRecording()"
                  >
                    توقف ضبط
                  </button>
                  <button
                    type="button"
                    class="lp-btn lp-btn-secondary"
                    [disabled]="!recordedAudioBlob || isSubmittingSubmission"
                    (click)="clearRecording()"
                  >
                    پاک کردن
                  </button>
                </div>

                @if (!isRecordingUnlocked) {
                  <p class="lp-error">برای فعال شدن ضبط باید فایل آموزشی را 3 بار کامل گوش دهید.</p>
                }

                @if (recordedAudioUrl) {
                  <audio controls [src]="recordedAudioUrl"></audio>
                  <label class="notes-field">
                    توضیحات
                    <textarea
                      rows="3"
                      [value]="submissionNotes"
                      (input)="submissionNotes = readTextInput($event)"
                      placeholder="توضیحات اختیاری برای تحویل"
                    ></textarea>
                  </label>
                  <button
                    type="button"
                    class="lp-btn"
                    [disabled]="isSubmittingSubmission || !isRecordingUnlocked"
                    (click)="submitRecording()"
                  >
                    {{ isSubmittingSubmission ? 'در حال ارسال...' : 'ارسال پاسخ' }}
                  </button>
                }
              </section>
            </div>
          </section>
        </div>
      }
    </main>
  `,
  styles: [
    `
      .lp-page {
        display: grid;
        gap: 1rem;
      }
      .lp-topbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .dashboard-grid {
        display: grid;
        grid-template-columns: 260px 1fr;
        gap: 1rem;
      }
      .course-list {
        display: grid;
        gap: 0.5rem;
      }
      .course-btn {
        border: 1px solid var(--lp-border);
        border-radius: 10px;
        background: #fff;
        padding: 0.6rem 0.75rem;
        text-align: right;
        cursor: pointer;
        display: grid;
        gap: 0.25rem;
      }
      .course-btn.is-active {
        border-color: var(--lp-primary);
        background: #eef2ff;
      }
      .timeline {
        display: flex;
        gap: 0.75rem;
        overflow-x: auto;
        padding-bottom: 0.25rem;
      }
      .timeline-item {
        min-width: 180px;
        border: 1px solid var(--lp-border);
        border-radius: 12px;
        background: #fff;
        padding: 0.6rem;
        text-align: right;
        display: grid;
        gap: 0.25rem;
        cursor: pointer;
      }
      .timeline-item.is-past {
        background: #f8fafc;
      }
      .timeline-item.is-today {
        border-color: #f59e0b;
        background: #fffbeb;
      }
      .timeline-item.is-future {
        border-color: #6366f1;
      }
      .timeline-date {
        font-size: 0.8rem;
        color: var(--lp-muted);
      }
      .section-title {
        margin-top: 1rem;
      }
      .submission-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        gap: 0.75rem;
      }
      .submission-card {
        border: 1px solid var(--lp-border);
        border-radius: 12px;
        background: #fff;
        padding: 0.75rem;
        display: grid;
        gap: 0.4rem;
      }
      .modal-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(15, 23, 42, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 1rem;
        z-index: 10;
      }
      .modal-panel {
        width: min(900px, 100%);
        max-height: 90vh;
        overflow: auto;
        background: #fff;
        border-radius: 16px;
        border: 1px solid var(--lp-border);
        padding: 1rem;
      }
      .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: start;
        gap: 1rem;
        margin-bottom: 0.75rem;
      }
      .modal-body {
        display: grid;
        gap: 1rem;
      }
      .attachment-list {
        margin: 0;
        padding-right: 1.2rem;
      }
      .gate-box {
        border: 1px solid var(--lp-border);
        border-radius: 12px;
        padding: 0.75rem;
        background: #f8fafc;
      }
      .recording-actions {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
        margin-bottom: 0.75rem;
      }
      .notes-field {
        display: grid;
        gap: 0.35rem;
        margin-top: 0.75rem;
      }
      .notes-field textarea {
        border: 1px solid var(--lp-border);
        border-radius: 10px;
        padding: 0.6rem;
      }
      h1,
      h2,
      h3,
      h4 {
        margin: 0 0 0.35rem;
      }
      .muted {
        color: var(--lp-muted);
        margin: 0;
      }
      audio {
        width: 100%;
      }
      @media (max-width: 900px) {
        .dashboard-grid {
          grid-template-columns: 1fr;
        }
      }
    `
  ]
})
export class DashboardComponent implements OnInit, OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly api = inject(LESSON_PLANNER_API);
  private readonly router = inject(Router);

  readonly username = this.authService.getCurrentUser()?.username ?? 'دانش‌آموز';

  activeCourses: Course[] = [];
  selectedCourse: Course | null = null;
  assignments: Assignment[] = [];
  submissions: AssignmentSubmission[] = [];

  selectedAssignment: Assignment | null = null;
  assignmentProgress: StudentAssignmentGateState | null = null;
  primaryInstructionAudioUrl: string | null = null;

  loadingCourses = false;
  loadingAssignments = false;
  loadingSubmissions = false;
  isSubmittingSubmission = false;
  errorMessage = '';
  successMessage = '';

  isRecording = false;
  private mediaRecorder: MediaRecorder | null = null;
  private mediaStream: MediaStream | null = null;
  private recordingChunks: Blob[] = [];
  private recordingStartedAt = 0;
  private recordingDurationSeconds = 0;
  recordedAudioBlob: Blob | null = null;
  recordedAudioUrl: string | null = null;
  submissionNotes = '';

  private listenSession = {
    active: false,
    lastTime: 0,
    listenedSeconds: 0,
    duration: 0
  };
  private listenRequestInFlight = false;

  ngOnInit(): void {
    this.loadActiveCourses();
  }

  ngOnDestroy(): void {
    this.stopStreamTracks();
    if (this.recordedAudioUrl) {
      URL.revokeObjectURL(this.recordedAudioUrl);
    }
  }

  get courseSubmissions(): AssignmentSubmission[] {
    if (!this.selectedCourse) {
      return [];
    }
    const assignmentIds = new Set(
      this.assignments.filter((assignment) => assignment.courseId === this.selectedCourse?.id).map((assignment) => assignment.id)
    );
    return this.submissions.filter((submission) => assignmentIds.has(submission.assignmentId));
  }

  get isRecordingUnlocked(): boolean {
    if (!this.selectedAssignment) {
      return false;
    }
    if (!this.primaryInstructionAudioUrl) {
      return true;
    }
    return Boolean(this.assignmentProgress?.isRecordingUnlocked);
  }

  logout(): void {
    this.authService.logout();
    void this.router.navigate(['/auth/login']);
  }

  selectCourse(course: Course): void {
    if (this.selectedCourse?.id === course.id) {
      return;
    }
    this.selectedCourse = course;
    this.selectedAssignment = null;
    this.assignmentProgress = null;
    this.primaryInstructionAudioUrl = null;
    this.loadCourseAssignments(course.id);
    this.loadSubmissions();
  }

  openAssignment(assignment: Assignment): void {
    this.selectedAssignment = assignment;
    this.successMessage = '';
    this.errorMessage = '';
    this.resetRecordingPreview();
    this.submissionNotes = '';
    this.listenSession = {
      active: false,
      lastTime: 0,
      listenedSeconds: 0,
      duration: 0
    };
    this.primaryInstructionAudioUrl = this.resolvePrimaryInstructionAudioUrl(assignment.attachments ?? []);
    this.loadAssignmentProgress(assignment.id);
  }

  closeAssignment(): void {
    if (this.isRecording) {
      this.stopRecording();
    }
    this.selectedAssignment = null;
    this.assignmentProgress = null;
    this.primaryInstructionAudioUrl = null;
    this.submissionNotes = '';
  }

  timelinePosition(assignment: Assignment): TimelinePosition {
    const assignmentDate = new Date(assignment.assignmentDate);
    const today = new Date();
    assignmentDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    if (assignmentDate.getTime() < today.getTime()) {
      return 'past';
    }
    if (assignmentDate.getTime() > today.getTime()) {
      return 'future';
    }
    return 'today';
  }

  assignmentTitleById(assignmentId: number): string {
    return this.assignments.find((item) => item.id === assignmentId)?.title ?? `تکلیف #${assignmentId}`;
  }

  resolveAudioUrl(url: string | null | undefined): string | null {
    return resolveMediaUrl(url);
  }

  readTextInput(event: Event): string {
    const target = event.target as HTMLTextAreaElement | null;
    return target?.value ?? '';
  }

  onInstructionAudioPlay(audio: HTMLAudioElement): void {
    this.listenSession = {
      active: true,
      lastTime: audio.currentTime,
      listenedSeconds: 0,
      duration: audio.duration || 0
    };
  }

  onInstructionAudioTimeUpdate(audio: HTMLAudioElement): void {
    if (!this.listenSession.active) {
      return;
    }
    const delta = audio.currentTime - this.listenSession.lastTime;
    if (delta > 0 && delta <= 1.5) {
      this.listenSession.listenedSeconds += delta;
    }
    this.listenSession.lastTime = audio.currentTime;
    if (audio.duration && Number.isFinite(audio.duration) && audio.duration > 0) {
      this.listenSession.duration = audio.duration;
    }
  }

  onInstructionAudioEnded(audio: HTMLAudioElement): void {
    if (!this.selectedAssignment || this.listenRequestInFlight) {
      return;
    }
    this.listenSession.active = false;
    const duration = this.listenSession.duration || audio.duration || 0;
    if (duration <= 0) {
      return;
    }
    const requiredElapsed = Math.max(duration * 0.85, duration - 3);
    if (this.listenSession.listenedSeconds < requiredElapsed) {
      return;
    }
    const studentId = this.getStudentId();
    if (studentId === null) {
      this.errorMessage = 'شناسه دانش‌آموز یافت نشد.';
      return;
    }
    this.listenRequestInFlight = true;
    this.api
      .registerAssignmentListenCompletion(
        studentId,
        this.selectedAssignment.id,
        this.selectedAssignment.instructionAudioVersion
      )
      .pipe(finalize(() => (this.listenRequestInFlight = false)))
      .subscribe({
        next: (progress) => {
          this.assignmentProgress = progress;
        },
        error: (error) => {
          this.errorMessage = error?.error?.message ?? 'ثبت دفعات گوش‌دادن با خطا مواجه شد.';
        }
      });
  }

  onInstructionAudioError(): void {
    this.errorMessage = 'پخش فایل صوتی با خطا مواجه شد. لطفا دوباره تلاش کنید.';
  }

  async startRecording(): Promise<void> {
    if (this.isRecording || !this.selectedAssignment) {
      return;
    }
    if (!this.isRecordingUnlocked) {
      this.errorMessage = 'برای ضبط باید ابتدا فایل آموزشی را 3 بار کامل گوش دهید.';
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia) {
      this.errorMessage = 'ضبط صدا در این مرورگر پشتیبانی نمی‌شود.';
      return;
    }

    try {
      this.errorMessage = '';
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaStream = stream;
      this.recordingChunks = [];
      this.mediaRecorder = new MediaRecorder(stream);
      this.mediaRecorder.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          this.recordingChunks.push(event.data);
        }
      };
      this.mediaRecorder.onstop = () => {
        if (!this.recordingChunks.length) {
          return;
        }
        const blob = new Blob(this.recordingChunks, { type: this.mediaRecorder?.mimeType || 'audio/webm' });
        this.recordedAudioBlob = blob;
        this.recordedAudioUrl = URL.createObjectURL(blob);
      };
      this.mediaRecorder.start();
      this.recordingStartedAt = Date.now();
      this.isRecording = true;
    } catch {
      this.errorMessage = 'دسترسی به میکروفون امکان‌پذیر نیست.';
      this.stopStreamTracks();
    }
  }

  stopRecording(): void {
    if (!this.isRecording) {
      return;
    }
    this.isRecording = false;
    this.recordingDurationSeconds = Math.max(1, Math.round((Date.now() - this.recordingStartedAt) / 1000));
    this.mediaRecorder?.stop();
    this.stopStreamTracks();
  }

  clearRecording(): void {
    this.resetRecordingPreview();
    this.submissionNotes = '';
  }

  submitRecording(): void {
    if (!this.selectedAssignment || !this.recordedAudioBlob || this.isSubmittingSubmission) {
      return;
    }
    const studentId = this.getStudentId();
    if (studentId === null) {
      this.errorMessage = 'شناسه دانش‌آموز یافت نشد.';
      return;
    }
    if (!this.isRecordingUnlocked) {
      this.errorMessage = 'ضبط هنوز فعال نشده است.';
      return;
    }

    const file = new File(
      [this.recordedAudioBlob],
      `submission-${this.selectedAssignment.id}-${Date.now()}.webm`,
      { type: this.recordedAudioBlob.type || 'audio/webm' }
    );
    const payload = new FormData();
    payload.append('audioFile', file);
    payload.append('notes', this.submissionNotes.trim());
    payload.append('timeSpent', String(this.recordingDurationSeconds));

    this.isSubmittingSubmission = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.api
      .submitAssignment(studentId, this.selectedAssignment.id, payload)
      .pipe(finalize(() => (this.isSubmittingSubmission = false)))
      .subscribe({
        next: () => {
          this.successMessage = 'پاسخ شما با موفقیت ثبت شد.';
          this.loadAssignmentProgress(this.selectedAssignment!.id);
          this.loadSubmissions();
          this.clearRecording();
        },
        error: (error) => {
          this.errorMessage = error?.error?.message ?? 'ارسال پاسخ با خطا مواجه شد.';
        }
      });
  }

  private loadActiveCourses(): void {
    this.loadingCourses = true;
    this.errorMessage = '';
    this.api
      .getActiveCourses()
      .pipe(finalize(() => (this.loadingCourses = false)))
      .subscribe({
        next: (courses) => {
          this.activeCourses = courses;
          const firstCourse = courses[0] ?? null;
          this.selectedCourse = firstCourse;
          if (firstCourse) {
            this.loadCourseAssignments(firstCourse.id);
            this.loadSubmissions();
          }
        },
        error: (error) => {
          this.errorMessage = error?.error?.message ?? 'دریافت دروس فعال با خطا مواجه شد.';
        }
      });
  }

  private loadCourseAssignments(courseId: number): void {
    this.loadingAssignments = true;
    this.api
      .getCourseAssignments(courseId)
      .pipe(finalize(() => (this.loadingAssignments = false)))
      .subscribe({
        next: (assignments) => {
          this.assignments = [...assignments].sort((a, b) => a.assignmentDate.localeCompare(b.assignmentDate));
        },
        error: (error) => {
          this.errorMessage = error?.error?.message ?? 'دریافت تکالیف با خطا مواجه شد.';
          this.assignments = [];
        }
      });
  }

  private loadSubmissions(): void {
    const studentId = this.getStudentId();
    if (studentId === null) {
      return;
    }
    this.loadingSubmissions = true;
    this.api
      .getStudentSubmissions(studentId)
      .pipe(finalize(() => (this.loadingSubmissions = false)))
      .subscribe({
        next: (items) => {
          this.submissions = items;
        },
        error: (error) => {
          this.errorMessage = error?.error?.message ?? 'دریافت تحویل‌ها با خطا مواجه شد.';
          this.submissions = [];
        }
      });
  }

  private loadAssignmentProgress(assignmentId: number): void {
    const studentId = this.getStudentId();
    if (studentId === null) {
      return;
    }
    this.api.getAssignmentProgress(studentId, assignmentId).subscribe({
      next: (progress) => {
        if (!this.primaryInstructionAudioUrl) {
          this.assignmentProgress = {
            ...progress,
            requiredListenCount: 0,
            currentListenCount: 0,
            isRecordingUnlocked: true,
            hasPlayableInstructionAudio: false
          };
          return;
        }
        this.assignmentProgress = progress;
      },
      error: (error) => {
        this.errorMessage = error?.error?.message ?? 'دریافت وضعیت تکلیف با خطا مواجه شد.';
      }
    });
  }

  private resolvePrimaryInstructionAudioUrl(attachments: AssignmentAttachment[]): string | null {
    const primary = attachments.find((attachment) => attachment.kind === 'audio' && !!attachment.url);
    return resolveMediaUrl(primary?.url) ?? null;
  }

  private getStudentId(): number | null {
    return this.authService.getCurrentUser()?.studentId ?? null;
  }

  private resetRecordingPreview(): void {
    if (this.recordedAudioUrl) {
      URL.revokeObjectURL(this.recordedAudioUrl);
    }
    this.recordedAudioUrl = null;
    this.recordedAudioBlob = null;
  }

  private stopStreamTracks(): void {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }
  }
}
