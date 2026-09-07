import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, Input, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import type { TeacherDashboardSummary } from '../../../core/models/lesson-planner.models';
import { LESSON_PLANNER_API } from '../../../core/services/lesson-planner-api.token';

@Component({
  selector: 'app-teacher-dashboard-section',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './teacher-dashboard-section.component.html',
  styleUrls: ['./teacher-dashboard-section.component.scss']
})
export class TeacherDashboardSectionComponent implements OnInit {
  private readonly api = inject(LESSON_PLANNER_API);
  private readonly destroyRef = inject(DestroyRef);

  @Input({ required: true }) teacherId = 0;

  dashboardSummary$: Observable<TeacherDashboardSummary> = of();

  ngOnInit(): void {
    if (!this.teacherId) return;
    this.load();
  }

  load(): void {
    this.dashboardSummary$ = this.api.getTeacherDashboardSummary(this.teacherId).pipe(
      catchError(() => of({ totalCourses: 0, totalStudents: 0, pendingGradings: 0, completedGradings: 0, averageScore: 0 }))
    );
  }
}
