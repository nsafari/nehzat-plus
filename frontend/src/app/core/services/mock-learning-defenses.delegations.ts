import { Observable } from 'rxjs';

import { MockLessonPlannerApiBase, type MockApiCtor } from './mock-lesson-planner-base';
import {
  CreateProjectDefensePayload,
  DefenseSchedule,
  ProjectDefense,
  ProjectDefenseEvaluation,
  ScheduleDefensePayload,
  SubmitProjectDefensePayload,
} from './mock-lesson-planner-models';

/**
 * withLearningDefenses delegation mixin
 * Project defense scheduling and evaluations.: every method forwards to the injected
 * MockLearningService instance (see MockLessonPlannerApiBase.learningDefenses).
 */
export function withLearningDefenses<T extends MockApiCtor>(Base: T) {
  return class extends Base {
    // ===== Project Defense =====
    getProjectDefenses(): Observable<ProjectDefense[]> {
      return this.learning.getProjectDefenses();
    }

    getProjectDefenseById(id: number): Observable<ProjectDefense> {
      return this.learning.getProjectDefenseById(id);
    }

    createProjectDefense(payload: CreateProjectDefensePayload): Observable<ProjectDefense> {
      return this.learning.createProjectDefense(payload);
    }

    submitProjectDefense(payload: SubmitProjectDefensePayload): Observable<ProjectDefense> {
      return this.learning.submitProjectDefense(payload);
    }

    getProjectDefenseEvaluations(defenseId: number): Observable<ProjectDefenseEvaluation[]> {
      return this.learning.getProjectDefenseEvaluations(defenseId);
    }

    scheduleDefense(payload: ScheduleDefensePayload): Observable<DefenseSchedule> {
      return this.learning.scheduleDefense(payload);
    }

    getDefenseSchedule(studentId: number): Observable<DefenseSchedule | null> {
      return this.learning.getDefenseSchedule(studentId);
    }
  };
}
