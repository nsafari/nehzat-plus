import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import type {
  TrainingAssignment,
  TrainingContent,
  TrainingCourse,
  TrainingEnrollment,
  TrainingProgress,
  TrainingSession,
  TrainingStage,
  TrainingStatistics,
  TrainingSubmission,
} from '../../models/training.models';

@Injectable({ providedIn: 'root' })
export class MockTrainingService {
  private courses: TrainingCourse[] = [
    {
      id: 1,
      title: 'دوره مقدماتی تربیت مربی',
      slug: 'trainer-basics',
      description: 'آشنایی مقدماتی با اصول تربیت و مربی‌گری',
      academicYear: '1403-1404',
      status: 'active',
      maxEnrollment: 40,
      startDate: '2024-09-01',
      endDate: '2025-03-01',
      createdAt: new Date().toISOString(),
      stagesCount: 2,
      enrollmentsCount: 12,
    },
    {
      id: 2,
      title: 'دوره تکمیلی مهارت‌های ارتباطی',
      slug: 'communication-skills',
      description: 'مهارت‌های ارتباط مؤثر برای مربیان',
      academicYear: '1403-1404',
      status: 'active',
      maxEnrollment: 30,
      startDate: '2024-10-01',
      endDate: '2025-04-01',
      createdAt: new Date().toISOString(),
      stagesCount: 1,
      enrollmentsCount: 8,
    },
  ];

  private stages: TrainingStage[] = [
    { id: 1, courseId: 1, title: 'مرحله مبانی', stageOrder: 1, required: true, description: 'مبانی نظری تربیت', sessionsCount: 2, prerequisiteStageId: undefined },
    { id: 2, courseId: 1, title: 'مرحله عملی', stageOrder: 2, required: true, description: 'تمرین عملی مربی‌گری', sessionsCount: 1, prerequisiteStageId: 1 },
    { id: 3, courseId: 2, title: 'مرحله ارتباط مؤثر', stageOrder: 1, required: true, description: 'اصول ارتباط مؤثر', sessionsCount: 1, prerequisiteStageId: undefined },
  ];

  private sessions: TrainingSession[] = [
    { id: 1, stageId: 1, title: 'جلسه اول: چیستی تربیت', sessionNumber: 1, durationMinutes: 90, sessionType: 'lecture', description: 'مفاهیم پایه', contentsCount: 1, assignmentsCount: 1 },
    { id: 2, stageId: 1, title: 'جلسه دوم: مراحل رشد', sessionNumber: 2, durationMinutes: 90, sessionType: 'lecture', description: 'مراحل رشد متربی', contentsCount: 0, assignmentsCount: 0 },
    { id: 3, stageId: 2, title: 'جلسه عملی: کارگاه', sessionNumber: 1, durationMinutes: 120, sessionType: 'workshop', description: 'کارگاه عملی', contentsCount: 0, assignmentsCount: 1 },
    { id: 4, stageId: 3, title: 'جلسه اول: گوش دادن فعال', sessionNumber: 1, durationMinutes: 90, sessionType: 'lecture', description: 'مهارت گوش دادن', contentsCount: 0, assignmentsCount: 1 },
  ];

  private contents: TrainingContent[] = [
    { id: 1, sessionId: 1, contentType: 'pdf', sourceFile: '/uploads/training/mabani.pdf', importedAt: new Date().toISOString() },
  ];

  private enrollments: TrainingEnrollment[] = [
    { id: 1, userId: 11, courseId: 1, enrolledAt: new Date().toISOString(), status: 'active', userName: 'علی احمدی', courseTitle: 'دوره مقدماتی تربیت مربی' },
    { id: 2, userId: 12, courseId: 1, enrolledAt: new Date().toISOString(), status: 'active', userName: 'فاطمه محمدی', courseTitle: 'دوره مقدماتی تربیت مربی' },
  ];

  private progress: TrainingProgress[] = [
    { id: 1, enrollmentId: 1, sessionId: 1, status: 'completed', score: 18, completedAt: new Date().toISOString(), notes: 'خوب بود' },
    { id: 2, enrollmentId: 1, sessionId: 3, status: 'in_progress', notes: 'در حال انجام' },
  ];

  private assignments: TrainingAssignment[] = [
    { id: 1, sessionId: 1, title: 'تکلیف یک: خلاصه فصل اول', description: 'خلاصه‌نویسی فصل اول کتاب مبانی', deadline: '2024-10-01', submissionType: 'text', submissionsCount: 1 },
    { id: 2, sessionId: 3, title: 'تکلیف عملی: گزارش کارگاه', description: 'گزارش کارگاه عملی', deadline: '2024-11-01', submissionType: 'file', submissionsCount: 0 },
  ];

  private submissions: TrainingSubmission[] = [
    { id: 1, assignmentId: 1, userId: 11, content: 'خلاصه فصل اول...', submittedAt: new Date().toISOString(), grade: 17, feedback: 'آفرین', userName: 'علی احمدی' },
  ];

  private nextId(items: { id: number }[]): number {
    return items.reduce((max, item) => Math.max(max, item.id), 0) + 1;
  }

  getCourses(): Observable<TrainingCourse[]> {
    return of(this.courses);
  }

  getCourseById(id: number): Observable<TrainingCourse> {
    const course = this.courses.find(c => c.id === id);
    if (!course) throw new Error('course not found');
    return of(course);
  }

  createCourse(course: Partial<TrainingCourse>): Observable<TrainingCourse> {
    const created: TrainingCourse = {
      id: this.nextId(this.courses),
      title: course.title ?? 'بدون عنوان',
      description: course.description,
      academicYear: course.academicYear ?? '1404-1405',
      status: course.status ?? 'draft',
      maxEnrollment: course.maxEnrollment,
      startDate: course.startDate,
      endDate: course.endDate,
      createdAt: new Date().toISOString(),
      stagesCount: 0,
      enrollmentsCount: 0,
    };
    this.courses = [...this.courses, created];
    return of(created);
  }

  updateCourse(id: number, course: Partial<TrainingCourse>): Observable<TrainingCourse> {
    const found = this.courses.find(c => c.id === id);
    if (!found) throw new Error('course not found');
    const updated = { ...found, ...course, id };
    this.courses = this.courses.map(c => (c.id === id ? updated : c));
    return of(updated);
  }

  deleteCourse(id: number): Observable<void> {
    this.courses = this.courses.filter(c => c.id !== id);
    return of(undefined);
  }

  searchCourses(query: string, page: number = 1, pageSize: number = 10): Observable<any> {
    const filtered = this.courses.filter(c => c.title.includes(query) || (c.description ?? '').includes(query));
    const start = (page - 1) * pageSize;
    return of({
      items: filtered.slice(start, start + pageSize),
      total: filtered.length,
      page,
      pageSize,
    });
  }

  filterCoursesByStatus(status: string): Observable<TrainingCourse[]> {
    return of(this.courses.filter(c => c.status === status));
  }

  filterCoursesByYear(academicYear: string): Observable<TrainingCourse[]> {
    return of(this.courses.filter(c => c.academicYear === academicYear));
  }

  getStagesByCourseId(courseId: number): Observable<TrainingStage[]> {
    return of(this.stages.filter(s => s.courseId === courseId));
  }

  createStage(courseId: number, stage: Partial<TrainingStage>): Observable<TrainingStage> {
    const created: TrainingStage = {
      id: this.nextId(this.stages),
      courseId,
      title: stage.title ?? 'بدون عنوان',
      stageOrder: stage.stageOrder ?? 1,
      required: stage.required ?? true,
      description: stage.description,
      sessionsCount: 0,
      prerequisiteStageId: stage.prerequisiteStageId,
    };
    this.stages = [...this.stages, created];
    this.courses = this.courses.map(c => (c.id === courseId ? { ...c, stagesCount: c.stagesCount + 1 } : c));
    return of(created);
  }

  getStageById(id: number): Observable<TrainingStage> {
    const stage = this.stages.find(s => s.id === id);
    if (!stage) throw new Error('stage not found');
    return of(stage);
  }

  updateStage(id: number, stage: Partial<TrainingStage>): Observable<TrainingStage> {
    const found = this.stages.find(s => s.id === id);
    if (!found) throw new Error('stage not found');
    const updated = { ...found, ...stage, id };
    this.stages = this.stages.map(s => (s.id === id ? updated : s));
    return of(updated);
  }

  deleteStage(id: number): Observable<void> {
    this.stages = this.stages.filter(s => s.id !== id);
    return of(undefined);
  }

  getSessionsByStageId(stageId: number): Observable<TrainingSession[]> {
    return of(this.sessions.filter(s => s.stageId === stageId));
  }

  createSession(stageId: number, session: Partial<TrainingSession>): Observable<TrainingSession> {
    const created: TrainingSession = {
      id: this.nextId(this.sessions),
      stageId,
      title: session.title ?? 'بدون عنوان',
      sessionNumber: session.sessionNumber ?? 1,
      durationMinutes: session.durationMinutes ?? 60,
      sessionType: session.sessionType ?? 'lecture',
      description: session.description,
      contentsCount: 0,
      assignmentsCount: 0,
    };
    this.sessions = [...this.sessions, created];
    return of(created);
  }

  getSessionById(id: number): Observable<TrainingSession> {
    const session = this.sessions.find(s => s.id === id);
    if (!session) throw new Error('session not found');
    return of(session);
  }

  updateSession(id: number, session: Partial<TrainingSession>): Observable<TrainingSession> {
    const found = this.sessions.find(s => s.id === id);
    if (!found) throw new Error('session not found');
    const updated = { ...found, ...session, id };
    this.sessions = this.sessions.map(s => (s.id === id ? updated : s));
    return of(updated);
  }

  deleteSession(id: number): Observable<void> {
    this.sessions = this.sessions.filter(s => s.id !== id);
    return of(undefined);
  }

  getContentsBySessionId(sessionId: number): Observable<TrainingContent[]> {
    return of(this.contents.filter(c => c.sessionId === sessionId));
  }

  createContent(sessionId: number, content: Partial<TrainingContent>): Observable<TrainingContent> {
    const created: TrainingContent = {
      id: this.nextId(this.contents),
      sessionId,
      contentType: content.contentType ?? 'text',
      sourceFile: content.sourceFile,
      rawText: content.rawText,
      structuredData: content.structuredData,
      importedAt: new Date().toISOString(),
    };
    this.contents = [...this.contents, created];
    return of(created);
  }

  getContentById(id: number): Observable<TrainingContent> {
    const content = this.contents.find(c => c.id === id);
    if (!content) throw new Error('content not found');
    return of(content);
  }

  updateContent(id: number, content: Partial<TrainingContent>): Observable<TrainingContent> {
    const found = this.contents.find(c => c.id === id);
    if (!found) throw new Error('content not found');
    const updated = { ...found, ...content, id };
    this.contents = this.contents.map(c => (c.id === id ? updated : c));
    return of(updated);
  }

  deleteContent(id: number): Observable<void> {
    this.contents = this.contents.filter(c => c.id !== id);
    return of(undefined);
  }

  uploadContent(sessionId: number, file: File): Observable<TrainingContent> {
    const created: TrainingContent = {
      id: this.nextId(this.contents),
      sessionId,
      contentType: file.type || 'file',
      sourceFile: `/uploads/training/${Date.now()}-${file.name}`,
      importedAt: new Date().toISOString(),
    };
    this.contents = [...this.contents, created];
    return of(created);
  }

  createEnrollment(enrollment: { userId: number; courseId: number }): Observable<TrainingEnrollment> {
    const course = this.courses.find(c => c.id === enrollment.courseId);
    const created: TrainingEnrollment = {
      id: this.nextId(this.enrollments),
      userId: enrollment.userId,
      courseId: enrollment.courseId,
      enrolledAt: new Date().toISOString(),
      status: 'active',
      courseTitle: course?.title,
    };
    this.enrollments = [...this.enrollments, created];
    return of(created);
  }

  getEnrollmentById(id: number): Observable<TrainingEnrollment> {
    const enrollment = this.enrollments.find(e => e.id === id);
    if (!enrollment) throw new Error('enrollment not found');
    return of(enrollment);
  }

  getEnrollmentsByCourseId(courseId: number): Observable<TrainingEnrollment[]> {
    return of(this.enrollments.filter(e => e.courseId === courseId));
  }

  getEnrollmentsByUserId(userId: number): Observable<TrainingEnrollment[]> {
    return of(this.enrollments.filter(e => e.userId === userId));
  }

  updateEnrollmentStatus(id: number, status: string): Observable<TrainingEnrollment> {
    const found = this.enrollments.find(e => e.id === id);
    if (!found) throw new Error('enrollment not found');
    const updated = { ...found, status };
    this.enrollments = this.enrollments.map(e => (e.id === id ? updated : e));
    return of(updated);
  }

  deleteEnrollment(id: number): Observable<void> {
    this.enrollments = this.enrollments.filter(e => e.id !== id);
    return of(undefined);
  }

  updateProgress(enrollmentId: number, sessionId: number, progress: { status: string; score?: number; notes?: string }): Observable<TrainingProgress> {
    const existing = this.progress.find(p => p.enrollmentId === enrollmentId && p.sessionId === sessionId);
    const created: TrainingProgress = existing
      ? { ...existing, ...progress }
      : {
          id: this.nextId(this.progress),
          enrollmentId,
          sessionId,
          status: progress.status,
          score: progress.score,
          notes: progress.notes,
          completedAt: progress.status === 'completed' ? new Date().toISOString() : undefined,
        };
    this.progress = existing
      ? this.progress.map(p => (p.id === existing.id ? created : p))
      : [...this.progress, created];
    return of(created);
  }

  getProgressByEnrollmentId(enrollmentId: number): Observable<TrainingProgress[]> {
    return of(this.progress.filter(p => p.enrollmentId === enrollmentId));
  }

  getProgressBySessionId(sessionId: number): Observable<TrainingProgress[]> {
    return of(this.progress.filter(p => p.sessionId === sessionId));
  }

  getAssignmentsBySessionId(sessionId: number): Observable<TrainingAssignment[]> {
    return of(this.assignments.filter(a => a.sessionId === sessionId));
  }

  createAssignment(sessionId: number, assignment: Partial<TrainingAssignment>): Observable<TrainingAssignment> {
    const created: TrainingAssignment = {
      id: this.nextId(this.assignments),
      sessionId,
      title: assignment.title ?? 'بدون عنوان',
      description: assignment.description,
      deadline: assignment.deadline,
      submissionType: assignment.submissionType ?? 'text',
      submissionsCount: 0,
    };
    this.assignments = [...this.assignments, created];
    return of(created);
  }

  getAssignmentById(id: number): Observable<TrainingAssignment> {
    const assignment = this.assignments.find(a => a.id === id);
    if (!assignment) throw new Error('assignment not found');
    return of(assignment);
  }

  updateAssignment(id: number, assignment: Partial<TrainingAssignment>): Observable<TrainingAssignment> {
    const found = this.assignments.find(a => a.id === id);
    if (!found) throw new Error('assignment not found');
    const updated = { ...found, ...assignment, id };
    this.assignments = this.assignments.map(a => (a.id === id ? updated : a));
    return of(updated);
  }

  deleteAssignment(id: number): Observable<void> {
    this.assignments = this.assignments.filter(a => a.id !== id);
    return of(undefined);
  }

  createSubmission(assignmentId: number, submission: { content?: string; fileUrl?: string }): Observable<TrainingSubmission> {
    const created: TrainingSubmission = {
      id: this.nextId(this.submissions),
      assignmentId,
      userId: 0,
      content: submission.content,
      fileUrl: submission.fileUrl,
      submittedAt: new Date().toISOString(),
    };
    this.submissions = [...this.submissions, created];
    return of(created);
  }

  getSubmissionsByAssignmentId(assignmentId: number): Observable<TrainingSubmission[]> {
    return of(this.submissions.filter(s => s.assignmentId === assignmentId));
  }

  getSubmissionById(id: number): Observable<TrainingSubmission> {
    const submission = this.submissions.find(s => s.id === id);
    if (!submission) throw new Error('submission not found');
    return of(submission);
  }

  gradeSubmission(id: number, grade: number, feedback?: string): Observable<TrainingSubmission> {
    const found = this.submissions.find(s => s.id === id);
    if (!found) throw new Error('submission not found');
    const updated = { ...found, grade, feedback };
    this.submissions = this.submissions.map(s => (s.id === id ? updated : s));
    return of(updated);
  }

  getStatistics(): Observable<TrainingStatistics> {
    return of({
      totalCourses: this.courses.length,
      activeCourses: this.courses.filter(c => c.status === 'active').length,
      totalEnrollments: this.enrollments.length,
      totalSessions: this.sessions.length,
      totalContent: this.contents.length,
      courseStats: this.courses.map(course => ({
        courseId: course.id,
        courseTitle: course.title,
        enrollmentCount: this.enrollments.filter(e => e.courseId === course.id).length,
        completionRate: 50,
      })),
    });
  }

  getCourseStatistics(courseId: number): Observable<any> {
    const course = this.courses.find(c => c.id === courseId);
    return of({
      courseId,
      courseTitle: course?.title,
      enrollmentCount: this.enrollments.filter(e => e.courseId === courseId).length,
      sessionCount: this.sessions.length,
      assignmentCount: this.assignments.length,
      submissionCount: this.submissions.length,
    });
  }
}