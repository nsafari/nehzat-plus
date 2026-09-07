import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, Input, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import type { AssignmentGrading } from '../../../core/models/lesson-planner.models';
import { LESSON_PLANNER_API } from '../../../core/services/lesson-planner-api.token';

@Component({
  selector: 'app-teacher-gradings-section',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './teacher-gradings-section.component.html',
  styleUrls: ['./teacher-gradings-section.component.scss']
})
export class TeacherGradingsSectionComponent implements OnInit {
  private readonly api = inject(LESSON_PLANNER_API);
  private readonly destroyRef = inject(DestroyRef);

  @Input({ required: true }) teacherId = 0;

  gradings$: Observable<AssignmentGrading[]> = of();

  ngOnInit(): void {
    if (!this.teacherId) return;
    this.load();
  }

  load(): void {
    this.gradings$ = this.api.getTeacherGradings(this.teacherId).pipe(
      catchError(() => of([]))
    );
  }

  getStatusClass(status?: string): string {
    return status ?? 'pending';
  }

  getStatusLabel(status?: string): string {
    const labels: Record<string, string> = {
      graded: 'نمره‌دهی شده',
      pending: 'در انتظار',
      late: 'دیرکرد'
    };
    return labels[status ?? ''] ?? status ?? 'نامشخص';
  }
}
