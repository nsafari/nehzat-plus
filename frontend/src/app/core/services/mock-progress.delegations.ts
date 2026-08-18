import { Observable } from 'rxjs';
import { MockLessonPlannerApiBase, type MockApiCtor } from './mock-lesson-planner-base';
import type {
  DashboardSummaryDto,
  ProgressReportDto,
  LeaderboardEntryDto,
  GenerateReportRequest,
} from './mock-lesson-planner-models';

export function withProgress<T extends MockApiCtor>(Base: T) {
  return class extends Base {
    getDashboardSummary(): Observable<DashboardSummaryDto> {
      return this.progress.getDashboardSummary();
    }
    getStudentReports(studentId: number, limit?: number): Observable<ProgressReportDto[]> {
      return this.progress.getStudentReports(studentId, limit);
    }
    generateReport(req: GenerateReportRequest): Observable<ProgressReportDto> {
      return this.progress.generateReport(req);
    }
    getLeaderboard(limit?: number): Observable<LeaderboardEntryDto[]> {
      return this.progress.getLeaderboard(limit);
    }
  };
}
