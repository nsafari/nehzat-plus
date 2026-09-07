import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MockDataContext } from './mock-data-context';
import { Course, Assignment, ApiMessageResponse } from '../../models/lesson-planner.models';

@Injectable({ providedIn: 'root' })
export class MockCoursesService {
  constructor(private ctx: MockDataContext) {}

  getActiveCourses(): Observable<Course[]> {
    return this.ctx.delayed(this.ctx.courses.filter((c) => c.status === 'active'));
  }

  getCourses(): Observable<Course[]> {
    return this.ctx.delayed([...this.ctx.courses]);
  }

  getCourseById(id: number): Observable<Course> {
    const course = this.ctx.courses.find((c) => c.id === id);
    if (!course) throw new Error('Course not found');
    return this.ctx.delayed(course);
  }

  createCourse(payload: {
    title: string;
    description?: string;
    courseCode?: string;
    credits?: number;
    instructor?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    maxStudents?: number;
  }): Observable<Course> {
    const course: Course = {
      id: this.ctx.nextId(this.ctx.courses),
      title: payload.title,
      description: payload.description ?? '',
      courseCode: payload.courseCode ?? '',
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

  updateCourse(
    id: number,
    payload: Partial<{
      title: string;
      description?: string;
      courseCode?: string;
      credits?: number;
      instructor?: string;
      status?: string;
      startDate?: string;
      endDate?: string;
      maxStudents?: number;
    }>,
  ): Observable<Course> {
    const course = this.ctx.courses.find((c) => c.id === id);
    if (!course) throw new Error('Course not found');
    Object.assign(course, payload, { updatedAt: this.ctx.now() });
    return this.ctx.delayed(course);
  }

  deleteCourse(id: number): Observable<ApiMessageResponse> {
    this.ctx.courses = this.ctx.courses.filter((c) => c.id !== id);
    this.ctx.assignments = this.ctx.assignments.filter((a) => a.courseId !== id);
    this.ctx.courseEnrollments.delete(id);
    return this.ctx.delayed({ message: 'دوره با موفقیت حذف شد' });
  }

  getCourseAssignments(courseId: number): Observable<Assignment[]> {
    return this.ctx.delayed(this.ctx.assignments.filter((a) => a.courseId === courseId));
  }

  createCourseAssignment(
    courseId: number,
    payload: Partial<{
      title?: string;
      description?: string;
      type?: string;
      maxScore?: number;
      assignmentDate?: string;
      status?: string;
      instructions?: string;
    }>,
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
}
