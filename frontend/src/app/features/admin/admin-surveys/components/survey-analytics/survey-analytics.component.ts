import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import {
  Chart,
  ChartConfiguration,
  ChartData,
  registerables
} from 'chart.js';

import type { SurveyAnalytics } from '../../../../../core/models/lesson-planner.models';

Chart.register(...registerables);

@Component({
  selector: 'app-survey-analytics',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  template: `
    @if (loading) {
      <p class="muted">در حال دریافت تحلیل...</p>
    } @else if (analyticsData === null) {
      <p class="muted">داده‌ای برای تحلیل موجود نیست.</p>
    } @else {
      <div class="analytics-section">
        <h4>تحلیل کلی</h4>
        <div class="survey-stats-grid">
          <div class="stat-card">
            <span class="stat-label">تعداد پاسخ‌دهندگان</span>
            <strong class="stat-value">{{ analyticsData.totalRespondents }}</strong>
          </div>
          <div class="stat-card">
            <span class="stat-label">تعداد سوالات</span>
            <strong class="stat-value">{{ analyticsData.totalQuestions }}</strong>
          </div>
          <div class="stat-card">
            <span class="stat-label">میانگین کل</span>
            <strong class="stat-value">{{ analyticsData.overallAverage }}</strong>
          </div>
        </div>
      </div>

      @if (categoryChartData) {
        <div class="analytics-section">
          <h4>میانگین نمره بر اساس دسته‌بندی</h4>
          <div class="chart-container">
            <canvas baseChart
              [data]="categoryChartData"
              [options]="barChartOptions"
              type="bar">
            </canvas>
          </div>
        </div>
      }

      @if (severityChartData) {
        <div class="analytics-section">
          <h4>توزیع شدت مشکلات</h4>
          <div class="chart-container chart-container--small">
            <canvas baseChart
              [data]="severityChartData"
              [options]="doughnutChartOptions"
              type="doughnut">
            </canvas>
          </div>
        </div>
      }

      @if (analyticsData.categoryBreakdown.length) {
        <div class="analytics-section">
          <h4>تحلیل بر اساس دسته‌بندی</h4>
          <div class="analytics-table">
            <div class="analytics-row analytics-header">
              <span>دسته‌بندی</span>
              <span>میانگین نمره</span>
              <span>تعداد سوال</span>
              <span>شدت</span>
            </div>
            @for (cat of analyticsData.categoryBreakdown; track cat.category) {
              <div class="analytics-row">
                <span>{{ cat.category }}</span>
                <span>{{ cat.averageScore }}</span>
                <span>{{ cat.questionCount }}</span>
                <span class="tag" [ngClass]="severityClass(cat.severity)">
                  {{ cat.severity === 'critical' ? 'بحرانی' : cat.severity === 'problem' ? 'مشکل' : 'قابل حل' }}
                </span>
              </div>
            }
          </div>
        </div>
      }
    }
  `,
  styles: [`
    .analytics-section h4 { margin: 0.5rem 0; color: var(--lp-primary); font-size: 0.9rem; }
    .survey-stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 0.5rem; }
    .stat-card { border: 1px solid var(--lp-border); border-radius: 12px; padding: 0.6rem; text-align: center; }
    .stat-label { display: block; font-size: 0.75rem; color: var(--lp-muted); }
    .stat-value { display: block; font-size: 1.2rem; font-weight: 700; color: var(--lp-primary); }
    .chart-container { height: 250px; margin: 1rem 0; }
    .chart-container--small { height: 200px; max-width: 300px; margin: 1rem auto; }
    .analytics-table { display: grid; gap: 0.25rem; font-size: 0.85rem; }
    .analytics-row { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 0.5rem; padding: 0.4rem 0.6rem; border-bottom: 1px solid var(--lp-border); }
    .analytics-header { font-weight: 700; background: var(--lp-primary-light); }
    .muted { color: var(--lp-muted); font-size: 0.85rem; }
    .tag { padding: 0.1rem 0.4rem; border-radius: 6px; font-size: 0.75rem; font-weight: 600; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SurveyAnalyticsComponent implements OnChanges {
  @Input() analyticsData: SurveyAnalytics | null = null;
  @Input() loading = false;

  categoryChartData: ChartData<'bar'> | null = null;
  severityChartData: ChartData<'doughnut'> | null = null;

  barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
        ticks: { stepSize: 1 }
      }
    }
  };

  doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' }
    }
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['analyticsData'] && this.analyticsData) {
      this.buildCharts();
    }
  }

  private buildCharts(): void {
    if (!this.analyticsData) return;

    // Bar chart: category average scores
    if (this.analyticsData.categoryBreakdown.length > 0) {
      this.categoryChartData = {
        labels: this.analyticsData.categoryBreakdown.map(c => c.category),
        datasets: [{
          data: this.analyticsData.categoryBreakdown.map(c => c.averageScore),
          backgroundColor: this.analyticsData.categoryBreakdown.map(c =>
            c.severity === 'critical' ? '#ef4444' :
            c.severity === 'problem' ? '#f59e0b' : '#22c55e'
          ),
          borderColor: this.analyticsData.categoryBreakdown.map(c =>
            c.severity === 'critical' ? '#dc2626' :
            c.severity === 'problem' ? '#d97706' : '#16a34a'
          ),
          borderWidth: 1
        }]
      };
    }

    // Doughnut chart: severity distribution
    const severityCounts = { critical: 0, problem: 0, solvable: 0 };
    this.analyticsData.categoryBreakdown.forEach(c => {
      if (c.severity === 'critical') severityCounts.critical++;
      else if (c.severity === 'problem') severityCounts.problem++;
      else severityCounts.solvable++;
    });

    if (severityCounts.critical + severityCounts.problem + severityCounts.solvable > 0) {
      this.severityChartData = {
        labels: ['بحرانی', 'مشکل', 'قابل حل'],
        datasets: [{
          data: [severityCounts.critical, severityCounts.problem, severityCounts.solvable],
          backgroundColor: ['#ef4444', '#f59e0b', '#22c55e'],
          borderColor: ['#dc2626', '#d97706', '#16a34a'],
          borderWidth: 2
        }]
      };
    }
  }

  severityClass(severity: string): string {
    switch (severity) {
      case 'critical':
        return 'status-chip--active';
      case 'problem':
        return 'status-chip--closed';
      default:
        return '';
    }
  }
}
