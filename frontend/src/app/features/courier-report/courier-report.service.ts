import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import type {
  CourierStatsDto,
  CourierLeaderboardDto,
} from '../../core/models/lesson-planner.models';
import { LESSON_PLANNER_API } from '../../core/services/lesson-planner-api.token';

@Injectable({ providedIn: 'root' })
export class CourierReportService {
  private readonly api = inject(LESSON_PLANNER_API);

  getCourierStats(courierId: number, from: Date, to: Date): Observable<CourierStatsDto> {
    return this.api.getCourierStats(courierId, from, to);
  }

  getLeaderboard(from: Date, to: Date, limit = 10): Observable<CourierLeaderboardDto> {
    return this.api.getCourierLeaderboard(from, to, limit);
  }
}
