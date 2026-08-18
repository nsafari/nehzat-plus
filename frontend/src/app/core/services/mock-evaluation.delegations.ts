import { Observable } from 'rxjs';
import { MockLessonPlannerApiBase, type MockApiCtor } from './mock-lesson-planner-base';
import type {
  QuestionDto,
  CreateQuestionRequest,
  RandomEvaluationDto,
  StartEvaluationRequest,
  SubmitAnswersRequest,
  EvaluationStatsDto,
} from './mock-lesson-planner-models';

export function withEvaluation<T extends MockApiCtor>(Base: T) {
  return class extends Base {
    getQuestions(category?: string, difficulty?: string): Observable<QuestionDto[]> {
      return this.evaluation.getQuestions(category, difficulty);
    }
    createQuestion(payload: CreateQuestionRequest): Observable<QuestionDto> {
      return this.evaluation.createQuestion(payload);
    }
    deleteQuestion(id: number): Observable<void> {
      return this.evaluation.deleteQuestion(id);
    }
    startEvaluation(payload: StartEvaluationRequest): Observable<RandomEvaluationDto> {
      return this.evaluation.startEvaluation(payload);
    }
    getEvaluation(id: number): Observable<RandomEvaluationDto> {
      return this.evaluation.getEvaluation(id);
    }
    submitAnswers(payload: SubmitAnswersRequest): Observable<RandomEvaluationDto> {
      return this.evaluation.submitAnswers(payload);
    }
    getMyEvaluations(limit?: number): Observable<RandomEvaluationDto[]> {
      return this.evaluation.getMyEvaluations(limit);
    }
    getEvaluationStats(): Observable<EvaluationStatsDto> {
      return this.evaluation.getEvaluationStats();
    }
  };
}
