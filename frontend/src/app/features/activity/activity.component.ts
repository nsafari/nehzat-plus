import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';

import type { DailyActivity, UpsertDailyActivityPayload } from '../../core/models/lesson-planner.models';
import { LESSON_PLANNER_API } from '../../core/services/lesson-planner-api.token';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';

interface WeekDay {
  label: string;
  dateStr: string;
  logged: boolean;
  minutes: number;
}

@Component({
  selector: 'app-activity',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityComponent implements OnInit {
  private readonly api = inject(LESSON_PLANNER_API);
  private readonly authService = inject(AuthService);
  private readonly notify = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  loading = true;
  saving = false;
  streak = 0;
  todayEntry: DailyActivity | null = null;
  weekDays: WeekDay[] = [];

  activityMinutes: number | null = null;
  steps: number | null = null;
  sleepHours: number | null = null;
  notes = '';

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

    this.api.getTodayActivity().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (entry) => {
        this.todayEntry = entry;
        if (entry) {
          this.activityMinutes = entry.activityMinutes ?? null;
          this.steps = entry.steps ?? null;
          this.sleepHours = entry.sleepHours ?? null;
          this.notes = entry.notes ?? '';
        }
        done();
      },
      error: () => done()
    });

    const today = new Date();
    const fromDate = new Date(today);
    fromDate.setDate(today.getDate() - 6);

    this.api.getActivityHistory(this.toDateStr(fromDate), this.toDateStr(today))
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (history) => {
          this.buildWeekDays(history);
          done();
        },
        error: () => done()
      });

    this.api.getActivityStreak().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.streak = res.streak;
        done();
      },
      error: () => done()
    });
  }

  onSubmit(): void {
    if (this.saving) return;
    this.saving = true;

    const payload: UpsertDailyActivityPayload = {
      activityDate: this.toDateStr(new Date()),
      activityMinutes: this.activityMinutes,
      steps: this.steps,
      sleepHours: this.sleepHours,
      notes: this.notes || null
    };

    this.api.upsertDailyActivity(payload)
      .pipe(finalize(() => (this.saving = false)))
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => {
          this.notify.show('فعالیت امروز ثبت شد', 'success');
          this.loadAll();
        },
        error: (error) => {
          this.notify.show(error?.error?.message ?? 'خطا در ثبت فعالیت', 'error');
        }
      });
  }

  private buildWeekDays(history: DailyActivity[]): void {
    const today = new Date();
    const byDate = new Map<string, DailyActivity>();
    for (const entry of history) {
      byDate.set(entry.activityDate, entry);
    }

    const days: WeekDay[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = this.toDateStr(d);
      const entry = byDate.get(dateStr);
      days.push({
        label: this.getPersianWeekday(d),
        dateStr,
        logged: Boolean(entry),
        minutes: entry?.activityMinutes ?? 0
      });
    }
    this.weekDays = days;
  }

  private getPersianWeekday(date: Date): string {
    const names = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'];
    return names[(date.getDay() + 1) % 7];
  }

  private toDateStr(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  getBarHeight(minutes: number | null | undefined): number {
    const m = minutes ?? 0;
    return Math.min(100, (m / 60) * 100);
  }
}
