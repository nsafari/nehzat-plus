import { Observable } from 'rxjs';
import { MockDataContext } from './mock-data-context';
import {
  Assessment,
  AssessmentQuestion,
  GenerateWeeklyAssessmentPayload,
  AssessmentQuestionPayload,
  ApiMessageResponse,
} from '../../models/lesson-planner.models';

/**
 * Assessment + question CRUD sub-domain. Split from the former monolithic
 * MockAssessmentsService.
 */
export abstract class MockAssessmentsCrudBaseService {
  constructor(protected ctx: MockDataContext) {}

  getAssessments(): Observable<Assessment[]> {
    return this.ctx.delayed([...this.ctx.assessments]);
  }

  getAssessmentById(id: number): Observable<Assessment> {
    const assessment = this.ctx.assessments.find((a) => a.id === id);
    if (!assessment) return this.ctx.delayed(null as unknown as Assessment);
    return this.ctx.delayed(assessment);
  }

  getAssessmentsByCourse(courseId: number): Observable<Assessment[]> {
    return this.ctx.delayed(this.ctx.assessments.filter((a) => a.courseId === courseId));
  }

  getAssessmentsByDateRange(
    courseId: number,
    startDate: string,
    endDate: string,
  ): Observable<Assessment[]> {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return this.ctx.delayed(
      this.ctx.assessments.filter((a) => {
        const date = new Date(a.assessmentDate);
        return a.courseId === courseId && date >= start && date <= end;
      }),
    );
  }

  createAssessment(payload: Partial<Assessment>): Observable<Assessment> {
    const assessment: Assessment = {
      id: this.ctx.nextId('assessment'),
      title: payload.title ?? '',
      description: payload.description ?? '',
      type: payload.type ?? 'weekly',
      maxScore: payload.maxScore ?? 100,
      durationMinutes: payload.durationMinutes ?? 60,
      assessmentDate: payload.assessmentDate ?? this.ctx.now(),
      status: payload.status ?? 'draft',
      instructions: payload.instructions,
      courseId: payload.courseId ?? 0,
      generatedByUserId: payload.generatedByUserId,
      generationCriteria: payload.generationCriteria,
      questions: [],
      results: [],
      createdAt: this.ctx.now(),
      updatedAt: this.ctx.now(),
    };
    this.ctx.assessments.push(assessment);
    return this.ctx.delayed(assessment);
  }

  updateAssessment(id: number, payload: Partial<Assessment>): Observable<Assessment> {
    const assessment = this.ctx.assessments.find((a) => a.id === id);
    if (!assessment) return this.ctx.delayed(null as unknown as Assessment);
    Object.assign(assessment, payload, { updatedAt: this.ctx.now() });
    return this.ctx.delayed(assessment);
  }

  deleteAssessment(id: number): Observable<ApiMessageResponse> {
    this.ctx.assessments = this.ctx.assessments.filter((a) => a.id !== id);
    return this.ctx.delayed({ message: 'ارزیابی حذف شد' });
  }

  generateWeeklyAssessment(payload: GenerateWeeklyAssessmentPayload): Observable<Assessment> {
    const assessment: Assessment = {
      id: this.ctx.nextId('assessment'),
      title: payload.title,
      description: payload.description,
      type: 'weekly',
      maxScore: payload.maxScore,
      durationMinutes: payload.durationMinutes ?? 60,
      assessmentDate: this.ctx.now(),
      status: 'draft',
      courseId: payload.courseId,
      questions: [],
      results: [],
      createdAt: this.ctx.now(),
      updatedAt: this.ctx.now(),
    };
    this.ctx.assessments.push(assessment);
    return this.ctx.delayed(assessment);
  }

  getAssessmentQuestions(assessmentId: number): Observable<AssessmentQuestion[]> {
    const assessment = this.ctx.assessments.find((a) => a.id === assessmentId);
    return this.ctx.delayed(assessment?.questions ?? []);
  }

  createAssessmentQuestion(
    assessmentId: number,
    payload: AssessmentQuestionPayload,
  ): Observable<AssessmentQuestion> {
    const assessment = this.ctx.assessments.find((a) => a.id === assessmentId);
    if (!assessment) throw new Error('Assessment not found');
    const question: AssessmentQuestion = {
      id: this.ctx.nextId('question'),
      assessmentId,
      questionText: payload.questionText,
      type: payload.type,
      optionsJson: payload.optionsJson,
      correctAnswerJson: payload.correctAnswerJson,
      points: payload.points,
      order: payload.order,
      difficulty: payload.difficulty,
      topic: payload.topic,
      explanation: payload.explanation,
    };
    if (!assessment.questions) assessment.questions = [];
    assessment.questions.push(question);
    return this.ctx.delayed(question);
  }

  updateAssessmentQuestion(
    questionId: number,
    payload: AssessmentQuestionPayload,
  ): Observable<AssessmentQuestion> {
    for (const assessment of this.ctx.assessments) {
      const question = assessment.questions?.find((q) => q.id === questionId);
      if (question) {
        Object.assign(question, payload);
        return this.ctx.delayed(question);
      }
    }
    throw new Error('Question not found');
  }

  deleteAssessmentQuestion(questionId: number): Observable<ApiMessageResponse> {
    for (const assessment of this.ctx.assessments) {
      if (assessment.questions) {
        assessment.questions = assessment.questions.filter((q) => q.id !== questionId);
      }
    }
    return this.ctx.delayed({ message: 'سوال حذف شد' });
  }
}
