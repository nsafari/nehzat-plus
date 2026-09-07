import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MockDataContext } from './mock-data-context';
import {
  Evaluator,
  EvaluationRecord,
  CreateEvaluatorPayload,
  CreateEvaluationPayload,
  ApiMessageResponse,
} from '../../models/lesson-planner.models';

@Injectable({ providedIn: 'root' })
export class MockAdminEvaluatorsService {
  constructor(private ctx: MockDataContext) {}

  getEvaluators(): Observable<Evaluator[]> {
    return this.ctx.delayed([...this.ctx.evaluators]);
  }

  createEvaluator(payload: CreateEvaluatorPayload): Observable<Evaluator> {
    const evaluator: Evaluator = {
      id: this.ctx.nextId(this.ctx.evaluators),
      username: payload.username,
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      phoneNumber: payload.phoneNumber,
      expertise: payload.expertise ?? '',
      assignedMadrasahIds: payload.assignedMadrasahIds ?? [],
      status: 'active',
      createdAt: this.ctx.now(),
    };
    this.ctx.evaluators.push(evaluator);
    return this.ctx.delayed(evaluator);
  }

  updateEvaluator(id: number, payload: Partial<CreateEvaluatorPayload>): Observable<Evaluator> {
    const evaluator = this.ctx.evaluators.find((e) => e.id === id);
    if (!evaluator) throw new Error('Evaluator not found');
    Object.assign(evaluator, payload);
    return this.ctx.delayed(evaluator);
  }

  deleteEvaluator(id: number): Observable<ApiMessageResponse> {
    this.ctx.evaluators = this.ctx.evaluators.filter((e) => e.id !== id);
    return this.ctx.delayed({ message: 'ارزیاب حذف شد' });
  }

  getEvaluationRecords(evaluatorId?: number): Observable<EvaluationRecord[]> {
    let records = [...this.ctx.evaluations];
    if (evaluatorId !== undefined) {
      records = records.filter((r) => r.evaluatorId === evaluatorId);
    }
    return this.ctx.delayed(records);
  }

  createEvaluation(payload: CreateEvaluationPayload): Observable<EvaluationRecord> {
    const record: EvaluationRecord = {
      id: this.ctx.nextId(this.ctx.evaluations),
      evaluatorId: payload.evaluatorId,
      evaluatorName: this.ctx.getEvaluatorName(payload.evaluatorId),
      targetName: payload.targetName,
      targetType: payload.targetType,
      targetId: payload.targetId,
      score: payload.score,
      feedback: payload.feedback,
      evaluationDate: payload.evaluationDate,
      createdAt: this.ctx.now(),
    };
    this.ctx.evaluations.push(record);
    return this.ctx.delayed(record);
  }

  deleteEvaluation(id: number): Observable<ApiMessageResponse> {
    this.ctx.evaluations = this.ctx.evaluations.filter((e) => e.id !== id);
    return this.ctx.delayed({ message: 'ارزیابی حذف شد' });
  }
}
