import { Observable } from 'rxjs';

import { MockLessonPlannerApiBase, type MockApiCtor } from './mock-lesson-planner-base';
import {
  AdminSystemStatistics,
  ApiMessageResponse,
  CourseEnrollment,
  CourseInviteCode,
} from './mock-lesson-planner-models';

/**
 * adminStatistics delegation mixin: every method forwards to the injected
 * MockAdminStatisticsService instance (see MockLessonPlannerApiBase.adminStatistics).
 */
export function withAdminStatistics<T extends MockApiCtor>(Base: T) {
  return class extends Base {
    // ===== Statistics =====
    getSystemStatistics(): Observable<AdminSystemStatistics> {
      return this.adminStatistics.getSystemStatistics();
    }

    getCourseStatistics(courseId: number): Observable<unknown> {
      return this.adminStatistics.getCourseStatistics(courseId);
    }

    // ===== Enrollments =====
    getCourseEnrollments(courseId: number): Observable<CourseEnrollment[]> {
      return this.adminStatistics.getCourseEnrollments(courseId);
    }

    enrollStudentInCourse(courseId: number, studentId: number): Observable<ApiMessageResponse> {
      return this.adminStatistics.enrollStudentInCourse(courseId, studentId);
    }

    unenrollStudentFromCourse(courseId: number, studentId: number): Observable<ApiMessageResponse> {
      return this.adminStatistics.unenrollStudentFromCourse(courseId, studentId);
    }

    generateCourseInviteCode(courseId: number): Observable<CourseInviteCode> {
      return this.adminStatistics.generateCourseInviteCode(courseId);
    }
  };
}
