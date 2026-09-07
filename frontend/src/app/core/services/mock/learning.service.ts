import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MockDataContext } from './mock-data-context';
import { MockLearningQuizzesBaseService } from './learning-quizzes.service';

/**
 * Project-defense sub-domain for the learning platform. Curriculum + quizzes
 * methods live in the extended bases.
 */
@Injectable({ providedIn: 'root' })
export class MockLearningService extends MockLearningQuizzesBaseService {
  constructor(ctx: MockDataContext) {
    super(ctx);
  }

  getProjectDefenses(): Observable<any[]> {
    return this.ctx.delayed([...this.ctx.projectDefenses]);
  }

  getProjectDefenseById(id: number): Observable<any> {
    const defense = this.ctx.projectDefenses.find((d: any) => d.id === id);
    if (!defense) throw new Error('Defense not found');
    return this.ctx.delayed(defense);
  }

  createProjectDefense(payload: any): Observable<any> {
    const defense = { id: this.ctx.nextId(this.ctx.projectDefenses), ...payload };
    this.ctx.projectDefenses.push(defense);
    return this.ctx.delayed(defense);
  }

  submitProjectDefense(payload: any): Observable<any> {
    const defense = this.ctx.projectDefenses.find((d: any) => d.id === payload.defenseId);
    if (defense) {
      defense.status = 'submitted';
      defense.submittedAt = this.ctx.now();
      return this.ctx.delayed(defense);
    }
    return this.ctx.delayed({ id: 1, ...payload, status: 'submitted' });
  }

  getProjectDefenseEvaluations(defenseId: number): Observable<any[]> {
    return this.ctx.delayed(
      this.ctx.defenseEvaluations.filter((e: any) => e.defenseId === defenseId),
    );
  }

  scheduleDefense(payload: any): Observable<any> {
    const schedule = { id: this.ctx.nextId(this.ctx.defenseSchedule), ...payload };
    this.ctx.defenseSchedule.push(schedule);
    return this.ctx.delayed(schedule);
  }

  getDefenseSchedule(studentId: number): Observable<any | null> {
    const schedule = this.ctx.defenseSchedule.find((s: any) => s.studentId === studentId);
    return this.ctx.delayed(schedule ?? null);
  }
}
