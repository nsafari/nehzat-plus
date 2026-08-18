import { Observable } from 'rxjs';
import { MockLessonPlannerApiBase, type MockApiCtor } from './mock-lesson-planner-base';
import type { CourierStatsDto, CourierLeaderboardDto } from './mock-lesson-planner-models';

export function withCourierReport<T extends MockApiCtor>(Base: T) {
  return class extends Base {
    getCourierStats(courierId: number, from: Date, to: Date): Observable<CourierStatsDto> {
      return this.courierReport.getCourierStats(courierId, from, to);
    }
    getCourierLeaderboard(from: Date, to: Date, limit?: number): Observable<CourierLeaderboardDto> {
      return this.courierReport.getCourierLeaderboard(from, to, limit);
    }
  };
}
