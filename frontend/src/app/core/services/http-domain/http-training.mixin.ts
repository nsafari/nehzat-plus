import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
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
import type { HttpServiceContext } from './base';
import { TrainingApi } from '../api-interfaces/api-training.interface';

export function WithTraining<TBase extends Constructor<HttpServiceContext>>(Base: TBase) {
  return class extends Base implements TrainingApi {
    getTrainingCourses(): Observable<TrainingCourse[]> {
      return this.http.get<TrainingCourse[]>(this.url('/api/training/courses'));
    }
    getTrainingCourseById(id: number): Observable<TrainingCourse> {
      return this.http.get<TrainingCourse>(this.url(`/api/training/courses/${id}`));
    }
    createTrainingCourse(course: Partial<TrainingCourse>): Observable<TrainingCourse> {
      return this.http.post<TrainingCourse>(this.url('/api/training/courses'), course);
    }
    updateTrainingCourse(id: number, course: Partial<TrainingCourse>): Observable<TrainingCourse> {
      return this.http.put<TrainingCourse>(this.url(`/api/training/courses/${id}`), course);
    }
    deleteTrainingCourse(id: number): Observable<void> {
      return this.http.delete<void>(this.url(`/api/training/courses/${id}`));
    }
    searchCourses(query: string, page: number = 1, pageSize: number = 10): Observable<any> {
      const params = new HttpParams()
        .set('q', query)
        .set('page', String(page))
        .set('pageSize', String(pageSize));
      return this.http.get<any>(this.url('/api/training/courses/search'), { params });
    }
    filterCoursesByStatus(status: string): Observable<TrainingCourse[]> {
      return this.http.get<TrainingCourse[]>(this.url('/api/training/courses/filter/status'), {
        params: new HttpParams().set('status', status)
      });
    }
    filterCoursesByYear(academicYear: string): Observable<TrainingCourse[]> {
      return this.http.get<TrainingCourse[]>(this.url('/api/training/courses/filter/year'), {
        params: new HttpParams().set('academicYear', academicYear)
      });
    }
    getStagesByCourseId(courseId: number): Observable<TrainingStage[]> {
      return this.http.get<TrainingStage[]>(this.url(`/api/training/courses/${courseId}/stages`));
    }
    createStage(courseId: number, stage: Partial<TrainingStage>): Observable<TrainingStage> {
      return this.http.post<TrainingStage>(this.url(`/api/training/courses/${courseId}/stages`), stage);
    }
    getStageById(id: number): Observable<TrainingStage> {
      return this.http.get<TrainingStage>(this.url(`/api/training/stages/${id}`));
    }
    updateStage(id: number, stage: Partial<TrainingStage>): Observable<TrainingStage> {
      return this.http.put<TrainingStage>(this.url(`/api/training/stages/${id}`), stage);
    }
    deleteStage(id: number): Observable<void> {
      return this.http.delete<void>(this.url(`/api/training/stages/${id}`));
    }
    getSessionsByStageId(stageId: number): Observable<TrainingSession[]> {
      return this.http.get<TrainingSession[]>(this.url(`/api/training/stages/${stageId}/sessions`));
    }
    createSession(stageId: number, session: Partial<TrainingSession>): Observable<TrainingSession> {
      return this.http.post<TrainingSession>(this.url(`/api/training/stages/${stageId}/sessions`), session);
    }
    getSessionById(id: number): Observable<TrainingSession> {
      return this.http.get<TrainingSession>(this.url(`/api/training/sessions/${id}`));
    }
    updateSession(id: number, session: Partial<TrainingSession>): Observable<TrainingSession> {
      return this.http.put<TrainingSession>(this.url(`/api/training/sessions/${id}`), session);
    }
    deleteSession(id: number): Observable<void> {
      return this.http.delete<void>(this.url(`/api/training/sessions/${id}`));
    }
    getContentsBySessionId(sessionId: number): Observable<TrainingContent[]> {
      return this.http.get<TrainingContent[]>(this.url(`/api/training/sessions/${sessionId}/contents`));
    }
    createContent(sessionId: number, content: Partial<TrainingContent>): Observable<TrainingContent> {
      return this.http.post<TrainingContent>(this.url(`/api/training/sessions/${sessionId}/contents`), content);
    }
    getContentById(id: number): Observable<TrainingContent> {
      return this.http.get<TrainingContent>(this.url(`/api/training/contents/${id}`));
    }
    updateContent(id: number, content: Partial<TrainingContent>): Observable<TrainingContent> {
      return this.http.put<TrainingContent>(this.url(`/api/training/contents/${id}`), content);
    }
    deleteContent(id: number): Observable<void> {
      return this.http.delete<void>(this.url(`/api/training/contents/${id}`));
    }
    uploadContent(sessionId: number, file: File): Observable<TrainingContent> {
      const formData = new FormData();
      formData.append('file', file);
      return this.http.post<TrainingContent>(this.url(`/api/training/sessions/${sessionId}/upload`), formData);
    }
    createEnrollment(enrollment: { userId: number; courseId: number }): Observable<TrainingEnrollment> {
      return this.http.post<TrainingEnrollment>(this.url('/api/training/enrollments'), enrollment);
    }
    getEnrollmentById(id: number): Observable<TrainingEnrollment> {
      return this.http.get<TrainingEnrollment>(this.url(`/api/training/enrollments/${id}`));
    }
    getEnrollmentsByCourseId(courseId: number): Observable<TrainingEnrollment[]> {
      return this.http.get<TrainingEnrollment[]>(this.url(`/api/training/courses/${courseId}/enrollments`));
    }
    getEnrollmentsByUserId(userId: number): Observable<TrainingEnrollment[]> {
      return this.http.get<TrainingEnrollment[]>(this.url(`/api/training/users/${userId}/enrollments`));
    }
    updateEnrollmentStatus(id: number, status: string): Observable<TrainingEnrollment> {
      return this.http.put<TrainingEnrollment>(this.url(`/api/training/enrollments/${id}/status`), JSON.stringify(status), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    deleteEnrollment(id: number): Observable<void> {
      return this.http.delete<void>(this.url(`/api/training/enrollments/${id}`));
    }
    updateProgress(enrollmentId: number, sessionId: number, progress: { status: string; score?: number; notes?: string }): Observable<TrainingProgress> {
      return this.http.put<TrainingProgress>(this.url(`/api/training/enrollments/${enrollmentId}/sessions/${sessionId}/progress`), progress);
    }
    getProgressByEnrollmentId(enrollmentId: number): Observable<TrainingProgress[]> {
      return this.http.get<TrainingProgress[]>(this.url(`/api/training/enrollments/${enrollmentId}/progress`));
    }
    getProgressBySessionId(sessionId: number): Observable<TrainingProgress[]> {
      return this.http.get<TrainingProgress[]>(this.url(`/api/training/sessions/${sessionId}/progress`));
    }
    getAssignmentsBySessionId(sessionId: number): Observable<TrainingAssignment[]> {
      return this.http.get<TrainingAssignment[]>(this.url(`/api/training/sessions/${sessionId}/assignments`));
    }
    createAssignment(sessionId: number, assignment: Partial<TrainingAssignment>): Observable<TrainingAssignment> {
      return this.http.post<TrainingAssignment>(this.url(`/api/training/sessions/${sessionId}/assignments`), assignment);
    }
    getTrainingAssignmentById(id: number): Observable<TrainingAssignment> {
      return this.http.get<TrainingAssignment>(this.url(`/api/training/assignments/${id}`));
    }
    updateAssignment(id: number, assignment: Partial<TrainingAssignment>): Observable<TrainingAssignment> {
      return this.http.put<TrainingAssignment>(this.url(`/api/training/assignments/${id}`), assignment);
    }
    deleteAssignment(id: number): Observable<void> {
      return this.http.delete<void>(this.url(`/api/training/assignments/${id}`));
    }
    createSubmission(assignmentId: number, submission: { content?: string; fileUrl?: string }): Observable<TrainingSubmission> {
      return this.http.post<TrainingSubmission>(this.url(`/api/training/assignments/${assignmentId}/submissions`), submission);
    }
    getSubmissionsByAssignmentId(assignmentId: number): Observable<TrainingSubmission[]> {
      return this.http.get<TrainingSubmission[]>(this.url(`/api/training/assignments/${assignmentId}/submissions`));
    }
    getSubmissionById(id: number): Observable<TrainingSubmission> {
      return this.http.get<TrainingSubmission>(this.url(`/api/training/submissions/${id}`));
    }
    gradeTrainingSubmission(id: number, grade: number, feedback?: string): Observable<TrainingSubmission> {
      return this.http.put<TrainingSubmission>(this.url(`/api/training/submissions/${id}/grade`), { grade, feedback });
    }
    getStatistics(): Observable<TrainingStatistics> {
      return this.http.get<TrainingStatistics>(this.url('/api/training/statistics'));
    }
    getTrainingCourseStatistics(courseId: number): Observable<any> {
      return this.http.get<any>(this.url(`/api/training/courses/${courseId}/statistics`));
    }
  };
}

type Constructor<T = {}> = new (...args: any[]) => T;