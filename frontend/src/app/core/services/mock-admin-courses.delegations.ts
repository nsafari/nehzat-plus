import { Observable } from 'rxjs';

import { MockLessonPlannerApiBase, type MockApiCtor } from './mock-lesson-planner-base';
import {
  ApiMessageResponse,
  Assignment,
  AssignmentAttachment,
  Course,
  CreateAssignmentPayload,
  CreateCoursePayload,
  CreateDailySeriesPayload,
  UpdateAttachmentPayload,
} from './mock-lesson-planner-models';

/**
 * adminCourses delegation mixin: every method forwards to the injected
 * MockAdminCoursesService instance (see MockLessonPlannerApiBase.adminCourses).
 */
export function withAdminCourses<T extends MockApiCtor>(Base: T) {
  return class extends Base {
    // ===== Admin Courses =====
    getAdminCourses(): Observable<Course[]> {
      return this.adminCourses.getAdminCourses();
    }

    createAdminCourse(payload: CreateCoursePayload): Observable<Course> {
      return this.adminCourses.createAdminCourse(payload);
    }

    updateAdminCourse(id: number, payload: Partial<CreateCoursePayload>): Observable<Course> {
      return this.adminCourses.updateAdminCourse(id, payload);
    }

    deleteAdminCourse(id: number): Observable<ApiMessageResponse> {
      return this.adminCourses.deleteAdminCourse(id);
    }

    searchAdminCourses(query: string): Observable<Course[]> {
      return this.adminCourses.searchAdminCourses(query);
    }

    filterAdminCourses(status: string): Observable<Course[]> {
      return this.adminCourses.filterAdminCourses(status);
    }

    getAdminCourseAssignments(courseId: number): Observable<Assignment[]> {
      return this.adminCourses.getAdminCourseAssignments(courseId);
    }

    getAssignmentById(id: number): Observable<Assignment> {
      return this.adminCourses.getAssignmentById(id);
    }

    createAdminAssignment(
      courseId: number,
      payload: Partial<CreateAssignmentPayload>,
    ): Observable<Assignment> {
      return this.adminCourses.createAdminAssignment(courseId, payload);
    }

    updateAdminAssignment(
      id: number,
      payload: Partial<CreateAssignmentPayload>,
    ): Observable<Assignment> {
      return this.adminCourses.updateAdminAssignment(id, payload);
    }

    deleteAdminAssignment(id: number): Observable<ApiMessageResponse> {
      return this.adminCourses.deleteAdminAssignment(id);
    }

    createDailyAssignments(
      courseId: number,
      payload: CreateDailySeriesPayload,
    ): Observable<Assignment[]> {
      return this.adminCourses.createDailyAssignments(courseId, payload);
    }

    // ===== Admin Attachments =====
    getAssignmentAttachments(assignmentId: number): Observable<AssignmentAttachment[]> {
      return this.adminCourses.getAssignmentAttachments(assignmentId);
    }

    createAttachment(assignmentId: number, payload: FormData): Observable<AssignmentAttachment> {
      return this.adminCourses.createAttachment(assignmentId, payload);
    }

    uploadAttachmentFile(
      attachmentId: number,
      payload: FormData,
    ): Observable<AssignmentAttachment> {
      return this.adminCourses.uploadAttachmentFile(attachmentId, payload);
    }

    updateAttachment(
      attachmentId: number,
      payload: UpdateAttachmentPayload,
    ): Observable<AssignmentAttachment> {
      return this.adminCourses.updateAttachment(attachmentId, payload);
    }

    deleteAttachment(attachmentId: number): Observable<ApiMessageResponse> {
      return this.adminCourses.deleteAttachment(attachmentId);
    }
  };
}
