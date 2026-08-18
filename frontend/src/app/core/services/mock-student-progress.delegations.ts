import { Observable } from 'rxjs';

import { MockLessonPlannerApiBase, type MockApiCtor } from './mock-lesson-planner-base';
import {
  ApiMessageResponse,
  AssignmentSubmission,
  StudentAssignmentGateState,
  StudentProgressResponse,
  StudentProgressSummary,
} from './mock-lesson-planner-models';

/**
 * studentProgress delegation mixin: every method forwards to the injected
 * MockStudentProgressService instance (see MockLessonPlannerApiBase.studentProgress).
 */
export function withStudentProgress<T extends MockApiCtor>(Base: T) {
  return class extends Base {
    // ===== Student Progress =====
    getStudentProgress(studentId: number): Observable<StudentProgressResponse> {
      return this.studentProgress.getStudentProgress(studentId);
    }

    getStudentSubmissions(
      studentId: number,
      assignmentId?: number,
    ): Observable<AssignmentSubmission[]> {
      return this.studentProgress.getStudentSubmissions(studentId, assignmentId);
    }

    getAssignmentProgress(
      studentId: number,
      assignmentId: number,
    ): Observable<StudentAssignmentGateState> {
      return this.studentProgress.getAssignmentProgress(studentId, assignmentId);
    }

    registerAssignmentListenCompletion(
      studentId: number,
      assignmentId: number,
      instructionAudioVersion?: string,
    ): Observable<StudentAssignmentGateState> {
      return this.studentProgress.registerAssignmentListenCompletion(
        studentId,
        assignmentId,
        instructionAudioVersion,
      );
    }

    submitAssignment(
      studentId: number,
      assignmentId: number,
      payload: FormData,
    ): Observable<AssignmentSubmission> {
      return this.studentProgress.submitAssignment(studentId, assignmentId, payload);
    }

    uploadSubmissionFile(
      studentId: number,
      submissionId: number,
      payload: FormData,
    ): Observable<AssignmentSubmission> {
      return this.studentProgress.uploadSubmissionFile(studentId, submissionId, payload);
    }

    getProgressSummary(studentId: number): Observable<StudentProgressSummary> {
      return this.studentProgress.getProgressSummary(studentId);
    }

    syncFromSubmission(submissionId: number): Observable<ApiMessageResponse> {
      return this.studentProgress.syncFromSubmission(submissionId);
    }
  };
}
