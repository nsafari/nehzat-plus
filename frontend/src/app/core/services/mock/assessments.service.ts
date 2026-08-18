import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MockDataContext } from './mock-data-context';
import { MockAssessmentsCrudBaseService } from './assessments-crud.service';
import {
  Assessment,
  AssessmentResult,
  AssessmentAnalytics,
  StudentAssessmentHistory,
  SubmitAssessmentResultPayload,
} from '../../models/lesson-planner.models';

/**
 * Assessment results + analytics sub-domain. CRUD methods live in
 * MockAssessmentsCrudBaseService.
 */
@Injectable({ providedIn: 'root' })
export class MockAssessmentsService extends MockAssessmentsCrudBaseService {
  constructor(ctx: MockDataContext) {
    super(ctx);
  }

  submitAssessmentResult(
    assessmentId: number,
    payload: SubmitAssessmentResultPayload,
  ): Observable<AssessmentResult> {
    const assessment = this.ctx.assessments.find((a) => a.id === assessmentId);
    if (!assessment) throw new Error('Assessment not found');
    const result: AssessmentResult = {
      id: this.ctx.nextId('result'),
      assessmentId,
      studentId: payload.studentId,
      score: payload.score,
      maxPossibleScore: payload.maxPossibleScore,
      percentage: payload.percentage,
      status: payload.status,
      answersJson: payload.answersJson,
      feedback: payload.feedback,
      timeSpentMinutes: payload.timeSpentMinutes,
      completedAt: payload.completedAt,
    };
    if (!assessment.results) assessment.results = [];
    assessment.results.push(result);
    return this.ctx.delayed(result);
  }

  startAssessment(assessmentId: number, studentId: number): Observable<AssessmentResult> {
    const result: AssessmentResult = {
      id: this.ctx.nextId('result'),
      assessmentId,
      studentId,
      score: 0,
      maxPossibleScore: 0,
      percentage: 0,
      status: 'in_progress',
      timeSpentMinutes: 0,
      completedAt: '',
    };
    return this.ctx.delayed(result);
  }

  getAssessmentResults(assessmentId: number): Observable<AssessmentResult[]> {
    const assessment = this.ctx.assessments.find((a) => a.id === assessmentId);
    return this.ctx.delayed(assessment?.results ?? []);
  }

  getStudentAssessmentResults(studentId: number): Observable<AssessmentResult[]> {
    const results: AssessmentResult[] = [];
    this.ctx.assessments.forEach((a) => {
      if (a.results) {
        results.push(...a.results.filter((r) => r.studentId === studentId));
      }
    });
    return this.ctx.delayed(results);
  }

  getAssessmentAnalytics(assessmentId: number): Observable<AssessmentAnalytics> {
    const assessment = this.ctx.assessments.find((a) => a.id === assessmentId);
    const results = assessment?.results ?? [];
    const questions = assessment?.questions ?? [];
    const scores = results.map((r) => r.score);
    const completedCount = results.length;
    const averageScore =
      completedCount > 0 ? scores.reduce((a, b) => a + b, 0) / completedCount : 0;
    const passedCount =
      completedCount > 0 && assessment
        ? scores.filter((s) => s >= assessment.maxScore * 0.5).length
        : 0;
    return this.ctx.delayed({
      assessment: {
        id: assessment?.id ?? assessmentId,
        title: assessment?.title ?? '',
        type: assessment?.type ?? 'weekly',
        maxScore: assessment?.maxScore ?? 0,
        assessmentDate: assessment?.assessmentDate ?? '',
        status: assessment?.status ?? 'draft',
      },
      totalStudents: completedCount,
      completedCount,
      completionRate: completedCount > 0 ? 100 : 0,
      averageScore,
      passRate: completedCount > 0 ? (passedCount / completedCount) * 100 : 0,
      questionStats: questions.map((q) => ({
        questionId: q.id,
        questionText: q.questionText,
        topic: q.topic,
        difficulty: q.difficulty,
        points: q.points,
        correctRate: 0,
      })),
    });
  }

  getStudentAssessmentHistory(
    studentId: number,
    courseId: number,
  ): Observable<StudentAssessmentHistory> {
    const courseAssessments = this.ctx.assessments.filter((a) => a.courseId === courseId);
    const history = courseAssessments.map((a) => {
      const result = a.results?.find((r) => r.studentId === studentId) ?? null;
      return {
        assessment: {
          id: a.id,
          title: a.title,
          type: a.type,
          assessmentDate: a.assessmentDate,
          maxScore: a.maxScore,
          status: a.status,
        },
        result: result
          ? {
              id: result.id,
              score: result.score,
              percentage: result.percentage,
              status: result.status,
              completedAt: result.completedAt,
            }
          : null,
      };
    });
    const scores = courseAssessments.flatMap((a) =>
      (a.results ?? []).filter((r) => r.studentId === studentId).map((r) => r.score),
    );
    return this.ctx.delayed({
      student: { id: studentId, name: '', studentId: '' },
      history,
      trend: [],
      statistics: {
        totalAssessments: courseAssessments.length,
        completedAssessments: scores.length,
        averageScore: scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0,
        bestScore: scores.length > 0 ? Math.max(...scores) : 0,
      },
    });
  }
}
