import { Observable } from 'rxjs';
import { MockDataContext } from './mock-data-context';
import { MockSurveysIssueBaseService } from './surveys-issue.service';
import {
  SurveyAnalytics,
  CategoryAnalytics,
  QuestionAnalytics,
  IssueAction,
  ActionStatus,
  IssueSeverity,
  IssueItemPool,
  IssueDashboardSummary,
  CreateIssueActionPayload,
  CreateIssueItemPoolPayload,
} from '../../models/lesson-planner.models';

/**
 * Issue-survey engagement sub-domain (analytics, actions, item pool, dashboard).
 * Split from the former monolithic MockSurveysService.
 */
export abstract class MockSurveysIssueOpsBaseService extends MockSurveysIssueBaseService {
  constructor(ctx: MockDataContext) {
    super(ctx);
  }

  getSurveyAnalytics(surveyId: number): Observable<SurveyAnalytics> {
    const responses = this.ctx.issueResponses.filter((r) => r.surveyId === surveyId);
    const survey = this.ctx.issueSurveys.find((s) => s.id === surveyId);
    const categoryBreakdown: CategoryAnalytics[] = [];
    const topCriticalIssues: QuestionAnalytics[] = [];
    const topStrengths: QuestionAnalytics[] = [];
    this.ctx.issueQuestions
      .filter((q) => q.surveyId === surveyId)
      .forEach((q) => {
        const qResponses = responses.filter((r) => r.questionId === q.id);
        const avg = qResponses.length
          ? qResponses.reduce((sum, r) => sum + r.score, 0) / qResponses.length
          : 0;
        const severity: IssueSeverity = avg <= 2 ? 'critical' : avg <= 3 ? 'problem' : 'solvable';
        const analytics = {
          questionId: q.id,
          questionText: q.questionText,
          category: q.category,
          averageScore: avg,
          standardDeviation: 0,
          responseCount: qResponses.length,
          severity,
        };
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
            severity,
          });
        }
        if (severity === 'critical') topCriticalIssues.push(analytics);
        if (avg >= 4) topStrengths.push(analytics);
      });
    const totalScore = responses.reduce((sum, r) => sum + r.score, 0);
    return this.ctx.delayed({
      surveyId,
      title: survey?.title ?? '',
      totalRespondents: new Set(responses.map((r) => r.respondentId)).size,
      totalQuestions: this.ctx.issueQuestions.filter((q) => q.surveyId === surveyId).length,
      overallAverage: responses.length ? totalScore / responses.length : 0,
      categoryBreakdown,
      topCriticalIssues: topCriticalIssues.slice(0, 5),
      topStrengths: topStrengths.slice(0, 5),
    });
  }

  getSurveyCategoryBreakdown(surveyId: number): Observable<CategoryAnalytics[]> {
    return this.ctx.delayed([]);
  }

  getSurveyTrends(): Observable<any[]> {
    return this.ctx.delayed([]);
  }

  exportSurveyJson(surveyId: number): Observable<any[]> {
    const responses = this.ctx.issueResponses.filter((r) => r.surveyId === surveyId);
    return this.ctx.delayed(responses);
  }

  getSurveyActions(surveyId: number): Observable<IssueAction[]> {
    return this.ctx.delayed(this.ctx.issueActions.filter((a) => a.surveyId === surveyId));
  }

  createSurveyAction(surveyId: number, payload: CreateIssueActionPayload): Observable<IssueAction> {
    const now = this.ctx.now();
    const action: IssueAction = {
      id: this.ctx.nextId(this.ctx.issueActions),
      surveyId,
      questionId: payload.questionId,
      title: payload.title,
      description: payload.description,
      category: payload.category,
      priority: payload.priority,
      status: 'proposed',
      assignedToId: payload.assignedToId,
      assignedTeam: payload.assignedTeam,
      targetDate: payload.targetDate,
      kpiDefinition: payload.kpiDefinition,
      createdAt: now,
      updatedAt: now,
      updateCount: 0,
    };
    this.ctx.issueActions.push(action);
    return this.ctx.delayed(action);
  }

  updateIssueAction(id: number, payload: Partial<IssueAction>): Observable<IssueAction> {
    const action = this.ctx.issueActions.find((a) => a.id === id);
    if (!action) throw new Error('Action not found');
    Object.assign(action, payload, { updatedAt: this.ctx.now() });
    return this.ctx.delayed(action);
  }

  updateIssueActionStatus(
    id: number,
    status: string,
    updatedById: number,
    note?: string,
    progressPercent?: number,
  ): Observable<IssueAction> {
    const action = this.ctx.issueActions.find((a) => a.id === id);
    if (!action) throw new Error('Action not found');
    action.status = status as ActionStatus;
    action.updatedAt = this.ctx.now();
    return this.ctx.delayed(action);
  }

  getIssueItemPool(category?: string): Observable<IssueItemPool[]> {
    let items = [...this.ctx.issueItemPools];
    if (category) items = items.filter((i) => i.category === category);
    return this.ctx.delayed(items);
  }

  createIssueItemPool(payload: CreateIssueItemPoolPayload): Observable<IssueItemPool> {
    const item: IssueItemPool = {
      id: this.ctx.nextId(this.ctx.issueItemPools),
      questionText: payload.questionText,
      category: payload.category,
      subCategory: payload.subCategory,
      targetAudience: payload.targetAudience,
      suggestedActions: payload.suggestedActions,
      source: payload.source,
      usageCount: 0,
      trend: 'stable',
      isActive: true,
      createdAt: this.ctx.now(),
    };
    this.ctx.issueItemPools.push(item);
    return this.ctx.delayed(item);
  }

  addPoolItemToSurvey(
    poolItemId: number,
    surveyId: number,
    sortOrder?: number,
  ): Observable<IssueItemPool> {
    const item = this.ctx.issueItemPools.find((i) => i.id === poolItemId);
    if (!item) throw new Error('Item not found');
    return this.ctx.delayed(item);
  }

  getIssueDashboardSummary(): Observable<IssueDashboardSummary> {
    return this.ctx.delayed({
      activeSurveys: this.ctx.issueSurveys.filter((s) => s.status === 'active').length,
      openActions: this.ctx.issueActions.filter(
        (a) => a.status !== 'completed' && a.status !== 'cancelled',
      ).length,
      completedActions: this.ctx.issueActions.filter((a) => a.status === 'completed').length,
      criticalIssuePercentage: 0,
      improvingTrendPercentage: 0,
    });
  }
}
