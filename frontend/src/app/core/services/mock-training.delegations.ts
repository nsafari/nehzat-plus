import { Observable } from 'rxjs';
import { type MockApiCtor } from './mock-lesson-planner-base';
import { MockTrainingService } from './mock/training.service';
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
} from './mock-lesson-planner-models';

export function withTraining<T extends MockApiCtor>(Base: T) {
  return class extends Base {
    private get _training() { return this.training; }
    getTrainingCourses(): Observable<TrainingCourse[]> {
      return this._training.getCourses();
    }
    getTrainingCourseById(id: number): Observable<TrainingCourse> {
      return this._training.getCourseById(id);
    }
    createTrainingCourse(course: Partial<TrainingCourse>): Observable<TrainingCourse> {
      return this._training.createCourse(course);
    }
    updateTrainingCourse(id: number, course: Partial<TrainingCourse>): Observable<TrainingCourse> {
      return this._training.updateCourse(id, course);
    }
    deleteTrainingCourse(id: number): Observable<void> {
      return this._training.deleteCourse(id);
    }
    searchCourses(query: string, page: number = 1, pageSize: number = 10): Observable<any> {
      return this._training.searchCourses(query, page, pageSize);
    }
    filterCoursesByStatus(status: string): Observable<TrainingCourse[]> {
      return this._training.filterCoursesByStatus(status);
    }
    filterCoursesByYear(academicYear: string): Observable<TrainingCourse[]> {
      return this._training.filterCoursesByYear(academicYear);
    }
    getStagesByCourseId(courseId: number): Observable<TrainingStage[]> {
      return this._training.getStagesByCourseId(courseId);
    }
    createStage(courseId: number, stage: Partial<TrainingStage>): Observable<TrainingStage> {
      return this._training.createStage(courseId, stage);
    }
    getStageById(id: number): Observable<TrainingStage> {
      return this._training.getStageById(id);
    }
    updateStage(id: number, stage: Partial<TrainingStage>): Observable<TrainingStage> {
      return this._training.updateStage(id, stage);
    }
    deleteStage(id: number): Observable<void> {
      return this._training.deleteStage(id);
    }
    getSessionsByStageId(stageId: number): Observable<TrainingSession[]> {
      return this._training.getSessionsByStageId(stageId);
    }
    createSession(stageId: number, session: Partial<TrainingSession>): Observable<TrainingSession> {
      return this._training.createSession(stageId, session);
    }
    getSessionById(id: number): Observable<TrainingSession> {
      return this._training.getSessionById(id);
    }
    updateSession(id: number, session: Partial<TrainingSession>): Observable<TrainingSession> {
      return this._training.updateSession(id, session);
    }
    deleteSession(id: number): Observable<void> {
      return this._training.deleteSession(id);
    }
    getContentsBySessionId(sessionId: number): Observable<TrainingContent[]> {
      return this._training.getContentsBySessionId(sessionId);
    }
    createContent(sessionId: number, content: Partial<TrainingContent>): Observable<TrainingContent> {
      return this._training.createContent(sessionId, content);
    }
    getContentById(id: number): Observable<TrainingContent> {
      return this._training.getContentById(id);
    }
    updateContent(id: number, content: Partial<TrainingContent>): Observable<TrainingContent> {
      return this._training.updateContent(id, content);
    }
    deleteContent(id: number): Observable<void> {
      return this._training.deleteContent(id);
    }
    uploadContent(sessionId: number, file: File): Observable<TrainingContent> {
      return this._training.uploadContent(sessionId, file);
    }
    createEnrollment(enrollment: { userId: number; courseId: number }): Observable<TrainingEnrollment> {
      return this._training.createEnrollment(enrollment);
    }
    getEnrollmentById(id: number): Observable<TrainingEnrollment> {
      return this._training.getEnrollmentById(id);
    }
    getEnrollmentsByCourseId(courseId: number): Observable<TrainingEnrollment[]> {
      return this._training.getEnrollmentsByCourseId(courseId);
    }
    getEnrollmentsByUserId(userId: number): Observable<TrainingEnrollment[]> {
      return this._training.getEnrollmentsByUserId(userId);
    }
    updateEnrollmentStatus(id: number, status: string): Observable<TrainingEnrollment> {
      return this._training.updateEnrollmentStatus(id, status);
    }
    deleteEnrollment(id: number): Observable<void> {
      return this._training.deleteEnrollment(id);
    }
    updateProgress(enrollmentId: number, sessionId: number, progress: { status: string; score?: number; notes?: string }): Observable<TrainingProgress> {
      return this._training.updateProgress(enrollmentId, sessionId, progress);
    }
    getProgressByEnrollmentId(enrollmentId: number): Observable<TrainingProgress[]> {
      return this._training.getProgressByEnrollmentId(enrollmentId);
    }
    getProgressBySessionId(sessionId: number): Observable<TrainingProgress[]> {
      return this._training.getProgressBySessionId(sessionId);
    }
    getAssignmentsBySessionId(sessionId: number): Observable<TrainingAssignment[]> {
      return this._training.getAssignmentsBySessionId(sessionId);
    }
    createAssignment(sessionId: number, assignment: Partial<TrainingAssignment>): Observable<TrainingAssignment> {
      return this._training.createAssignment(sessionId, assignment);
    }
    getTrainingAssignmentById(id: number): Observable<TrainingAssignment> {
      return this._training.getAssignmentById(id);
    }
    updateAssignment(id: number, assignment: Partial<TrainingAssignment>): Observable<TrainingAssignment> {
      return this._training.updateAssignment(id, assignment);
    }
    deleteAssignment(id: number): Observable<void> {
      return this._training.deleteAssignment(id);
    }
    createSubmission(assignmentId: number, submission: { content?: string; fileUrl?: string }): Observable<TrainingSubmission> {
      return this._training.createSubmission(assignmentId, submission);
    }
    getSubmissionsByAssignmentId(assignmentId: number): Observable<TrainingSubmission[]> {
      return this._training.getSubmissionsByAssignmentId(assignmentId);
    }
    getSubmissionById(id: number): Observable<TrainingSubmission> {
      return this._training.getSubmissionById(id);
    }
    gradeTrainingSubmission(id: number, grade: number, feedback?: string): Observable<TrainingSubmission> {
      return this._training.gradeSubmission(id, grade, feedback);
    }
    getStatistics(): Observable<TrainingStatistics> {
      return this._training.getStatistics();
    }
    getTrainingCourseStatistics(courseId: number): Observable<any> {
      return this._training.getCourseStatistics(courseId);
    }
  };
}