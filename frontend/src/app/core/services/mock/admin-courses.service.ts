import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MockDataContext } from './mock-data-context';
import {
  Course,
  Assignment,
  AssignmentAttachment,
  CreateCoursePayload,
  CreateAssignmentPayload,
  CreateDailySeriesPayload,
  UpdateAttachmentPayload,
  ApiMessageResponse,
} from '../../models/lesson-planner.models';

@Injectable({ providedIn: 'root' })
export class MockAdminCoursesService {
  constructor(private ctx: MockDataContext) {}

  getAdminCourses(): Observable<Course[]> {
    return this.ctx.delayed([...this.ctx.courses]);
  }

  createAdminCourse(payload: CreateCoursePayload): Observable<Course> {
    const course: Course = {
      id: this.ctx.nextId(this.ctx.courses),
      title: payload.title,
      description: payload.description ?? '',
      courseCode: payload.courseCode,
      credits: payload.credits,
      instructor: payload.instructor ?? '',
      status: payload.status ?? 'active',
      startDate: payload.startDate ?? this.ctx.now().split('T')[0],
      endDate: payload.endDate ?? this.ctx.now().split('T')[0],
      maxStudents: payload.maxStudents,
      createdAt: this.ctx.now(),
      updatedAt: this.ctx.now(),
    };
    this.ctx.courses.push(course);
    return this.ctx.delayed(course);
  }

  updateAdminCourse(id: number, payload: Partial<CreateCoursePayload>): Observable<Course> {
    const course = this.ctx.courses.find((c) => c.id === id);
    if (!course) throw new Error('Course not found');
    Object.assign(course, payload, { updatedAt: this.ctx.now() });
    return this.ctx.delayed(course);
  }

  deleteAdminCourse(id: number): Observable<ApiMessageResponse> {
    this.ctx.courses = this.ctx.courses.filter((c) => c.id !== id);
    this.ctx.assignments = this.ctx.assignments.filter((a) => a.courseId !== id);
    this.ctx.courseEnrollments.delete(id);
    return this.ctx.delayed({ message: 'دوره با موفقیت حذف شد' });
  }

  searchAdminCourses(query: string): Observable<Course[]> {
    return this.ctx.delayed(
      this.ctx.courses.filter((c) => c.title.includes(query) || c.description.includes(query)),
    );
  }

  filterAdminCourses(status: string): Observable<Course[]> {
    return this.ctx.delayed(this.ctx.courses.filter((c) => c.status === status));
  }

  getAdminCourseAssignments(courseId: number): Observable<Assignment[]> {
    return this.ctx.delayed(this.ctx.assignments.filter((a) => a.courseId === courseId));
  }

  getAssignmentById(id: number): Observable<Assignment> {
    const assignment = this.ctx.assignments.find((a) => a.id === id);
    if (!assignment) throw new Error('Assignment not found');
    return this.ctx.delayed(assignment);
  }

  createAdminAssignment(
    courseId: number,
    payload: Partial<CreateAssignmentPayload>,
  ): Observable<Assignment> {
    const assignment: Assignment = {
      id: this.ctx.nextId(this.ctx.assignments),
      courseId,
      title: payload.title ?? 'تکلیف جدید',
      description: payload.description ?? '',
      type: payload.type ?? 'daily',
      maxScore: payload.maxScore ?? 100,
      assignmentDate: payload.assignmentDate ?? this.ctx.now().split('T')[0],
      status: payload.status ?? 'published',
      instructions: payload.instructions,
      requiredListenCount: 1,
      currentListenCount: 0,
      isRecordingUnlocked: true,
      createdAt: this.ctx.now(),
      updatedAt: this.ctx.now(),
    };
    this.ctx.assignments.push(assignment);
    return this.ctx.delayed(assignment);
  }

  updateAdminAssignment(
    id: number,
    payload: Partial<CreateAssignmentPayload>,
  ): Observable<Assignment> {
    const assignment = this.ctx.assignments.find((a) => a.id === id);
    if (!assignment) throw new Error('Assignment not found');
    Object.assign(assignment, payload, { updatedAt: this.ctx.now() });
    return this.ctx.delayed(assignment);
  }

  deleteAdminAssignment(id: number): Observable<ApiMessageResponse> {
    this.ctx.assignments = this.ctx.assignments.filter((a) => a.id !== id);
    return this.ctx.delayed({ message: 'تکلیف با موفقیت حذف شد' });
  }

  createDailyAssignments(
    courseId: number,
    payload: CreateDailySeriesPayload,
  ): Observable<Assignment[]> {
    const newAssignments: Assignment[] = [];
    const startDate = new Date(payload.startDate);
    for (let i = 0; i < payload.days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const assignment: Assignment = {
        id: this.ctx.nextId(this.ctx.assignments),
        courseId,
        title: `${payload.titlePrefix ?? 'تکلیف روز'} ${i + 1}`,
        description: payload.descriptionPrefix ?? '',
        type: payload.type ?? 'daily',
        maxScore: payload.maxScore ?? 100,
        assignmentDate: date.toISOString().split('T')[0],
        status: 'published',
        instructions: payload.instructions,
        requiredListenCount: 1,
        currentListenCount: 0,
        isRecordingUnlocked: true,
        createdAt: this.ctx.now(),
        updatedAt: this.ctx.now(),
      };
      this.ctx.assignments.push(assignment);
      newAssignments.push(assignment);
    }
    return this.ctx.delayed(newAssignments);
  }

  getAssignmentAttachments(assignmentId: number): Observable<AssignmentAttachment[]> {
    return this.ctx.delayed(this.ctx.attachments.filter((a) => a.assignmentId === assignmentId));
  }

  createAttachment(assignmentId: number, payload: FormData): Observable<AssignmentAttachment> {
    const attachment: AssignmentAttachment = {
      id: this.ctx.nextId(this.ctx.attachments),
      assignmentId,
      title: (payload.get('title') as string) ?? 'فایل پیوست',
      description: (payload.get('description') as string) ?? '',
      kind: (payload.get('kind') as string as any) ?? 'file',
      url: (payload.get('url') as string) ?? '',
      displayOrder: this.ctx.attachments.filter((a) => a.assignmentId === assignmentId).length + 1,
      createdAt: this.ctx.now(),
    };
    this.ctx.attachments.push(attachment);
    return this.ctx.delayed(attachment);
  }

  uploadAttachmentFile(attachmentId: number, payload: FormData): Observable<AssignmentAttachment> {
    const attachment = this.ctx.attachments.find((a) => a.id === attachmentId);
    if (!attachment) throw new Error('Attachment not found');
    attachment.url = URL.createObjectURL(payload.get('file') as Blob);
    return this.ctx.delayed(attachment);
  }

  updateAttachment(
    attachmentId: number,
    payload: UpdateAttachmentPayload,
  ): Observable<AssignmentAttachment> {
    const attachment = this.ctx.attachments.find((a) => a.id === attachmentId);
    if (!attachment) throw new Error('Attachment not found');
    Object.assign(attachment, payload);
    return this.ctx.delayed(attachment);
  }

  deleteAttachment(attachmentId: number): Observable<ApiMessageResponse> {
    this.ctx.attachments = this.ctx.attachments.filter((a) => a.id !== attachmentId);
    return this.ctx.delayed({ message: 'فایل پیوست حذف شد' });
  }
}
