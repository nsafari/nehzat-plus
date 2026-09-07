import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, Input, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { LESSON_PLANNER_API } from '../../../core/services/lesson-planner-api.token';

@Component({
  selector: 'app-teacher-courses-section',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './teacher-courses-section.component.html',
  styleUrls: ['./teacher-courses-section.component.scss']
})
export class TeacherCoursesSectionComponent implements OnInit {
  private readonly api = inject(LESSON_PLANNER_API);
  private readonly destroyRef = inject(DestroyRef);

  @Input({ required: true }) teacherId = 0;

  courses$: Observable<any[]> = of();

  ngOnInit(): void {
    if (!this.teacherId) return;
    this.load();
  }

  load(): void {
    this.courses$ = this.api.getTeacherCourses(this.teacherId).pipe(
      catchError(() => of([]))
    );
  }
}
