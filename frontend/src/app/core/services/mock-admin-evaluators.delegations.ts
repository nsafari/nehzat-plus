import { Observable } from 'rxjs';

import { MockLessonPlannerApiBase, type MockApiCtor } from './mock-lesson-planner-base';
import {
  ApiMessageResponse,
  CreateEvaluationPayload,
  CreateEvaluatorPayload,
  EvaluationRecord,
  Evaluator,
} from './mock-lesson-planner-models';

/**
 * adminEvaluators delegation mixin: every method forwards to the injected
 * MockAdminEvaluatorsService instance (see MockLessonPlannerApiBase.adminEvaluators).
 */
export function withAdminEvaluators<T extends MockApiCtor>(Base: T) {
  return class extends Base {
    // ===== Evaluators =====
    getEvaluators(): Observable<Evaluator[]> {
      return this.adminEvaluators.getEvaluators();
    }

    createEvaluator(payload: CreateEvaluatorPayload): Observable<Evaluator> {
      return this.adminEvaluators.createEvaluator(payload);
    }

    updateEvaluator(id: number, payload: Partial<CreateEvaluatorPayload>): Observable<Evaluator> {
      return this.adminEvaluators.updateEvaluator(id, payload);
    }

    deleteEvaluator(id: number): Observable<ApiMessageResponse> {
      return this.adminEvaluators.deleteEvaluator(id);
    }

    // ===== Evaluation Records =====
    getEvaluationRecords(evaluatorId?: number): Observable<EvaluationRecord[]> {
      return this.adminEvaluators.getEvaluationRecords(evaluatorId);
    }

    createEvaluation(payload: CreateEvaluationPayload): Observable<EvaluationRecord> {
      return this.adminEvaluators.createEvaluation(payload);
    }

    deleteEvaluation(id: number): Observable<ApiMessageResponse> {
      return this.adminEvaluators.deleteEvaluation(id);
    }
  };
}
