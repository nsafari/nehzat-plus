import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  TrainingCourse,
  TrainingStage,
  TrainingSession,
  TrainingContent,
  TrainingEnrollment,
  TrainingProgress,
  TrainingAssignment,
  TrainingSubmission,
  TrainingStatistics
} from './training.models';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/training`;

  getCourses(): Observable<TrainingCourse[]> {
    return this.http.get<TrainingCourse[]>(`${this.apiUrl}/courses`);
  }

  getCourseById(id: number): Observable<TrainingCourse> {
    return this.http.get<TrainingCourse>(`${this.apiUrl}/courses/${id}`);
  }

  createCourse(course: Partial<TrainingCourse>): Observable<TrainingCourse> {
    return this.http.post<TrainingCourse>(`${this.apiUrl}/courses`, course);
  }

  updateCourse(id: number, course: Partial<TrainingCourse>): Observable<TrainingCourse> {
    return this.http.put<TrainingCourse>(`${this.apiUrl}/courses/${id}`, course);
  }

  deleteCourse(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/courses/${id}`);
  }

  searchCourses(query: string, page: number = 1, pageSize: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('q', query)
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<any>(`${this.apiUrl}/courses/search`, { params });
  }

  filterCoursesByStatus(status: string): Observable<TrainingCourse[]> {
    return this.http.get<TrainingCourse[]>(`${this.apiUrl}/courses/filter/status`, {
      params: new HttpParams().set('status', status)
    });
  }

  filterCoursesByYear(academicYear: string): Observable<TrainingCourse[]> {
    return this.http.get<TrainingCourse[]>(`${this.apiUrl}/courses/filter/year`, {
      params: new HttpParams().set('academicYear', academicYear)
    });
  }

  getStagesByCourseId(courseId: number): Observable<TrainingStage[]> {
    return this.http.get<TrainingStage[]>(`${this.apiUrl}/courses/${courseId}/stages`);
  }

  createStage(courseId: number, stage: Partial<TrainingStage>): Observable<TrainingStage> {
    return this.http.post<TrainingStage>(`${this.apiUrl}/courses/${courseId}/stages`, stage);
  }

  getStageById(id: number): Observable<TrainingStage> {
    return this.http.get<TrainingStage>(`${this.apiUrl}/stages/${id}`);
  }

  updateStage(id: number, stage: Partial<TrainingStage>): Observable<TrainingStage> {
    return this.http.put<TrainingStage>(`${this.apiUrl}/stages/${id}`, stage);
  }

  deleteStage(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/stages/${id}`);
  }

  getSessionsByStageId(stageId: number): Observable<TrainingSession[]> {
    return this.http.get<TrainingSession[]>(`${this.apiUrl}/stages/${stageId}/sessions`);
  }

  createSession(stageId: number, session: Partial<TrainingSession>): Observable<TrainingSession> {
    return this.http.post<TrainingSession>(`${this.apiUrl}/stages/${stageId}/sessions`, session);
  }

  getSessionById(id: number): Observable<TrainingSession> {
    return this.http.get<TrainingSession>(`${this.apiUrl}/sessions/${id}`);
  }

  updateSession(id: number, session: Partial<TrainingSession>): Observable<TrainingSession> {
    return this.http.put<TrainingSession>(`${this.apiUrl}/sessions/${id}`, session);
  }

  deleteSession(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/sessions/${id}`);
  }

  getContentsBySessionId(sessionId: number): Observable<TrainingContent[]> {
    return this.http.get<TrainingContent[]>(`${this.apiUrl}/sessions/${sessionId}/contents`);
  }

  createContent(sessionId: number, content: Partial<TrainingContent>): Observable<TrainingContent> {
    return this.http.post<TrainingContent>(`${this.apiUrl}/sessions/${sessionId}/contents`, content);
  }

  getContentById(id: number): Observable<TrainingContent> {
    return this.http.get<TrainingContent>(`${this.apiUrl}/contents/${id}`);
  }

  updateContent(id: number, content: Partial<TrainingContent>): Observable<TrainingContent> {
    return this.http.put<TrainingContent>(`${this.apiUrl}/contents/${id}`, content);
  }

  deleteContent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/contents/${id}`);
  }

  uploadContent(sessionId: number, file: File): Observable<TrainingContent> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<TrainingContent>(`${this.apiUrl}/sessions/${sessionId}/upload`, formData);
  }

  createEnrollment(enrollment: { userId: number; courseId: number }): Observable<TrainingEnrollment> {
    return this.http.post<TrainingEnrollment>(`${this.apiUrl}/enrollments`, enrollment);
  }

  getEnrollmentById(id: number): Observable<TrainingEnrollment> {
    return this.http.get<TrainingEnrollment>(`${this.apiUrl}/enrollments/${id}`);
  }

  getEnrollmentsByCourseId(courseId: number): Observable<TrainingEnrollment[]> {
    return this.http.get<TrainingEnrollment[]>(`${this.apiUrl}/courses/${courseId}/enrollments`);
  }

  getEnrollmentsByUserId(userId: number): Observable<TrainingEnrollment[]> {
    return this.http.get<TrainingEnrollment[]>(`${this.apiUrl}/users/${userId}/enrollments`);
  }

  updateEnrollmentStatus(id: number, status: string): Observable<TrainingEnrollment> {
    return this.http.put<TrainingEnrollment>(`${this.apiUrl}/enrollments/${id}/status`, JSON.stringify(status), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  deleteEnrollment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/enrollments/${id}`);
  }

  updateProgress(enrollmentId: number, sessionId: number, progress: { status: string; score?: number; notes?: string }): Observable<TrainingProgress> {
    return this.http.put<TrainingProgress>(`${this.apiUrl}/enrollments/${enrollmentId}/sessions/${sessionId}/progress`, progress);
  }

  getProgressByEnrollmentId(enrollmentId: number): Observable<TrainingProgress[]> {
    return this.http.get<TrainingProgress[]>(`${this.apiUrl}/enrollments/${enrollmentId}/progress`);
  }

  getProgressBySessionId(sessionId: number): Observable<TrainingProgress[]> {
    return this.http.get<TrainingProgress[]>(`${this.apiUrl}/sessions/${sessionId}/progress`);
  }

  getAssignmentsBySessionId(sessionId: number): Observable<TrainingAssignment[]> {
    return this.http.get<TrainingAssignment[]>(`${this.apiUrl}/sessions/${sessionId}/assignments`);
  }

  createAssignment(sessionId: number, assignment: Partial<TrainingAssignment>): Observable<TrainingAssignment> {
    return this.http.post<TrainingAssignment>(`${this.apiUrl}/sessions/${sessionId}/assignments`, assignment);
  }

  getAssignmentById(id: number): Observable<TrainingAssignment> {
    return this.http.get<TrainingAssignment>(`${this.apiUrl}/assignments/${id}`);
  }

  updateAssignment(id: number, assignment: Partial<TrainingAssignment>): Observable<TrainingAssignment> {
    return this.http.put<TrainingAssignment>(`${this.apiUrl}/assignments/${id}`, assignment);
  }

  deleteAssignment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/assignments/${id}`);
  }

  createSubmission(assignmentId: number, submission: { content?: string; fileUrl?: string }): Observable<TrainingSubmission> {
    return this.http.post<TrainingSubmission>(`${this.apiUrl}/assignments/${assignmentId}/submissions`, submission);
  }

  getSubmissionsByAssignmentId(assignmentId: number): Observable<TrainingSubmission[]> {
    return this.http.get<TrainingSubmission[]>(`${this.apiUrl}/assignments/${assignmentId}/submissions`);
  }

  getSubmissionById(id: number): Observable<TrainingSubmission> {
    return this.http.get<TrainingSubmission>(`${this.apiUrl}/submissions/${id}`);
  }

  gradeSubmission(id: number, grade: number, feedback?: string): Observable<TrainingSubmission> {
    return this.http.put<TrainingSubmission>(`${this.apiUrl}/submissions/${id}/grade`, { grade, feedback });
  }

  getStatistics(): Observable<TrainingStatistics> {
    return this.http.get<TrainingStatistics>(`${this.apiUrl}/statistics`);
  }

  getCourseStatistics(courseId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/courses/${courseId}/statistics`);
  }
}
