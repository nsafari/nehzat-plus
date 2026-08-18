import { Observable, of } from 'rxjs';
import type { AssignmentGrading, GradeSubmissionRequest } from '../../models/lesson-planner.models';
import type { HttpServiceContext } from './base';
import { TeacherGradingApi } from '../api-interfaces/api-teacher-grading.interface';

export function WithTeacherGrading<TBase extends Constructor<HttpServiceContext>>(Base: TBase) {
  return class extends Base implements TeacherGradingApi {
    getTeacherGradings(teacherId: number): Observable<AssignmentGrading[]> {
      return this.http.get<AssignmentGrading[]>(this.url(`/api/teacher/${teacherId}/gradings`));
    }
    getPendingGradings(teacherId: number): Observable<AssignmentGrading[]> {
      return this.http.get<AssignmentGrading[]>(this.url(`/api/teacher/${teacherId}/gradings/pending`));
    }
    gradeSubmission(payload: GradeSubmissionRequest): Observable<AssignmentGrading> {
      return this.http.post<AssignmentGrading>(this.url('/api/teacher/grade'), payload);
    }
  };
}

type Constructor<T = {}> = new (...args: any[]) => T;
