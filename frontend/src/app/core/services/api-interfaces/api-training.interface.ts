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

export abstract class TrainingApi {
  abstract getTrainingCourses(): Observable<TrainingCourse[]>;
  abstract getTrainingCourseById(id: number): Observable<TrainingCourse>;
  abstract createTrainingCourse(course: Partial<TrainingCourse>): Observable<TrainingCourse>;
  abstract updateTrainingCourse(id: number, course: Partial<TrainingCourse>): Observable<TrainingCourse>;
  abstract deleteTrainingCourse(id: number): Observable<void>;
  abstract searchCourses(query: string, page?: number, pageSize?: number): Observable<any>;
  abstract filterCoursesByStatus(status: string): Observable<TrainingCourse[]>;
  abstract filterCoursesByYear(academicYear: string): Observable<TrainingCourse[]>;
  abstract getStagesByCourseId(courseId: number): Observable<TrainingStage[]>;
  abstract createStage(courseId: number, stage: Partial<TrainingStage>): Observable<TrainingStage>;
  abstract getStageById(id: number): Observable<TrainingStage>;
  abstract updateStage(id: number, stage: Partial<TrainingStage>): Observable<TrainingStage>;
  abstract deleteStage(id: number): Observable<void>;
  abstract getSessionsByStageId(stageId: number): Observable<TrainingSession[]>;
  abstract createSession(stageId: number, session: Partial<TrainingSession>): Observable<TrainingSession>;
  abstract getSessionById(id: number): Observable<TrainingSession>;
  abstract updateSession(id: number, session: Partial<TrainingSession>): Observable<TrainingSession>;
  abstract deleteSession(id: number): Observable<void>;
  abstract getContentsBySessionId(sessionId: number): Observable<TrainingContent[]>;
  abstract createContent(sessionId: number, content: Partial<TrainingContent>): Observable<TrainingContent>;
  abstract getContentById(id: number): Observable<TrainingContent>;
  abstract updateContent(id: number, content: Partial<TrainingContent>): Observable<TrainingContent>;
  abstract deleteContent(id: number): Observable<void>;
  abstract uploadContent(sessionId: number, file: File): Observable<TrainingContent>;
  abstract createEnrollment(enrollment: { userId: number; courseId: number }): Observable<TrainingEnrollment>;
  abstract getEnrollmentById(id: number): Observable<TrainingEnrollment>;
  abstract getEnrollmentsByCourseId(courseId: number): Observable<TrainingEnrollment[]>;
  abstract getEnrollmentsByUserId(userId: number): Observable<TrainingEnrollment[]>;
  abstract updateEnrollmentStatus(id: number, status: string): Observable<TrainingEnrollment>;
  abstract deleteEnrollment(id: number): Observable<void>;
  abstract updateProgress(enrollmentId: number, sessionId: number, progress: { status: string; score?: number; notes?: string }): Observable<TrainingProgress>;
  abstract getProgressByEnrollmentId(enrollmentId: number): Observable<TrainingProgress[]>;
  abstract getProgressBySessionId(sessionId: number): Observable<TrainingProgress[]>;
  abstract getAssignmentsBySessionId(sessionId: number): Observable<TrainingAssignment[]>;
  abstract createAssignment(sessionId: number, assignment: Partial<TrainingAssignment>): Observable<TrainingAssignment>;
  abstract getTrainingAssignmentById(id: number): Observable<TrainingAssignment>;
  abstract updateAssignment(id: number, assignment: Partial<TrainingAssignment>): Observable<TrainingAssignment>;
  abstract deleteAssignment(id: number): Observable<void>;
  abstract createSubmission(assignmentId: number, submission: { content?: string; fileUrl?: string }): Observable<TrainingSubmission>;
  abstract getSubmissionsByAssignmentId(assignmentId: number): Observable<TrainingSubmission[]>;
  abstract getSubmissionById(id: number): Observable<TrainingSubmission>;
  abstract gradeTrainingSubmission(id: number, grade: number, feedback?: string): Observable<TrainingSubmission>;
  abstract getStatistics(): Observable<TrainingStatistics>;
  abstract getTrainingCourseStatistics(courseId: number): Observable<any>;
}