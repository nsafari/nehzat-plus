import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import type { DomainProgress, StreakInfo } from '../models/lesson-planner.models';
import { emptyDomainProgress } from '../utils/radar-chart';
import { LESSON_PLANNER_API } from './lesson-planner-api.token';

export const DEFAULT_STREAKS: StreakInfo = {
  academic: 0,
  spiritual: 0,
  physical: 0,
  unified: 0
};

@Injectable({ providedIn: 'root' })
export class StreakService {
  private readonly api = inject(LESSON_PLANNER_API);

  getUserStreaks(): Observable<StreakInfo> {
    return this.api.getUserStreaks().pipe(
      map((streaks) => ({
        academic: Math.max(0, streaks.academic),
        spiritual: Math.max(0, streaks.spiritual),
        physical: Math.max(0, streaks.physical),
        unified: Math.max(0, streaks.unified)
      })),
      catchError(() => of(DEFAULT_STREAKS))
    );
  }

  getDomainProgress(): Observable<DomainProgress[]> {
    return this.api.getDomainProgress().pipe(
      map((domains) => {
        const defaults = emptyDomainProgress();
        const byKey = new Map(defaults.map((domain) => [domain.key, domain]));
        for (const domain of domains) {
          const target = byKey.get(domain.key);
          if (target) {
            byKey.set(domain.key, {
              ...target,
              ...domain,
              score: Math.max(0, Math.min(100, domain.score))
            });
          }
        }
        return defaults.map((domain) => byKey.get(domain.key)!);
      }),
      catchError(() => of(emptyDomainProgress()))
    );
  }

  computeUnified(streaks: Pick<StreakInfo, 'academic' | 'spiritual' | 'physical'>): number {
    return Math.max(streaks.academic, streaks.spiritual, streaks.physical);
  }
}