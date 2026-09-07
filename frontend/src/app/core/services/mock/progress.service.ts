import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import type {
  DashboardSummaryDto,
  ProgressReportDto,
  LeaderboardEntryDto,
  GenerateReportRequest,
} from '../../models/lesson-planner.models';

function isoDaysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

@Injectable({ providedIn: 'root' })
export class MockProgressService {
  private readonly reports: ProgressReportDto[] = [
    {
      id: 1,
      studentId: 1,
      studentName: 'علی احمدی',
      periodStart: isoDaysAgo(70),
      periodEnd: isoDaysAgo(56),
      overallScore: 58.5,
      attendanceRate: 71.4,
      assignmentCompletionRate: 64.3,
      completedAssignments: 9,
      totalAssignments: 14,
      coachNote: 'پیشرفت قابل قبول در پایهٔ ریاضی؛ نیاز به تمرین بیشتر در حل مسائل.',
      generatedAt: isoDaysAgo(55),
      metrics: [
        { id: 1, metricKey: 'math', metricLabel: 'ریاضی', score: 62, target: 100, rank: 1, notes: 'میانگین نمرات تمرین‌ها' },
        { id: 2, metricKey: 'quran', metricLabel: 'قرآن', score: 70, target: 100, rank: 2, notes: 'پیشرفت قرائت و حفظ' },
        { id: 3, metricKey: 'assignments', metricLabel: 'تکالیف', score: 64.3, target: 100, rank: 3, notes: 'تکمیل ۹ از ۱۴ تکلیف' },
        { id: 4, metricKey: 'behavior', metricLabel: 'رفتار', score: 85, target: 100, rank: 4, notes: 'ارزیابی مربی' },
      ],
    },
    {
      id: 2,
      studentId: 1,
      studentName: 'علی احمدی',
      periodStart: isoDaysAgo(56),
      periodEnd: isoDaysAgo(42),
      overallScore: 64.75,
      attendanceRate: 78.6,
      assignmentCompletionRate: 71.4,
      completedAssignments: 10,
      totalAssignments: 14,
      coachNote: 'تکالیف قرآن با نظم بیشتری ارسال شده‌اند.',
      generatedAt: isoDaysAgo(41),
      metrics: [
        { id: 5, metricKey: 'math', metricLabel: 'ریاضی', score: 66, target: 100, rank: 1, notes: 'میانگین نمرات تمرین‌ها' },
        { id: 6, metricKey: 'quran', metricLabel: 'قرآن', score: 76, target: 100, rank: 2, notes: 'پیشرفت قرائت و حفظ' },
        { id: 7, metricKey: 'assignments', metricLabel: 'تکالیف', score: 71.4, target: 100, rank: 3, notes: 'تکمیل ۱۰ از ۱۴ تکلیف' },
        { id: 8, metricKey: 'behavior', metricLabel: 'رفتار', score: 85, target: 100, rank: 4, notes: 'ارزیابی مربی' },
      ],
    },
    {
      id: 3,
      studentId: 1,
      studentName: 'علی احمدی',
      periodStart: isoDaysAgo(42),
      periodEnd: isoDaysAgo(28),
      overallScore: 71.2,
      attendanceRate: 85.7,
      assignmentCompletionRate: 78.6,
      completedAssignments: 11,
      totalAssignments: 14,
      coachNote: 'مشارکت در حلقهٔ حفظ بهبود یافته است.',
      generatedAt: isoDaysAgo(27),
      metrics: [
        { id: 9, metricKey: 'math', metricLabel: 'ریاضی', score: 72, target: 100, rank: 1, notes: 'میانگین نمرات تمرین‌ها' },
        { id: 10, metricKey: 'quran', metricLabel: 'قرآن', score: 81, target: 100, rank: 2, notes: 'پیشرفت قرائت و حفظ' },
        { id: 11, metricKey: 'assignments', metricLabel: 'تکالیف', score: 78.6, target: 100, rank: 3, notes: 'تکمیل ۱۱ از ۱۴ تکلیف' },
        { id: 12, metricKey: 'behavior', metricLabel: 'رفتار', score: 85, target: 100, rank: 4, notes: 'ارزیابی مربی' },
      ],
    },
    {
      id: 4,
      studentId: 1,
      studentName: 'علی احمدی',
      periodStart: isoDaysAgo(28),
      periodEnd: isoDaysAgo(14),
      overallScore: 78.8,
      attendanceRate: 92.9,
      assignmentCompletionRate: 85.7,
      completedAssignments: 12,
      totalAssignments: 14,
      coachNote: 'نتایج آزمون ریاضی به‌طور چشمگیری بهبود یافته است.',
      generatedAt: isoDaysAgo(13),
      metrics: [
        { id: 13, metricKey: 'math', metricLabel: 'ریاضی', score: 79, target: 100, rank: 1, notes: 'میانگین نمرات تمرین‌ها' },
        { id: 14, metricKey: 'quran', metricLabel: 'قرآن', score: 88, target: 100, rank: 2, notes: 'پیشرفت قرائت و حفظ' },
        { id: 15, metricKey: 'assignments', metricLabel: 'تکالیف', score: 85.7, target: 100, rank: 3, notes: 'تکمیل ۱۲ از ۱۴ تکلیف' },
        { id: 16, metricKey: 'behavior', metricLabel: 'رفتار', score: 85, target: 100, rank: 4, notes: 'ارزیابی مربی' },
      ],
    },
    {
      id: 5,
      studentId: 1,
      studentName: 'علی احمدی',
      periodStart: isoDaysAgo(14),
      periodEnd: isoDaysAgo(0),
      overallScore: 85.4,
      attendanceRate: 100,
      assignmentCompletionRate: 92.9,
      completedAssignments: 13,
      totalAssignments: 14,
      coachNote: 'حضور منظم و ارسال به‌موقع همهٔ تکالیف دورهٔ جاری.',
      generatedAt: isoDaysAgo(0),
      metrics: [
        { id: 17, metricKey: 'math', metricLabel: 'ریاضی', score: 86, target: 100, rank: 1, notes: 'میانگین نمرات تمرین‌ها' },
        { id: 18, metricKey: 'quran', metricLabel: 'قرآن', score: 93, target: 100, rank: 2, notes: 'پیشرفت قرائت و حفظ' },
        { id: 19, metricKey: 'assignments', metricLabel: 'تکالیف', score: 92.9, target: 100, rank: 3, notes: 'تکمیل ۱۳ از ۱۴ تکلیف' },
        { id: 20, metricKey: 'behavior', metricLabel: 'رفتار', score: 85, target: 100, rank: 4, notes: 'ارزیابی مربی' },
      ],
    },
  ];

  private readonly leaderboard: LeaderboardEntryDto[] = [
    { studentId: 1, studentName: 'علی احمدی', overallScore: 85.4, rank: 1 },
    { studentId: 2, studentName: 'فاطمه محمدی', overallScore: 82.1, rank: 2 },
    { studentId: 3, studentName: 'محمد رضایی', overallScore: 78.9, rank: 3 },
    { studentId: 4, studentName: 'زهرا کریمی', overallScore: 74.3, rank: 4 },
    { studentId: 5, studentName: 'حسین موسوی', overallScore: 69.7, rank: 5 },
  ];

  getDashboardSummary(): Observable<DashboardSummaryDto> {
    const trend = this.reports
      .slice()
      .sort((a, b) => a.periodEnd.localeCompare(b.periodEnd))
      .map(r => ({
        date: r.periodEnd,
        overallScore: r.overallScore,
        attendanceRate: r.attendanceRate,
        assignmentCompletionRate: r.assignmentCompletionRate,
      }));
    return of({
      recentReports: this.reports.slice().sort((a, b) => b.periodEnd.localeCompare(a.periodEnd)).slice(0, 3),
      trend,
      pendingEvaluations: 2,
      unreadMessages: 3,
      openWorkflows: 1,
      totalXp: 2450,
      leaderboard: this.leaderboard,
    });
  }

  getStudentReports(studentId: number, limit = 12): Observable<ProgressReportDto[]> {
    const filtered = this.reports
      .filter(r => r.studentId === studentId)
      .sort((a, b) => b.periodEnd.localeCompare(a.periodEnd))
      .slice(0, limit);
    return of(filtered);
  }

  generateReport(req: GenerateReportRequest): Observable<ProgressReportDto> {
    const metrics = [
      { id: this.nextMetricId(), metricKey: 'math', metricLabel: 'ریاضی', score: 80, target: 100, rank: 1, notes: 'میانگین نمرات تمرین‌ها' },
      { id: this.nextMetricId(), metricKey: 'quran', metricLabel: 'قرآن', score: 85, target: 100, rank: 2, notes: 'پیشرفت قرائت و حفظ' },
      { id: this.nextMetricId(), metricKey: 'assignments', metricLabel: 'تکالیف', score: 90, target: 100, rank: 3, notes: 'تکمیل تکالیف دوره' },
      { id: this.nextMetricId(), metricKey: 'behavior', metricLabel: 'رفتار', score: 85, target: 100, rank: 4, notes: 'ارزیابی مربی' },
    ];
    const report: ProgressReportDto = {
      id: this.nextReportId(),
      studentId: req.studentId,
      studentName: this.reports.find(r => r.studentId === req.studentId)?.studentName ?? `دانش‌آموز ${req.studentId}`,
      periodStart: req.periodStart,
      periodEnd: req.periodEnd,
      overallScore: Math.round((metrics.reduce((sum, m) => sum + m.score, 0) / metrics.length) * 100) / 100,
      attendanceRate: 90,
      assignmentCompletionRate: 90,
      completedAssignments: 12,
      totalAssignments: 14,
      coachNote: req.coachNote,
      generatedAt: new Date().toISOString(),
      metrics,
    };
    this.reports.push(report);
    return of(report);
  }

  getLeaderboard(limit = 10): Observable<LeaderboardEntryDto[]> {
    return of(this.leaderboard.slice(0, limit));
  }

  private nextReportId(): number {
    return Math.max(0, ...this.reports.map(r => r.id)) + 1;
  }

  private nextMetricId(): number {
    return Math.max(0, ...this.reports.flatMap(r => r.metrics.map(m => m.id))) + 1;
  }
}
