import { CommonModule } from '@angular/common';
import { Component, Input, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';

import { StudentProgressSummary, StudentSkillProgress } from '../../core/models/lesson-planner.models';
import { LESSON_PLANNER_API } from '../../core/services/lesson-planner-api.token';

@Component({
  selector: 'app-student-progress-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './student-progress-card.component.html',
  styleUrls: ['./student-progress-card.component.scss']
})
export class StudentProgressCardComponent {
  private readonly api = inject(LESSON_PLANNER_API);
  private readonly router = inject(Router);

  @Input({ required: true }) studentId!: number;
  @Input({ required: true }) studentName!: string;
  @Input({ required: true }) studentCode!: string;
  @Input({ required: true }) courseName!: string;
  @Input() latestGrade?: number;
  @Input() attendanceRate?: number;

  progressSummary$: Observable<StudentProgressSummary> = this.api.getProgressSummary(this.studentId);
  skillProgress$: Observable<StudentSkillProgress[]> = this.api.getSkillProgressByStudent(this.studentId);

  navigateToDetail(): void {
    void this.router.navigate(['/parent/student', this.studentId]);
  }
}
