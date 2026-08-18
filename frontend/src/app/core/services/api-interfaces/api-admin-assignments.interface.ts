import { Observable } from 'rxjs';

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

export abstract class AdminAssignmentsApi {
  abstract getAdminCourses(): Observable<Course[]>;
  abstract createAdminCourse(payload: CreateCoursePayload): Observable<Course>;
  abstract updateAdminCourse(id: number, payload: Partial<CreateCoursePayload>): Observable<Course>;
  abstract deleteAdminCourse(id: number): Observable<ApiMessageResponse>;
  abstract searchAdminCourses(query: string): Observable<Course[]>;
  abstract filterAdminCourses(status: string): Observable<Course[]>;

  abstract getAdminCourseAssignments(courseId: number): Observable<Assignment[]>;
  abstract getAssignmentById(id: number): Observable<Assignment>;
  abstract createAdminAssignment(
    courseId: number,
    payload: Partial<CreateAssignmentPayload>,
  ): Observable<Assignment>;
  abstract updateAdminAssignment(
    id: number,
    payload: Partial<CreateAssignmentPayload>,
  ): Observable<Assignment>;
  abstract deleteAdminAssignment(id: number): Observable<ApiMessageResponse>;
  abstract createDailyAssignments(
    courseId: number,
    payload: CreateDailySeriesPayload,
  ): Observable<Assignment[]>;

  abstract getAssignmentAttachments(assignmentId: number): Observable<AssignmentAttachment[]>;
  abstract createAttachment(
    assignmentId: number,
    payload: FormData,
  ): Observable<AssignmentAttachment>;
  abstract uploadAttachmentFile(
    attachmentId: number,
    payload: FormData,
  ): Observable<AssignmentAttachment>;
  abstract updateAttachment(
    attachmentId: number,
    payload: UpdateAttachmentPayload,
  ): Observable<AssignmentAttachment>;
  abstract deleteAttachment(attachmentId: number): Observable<ApiMessageResponse>;
}
