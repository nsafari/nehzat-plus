import { Constructor, HttpServiceContext } from './base';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
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

export function WithSurveys<TBase extends Constructor<HttpServiceContext>>(Base: TBase) {
  return class extends Base {
    getIssueSurveys(): Observable<IssueSurvey[]> {
      return this.http.get<IssueSurvey[]>(this.url('/issue-surveys'));
    }

    getIssueSurveyById(id: number): Observable<IssueSurvey> {
      return this.http.get<IssueSurvey>(this.url(`/issue-surveys/${id}`));
    }

    createIssueSurvey(payload: CreateIssueSurveyPayload): Observable<IssueSurvey> {
      return this.http.post<IssueSurvey>(this.url('/issue-surveys'), payload);
    }

    updateIssueSurvey(id: number, payload: UpdateIssueSurveyPayload): Observable<IssueSurvey> {
      return this.http.put<IssueSurvey>(this.url(`/issue-surveys/${id}`), payload);
    }

    deleteIssueSurvey(id: number): Observable<ApiMessageResponse> {
      return this.http.delete<ApiMessageResponse>(this.url(`/issue-surveys/${id}`));
    }

    publishIssueSurvey(id: number): Observable<IssueSurvey> {
      return this.http.post<IssueSurvey>(this.url(`/issue-surveys/${id}/publish`), {});
    }

    closeIssueSurvey(id: number): Observable<IssueSurvey> {
      return this.http.post<IssueSurvey>(this.url(`/issue-surveys/${id}/close`), {});
    }

    duplicateIssueSurvey(id: number): Observable<IssueSurvey> {
      return this.http.post<IssueSurvey>(this.url(`/issue-surveys/${id}/duplicate`), {});
    }

    getIssueSurveyQuestions(surveyId: number): Observable<IssueSurveyQuestion[]> {
      return this.http.get<IssueSurveyQuestion[]>(this.url(`/issue-surveys/${surveyId}/questions`));
    }

    createIssueSurveyQuestion(
      surveyId: number,
      payload: CreateIssueQuestionPayload,
    ): Observable<IssueSurveyQuestion> {
      return this.http.post<IssueSurveyQuestion>(
        this.url(`/issue-surveys/${surveyId}/questions`),
        payload,
      );
    }

    updateIssueSurveyQuestion(
      surveyId: number,
      questionId: number,
      payload: Partial<CreateIssueQuestionPayload>,
    ): Observable<IssueSurveyQuestion> {
      return this.http.put<IssueSurveyQuestion>(
        this.url(`/issue-surveys/${surveyId}/questions/${questionId}`),
        payload,
      );
    }

    deleteIssueSurveyQuestion(
      surveyId: number,
      questionId: number,
    ): Observable<ApiMessageResponse> {
      return this.http.delete<ApiMessageResponse>(
        this.url(`/issue-surveys/${surveyId}/questions/${questionId}`),
      );
    }

    reorderIssueQuestions(surveyId: number, questionIds: number[]): Observable<void> {
      return this.http.post<void>(
        this.url(`/issue-surveys/${surveyId}/questions/reorder`),
        questionIds,
      );
    }

    getIssueSurveysForRespond(surveyId: number): Observable<IssueSurvey> {
      return this.http.get<IssueSurvey>(this.url(`/issue-surveys/${surveyId}/respond`));
    }

    submitSurveyResponses(
      surveyId: number,
      payload: SubmitSurveyResponsePayload,
    ): Observable<IssueSurveyResponse[]> {
      return this.http.post<IssueSurveyResponse[]>(
        this.url(`/issue-surveys/${surveyId}/respond`),
        payload,
      );
    }

    getSurveyAnalytics(surveyId: number): Observable<SurveyAnalytics> {
      return this.http.get<SurveyAnalytics>(this.url(`/issue-surveys/${surveyId}/analytics`));
    }

    getSurveyCategoryBreakdown(surveyId: number): Observable<CategoryAnalytics[]> {
      return this.http.get<CategoryAnalytics[]>(
        this.url(`/issue-surveys/${surveyId}/analytics/categories`),
      );
    }

    getSurveyTrends(): Observable<any[]> {
      return this.http.get<any[]>(this.url('/issue-surveys/analytics/trends'));
    }

    exportSurveyJson(surveyId: number): Observable<any[]> {
      return this.http.get<any[]>(this.url(`/issue-surveys/${surveyId}/export/json`));
    }

    getSurveyComments(surveyId: number): Observable<IssueSurveyComment[]> {
      return this.http.get<IssueSurveyComment[]>(this.url(`/issue-surveys/${surveyId}/comments`));
    }

    addSurveyComment(
      surveyId: number,
      payload: { comment: string },
    ): Observable<IssueSurveyComment> {
      return this.http.post<IssueSurveyComment>(
        this.url(`/issue-surveys/${surveyId}/comments`),
        payload,
      );
    }

    getSurveyActions(surveyId: number): Observable<IssueAction[]> {
      return this.http.get<IssueAction[]>(this.url(`/issue-surveys/${surveyId}/actions`));
    }

    createSurveyAction(
      surveyId: number,
      payload: CreateIssueActionPayload,
    ): Observable<IssueAction> {
      return this.http.post<IssueAction>(this.url(`/issue-surveys/${surveyId}/actions`), payload);
    }

    updateIssueAction(id: number, payload: Partial<IssueAction>): Observable<IssueAction> {
      return this.http.put<IssueAction>(this.url(`/issue-actions/${id}`), payload);
    }

    updateIssueActionStatus(
      id: number,
      status: string,
      updatedById: number,
      note?: string,
      progressPercent?: number,
    ): Observable<IssueAction> {
      let params = new HttpParams().set('status', status).set('updatedById', updatedById);
      if (note) params = params.set('note', note);
      if (progressPercent != null) params = params.set('progressPercent', progressPercent);
      return this.http.patch<IssueAction>(this.url(`/issue-actions/${id}/status`), null, {
        params,
      });
    }

    getIssueItemPool(category?: string): Observable<IssueItemPool[]> {
      let params = new HttpParams();
      if (category) params = params.set('category', category);
      return this.http.get<IssueItemPool[]>(this.url('/issue-item-pool'), { params });
    }

    createIssueItemPool(payload: CreateIssueItemPoolPayload): Observable<IssueItemPool> {
      return this.http.post<IssueItemPool>(this.url('/issue-item-pool'), payload);
    }

    addPoolItemToSurvey(
      poolItemId: number,
      surveyId: number,
      sortOrder?: number,
    ): Observable<IssueItemPool> {
      let params = new HttpParams().set('surveyId', surveyId);
      if (sortOrder != null) params = params.set('sortOrder', sortOrder);
      return this.http.post<IssueItemPool>(
        this.url(`/issue-item-pool/${poolItemId}/use-in-survey`),
        null,
        { params },
      );
    }

    getIssueDashboardSummary(): Observable<IssueDashboardSummary> {
      return this.http.get<IssueDashboardSummary>(this.url('/issue-dashboard/summary'));
    }

    getServiceSurveys(targetRole?: string): Observable<ServiceSurvey[]> {
      let params = new HttpParams();
      if (targetRole) params = params.set('targetRole', targetRole);
      return this.http.get<ServiceSurvey[]>(this.url('/service-surveys'), { params });
    }

    getServiceSurveyById(id: number): Observable<ServiceSurvey> {
      return this.http.get<ServiceSurvey>(this.url(`/service-surveys/${id}`));
    }

    createServiceSurvey(payload: CreateServiceSurveyPayload): Observable<ServiceSurvey> {
      return this.http.post<ServiceSurvey>(this.url('/service-surveys'), payload);
    }

    updateServiceSurvey(
      id: number,
      payload: UpdateServiceSurveyPayload,
    ): Observable<ServiceSurvey> {
      return this.http.patch<ServiceSurvey>(this.url(`/service-surveys/${id}`), payload);
    }

    deleteServiceSurvey(id: number): Observable<ApiMessageResponse> {
      return this.http.delete<ApiMessageResponse>(this.url(`/service-surveys/${id}`));
    }

    publishServiceSurvey(id: number): Observable<ServiceSurvey> {
      return this.http.post<ServiceSurvey>(this.url(`/service-surveys/${id}/publish`), null);
    }

    closeServiceSurvey(id: number): Observable<ServiceSurvey> {
      return this.http.post<ServiceSurvey>(this.url(`/service-surveys/${id}/close`), null);
    }

    getServiceSurveyQuestions(surveyId: number): Observable<ServiceSurveyQuestion[]> {
      return this.http.get<ServiceSurveyQuestion[]>(
        this.url(`/service-surveys/${surveyId}/questions`),
      );
    }

    createServiceQuestion(
      surveyId: number,
      payload: CreateServiceQuestionPayload,
    ): Observable<ServiceSurveyQuestion> {
      return this.http.post<ServiceSurveyQuestion>(
        this.url(`/service-surveys/${surveyId}/questions`),
        payload,
      );
    }

    deleteServiceQuestion(surveyId: number, questionId: number): Observable<ApiMessageResponse> {
      return this.http.delete<ApiMessageResponse>(
        this.url(`/service-surveys/${surveyId}/questions/${questionId}`),
      );
    }

    getServiceSurveyResponses(surveyId: number): Observable<ServiceSurveyResponse[]> {
      return this.http.get<ServiceSurveyResponse[]>(
        this.url(`/service-surveys/${surveyId}/responses`),
      );
    }

    submitServiceSurveyResponse(
      payload: SubmitServiceSurveyPayload,
    ): Observable<ServiceSurveyResponse> {
      return this.http.post<ServiceSurveyResponse>(this.url('/service-survey-responses'), payload);
    }

    getServiceSurveyAnalytics(surveyId: number): Observable<ServiceSurveyAnalytics> {
      return this.http.get<ServiceSurveyAnalytics>(
        this.url(`/service-surveys/${surveyId}/analytics`),
      );
    }

    getServiceDashboardSummary(): Observable<ServiceDashboardSummary> {
      return this.http.get<ServiceDashboardSummary>(this.url('/service-surveys/dashboard/summary'));
    }
  };
}
