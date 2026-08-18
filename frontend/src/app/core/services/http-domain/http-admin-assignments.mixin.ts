import { Constructor, HttpServiceContext } from './base';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import {
  ApiMessageResponse,
  Assignment,
  AssignmentAttachment,
  Course,
  CreateAssignmentPayload,
  CreateCoursePayload,
  CreateDailySeriesPayload,
  UpdateAttachmentPayload,
} from '../../models/lesson-planner.models';

export function WithAdminAssignments<TBase extends Constructor<HttpServiceContext>>(Base: TBase) {
  return class extends Base {
    getAdminCourses(): Observable<Course[]> {
      return this.http.get<Course[]>(this.url('/admin/courses'));
    }

    createAdminCourse(payload: CreateCoursePayload): Observable<Course> {
      return this.http.post<Course>(this.url('/admin/courses'), payload);
    }

    updateAdminCourse(id: number, payload: Partial<CreateCoursePayload>): Observable<Course> {
      return this.http.put<Course>(this.url(`/admin/courses/${id}`), payload);
    }

    deleteAdminCourse(id: number): Observable<ApiMessageResponse> {
      return this.http.delete<ApiMessageResponse>(this.url(`/admin/courses/${id}`));
    }

    searchAdminCourses(query: string): Observable<Course[]> {
      const params = new HttpParams().set('q', query);
      return this.http.get<Course[]>(this.url('/admin/courses/search'), { params });
    }

    filterAdminCourses(status: string): Observable<Course[]> {
      const params = new HttpParams().set('status', status);
      return this.http.get<Course[]>(this.url('/admin/courses/filter'), { params });
    }

    getAdminCourseAssignments(courseId: number): Observable<Assignment[]> {
      return this.http.get<Assignment[]>(this.url(`/admin/courses/${courseId}/assignments`));
    }

    getAssignmentById(id: number): Observable<Assignment> {
      return this.http.get<Assignment>(this.url(`/admin/assignments/${id}`));
    }

    createAdminAssignment(
      courseId: number,
      payload: CreateAssignmentPayload,
    ): Observable<Assignment> {
      return this.http.post<Assignment>(
        this.url(`/admin/courses/${courseId}/assignments`),
        payload,
      );
    }

    updateAdminAssignment(id: number, payload: CreateAssignmentPayload): Observable<Assignment> {
      return this.http.put<Assignment>(this.url(`/admin/assignments/${id}`), payload);
    }

    deleteAdminAssignment(id: number): Observable<ApiMessageResponse> {
      return this.http.delete<ApiMessageResponse>(this.url(`/admin/assignments/${id}`));
    }

    createDailyAssignments(
      courseId: number,
      payload: CreateDailySeriesPayload,
    ): Observable<Assignment[]> {
      return this.http.post<Assignment[]>(
        this.url(`/admin/courses/${courseId}/assignments/daily-series`),
        payload,
      );
    }

    getAssignmentAttachments(assignmentId: number): Observable<AssignmentAttachment[]> {
      return this.http.get<AssignmentAttachment[]>(
        this.url(`/admin/assignments/${assignmentId}/attachments`),
      );
    }

    createAttachment(assignmentId: number, payload: FormData): Observable<AssignmentAttachment> {
      return this.http.post<AssignmentAttachment>(
        this.url(`/admin/assignments/${assignmentId}/attachments`),
        payload,
      );
    }

    uploadAttachmentFile(
      attachmentId: number,
      payload: FormData,
    ): Observable<AssignmentAttachment> {
      return this.http.post<AssignmentAttachment>(
        this.url(`/admin/attachments/${attachmentId}/upload`),
        payload,
      );
    }

    updateAttachment(
      attachmentId: number,
      payload: Partial<AssignmentAttachment>,
    ): Observable<AssignmentAttachment> {
      return this.http.put<AssignmentAttachment>(
        this.url(`/admin/attachments/${attachmentId}`),
        payload,
      );
    }

    deleteAttachment(attachmentId: number): Observable<ApiMessageResponse> {
      return this.http.delete<ApiMessageResponse>(this.url(`/admin/attachments/${attachmentId}`));
    }
  };
}
