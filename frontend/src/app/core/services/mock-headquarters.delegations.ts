import { Observable } from 'rxjs';

import { MockLessonPlannerApiBase, type MockApiCtor } from './mock-lesson-planner-base';
import {
  BranchPerformance,
  CoachPerformance,
  HeadquartersSummary,
} from './mock-lesson-planner-models';

/**
 * headquarters delegation mixin: every method forwards to the injected
 * MockHeadquartersService instance (see MockLessonPlannerApiBase.headquarters).
 */
export function withHeadquarters<T extends MockApiCtor>(Base: T) {
  return class extends Base {
    // ===== Headquarters =====
    getHeadquartersSummary(): Observable<HeadquartersSummary> {
      return this.headquarters.getHeadquartersSummary();
    }

    getBranchPerformance(): Observable<BranchPerformance[]> {
      return this.headquarters.getBranchPerformance();
    }

    getCoachPerformance(): Observable<CoachPerformance[]> {
      return this.headquarters.getCoachPerformance();
    }
  };
}
