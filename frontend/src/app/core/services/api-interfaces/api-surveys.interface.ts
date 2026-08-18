import { Observable } from 'rxjs';

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
} from '../../models/lesson-planner.models';

export abstract class SurveysApi {
  abstract getIssueSurveys(): Observable<IssueSurvey[]>;
  abstract getIssueSurveyById(id: number): Observable<IssueSurvey>;
  abstract createIssueSurvey(payload: CreateIssueSurveyPayload): Observable<IssueSurvey>;
  abstract updateIssueSurvey(
    id: number,
    payload: UpdateIssueSurveyPayload,
  ): Observable<IssueSurvey>;
  abstract deleteIssueSurvey(id: number): Observable<ApiMessageResponse>;
  abstract publishIssueSurvey(id: number): Observable<IssueSurvey>;
  abstract closeIssueSurvey(id: number): Observable<IssueSurvey>;
  abstract duplicateIssueSurvey(id: number): Observable<IssueSurvey>;

  abstract getIssueSurveyQuestions(surveyId: number): Observable<IssueSurveyQuestion[]>;
  abstract createIssueSurveyQuestion(
    surveyId: number,
    payload: CreateIssueQuestionPayload,
  ): Observable<IssueSurveyQuestion>;
  abstract updateIssueSurveyQuestion(
    surveyId: number,
    questionId: number,
    payload: Partial<CreateIssueQuestionPayload>,
  ): Observable<IssueSurveyQuestion>;
  abstract deleteIssueSurveyQuestion(
    surveyId: number,
    questionId: number,
  ): Observable<ApiMessageResponse>;
  abstract reorderIssueQuestions(surveyId: number, questionIds: number[]): Observable<void>;

  abstract getIssueSurveysForRespond(surveyId: number): Observable<IssueSurvey>;
  abstract submitSurveyResponses(
    surveyId: number,
    payload: SubmitSurveyResponsePayload,
  ): Observable<IssueSurveyResponse[]>;

  abstract getSurveyAnalytics(surveyId: number): Observable<SurveyAnalytics>;
  abstract getSurveyCategoryBreakdown(surveyId: number): Observable<CategoryAnalytics[]>;
  abstract getSurveyTrends(): Observable<any[]>;
  abstract exportSurveyJson(surveyId: number): Observable<any[]>;

  abstract getSurveyComments(surveyId: number): Observable<IssueSurveyComment[]>;
  abstract addSurveyComment(
    surveyId: number,
    payload: { comment: string },
  ): Observable<IssueSurveyComment>;

  abstract getSurveyActions(surveyId: number): Observable<IssueAction[]>;
  abstract createSurveyAction(
    surveyId: number,
    payload: CreateIssueActionPayload,
  ): Observable<IssueAction>;
  abstract updateIssueAction(id: number, payload: Partial<IssueAction>): Observable<IssueAction>;
  abstract updateIssueActionStatus(
    id: number,
    status: string,
    updatedById: number,
    note?: string,
    progressPercent?: number,
  ): Observable<IssueAction>;

  abstract getIssueItemPool(category?: string): Observable<IssueItemPool[]>;
  abstract createIssueItemPool(payload: CreateIssueItemPoolPayload): Observable<IssueItemPool>;
  abstract addPoolItemToSurvey(
    poolItemId: number,
    surveyId: number,
    sortOrder?: number,
  ): Observable<IssueItemPool>;

  abstract getIssueDashboardSummary(): Observable<IssueDashboardSummary>;

  abstract getServiceSurveys(targetRole?: string): Observable<ServiceSurvey[]>;
  abstract getServiceSurveyById(id: number): Observable<ServiceSurvey>;
  abstract createServiceSurvey(payload: CreateServiceSurveyPayload): Observable<ServiceSurvey>;
  abstract updateServiceSurvey(
    id: number,
    payload: UpdateServiceSurveyPayload,
  ): Observable<ServiceSurvey>;
  abstract deleteServiceSurvey(id: number): Observable<ApiMessageResponse>;
  abstract publishServiceSurvey(id: number): Observable<ServiceSurvey>;
  abstract closeServiceSurvey(id: number): Observable<ServiceSurvey>;

  abstract getServiceSurveyQuestions(surveyId: number): Observable<ServiceSurveyQuestion[]>;
  abstract createServiceQuestion(
    surveyId: number,
    payload: CreateServiceQuestionPayload,
  ): Observable<ServiceSurveyQuestion>;
  abstract deleteServiceQuestion(
    surveyId: number,
    questionId: number,
  ): Observable<ApiMessageResponse>;

  abstract getServiceSurveyResponses(surveyId: number): Observable<ServiceSurveyResponse[]>;
  abstract submitServiceSurveyResponse(
    payload: SubmitServiceSurveyPayload,
  ): Observable<ServiceSurveyResponse>;

  abstract getServiceSurveyAnalytics(surveyId: number): Observable<ServiceSurveyAnalytics>;
  abstract getServiceDashboardSummary(): Observable<ServiceDashboardSummary>;
}
