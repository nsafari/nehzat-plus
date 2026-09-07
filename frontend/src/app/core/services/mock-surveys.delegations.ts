import { Observable } from 'rxjs';

import { MockLessonPlannerApiBase, type MockApiCtor } from './mock-lesson-planner-base';
import {
  ApiMessageResponse,
  CategoryAnalytics,
  CreateIssueActionPayload,
  CreateIssueItemPoolPayload,
  CreateIssueQuestionPayload,
  CreateIssueSurveyPayload,
  CreateServiceQuestionPayload,
  CreateServiceSurveyPayload,
  IssueAction,
  IssueDashboardSummary,
  IssueItemPool,
  IssueSurvey,
  IssueSurveyComment,
  IssueSurveyQuestion,
  IssueSurveyResponse,
  ServiceDashboardSummary,
  ServiceSurvey,
  ServiceSurveyAnalytics,
  ServiceSurveyQuestion,
  ServiceSurveyResponse,
  SubmitServiceSurveyPayload,
  SubmitSurveyResponsePayload,
  SurveyAnalytics,
  UpdateIssueSurveyPayload,
  UpdateServiceSurveyPayload,
} from './mock-lesson-planner-models';

/**
 * surveys delegation mixin: every method forwards to the injected
 * MockSurveysService instance (see MockLessonPlannerApiBase.surveys).
 */
export function withSurveys<T extends MockApiCtor>(Base: T) {
  return class extends Base {
    // ===== Issue Surveys =====
    getIssueSurveys(): Observable<IssueSurvey[]> {
      return this.surveys.getIssueSurveys();
    }

    getIssueSurveyById(id: number): Observable<IssueSurvey> {
      return this.surveys.getIssueSurveyById(id);
    }

    createIssueSurvey(payload: CreateIssueSurveyPayload): Observable<IssueSurvey> {
      return this.surveys.createIssueSurvey(payload);
    }

    updateIssueSurvey(id: number, payload: UpdateIssueSurveyPayload): Observable<IssueSurvey> {
      return this.surveys.updateIssueSurvey(id, payload);
    }

    deleteIssueSurvey(id: number): Observable<ApiMessageResponse> {
      return this.surveys.deleteIssueSurvey(id);
    }

    publishIssueSurvey(id: number): Observable<IssueSurvey> {
      return this.surveys.publishIssueSurvey(id);
    }

    closeIssueSurvey(id: number): Observable<IssueSurvey> {
      return this.surveys.closeIssueSurvey(id);
    }

    duplicateIssueSurvey(id: number): Observable<IssueSurvey> {
      return this.surveys.duplicateIssueSurvey(id);
    }

    // ===== Issue Survey Questions =====
    getIssueSurveyQuestions(surveyId: number): Observable<IssueSurveyQuestion[]> {
      return this.surveys.getIssueSurveyQuestions(surveyId);
    }

    createIssueSurveyQuestion(
      surveyId: number,
      payload: CreateIssueQuestionPayload,
    ): Observable<IssueSurveyQuestion> {
      return this.surveys.createIssueSurveyQuestion(surveyId, payload);
    }

    updateIssueSurveyQuestion(
      surveyId: number,
      questionId: number,
      payload: Partial<CreateIssueQuestionPayload>,
    ): Observable<IssueSurveyQuestion> {
      return this.surveys.updateIssueSurveyQuestion(surveyId, questionId, payload);
    }

    deleteIssueSurveyQuestion(
      surveyId: number,
      questionId: number,
    ): Observable<ApiMessageResponse> {
      return this.surveys.deleteIssueSurveyQuestion(surveyId, questionId);
    }

    reorderIssueQuestions(surveyId: number, questionIds: number[]): Observable<void> {
      return this.surveys.reorderIssueQuestions(surveyId, questionIds);
    }

    // ===== Issue Survey Responses =====
    getIssueSurveysForRespond(surveyId: number): Observable<IssueSurvey> {
      return this.surveys.getIssueSurveysForRespond(surveyId);
    }

    submitSurveyResponses(
      surveyId: number,
      payload: SubmitSurveyResponsePayload,
    ): Observable<IssueSurveyResponse[]> {
      return this.surveys.submitSurveyResponses(surveyId, payload);
    }

    // ===== Survey Analytics =====
    getSurveyAnalytics(surveyId: number): Observable<SurveyAnalytics> {
      return this.surveys.getSurveyAnalytics(surveyId);
    }

    getSurveyCategoryBreakdown(surveyId: number): Observable<CategoryAnalytics[]> {
      return this.surveys.getSurveyCategoryBreakdown(surveyId);
    }

    getSurveyTrends(): Observable<any[]> {
      return this.surveys.getSurveyTrends();
    }

    exportSurveyJson(surveyId: number): Observable<any[]> {
      return this.surveys.exportSurveyJson(surveyId);
    }

    // ===== Survey Comments =====
    getSurveyComments(surveyId: number): Observable<IssueSurveyComment[]> {
      return this.surveys.getSurveyComments(surveyId);
    }

    addSurveyComment(
      surveyId: number,
      payload: { comment: string },
    ): Observable<IssueSurveyComment> {
      return this.surveys.addSurveyComment(surveyId, payload);
    }

    // ===== Survey Actions =====
    getSurveyActions(surveyId: number): Observable<IssueAction[]> {
      return this.surveys.getSurveyActions(surveyId);
    }

    createSurveyAction(
      surveyId: number,
      payload: CreateIssueActionPayload,
    ): Observable<IssueAction> {
      return this.surveys.createSurveyAction(surveyId, payload);
    }

    updateIssueAction(id: number, payload: Partial<IssueAction>): Observable<IssueAction> {
      return this.surveys.updateIssueAction(id, payload);
    }

    updateIssueActionStatus(
      id: number,
      status: string,
      updatedById: number,
      note?: string,
      progressPercent?: number,
    ): Observable<IssueAction> {
      return this.surveys.updateIssueActionStatus(id, status, updatedById, note, progressPercent);
    }

    // ===== Issue Item Pool =====
    getIssueItemPool(category?: string): Observable<IssueItemPool[]> {
      return this.surveys.getIssueItemPool(category);
    }

    createIssueItemPool(payload: CreateIssueItemPoolPayload): Observable<IssueItemPool> {
      return this.surveys.createIssueItemPool(payload);
    }

    addPoolItemToSurvey(
      poolItemId: number,
      surveyId: number,
      sortOrder?: number,
    ): Observable<IssueItemPool> {
      return this.surveys.addPoolItemToSurvey(poolItemId, surveyId, sortOrder);
    }

    // ===== Issue Dashboard =====
    getIssueDashboardSummary(): Observable<IssueDashboardSummary> {
      return this.surveys.getIssueDashboardSummary();
    }

    // ===== Service Surveys =====
    getServiceSurveys(targetRole?: string): Observable<ServiceSurvey[]> {
      return this.surveys.getServiceSurveys(targetRole);
    }

    getServiceSurveyById(id: number): Observable<ServiceSurvey> {
      return this.surveys.getServiceSurveyById(id);
    }

    createServiceSurvey(payload: CreateServiceSurveyPayload): Observable<ServiceSurvey> {
      return this.surveys.createServiceSurvey(payload);
    }

    updateServiceSurvey(
      id: number,
      payload: UpdateServiceSurveyPayload,
    ): Observable<ServiceSurvey> {
      return this.surveys.updateServiceSurvey(id, payload);
    }

    deleteServiceSurvey(id: number): Observable<ApiMessageResponse> {
      return this.surveys.deleteServiceSurvey(id);
    }

    publishServiceSurvey(id: number): Observable<ServiceSurvey> {
      return this.surveys.publishServiceSurvey(id);
    }

    closeServiceSurvey(id: number): Observable<ServiceSurvey> {
      return this.surveys.closeServiceSurvey(id);
    }

    // ===== Service Survey Questions =====
    getServiceSurveyQuestions(surveyId: number): Observable<ServiceSurveyQuestion[]> {
      return this.surveys.getServiceSurveyQuestions(surveyId);
    }

    createServiceQuestion(
      surveyId: number,
      payload: CreateServiceQuestionPayload,
    ): Observable<ServiceSurveyQuestion> {
      return this.surveys.createServiceQuestion(surveyId, payload);
    }

    deleteServiceQuestion(surveyId: number, questionId: number): Observable<ApiMessageResponse> {
      return this.surveys.deleteServiceQuestion(surveyId, questionId);
    }

    // ===== Service Survey Responses =====
    getServiceSurveyResponses(surveyId: number): Observable<ServiceSurveyResponse[]> {
      return this.surveys.getServiceSurveyResponses(surveyId);
    }

    submitServiceSurveyResponse(
      payload: SubmitServiceSurveyPayload,
    ): Observable<ServiceSurveyResponse> {
      return this.surveys.submitServiceSurveyResponse(payload);
    }

    // ===== Service Survey Analytics =====
    getServiceSurveyAnalytics(surveyId: number): Observable<ServiceSurveyAnalytics> {
      return this.surveys.getServiceSurveyAnalytics(surveyId);
    }

    getServiceDashboardSummary(): Observable<ServiceDashboardSummary> {
      return this.surveys.getServiceDashboardSummary();
    }
  };
}
