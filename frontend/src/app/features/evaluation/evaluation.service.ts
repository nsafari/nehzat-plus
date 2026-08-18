import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import type {
  QuestionDto,
  CreateQuestionRequest,
  RandomEvaluationDto,
  StartEvaluationRequest,
  SubmitAnswersRequest,
  EvaluationStatsDto,
} from '../../core/models/lesson-planner.models';
import { LESSON_PLANNER_API } from '../../core/services/lesson-planner-api.token';

@Injectable({ providedIn: 'root' })
export class EvaluationService {
  private readonly api = inject(LESSON_PLANNER_API);

  getQuestions(category?: string, difficulty?: string): Observable<QuestionDto[]> {
    return this.api.getQuestions(category, difficulty);
  }

  createQuestion(payload: CreateQuestionRequest): Observable<QuestionDto> {
    return this.api.createQuestion(payload);
  }

  deleteQuestion(id: number): Observable<void> {
    return this.api.deleteQuestion(id);
  }

  startEvaluation(payload: StartEvaluationRequest): Observable<RandomEvaluationDto> {
    return this.api.startEvaluation(payload);
  }

  getEvaluation(id: number): Observable<RandomEvaluationDto> {
    return this.api.getEvaluation(id);
  }

  submitAnswers(payload: SubmitAnswersRequest): Observable<RandomEvaluationDto> {
    return this.api.submitAnswers(payload);
  }

  getMyEvaluations(limit?: number): Observable<RandomEvaluationDto[]> {
    return this.api.getMyEvaluations(limit);
  }

  getEvaluationStats(): Observable<EvaluationStatsDto> {
    return this.api.getEvaluationStats();
  }
}