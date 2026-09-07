import { Observable } from 'rxjs';

import { MockLessonPlannerApiBase, type MockApiCtor } from './mock-lesson-planner-base';
import {
  ApiMessageResponse,
  Coach,
  CreateCoachPayload,
  CreateStudentPayload,
  Student,
  UpdateStudentPayload,
} from './mock-lesson-planner-models';

/**
 * adminCoaches delegation mixin: every method forwards to the injected
 * MockAdminCoachesService instance (see MockLessonPlannerApiBase.adminCoaches).
 */
export function withAdminCoaches<T extends MockApiCtor>(Base: T) {
  return class extends Base {
    // ===== Coaches =====
    getCoaches(): Observable<Coach[]> {
      return this.adminCoaches.getCoaches();
    }

    createCoach(payload: CreateCoachPayload): Observable<Coach> {
      return this.adminCoaches.createCoach(payload);
    }

    updateCoach(id: number, payload: Partial<CreateCoachPayload>): Observable<Coach> {
      return this.adminCoaches.updateCoach(id, payload);
    }

    deleteCoach(id: number): Observable<ApiMessageResponse> {
      return this.adminCoaches.deleteCoach(id);
    }

    // ===== Students =====
    getStudents(): Observable<Student[]> {
      return this.adminCoaches.getStudents();
    }

    getCoachStudents(): Observable<Student[]> {
      return this.adminCoaches.getCoachStudents();
    }

    createStudent(payload: CreateStudentPayload): Observable<Student> {
      return this.adminCoaches.createStudent(payload);
    }

    updateStudent(id: number, payload: UpdateStudentPayload): Observable<Student> {
      return this.adminCoaches.updateStudent(id, payload);
    }

    deleteStudent(id: number): Observable<ApiMessageResponse> {
      return this.adminCoaches.deleteStudent(id);
    }
  };
}
