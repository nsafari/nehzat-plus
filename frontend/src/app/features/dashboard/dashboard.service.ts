import { Injectable, inject } from '@angular/core';
import { LESSON_PLANNER_API } from '../../core/services/lesson-planner-api.token';
import type { GenerateReportRequest } from '../../core/models/lesson-planner.models';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly api = inject(LESSON_PLANNER_API);

  getDashboard() {
    return this.api.getDashboardSummary();
  }

  getStudentReports(studentId: number, limit = 12) {
    return this.api.getStudentReports(studentId, limit);
  }

  generateReport(req: GenerateReportRequest) {
    return this.api.generateReport(req);
  }

  getLeaderboard(limit = 10) {
    return this.api.getLeaderboard(limit);
  }
}
