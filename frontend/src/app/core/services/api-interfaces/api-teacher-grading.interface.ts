import { Observable } from 'rxjs';
import type { AssignmentGrading, GradeSubmissionRequest } from '../../models/lesson-planner.models';

export abstract class TeacherGradingApi {
  abstract getTeacherGradings(teacherId: number): Observable<AssignmentGrading[]>;
  abstract getPendingGradings(teacherId: number): Observable<AssignmentGrading[]>;
  abstract gradeSubmission(payload: GradeSubmissionRequest): Observable<AssignmentGrading>;
}
