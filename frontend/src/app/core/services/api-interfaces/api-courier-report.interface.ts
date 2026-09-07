import { Observable } from 'rxjs';
import type { CourierStatsDto, CourierLeaderboardDto } from '../../models/lesson-planner.models';

export abstract class CourierReportApi {
  abstract getCourierStats(courierId: number, from: Date, to: Date): Observable<CourierStatsDto>;
  abstract getCourierLeaderboard(
    from: Date,
    to: Date,
    limit?: number,
  ): Observable<CourierLeaderboardDto>;
}
