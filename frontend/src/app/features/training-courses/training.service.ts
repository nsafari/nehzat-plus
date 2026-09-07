import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { LESSON_PLANNER_API } from '../../core/services/lesson-planner-api.token';
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
  private api = inject(LESSON_PLANNER_API);

  getCourses(): Observable<TrainingCourse[]> {
    return this.api.getTrainingCourses();
  }

  getCourseById(id: number): Observable<TrainingCourse> {
    return this.api.getTrainingCourseById(id);
  }

  createCourse(course: Partial<TrainingCourse>): Observable<TrainingCourse> {
    return this.api.createTrainingCourse(course);
  }

  updateCourse(id: number, course: Partial<TrainingCourse>): Observable<TrainingCourse> {
    return this.api.updateTrainingCourse(id, course);
  }

  deleteCourse(id: number): Observable<void> {
    return this.api.deleteTrainingCourse(id);
  }

  searchCourses(query: string, page: number = 1, pageSize: number = 10): Observable<any> {
    return this.api.searchCourses(query, page, pageSize);
  }

  filterCoursesByStatus(status: string): Observable<TrainingCourse[]> {
    return this.api.filterCoursesByStatus(status);
  }

  filterCoursesByYear(academicYear: string): Observable<TrainingCourse[]> {
    return this.api.filterCoursesByYear(academicYear);
  }

  getStagesByCourseId(courseId: number): Observable<TrainingStage[]> {
    return this.api.getStagesByCourseId(courseId);
  }

  createStage(courseId: number, stage: Partial<TrainingStage>): Observable<TrainingStage> {
    return this.api.createStage(courseId, stage);
  }

  getStageById(id: number): Observable<TrainingStage> {
    return this.api.getStageById(id);
  }

  updateStage(id: number, stage: Partial<TrainingStage>): Observable<TrainingStage> {
    return this.api.updateStage(id, stage);
  }

  deleteStage(id: number): Observable<void> {
    return this.api.deleteStage(id);
  }

  getSessionsByStageId(stageId: number): Observable<TrainingSession[]> {
    return this.api.getSessionsByStageId(stageId);
  }

  createSession(stageId: number, session: Partial<TrainingSession>): Observable<TrainingSession> {
    return this.api.createSession(stageId, session);
  }

  getSessionById(id: number): Observable<TrainingSession> {
    return this.api.getSessionById(id);
  }

  updateSession(id: number, session: Partial<TrainingSession>): Observable<TrainingSession> {
    return this.api.updateSession(id, session);
  }

  deleteSession(id: number): Observable<void> {
    return this.api.deleteSession(id);
  }

  getContentsBySessionId(sessionId: number): Observable<TrainingContent[]> {
    return this.api.getContentsBySessionId(sessionId);
  }

  createContent(sessionId: number, content: Partial<TrainingContent>): Observable<TrainingContent> {
    return this.api.createContent(sessionId, content);
  }

  getContentById(id: number): Observable<TrainingContent> {
    return this.api.getContentById(id);
  }

  updateContent(id: number, content: Partial<TrainingContent>): Observable<TrainingContent> {
    return this.api.updateContent(id, content);
  }

  deleteContent(id: number): Observable<void> {
    return this.api.deleteContent(id);
  }

  uploadContent(sessionId: number, file: File): Observable<TrainingContent> {
    return this.api.uploadContent(sessionId, file);
  }

  createEnrollment(enrollment: { userId: number; courseId: number }): Observable<TrainingEnrollment> {
    return this.api.createEnrollment(enrollment);
  }

  getEnrollmentById(id: number): Observable<TrainingEnrollment> {
    return this.api.getEnrollmentById(id);
  }

  getEnrollmentsByCourseId(courseId: number): Observable<TrainingEnrollment[]> {
    return this.api.getEnrollmentsByCourseId(courseId);
  }

  getEnrollmentsByUserId(userId: number): Observable<TrainingEnrollment[]> {
    return this.api.getEnrollmentsByUserId(userId);
  }

  updateEnrollmentStatus(id: number, status: string): Observable<TrainingEnrollment> {
    return this.api.updateEnrollmentStatus(id, status);
  }

  deleteEnrollment(id: number): Observable<void> {
    return this.api.deleteEnrollment(id);
  }

  updateProgress(enrollmentId: number, sessionId: number, progress: { status: string; score?: number; notes?: string }): Observable<TrainingProgress> {
    return this.api.updateProgress(enrollmentId, sessionId, progress);
  }

  getProgressByEnrollmentId(enrollmentId: number): Observable<TrainingProgress[]> {
    return this.api.getProgressByEnrollmentId(enrollmentId);
  }

  getProgressBySessionId(sessionId: number): Observable<TrainingProgress[]> {
    return this.api.getProgressBySessionId(sessionId);
  }

  getAssignmentsBySessionId(sessionId: number): Observable<TrainingAssignment[]> {
    return this.api.getAssignmentsBySessionId(sessionId);
  }

  createAssignment(sessionId: number, assignment: Partial<TrainingAssignment>): Observable<TrainingAssignment> {
    return this.api.createAssignment(sessionId, assignment);
  }

  getAssignmentById(id: number): Observable<TrainingAssignment> {
    return this.api.getTrainingAssignmentById(id);
  }

  updateAssignment(id: number, assignment: Partial<TrainingAssignment>): Observable<TrainingAssignment> {
    return this.api.updateAssignment(id, assignment);
  }

  deleteAssignment(id: number): Observable<void> {
    return this.api.deleteAssignment(id);
  }

  createSubmission(assignmentId: number, submission: { content?: string; fileUrl?: string }): Observable<TrainingSubmission> {
    return this.api.createSubmission(assignmentId, submission);
  }

  getSubmissionsByAssignmentId(assignmentId: number): Observable<TrainingSubmission[]> {
    return this.api.getSubmissionsByAssignmentId(assignmentId);
  }

  getSubmissionById(id: number): Observable<TrainingSubmission> {
    return this.api.getSubmissionById(id);
  }

  gradeSubmission(id: number, grade: number, feedback?: string): Observable<TrainingSubmission> {
    return this.api.gradeTrainingSubmission(id, grade, feedback);
  }

  getStatistics(): Observable<TrainingStatistics> {
    return this.api.getStatistics();
  }

  getCourseStatistics(courseId: number): Observable<any> {
    return this.api.getTrainingCourseStatistics(courseId);
  }
}