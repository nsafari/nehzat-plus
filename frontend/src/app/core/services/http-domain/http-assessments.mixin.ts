import { Constructor, HttpServiceContext } from './base';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import {
  ApiMessageResponse,
  Assessment,
  AssessmentAnalytics,
  AssessmentQuestion,
  AssessmentQuestionPayload,
  AssessmentResult,
  GenerateWeeklyAssessmentPayload,
  StudentAssessmentHistory,
  StudentProgressSummary,
  SubmitAssessmentResultPayload,
} from '../../models/lesson-planner.models';

export function WithAssessments<TBase extends Constructor<HttpServiceContext>>(Base: TBase) {
  return class extends Base {
    getAssessments(): Observable<Assessment[]> {
      return this.http.get<Assessment[]>(this.url('/assessments'));
    }

    getAssessmentById(id: number): Observable<Assessment> {
      return this.http.get<Assessment>(this.url(`/assessments/${id}`));
    }

    getAssessmentsByCourse(courseId: number): Observable<Assessment[]> {
      return this.http.get<Assessment[]>(this.url(`/assessments/course/${courseId}`));
    }

    getAssessmentsByDateRange(
      courseId: number,
      startDate: string,
      endDate: string,
    ): Observable<Assessment[]> {
      const params = new HttpParams().set('startDate', startDate).set('endDate', endDate);
      return this.http.get<Assessment[]>(this.url(`/assessments/course/${courseId}/date-range`), {
        params,
      });
    }

    createAssessment(payload: Partial<Assessment>): Observable<Assessment> {
      return this.http.post<Assessment>(this.url('/assessments'), payload);
    }

    updateAssessment(id: number, payload: Partial<Assessment>): Observable<Assessment> {
      return this.http.put<Assessment>(this.url(`/assessments/${id}`), payload);
    }

    deleteAssessment(id: number): Observable<ApiMessageResponse> {
      return this.http.delete<ApiMessageResponse>(this.url(`/assessments/${id}`));
    }

    generateWeeklyAssessment(payload: GenerateWeeklyAssessmentPayload): Observable<Assessment> {
      return this.http.post<Assessment>(this.url('/assessments/generate-weekly'), payload);
    }

    getAssessmentQuestions(assessmentId: number): Observable<AssessmentQuestion[]> {
      return this.http.get<AssessmentQuestion[]>(
        this.url(`/assessments/${assessmentId}/questions`),
      );
    }

    createAssessmentQuestion(
      assessmentId: number,
      payload: AssessmentQuestionPayload,
    ): Observable<AssessmentQuestion> {
      return this.http.post<AssessmentQuestion>(
        this.url(`/assessments/${assessmentId}/questions`),
        payload,
      );
    }

    updateAssessmentQuestion(
      questionId: number,
      payload: AssessmentQuestionPayload,
    ): Observable<AssessmentQuestion> {
      return this.http.put<AssessmentQuestion>(
        this.url(`/assessments/questions/${questionId}`),
        payload,
      );
    }

    deleteAssessmentQuestion(questionId: number): Observable<ApiMessageResponse> {
      return this.http.delete<ApiMessageResponse>(this.url(`/assessments/questions/${questionId}`));
    }

    submitAssessmentResult(
      assessmentId: number,
      payload: SubmitAssessmentResultPayload,
    ): Observable<AssessmentResult> {
      return this.http.post<AssessmentResult>(
        this.url(`/assessments/${assessmentId}/submit`),
        payload,
      );
    }

    startAssessment(assessmentId: number, studentId: number): Observable<AssessmentResult> {
      return this.http.post<AssessmentResult>(
        this.url(`/assessments/${assessmentId}/start/${studentId}`),
        {},
      );
    }

    getAssessmentResults(assessmentId: number): Observable<AssessmentResult[]> {
      return this.http.get<AssessmentResult[]>(this.url(`/assessments/${assessmentId}/results`));
    }

    getStudentAssessmentResults(studentId: number): Observable<AssessmentResult[]> {
      return this.http.get<AssessmentResult[]>(
        this.url(`/assessments/student/${studentId}/results`),
      );
    }

    getAssessmentAnalytics(assessmentId: number): Observable<AssessmentAnalytics> {
      return this.http.get<AssessmentAnalytics>(this.url(`/assessments/${assessmentId}/analytics`));
    }

    getStudentAssessmentHistory(
      studentId: number,
      courseId: number,
    ): Observable<StudentAssessmentHistory> {
      return this.http.get<StudentAssessmentHistory>(
        this.url(`/assessments/student/${studentId}/course/${courseId}/history`),
      );
    }
  };
}
