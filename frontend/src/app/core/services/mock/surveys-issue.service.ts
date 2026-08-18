import { Observable } from 'rxjs';
import { MockDataContext } from './mock-data-context';
import {
  IssueSurvey,
  IssueSurveyQuestion,
  IssueSurveyResponse,
  IssueSurveyComment,
  CreateIssueSurveyPayload,
  UpdateIssueSurveyPayload,
  CreateIssueQuestionPayload,
  SubmitSurveyResponsePayload,
  ApiMessageResponse,
} from '../../models/lesson-planner.models';

/**
 * Issue-survey sub-domain (surveys + questions + responses + comments).
 * Split from the former monolithic MockSurveysService; the concrete
 * MockSurveysService extends this base.
 */
export abstract class MockSurveysIssueBaseService {
  constructor(protected ctx: MockDataContext) {}

  getIssueSurveys(): Observable<IssueSurvey[]> {
    return this.ctx.delayed([...this.ctx.issueSurveys]);
  }

  getIssueSurveyById(id: number): Observable<IssueSurvey> {
    const survey = this.ctx.issueSurveys.find((s) => s.id === id);
    if (!survey) throw new Error('Survey not found');
    return this.ctx.delayed(survey);
  }

  createIssueSurvey(payload: CreateIssueSurveyPayload): Observable<IssueSurvey> {
    const now = this.ctx.now();
    const survey: IssueSurvey = {
      id: this.ctx.nextId(this.ctx.issueSurveys),
      title: payload.title,
      description: payload.description,
      surveyType: payload.surveyType,
      targetRole: payload.targetRole,
      status: 'draft',
      startDate: payload.startDate,
      endDate: payload.endDate,
      isAnonymous: payload.isAnonymous,
      scoreScaleMin: payload.scoreScaleMin,
      scoreScaleMax: payload.scoreScaleMax,
      createdById: 1,
      createdAt: now,
      updatedAt: now,
      questionCount: 0,
      responseCount: 0,
    };
    this.ctx.issueSurveys.push(survey);
    return this.ctx.delayed(survey);
  }

  updateIssueSurvey(id: number, payload: UpdateIssueSurveyPayload): Observable<IssueSurvey> {
    const survey = this.ctx.issueSurveys.find((s) => s.id === id);
    if (!survey) throw new Error('Survey not found');
    Object.assign(survey, payload, { updatedAt: this.ctx.now() });
    return this.ctx.delayed(survey);
  }

  deleteIssueSurvey(id: number): Observable<ApiMessageResponse> {
    this.ctx.issueSurveys = this.ctx.issueSurveys.filter((s) => s.id !== id);
    return this.ctx.delayed({ message: 'نظرسنجی حذف شد' });
  }

  publishIssueSurvey(id: number): Observable<IssueSurvey> {
    const survey = this.ctx.issueSurveys.find((s) => s.id === id);
    if (!survey) throw new Error('Survey not found');
    survey.status = 'active';
    survey.updatedAt = this.ctx.now();
    return this.ctx.delayed(survey);
  }

  closeIssueSurvey(id: number): Observable<IssueSurvey> {
    const survey = this.ctx.issueSurveys.find((s) => s.id === id);
    if (!survey) throw new Error('Survey not found');
    survey.status = 'closed';
    survey.updatedAt = this.ctx.now();
    return this.ctx.delayed(survey);
  }

  duplicateIssueSurvey(id: number): Observable<IssueSurvey> {
    const original = this.ctx.issueSurveys.find((s) => s.id === id);
    if (!original) throw new Error('Survey not found');
    const now = this.ctx.now();
    const duplicate: IssueSurvey = {
      id: this.ctx.nextId(this.ctx.issueSurveys),
      title: `${original.title} (کپی)`,
      description: original.description,
      surveyType: original.surveyType,
      targetRole: original.targetRole,
      status: 'draft',
      startDate: original.startDate,
      endDate: original.endDate,
      isAnonymous: original.isAnonymous,
      scoreScaleMin: original.scoreScaleMin,
      scoreScaleMax: original.scoreScaleMax,
      createdById: 1,
      createdAt: now,
      updatedAt: now,
      questionCount: 0,
      responseCount: 0,
    };
    this.ctx.issueSurveys.push(duplicate);
    return this.ctx.delayed(duplicate);
  }

  getIssueSurveyQuestions(surveyId: number): Observable<IssueSurveyQuestion[]> {
    return this.ctx.delayed(this.ctx.issueQuestions.filter((q) => q.surveyId === surveyId));
  }

  createIssueSurveyQuestion(
    surveyId: number,
    payload: CreateIssueQuestionPayload,
  ): Observable<IssueSurveyQuestion> {
    const question: IssueSurveyQuestion = {
      id: this.ctx.nextId(this.ctx.issueQuestions),
      surveyId,
      itemPoolId: payload.itemPoolId,
      questionText: payload.questionText,
      category: payload.category,
      subCategory: payload.subCategory,
      targetAudience: payload.targetAudience,
      sortOrder: payload.sortOrder,
      isActive: true,
      createdAt: this.ctx.now(),
    };
    this.ctx.issueQuestions.push(question);
    return this.ctx.delayed(question);
  }

  updateIssueSurveyQuestion(
    surveyId: number,
    questionId: number,
    payload: Partial<CreateIssueQuestionPayload>,
  ): Observable<IssueSurveyQuestion> {
    const question = this.ctx.issueQuestions.find(
      (q) => q.id === questionId && q.surveyId === surveyId,
    );
    if (!question) throw new Error('Question not found');
    Object.assign(question, payload);
    return this.ctx.delayed(question);
  }

  deleteIssueSurveyQuestion(surveyId: number, questionId: number): Observable<ApiMessageResponse> {
    this.ctx.issueQuestions = this.ctx.issueQuestions.filter(
      (q) => !(q.surveyId === surveyId && q.id === questionId),
    );
    return this.ctx.delayed({ message: 'سوال حذف شد' });
  }

  reorderIssueQuestions(surveyId: number, questionIds: number[]): Observable<void> {
    questionIds.forEach((qId, index) => {
      const question = this.ctx.issueQuestions.find((q) => q.id === qId && q.surveyId === surveyId);
      if (question) question.sortOrder = index;
    });
    return this.ctx.delayed(undefined);
  }

  getIssueSurveysForRespond(surveyId: number): Observable<IssueSurvey> {
    const survey = this.ctx.issueSurveys.find((s) => s.id === surveyId);
    if (!survey) throw new Error('Survey not found');
    return this.ctx.delayed(survey);
  }

  submitSurveyResponses(
    surveyId: number,
    payload: SubmitSurveyResponsePayload,
  ): Observable<IssueSurveyResponse[]> {
    const responses: IssueSurveyResponse[] = payload.answers.map((r) => ({
      id: this.ctx.nextId(this.ctx.issueResponses),
      surveyId,
      questionId: r.questionId,
      respondentId: 42,
      respondentRole: 'student',
      score: r.score,
      answeredAt: this.ctx.now(),
    }));
    this.ctx.issueResponses.push(...responses);
    return this.ctx.delayed(responses);
  }

  getSurveyComments(surveyId: number): Observable<IssueSurveyComment[]> {
    return this.ctx.delayed(this.ctx.issueComments.filter((c) => c.surveyId === surveyId));
  }

  addSurveyComment(surveyId: number, payload: { comment: string }): Observable<IssueSurveyComment> {
    const comment: IssueSurveyComment = {
      id: this.ctx.nextId(this.ctx.issueComments),
      surveyId,
      respondentId: 42,
      comment: payload.comment,
      isPublic: true,
      createdAt: this.ctx.now(),
    };
    this.ctx.issueComments.push(comment);
    return this.ctx.delayed(comment);
  }
}
