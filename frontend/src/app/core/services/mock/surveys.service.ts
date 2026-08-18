import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MockDataContext } from './mock-data-context';
import { MockSurveysIssueOpsBaseService } from './surveys-issue-ops.service';
import {
  ServiceSurvey,
  ServiceSurveyQuestion,
  ServiceSurveyResponse,
  ServiceSurveyAnalytics,
  ServiceCategoryAnalytics,
  ServiceQuestionAnalytics,
  ServiceDashboardSummary,
  CreateServiceSurveyPayload,
  UpdateServiceSurveyPayload,
  CreateServiceQuestionPayload,
  SubmitServiceSurveyPayload,
  ApiMessageResponse,
} from '../../models/lesson-planner.models';

/**
 * Service-survey sub-domain. Issue-survey methods live in
 * MockSurveysIssueOpsBaseService (and its base) — both are extended here.
 */
@Injectable({ providedIn: 'root' })
export class MockSurveysService extends MockSurveysIssueOpsBaseService {
  constructor(ctx: MockDataContext) {
    super(ctx);
  }

  getServiceSurveys(targetRole?: string): Observable<ServiceSurvey[]> {
    let surveys = [...this.ctx.serviceSurveys];
    if (targetRole) surveys = surveys.filter((s) => s.targetRole === targetRole);
    return this.ctx.delayed(surveys);
  }

  getServiceSurveyById(id: number): Observable<ServiceSurvey> {
    const survey = this.ctx.serviceSurveys.find((s) => s.id === id);
    if (!survey) throw new Error('Survey not found');
    return this.ctx.delayed(survey);
  }

  createServiceSurvey(payload: CreateServiceSurveyPayload): Observable<ServiceSurvey> {
    const now = this.ctx.now();
    const survey: ServiceSurvey = {
      id: this.ctx.nextId(this.ctx.serviceSurveys),
      title: payload.title,
      description: payload.description,
      targetRole: payload.targetRole,
      status: 'draft',
      startDate: payload.startDate,
      endDate: payload.endDate,
      scoreScaleMin: payload.scoreScaleMin,
      scoreScaleMax: payload.scoreScaleMax,
      isAnonymous: payload.isAnonymous,
      createdById: 1,
      createdAt: now,
      updatedAt: now,
      questionCount: 0,
      responseCount: 0,
    };
    this.ctx.serviceSurveys.push(survey);
    return this.ctx.delayed(survey);
  }

  updateServiceSurvey(id: number, payload: UpdateServiceSurveyPayload): Observable<ServiceSurvey> {
    const survey = this.ctx.serviceSurveys.find((s) => s.id === id);
    if (!survey) throw new Error('Survey not found');
    Object.assign(survey, payload, { updatedAt: this.ctx.now() });
    return this.ctx.delayed(survey);
  }

  deleteServiceSurvey(id: number): Observable<ApiMessageResponse> {
    this.ctx.serviceSurveys = this.ctx.serviceSurveys.filter((s) => s.id !== id);
    return this.ctx.delayed({ message: 'نظرسنجی خدمت حذف شد' });
  }

  publishServiceSurvey(id: number): Observable<ServiceSurvey> {
    const survey = this.ctx.serviceSurveys.find((s) => s.id === id);
    if (!survey) throw new Error('Survey not found');
    survey.status = 'active';
    survey.updatedAt = this.ctx.now();
    return this.ctx.delayed(survey);
  }

  closeServiceSurvey(id: number): Observable<ServiceSurvey> {
    const survey = this.ctx.serviceSurveys.find((s) => s.id === id);
    if (!survey) throw new Error('Survey not found');
    survey.status = 'closed';
    survey.updatedAt = this.ctx.now();
    return this.ctx.delayed(survey);
  }

  getServiceSurveyQuestions(surveyId: number): Observable<ServiceSurveyQuestion[]> {
    return this.ctx.delayed(this.ctx.serviceQuestions.filter((q) => q.surveyId === surveyId));
  }

  createServiceQuestion(
    surveyId: number,
    payload: CreateServiceQuestionPayload,
  ): Observable<ServiceSurveyQuestion> {
    const question: ServiceSurveyQuestion = {
      id: this.ctx.nextId(this.ctx.serviceQuestions),
      surveyId,
      questionText: payload.questionText,
      questionType: payload.questionType,
      category: payload.category,
      options: payload.options,
      scaleMin: payload.scaleMin,
      scaleMax: payload.scaleMax,
      sortOrder: payload.sortOrder ?? 0,
      isRequired: payload.isRequired ?? true,
      isActive: true,
      createdAt: this.ctx.now(),
    };
    this.ctx.serviceQuestions.push(question);
    return this.ctx.delayed(question);
  }

  deleteServiceQuestion(surveyId: number, questionId: number): Observable<ApiMessageResponse> {
    this.ctx.serviceQuestions = this.ctx.serviceQuestions.filter(
      (q) => !(q.surveyId === surveyId && q.id === questionId),
    );
    return this.ctx.delayed({ message: 'سوال حذف شد' });
  }

  getServiceSurveyResponses(surveyId: number): Observable<ServiceSurveyResponse[]> {
    return this.ctx.delayed(this.ctx.serviceResponses.filter((r) => r.surveyId === surveyId));
  }

  submitServiceSurveyResponse(
    payload: SubmitServiceSurveyPayload,
  ): Observable<ServiceSurveyResponse> {
    const responses: ServiceSurveyResponse[] = payload.answers.map((a) => ({
      id: this.ctx.nextId(this.ctx.serviceResponses),
      surveyId: payload.surveyId,
      questionId: a.questionId,
      respondentId: 42,
      answerText: a.answerText,
      answerScore: a.answerScore,
      answerOptions: a.answerOptions,
      respondedAt: this.ctx.now(),
    }));
    this.ctx.serviceResponses.push(...responses);
    return this.ctx.delayed(responses[0]);
  }

  getServiceSurveyAnalytics(surveyId: number): Observable<ServiceSurveyAnalytics> {
    const responses = this.ctx.serviceResponses.filter((r) => r.surveyId === surveyId);
    const survey = this.ctx.serviceSurveys.find((s) => s.id === surveyId);
    const questions = this.ctx.serviceQuestions.filter((q) => q.surveyId === surveyId);
    const categoryBreakdown: ServiceCategoryAnalytics[] = [];
    const topQuestions: ServiceQuestionAnalytics[] = questions.map((q) => {
      const qResponses = responses.filter((r) => r.questionId === q.id);
      return {
        questionId: q.id,
        questionText: q.questionText,
        category: q.category,
        averageScore: qResponses.length
          ? qResponses.reduce((sum, r) => sum + (r.answerScore ?? 0), 0) / qResponses.length
          : 0,
        responseCount: qResponses.length,
        responseRate: questions.length ? qResponses.length / questions.length : 0,
      };
    });
    questions.forEach((q) => {
      const qResponses = responses.filter((r) => r.questionId === q.id);
      const avg = qResponses.length
        ? qResponses.reduce((sum, r) => sum + (r.answerScore ?? 0), 0) / qResponses.length
        : 0;
      const category = categoryBreakdown.find((c) => c.category === q.category);
      if (category) {
        category.averageScore =
          (category.averageScore * category.questionCount + avg) / (category.questionCount + 1);
        category.questionCount += 1;
      } else {
        categoryBreakdown.push({
          category: q.category,
          averageScore: avg,
          questionCount: 1,
          responseCount: 0,
        });
      }
    });
    const scoredAnswers = responses.filter((r) => r.answerScore !== undefined);
    return this.ctx.delayed({
      surveyId,
      title: survey?.title ?? '',
      totalRespondents: new Set(responses.map((r) => r.respondentId)).size,
      totalQuestions: questions.length,
      overallAverage: scoredAnswers.length
        ? scoredAnswers.reduce((sum, r) => sum + (r.answerScore ?? 0), 0) / scoredAnswers.length
        : 0,
      responseCount: responses.length,
      categoryBreakdown,
      topQuestions,
    });
  }

  getServiceDashboardSummary(): Observable<ServiceDashboardSummary> {
    const responses = this.ctx.serviceResponses;
    const scoredAnswers = responses.filter((r) => r.answerScore !== undefined);
    return this.ctx.delayed({
      activeSurveys: this.ctx.serviceSurveys.filter((s) => s.status === 'active').length,
      totalResponses: responses.length,
      averageScore: scoredAnswers.length
        ? scoredAnswers.reduce((sum, r) => sum + (r.answerScore ?? 0), 0) / scoredAnswers.length
        : 0,
      completionRate: 0,
      lastUpdated: this.ctx.now(),
    });
  }
}
