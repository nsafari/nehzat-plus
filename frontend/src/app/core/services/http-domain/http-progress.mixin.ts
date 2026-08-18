import { Observable } from 'rxjs';
import type { HttpClient } from '@angular/common/http';
import type {
  DashboardSummaryDto,
  ProgressReportDto,
  LeaderboardEntryDto,
  GenerateReportRequest,
} from '../../models/lesson-planner.models';

export interface HttpServiceContext {
  http: HttpClient;
  url(path: string): string;
}

export type Constructor<T = {}> = new (...args: any[]) => T;

export function WithProgress<TBase extends Constructor<HttpServiceContext>>(Base: TBase) {
  return class extends Base {
    getDashboardSummary(): Observable<DashboardSummaryDto> {
      return this.http.get<DashboardSummaryDto>(this.url('/api/progress/dashboard'));
    }

    getStudentReports(studentId: number, limit = 12): Observable<ProgressReportDto[]> {
      return this.http.get<ProgressReportDto[]>(
        this.url(`/api/progress/students/${studentId}/reports?limit=${limit}`),
      );
    }

    generateReport(req: GenerateReportRequest): Observable<ProgressReportDto> {
      return this.http.post<ProgressReportDto>(this.url('/api/progress/reports'), req);
    }

    getLeaderboard(limit = 10): Observable<LeaderboardEntryDto[]> {
      return this.http.get<LeaderboardEntryDto[]>(
        this.url(`/api/progress/leaderboard?limit=${limit}`),
      );
    }
  };
}
