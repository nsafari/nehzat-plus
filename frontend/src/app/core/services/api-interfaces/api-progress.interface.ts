import { Observable } from 'rxjs';
import type {
  DashboardSummaryDto,
  ProgressReportDto,
  LeaderboardEntryDto,
  GenerateReportRequest,
} from '../../models/lesson-planner.models';

export abstract class ProgressApi {
  abstract getDashboardSummary(): Observable<DashboardSummaryDto>;
  abstract getStudentReports(studentId: number, limit?: number): Observable<ProgressReportDto[]>;
  abstract generateReport(req: GenerateReportRequest): Observable<ProgressReportDto>;
  abstract getLeaderboard(limit?: number): Observable<LeaderboardEntryDto[]>;
}
