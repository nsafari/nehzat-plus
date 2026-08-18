import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { LESSON_PLANNER_API } from '../../core/services/lesson-planner-api.token';
import type {
  DashboardSummaryDto,
  GenerateReportRequest,
  LeaderboardEntryDto,
  ProgressReportDto,
} from '../../core/models/lesson-planner.models';

@Injectable({ providedIn: 'root' })
export class ProgressService {
  private readonly api = inject(LESSON_PLANNER_API);

  private readonly dashboardSignal = signal<DashboardSummaryDto | null>(null);
  private readonly loadingSignal = signal(false);
  private readonly errorSignal = signal(false);

  readonly dashboard = this.dashboardSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  loadDashboard(): Observable<DashboardSummaryDto> {
    this.loadingSignal.set(true);
    this.errorSignal.set(false);
    return this.api.getDashboardSummary().pipe(
      tap({
        next: (summary) => this.dashboardSignal.set(summary),
        error: () => this.errorSignal.set(true),
        finalize: () => this.loadingSignal.set(false),
      }),
    );
  }

  getStudentReports(studentId: number, limit = 12): Observable<ProgressReportDto[]> {
    return this.api.getStudentReports(studentId, limit);
  }

  generateReport(req: GenerateReportRequest): Observable<ProgressReportDto> {
    return this.api.generateReport(req);
  }

  getLeaderboard(limit = 10): Observable<LeaderboardEntryDto[]> {
    return this.api.getLeaderboard(limit);
  }

  refresh(): void {
    void this.loadDashboard().subscribe();
  }
}