import { Observable } from 'rxjs';

import { MockLessonPlannerApiBase, type MockApiCtor } from './mock-lesson-planner-base';
import {
  ApiMessageResponse,
  Assignment,
  Course,
  CreateAssignmentPayload,
  CreateCoursePayload,
} from './mock-lesson-planner-models';

/**
 * courses delegation mixin: every method forwards to the injected
 * MockCoursesService instance (see MockLessonPlannerApiBase.courses).
 */
export function withCourses<T extends MockApiCtor>(Base: T) {
  return class extends Base {
    // ===== Public Courses =====
    getActiveCourses(): Observable<Course[]> {
      return this.courses.getActiveCourses();
    }

    getCourses(): Observable<Course[]> {
      return this.courses.getCourses();
    }

    getCourseById(id: number): Observable<Course> {
      return this.courses.getCourseById(id);
    }

    createCourse(payload: CreateCoursePayload): Observable<Course> {
      return this.courses.createCourse(payload);
    }

    updateCourse(id: number, payload: Partial<CreateCoursePayload>): Observable<Course> {
      return this.courses.updateCourse(id, payload);
    }

    deleteCourse(id: number): Observable<ApiMessageResponse> {
      return this.courses.deleteCourse(id);
    }

    getCourseAssignments(courseId: number): Observable<Assignment[]> {
      return this.courses.getCourseAssignments(courseId);
    }

    createCourseAssignment(
      courseId: number,
      payload: Partial<CreateAssignmentPayload>,
    ): Observable<Assignment> {
      return this.courses.createCourseAssignment(courseId, payload);
    }
  };
}
