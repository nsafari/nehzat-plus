import { Observable } from 'rxjs';

import { MockLessonPlannerApiBase, type MockApiCtor } from './mock-lesson-planner-base';
import {
  ApiMessageResponse,
  Assessment,
  AssessmentAnalytics,
  AssessmentQuestion,
  AssessmentQuestionPayload,
  AssessmentResult,
  GenerateWeeklyAssessmentPayload,
  StudentAssessmentHistory,
  SubmitAssessmentResultPayload,
} from './mock-lesson-planner-models';

/**
 * assessments delegation mixin: every method forwards to the injected
 * MockAssessmentsService instance (see MockLessonPlannerApiBase.assessments).
 */
export function withAssessments<T extends MockApiCtor>(Base: T) {
  return class extends Base {
    // ===== Assessments =====
    getAssessments(): Observable<Assessment[]> {
      return this.assessments.getAssessments();
    }

    getAssessmentById(id: number): Observable<Assessment> {
      return this.assessments.getAssessmentById(id);
    }

    getAssessmentsByCourse(courseId: number): Observable<Assessment[]> {
      return this.assessments.getAssessmentsByCourse(courseId);
    }

    getAssessmentsByDateRange(
      courseId: number,
      startDate: string,
      endDate: string,
    ): Observable<Assessment[]> {
      return this.assessments.getAssessmentsByDateRange(courseId, startDate, endDate);
    }

    createAssessment(payload: Partial<Assessment>): Observable<Assessment> {
      return this.assessments.createAssessment(payload);
    }

    updateAssessment(id: number, payload: Partial<Assessment>): Observable<Assessment> {
      return this.assessments.updateAssessment(id, payload);
    }

    deleteAssessment(id: number): Observable<ApiMessageResponse> {
      return this.assessments.deleteAssessment(id);
    }

    generateWeeklyAssessment(payload: GenerateWeeklyAssessmentPayload): Observable<Assessment> {
      return this.assessments.generateWeeklyAssessment(payload);
    }

    // ===== Assessment Questions =====
    getAssessmentQuestions(assessmentId: number): Observable<AssessmentQuestion[]> {
      return this.assessments.getAssessmentQuestions(assessmentId);
    }

    createAssessmentQuestion(
      assessmentId: number,
      payload: AssessmentQuestionPayload,
    ): Observable<AssessmentQuestion> {
      return this.assessments.createAssessmentQuestion(assessmentId, payload);
    }

    updateAssessmentQuestion(
      questionId: number,
      payload: AssessmentQuestionPayload,
    ): Observable<AssessmentQuestion> {
      return this.assessments.updateAssessmentQuestion(questionId, payload);
    }

    deleteAssessmentQuestion(questionId: number): Observable<ApiMessageResponse> {
      return this.assessments.deleteAssessmentQuestion(questionId);
    }

    // ===== Assessment Results =====
    submitAssessmentResult(
      assessmentId: number,
      payload: SubmitAssessmentResultPayload,
    ): Observable<AssessmentResult> {
      return this.assessments.submitAssessmentResult(assessmentId, payload);
    }

    startAssessment(assessmentId: number, studentId: number): Observable<AssessmentResult> {
      return this.assessments.startAssessment(assessmentId, studentId);
    }

    getAssessmentResults(assessmentId: number): Observable<AssessmentResult[]> {
      return this.assessments.getAssessmentResults(assessmentId);
    }

    getStudentAssessmentResults(studentId: number): Observable<AssessmentResult[]> {
      return this.assessments.getStudentAssessmentResults(studentId);
    }

    getAssessmentAnalytics(assessmentId: number): Observable<AssessmentAnalytics> {
      return this.assessments.getAssessmentAnalytics(assessmentId);
    }

    getStudentAssessmentHistory(
      studentId: number,
      courseId: number,
    ): Observable<StudentAssessmentHistory> {
      return this.assessments.getStudentAssessmentHistory(studentId, courseId);
    }
  };
}
