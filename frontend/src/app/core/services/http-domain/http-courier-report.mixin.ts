import { Observable } from 'rxjs';
import type { HttpClient } from '@angular/common/http';
import type { CourierStatsDto, CourierLeaderboardDto } from '../../models/lesson-planner.models';

export interface HttpServiceContext {
  http: HttpClient;
  url(path: string): string;
}

export type Constructor<T = {}> = new (...args: any[]) => T;

export function WithCourierReport<TBase extends Constructor<HttpServiceContext>>(Base: TBase) {
  return class extends Base {
    getCourierStats(courierId: number, from: Date, to: Date): Observable<CourierStatsDto> {
      return this.http.get<CourierStatsDto>(
        this.url(`/api/courier-reports/couriers/${courierId}`),
        {
          params: { from: from.toISOString(), to: to.toISOString() },
        },
      );
    }

    getCourierLeaderboard(from: Date, to: Date, limit = 10): Observable<CourierLeaderboardDto> {
      return this.http.get<CourierLeaderboardDto>(this.url('/api/courier-reports/leaderboard'), {
        params: { from: from.toISOString(), to: to.toISOString(), limit: String(limit) },
      });
    }
  };
}
