import { Observable } from 'rxjs';
import { type MockApiCtor } from './mock-lesson-planner-base';
import { MockTeacherGradingService } from './mock/teacher-grading.service';
import type { AssignmentGrading, GradeSubmissionRequest } from './mock-lesson-planner-models';

export function withTeacherGrading<T extends MockApiCtor>(Base: T) {
  return class extends Base {
    private get _tg() { return this.teacherGrading; }
    getTeacherGradings(teacherId: number): Observable<AssignmentGrading[]> {
      return this._tg.getTeacherGradings(teacherId);
    }
    getPendingGradings(teacherId: number): Observable<AssignmentGrading[]> {
      return this._tg.getPendingGradings(teacherId);
    }
    gradeSubmission(payload: GradeSubmissionRequest): Observable<AssignmentGrading> {
      return this._tg.gradeSubmission(payload);
    }
  };
}
