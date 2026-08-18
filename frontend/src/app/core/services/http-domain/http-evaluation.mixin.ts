import { Observable } from 'rxjs';
import type { HttpClient } from '@angular/common/http';
import type {
  QuestionDto,
  CreateQuestionRequest,
  RandomEvaluationDto,
  StartEvaluationRequest,
  SubmitAnswersRequest,
  EvaluationStatsDto,
} from '../../models/lesson-planner.models';

export interface HttpServiceContext {
  http: HttpClient;
  url(path: string): string;
}

export type Constructor<T = {}> = new (...args: any[]) => T;

export function WithEvaluation<TBase extends Constructor<HttpServiceContext>>(Base: TBase) {
  return class extends Base {
    getQuestions(category?: string, difficulty?: string): Observable<QuestionDto[]> {
      const params = new URLSearchParams();
      if (category) params.set('category', category);
      if (difficulty) params.set('difficulty', difficulty);
      const qs = params.toString();
      return this.http.get<QuestionDto[]>(
        this.url(qs ? `/api/evaluations/questions?${qs}` : '/api/evaluations/questions'),
      );
    }

    createQuestion(payload: CreateQuestionRequest): Observable<QuestionDto> {
      return this.http.post<QuestionDto>(this.url('/api/evaluations/questions'), payload);
    }

    deleteQuestion(id: number): Observable<void> {
      return this.http.delete<void>(this.url(`/api/evaluations/questions/${id}`));
    }

    startEvaluation(payload: StartEvaluationRequest): Observable<RandomEvaluationDto> {
      return this.http.post<RandomEvaluationDto>(this.url('/api/evaluations/start'), payload);
    }

    getEvaluation(id: number): Observable<RandomEvaluationDto> {
      return this.http.get<RandomEvaluationDto>(this.url(`/api/evaluations/${id}`));
    }

    submitAnswers(payload: SubmitAnswersRequest): Observable<RandomEvaluationDto> {
      return this.http.post<RandomEvaluationDto>(this.url('/api/evaluations/submit'), payload);
    }

    getMyEvaluations(limit: number = 20): Observable<RandomEvaluationDto[]> {
      return this.http.get<RandomEvaluationDto[]>(this.url(`/api/evaluations/mine?limit=${limit}`));
    }

    getEvaluationStats(): Observable<EvaluationStatsDto> {
      return this.http.get<EvaluationStatsDto>(this.url('/api/evaluations/stats'));
    }
  };
}
