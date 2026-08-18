import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MockDataContext } from './mock-data-context';
import {
  Teacher,
  TeacherCourse,
  TeacherDashboardSummary,
  AssignmentGrading,
  CreateTeacherPayload,
  UpdateTeacherPayload,
  GradeSubmissionPayload,
  ApiMessageResponse,
} from '../../models/lesson-planner.models';

@Injectable({ providedIn: 'root' })
export class MockTeachersService {
  constructor(private ctx: MockDataContext) {}

  getTeachers(): Observable<Teacher[]> {
    return this.ctx.delayed([...this.ctx.teachers]);
  }

  getTeacherById(id: number): Observable<Teacher> {
    const teacher = this.ctx.teachers.find((t) => t.id === id);
    return this.ctx.delayed(teacher ?? ({} as Teacher));
  }

  createTeacher(payload: CreateTeacherPayload): Observable<Teacher> {
    const teacher: Teacher = {
      id: this.ctx.nextId(this.ctx.teachers),
      username: payload.username,
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      phoneNumber: payload.phoneNumber,
      specialization: payload.specialization,
      nationalCode: payload.nationalCode,
      branchId: payload.branchId,
      status: 'active',
      createdAt: this.ctx.now(),
      updatedAt: this.ctx.now(),
    };
    this.ctx.teachers.push(teacher);
    return this.ctx.delayed(teacher);
  }

  updateTeacher(id: number, payload: UpdateTeacherPayload): Observable<Teacher> {
    const teacher = this.ctx.teachers.find((t) => t.id === id);
    if (!teacher) throw new Error('Teacher not found');
    Object.assign(teacher, payload, { updatedAt: this.ctx.now() });
    return this.ctx.delayed(teacher);
  }

  deleteTeacher(id: number): Observable<ApiMessageResponse> {
    this.ctx.teachers = this.ctx.teachers.filter((t) => t.id !== id);
    return this.ctx.delayed({ message: 'استاد حذف شد' });
  }

  getTeachersByCourse(courseId: number): Observable<Teacher[]> {
    const teacherIds = this.ctx.teacherCourses
      .filter((tc) => tc.courseId === courseId)
      .map((tc) => tc.teacherId);
    return this.ctx.delayed(this.ctx.teachers.filter((t) => teacherIds.includes(t.id)));
  }

  getTeacherDashboardSummary(teacherId: number): Observable<TeacherDashboardSummary> {
    const courses = this.ctx.teacherCourses.filter((tc) => tc.teacherId === teacherId);
    const gradings = this.ctx.assignmentGradings.filter((g) => g.teacherId === teacherId);
    return this.ctx.delayed({
      totalCourses: courses.length,
      totalStudents: 0,
      pendingGradings: gradings.filter((g) => g.status === 'pending').length,
      completedGradings: gradings.filter((g) => g.status === 'completed').length,
      averageScore:
        gradings.length > 0
          ? Math.round(gradings.reduce((sum, g) => sum + (g.dailyScore ?? 0), 0) / gradings.length)
          : 0,
    });
  }

  getTeacherCourses(teacherId: number): Observable<TeacherCourse[]> {
    return this.ctx.delayed(this.ctx.teacherCourses.filter((tc) => tc.teacherId === teacherId));
  }

  getTeacherGradings(teacherId: number): Observable<AssignmentGrading[]> {
    return this.ctx.delayed(this.ctx.assignmentGradings.filter((g) => g.teacherId === teacherId));
  }

  getPendingGradings(teacherId: number): Observable<AssignmentGrading[]> {
    return this.ctx.delayed(
      this.ctx.assignmentGradings.filter(
        (g) => g.teacherId === teacherId && g.status === 'pending',
      ),
    );
  }

  gradeSubmission(payload: GradeSubmissionPayload): Observable<AssignmentGrading> {
    const grading: AssignmentGrading = {
      id: this.ctx.nextId(this.ctx.assignmentGradings),
      submissionId: payload.submissionId,
      teacherId: payload.teacherId,
      dailyScore: payload.dailyScore,
      cumulativeScore: payload.cumulativeScore,
      status: payload.status ?? 'completed',
      feedback: payload.feedback,
      gradedAt: this.ctx.now(),
    };
    this.ctx.assignmentGradings.push(grading);
    return this.ctx.delayed(grading);
  }
}
