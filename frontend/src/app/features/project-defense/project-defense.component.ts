import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';

import type {
  ProjectDefense,
  CreateProjectDefensePayload,
  SubmitProjectDefensePayload,
  ProjectDefenseEvaluation,
  ScheduleDefensePayload,
  DefenseSchedule
} from '../../core/models/lesson-planner.models';
import { LESSON_PLANNER_API } from '../../core/services/lesson-planner-api.token';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';

type DefenseView = 'list' | 'create' | 'schedule';

@Component({
  selector: 'app-project-defense',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './project-defense.component.html',
  styleUrls: ['./project-defense.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectDefenseComponent implements OnInit {
  private readonly api = inject(LESSON_PLANNER_API);
  private readonly authService = inject(AuthService);
  private readonly notify = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  activeView: DefenseView = 'list';
  loading = true;
  saving = false;

  defenses: ProjectDefense[] = [];
  evaluations: ProjectDefenseEvaluation[] = [];
  defenseSchedule: DefenseSchedule | null = null;

  selectedDefense: ProjectDefense | null = null;

  // Create form
  createTitle = '';
  createDescription = '';

  // Schedule form
  scheduleDefenseId: number | null = null;
  scheduleDate = '';
  scheduleLocation = '';
  scheduleEvaluatorIds = '101,102';
  scheduleDuration = 45;

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
    let pending = 2;

    const done = () => {
      pending--;
      if (pending <= 0) {
        this.loading = false;
      }
    };

    this.api.getProjectDefenses().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (items) => {
        this.defenses = items;
        done();
      },
      error: () => done()
    });

    this.api.getDefenseSchedule(42).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (schedule) => {
        this.defenseSchedule = schedule;
        done();
      },
      error: () => done()
    });
  }

  switchView(view: DefenseView): void {
    this.activeView = view;
    this.closeModals();
  }

  openCreateModal(): void {
    this.createTitle = '';
    this.createDescription = '';
    this.activeView = 'create';
  }

  closeModals(): void {
    this.activeView = 'list';
    this.selectedDefense = null;
    this.createTitle = '';
    this.createDescription = '';
  }

  onCreateDefense(): void {
    if (this.saving) return;
    if (!this.createTitle.trim()) {
      this.notify.show('عنوان دفاع را وارد کنید', 'error');
      return;
    }

    this.saving = true;
    const payload: CreateProjectDefensePayload = {
      title: this.createTitle.trim(),
      description: this.createDescription.trim() || null
    };

    this.api.createProjectDefense(payload).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (defense) => {
        this.notify.show('دفاع پروژه با موفقیت ایجاد شد', 'success');
        this.saving = false;
        this.closeModals();
        this.loadAll();
      },
      error: (error) => {
        this.notify.show(error?.error?.message ?? 'خطا در ایجاد دفاع', 'error');
        this.saving = false;
      }
    });
  }

  onSubmitDefense(defense: ProjectDefense): void {
    if (this.saving) return;
    if (defense.status !== 'draft') {
      this.notify.show('فقط دفاع‌های در حالت پیش‌نویس قابل ارسال هستند', 'error');
      return;
    }

    this.saving = true;
    const payload: SubmitProjectDefensePayload = {
      defenseId: defense.id
    };

    this.api.submitProjectDefense(payload).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (updated) => {
        this.notify.show('دفاع پروژه با موفقیت ارسال شد', 'success');
        this.saving = false;
        this.loadAll();
      },
      error: (error) => {
        this.notify.show(error?.error?.message ?? 'خطا در ارسال دفاع', 'error');
        this.saving = false;
      }
    });
  }

  onViewEvaluations(defense: ProjectDefense): void {
    this.selectedDefense = defense;
    this.api.getProjectDefenseEvaluations(defense.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (evals) => {
        this.evaluations = evals;
      },
      error: () => this.notify.show('خطا در بارگذاری ارزیابی‌ها', 'error')
    });
  }

  onScheduleDefense(): void {
    if (this.saving) return;
    if (!this.scheduleDefenseId) {
      this.notify.show('دفاع پروژه را انتخاب کنید', 'error');
      return;
    }
    if (!this.scheduleDate) {
      this.notify.show('تاریخ و زمان دفاع را تعیین کنید', 'error');
      return;
    }
    if (!this.scheduleLocation.trim()) {
      this.notify.show('مکان دفاع را وارد کنید', 'error');
      return;
    }

    this.saving = true;
    const evaluatorIds = this.scheduleEvaluatorIds
      .split(',')
      .map(id => parseInt(id.trim(), 10))
      .filter(id => !isNaN(id));

    const payload: ScheduleDefensePayload = {
      defenseId: this.scheduleDefenseId,
      scheduledAt: this.scheduleDate,
      location: this.scheduleLocation.trim(),
      evaluatorIds,
      durationMinutes: this.scheduleDuration
    };

    this.api.scheduleDefense(payload).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (schedule) => {
        this.notify.show('جلسه دفاع با موفقیت زمان‌بندی شد', 'success');
        this.saving = false;
        this.closeModals();
        this.loadAll();
      },
      error: (error) => {
        this.notify.show(error?.error?.message ?? 'خطا در زمان‌بندی دفاع', 'error');
        this.saving = false;
      }
    });
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      draft: 'پیش‌نویس',
      submitted: 'ارسال شده',
      scheduled: 'زمان‌بندی شده',
      completed: 'تکمیل شده',
      approved: 'تایید شده',
      rejected: 'رد شده'
    };
    return labels[status] ?? status;
  }

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      draft: 'status-draft',
      submitted: 'status-submitted',
      scheduled: 'status-scheduled',
      completed: 'status-completed',
      approved: 'status-approved',
      rejected: 'status-rejected'
    };
    return classes[status] ?? '';
  }

  canSubmit(defense: ProjectDefense): boolean {
    return defense.status === 'draft';
  }

  canSchedule(defense: ProjectDefense): boolean {
    return defense.status === 'submitted';
  }

  openScheduleModal(defense: ProjectDefense): void {
    this.scheduleDefenseId = defense.id;
    this.activeView = 'schedule';
  }

  getCriteriaKeys(): string[] {
    if (!this.evaluations.length) return [];
    const allKeys = new Set<string>();
    for (const eval_ of this.evaluations) {
      for (const key of Object.keys(eval_.criteriaScores)) {
        allKeys.add(key);
      }
    }
    return [...allKeys];
  }

  getCriterionLabel(criterion: string): string {
    const labels: Record<string, string> = {
      originality: 'اصالت',
      presentation: 'ارائه',
      technicalDepth: 'عمق فنی',
      research: 'تحقیق',
      innovation: 'نوآوری',
      clarity: 'وضوح'
    };
    return labels[criterion] ?? criterion;
  }

  formatDate(dateStr: string | null): string {
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    return date.toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  formatDateTime(dateStr: string | null): string {
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    return date.toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  getAverageScore(evals: ProjectDefenseEvaluation[]): number {
    if (!evals.length) return 0;
    const sum = evals.reduce((s, e) => s + e.score, 0);
    return Math.round(sum / evals.length);
  }
}