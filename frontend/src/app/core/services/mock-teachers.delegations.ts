import { Observable } from 'rxjs';

import { MockLessonPlannerApiBase, type MockApiCtor } from './mock-lesson-planner-base';
import {
  ApiMessageResponse,
  AssignmentGrading,
  CreateTeacherPayload,
  GradeSubmissionPayload,
  Teacher,
  TeacherDashboardSummary,
  UpdateTeacherPayload,
} from './mock-lesson-planner-models';

/**
 * teachers delegation mixin: every method forwards to the injected
 * MockTeachersService instance (see MockLessonPlannerApiBase.teachers).
 */
export function withTeachers<T extends MockApiCtor>(Base: T) {
  return class extends Base {
    // ===== Teachers =====
    getTeachers(): Observable<Teacher[]> {
      return this.teachers.getTeachers();
    }

    getTeacherById(id: number): Observable<Teacher> {
      return this.teachers.getTeacherById(id);
    }

    createTeacher(payload: CreateTeacherPayload): Observable<Teacher> {
      return this.teachers.createTeacher(payload);
    }

    updateTeacher(id: number, payload: UpdateTeacherPayload): Observable<Teacher> {
      return this.teachers.updateTeacher(id, payload);
    }

    deleteTeacher(id: number): Observable<ApiMessageResponse> {
      return this.teachers.deleteTeacher(id);
    }

    getTeachersByCourse(courseId: number): Observable<Teacher[]> {
      return this.teachers.getTeachersByCourse(courseId);
    }

    getTeacherDashboardSummary(teacherId: number): Observable<TeacherDashboardSummary> {
      return this.teachers.getTeacherDashboardSummary(teacherId);
    }

    getTeacherCourses(teacherId: number): Observable<any[]> {
      return this.teachers.getTeacherCourses(teacherId);
    }

    getTeacherGradings(teacherId: number): Observable<AssignmentGrading[]> {
      return this.teachers.getTeacherGradings(teacherId);
    }

    getPendingGradings(teacherId: number): Observable<any[]> {
      return this.teachers.getPendingGradings(teacherId);
    }

    gradeSubmission(payload: GradeSubmissionPayload): Observable<AssignmentGrading> {
      return this.teachers.gradeSubmission(payload);
    }
  };
}
