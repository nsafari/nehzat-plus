import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MockDataContext } from './mock-data-context';
import {
  AdminSystemStatistics,
  CourseStatistics,
  CourseEnrollment,
  CourseInviteCode,
  ApiMessageResponse,
} from '../../models/lesson-planner.models';

@Injectable({ providedIn: 'root' })
export class MockAdminStatisticsService {
  constructor(private ctx: MockDataContext) {}

  getSystemStatistics(): Observable<AdminSystemStatistics> {
    return this.ctx.delayed({
      totalStudents: this.ctx.students.length,
      totalCourses: this.ctx.courses.length,
      totalCoaches: this.ctx.coaches.length,
      totalBranches: this.ctx.branches.length,
      activeStudents: this.ctx.students.filter((s) => s.status === 'active').length,
      activeCourses: this.ctx.courses.filter((c) => c.status === 'active').length,
      totalAssignments: this.ctx.assignments.length,
      totalAttachments: this.ctx.attachments.length,
    });
  }

  getCourseStatistics(courseId: number): Observable<unknown> {
    const course = this.ctx.courses.find((c) => c.id === courseId);
    const enrollments = Array.from(this.ctx.courseEnrollments.get(courseId) ?? []);
    return this.ctx.delayed({
      courseId,
      courseName: course?.title ?? '',
      totalStudents: this.ctx.students.length,
      enrolledStudents: enrollments.length,
      averageStudentScore: 0,
      evaluationCount: 0,
      averageEvaluationScore: 0,
      status: course?.status ?? 'unknown',
    });
  }

  getCourseEnrollments(courseId: number): Observable<CourseEnrollment[]> {
    const studentIds = Array.from(this.ctx.courseEnrollments.get(courseId) ?? []);
    const enrollments: CourseEnrollment[] = studentIds.map((studentId) => {
      const student = this.ctx.students.find((s) => s.id === studentId);
      return {
        id: this.ctx.nextId([{ id: 0 }]),
        courseId,
        studentId,
        studentName: student ? `${student.firstName} ${student.lastName}` : '',
        studentCode: student ? student.studentId : '',
        enrollmentDate: this.ctx.now(),
        enrolledAt: this.ctx.now(),
        status: 'active',
      };
    });
    return this.ctx.delayed(enrollments);
  }

  enrollStudentInCourse(courseId: number, studentId: number): Observable<ApiMessageResponse> {
    const existing = this.ctx.courseEnrollments.get(courseId) ?? [];
    if (!existing.includes(studentId)) {
      existing.push(studentId);
      this.ctx.courseEnrollments.set(courseId, existing);
    }
    return this.ctx.delayed({ message: 'دانش‌آموز در دوره ثبت‌نام شد' });
  }

  unenrollStudentFromCourse(courseId: number, studentId: number): Observable<ApiMessageResponse> {
    const existing = this.ctx.courseEnrollments.get(courseId) ?? [];
    this.ctx.courseEnrollments.set(
      courseId,
      existing.filter((id) => id !== studentId),
    );
    return this.ctx.delayed({ message: 'دانش‌آموز از دوره حذف شد' });
  }

  generateCourseInviteCode(courseId: number): Observable<CourseInviteCode> {
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    this.ctx.inviteCodes.set(courseId, code);
    return this.ctx.delayed({
      courseId,
      code,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    });
  }
}
