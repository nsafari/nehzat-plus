import { Observable } from 'rxjs';
import type {
  QuestionDto,
  CreateQuestionRequest,
  RandomEvaluationDto,
  StartEvaluationRequest,
  SubmitAnswersRequest,
  EvaluationStatsDto,
} from '../../models/lesson-planner.models';

export abstract class EvaluationApi {
  abstract getQuestions(category?: string, difficulty?: string): Observable<QuestionDto[]>;
  abstract createQuestion(payload: CreateQuestionRequest): Observable<QuestionDto>;
  abstract deleteQuestion(id: number): Observable<void>;
  abstract startEvaluation(payload: StartEvaluationRequest): Observable<RandomEvaluationDto>;
  abstract getEvaluation(id: number): Observable<RandomEvaluationDto>;
  abstract submitAnswers(payload: SubmitAnswersRequest): Observable<RandomEvaluationDto>;
  abstract getMyEvaluations(limit?: number): Observable<RandomEvaluationDto[]>;
  abstract getEvaluationStats(): Observable<EvaluationStatsDto>;
}
