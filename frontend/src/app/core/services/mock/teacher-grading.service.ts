import { Observable, of } from 'rxjs';
import type { AssignmentGrading, GradeSubmissionRequest } from '../../models/lesson-planner.models';

export class MockTeacherGradingService {
  private gradings: AssignmentGrading[] = [
    { id: 1, submissionId: 10, teacherId: 1, status: 'pending', dailyScore: 0, gradedAt: new Date().toISOString() },
    { id: 2, submissionId: 11, teacherId: 1, status: 'graded', dailyScore: 18, gradedAt: new Date().toISOString() },
  ];

  getTeacherGradings(teacherId: number): Observable<AssignmentGrading[]> {
    return of(this.gradings);
  }
  getPendingGradings(teacherId: number): Observable<AssignmentGrading[]> {
    return of(this.gradings.filter(g => g.status === 'pending'));
  }
  gradeSubmission(payload: GradeSubmissionRequest): Observable<AssignmentGrading> {
    const existing = this.gradings.find(g => g.submissionId === payload.submissionId);
    if (existing) {
      existing.dailyScore = payload.dailyScore ?? existing.dailyScore;
      existing.status = payload.status ?? existing.status;
    }
    return of(this.gradings[this.gradings.length - 1]);
  }
}
