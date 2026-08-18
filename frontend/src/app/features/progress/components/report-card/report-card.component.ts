import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import type { ProgressReportDto } from '../../../../core/models/lesson-planner.models';

@Component({
  selector: 'app-report-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: block;
      }
      .report-card {
        display: flex;
        flex-direction: column;
        gap: 0.65rem;
        padding: 1rem;
        border: 1px solid var(--lp-border);
        border-radius: 0.75rem;
        background: var(--lp-surface);
        direction: rtl;
      }
      .report-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.5rem;
      }
      .report-student {
        font-weight: 700;
        color: var(--lp-text);
      }
      .report-overall {
        font-weight: 700;
        color: var(--lp-gold);
        white-space: nowrap;
      }
      .period {
        font-size: 0.75rem;
        color: var(--lp-muted);
      }
      .bar-track {
        height: 0.55rem;
        border-radius: 999px;
        background: var(--lp-border);
        overflow: hidden;
      }
      .bar-fill {
        height: 100%;
        border-radius: 999px;
        background: linear-gradient(90deg, var(--lp-primary), var(--lp-gold));
        transition: width 0.4s ease;
      }
      .report-meta {
        display: flex;
        justify-content: space-between;
        gap: 0.5rem;
        font-size: 0.75rem;
        color: var(--lp-muted);
      }
      .metric-list {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
      }
      .metric-row {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.75rem;
      }
      .metric-label {
        min-width: 3.5rem;
        color: var(--lp-text);
      }
      .metric-track {
        flex: 1;
        height: 0.4rem;
        border-radius: 999px;
        background: var(--lp-border);
        overflow: hidden;
      }
      .metric-fill {
        height: 100%;
        border-radius: 999px;
        background: var(--lp-primary);
      }
      .metric-score {
        min-width: 2.6rem;
        text-align: left;
        color: var(--lp-muted);
        font-variant-numeric: tabular-nums;
      }
      .coach-note {
        font-size: 0.78rem;
        color: var(--lp-muted);
        background: var(--lp-bg);
        border-radius: 0.5rem;
        padding: 0.5rem 0.6rem;
        line-height: 1.6;
      }
      .empty {
        padding: 1rem;
        text-align: center;
        color: var(--lp-muted);
        border: 1px dashed var(--lp-border);
        border-radius: 0.75rem;
        font-size: 0.85rem;
      }
    `,
  ],
  template: `
    <article class="report-card">
      <div class="report-head">
        <span class="report-student">{{ report.studentName }}</span>
        <span class="report-overall">{{ percent(report.overallScore) }}</span>
      </div>
      <div class="period">{{ date(report.periodStart) }} — {{ date(report.periodEnd) }}</div>
      <div class="bar-track">
        <div class="bar-fill" [style.width.%]="clamp(report.assignmentCompletionRate)"></div>
      </div>
      <div class="report-meta">
        <span>تکالیف: {{ report.completedAssignments }} از {{ report.totalAssignments }}</span>
        <span>حضور: {{ percent(report.attendanceRate) }}</span>
      </div>
      @if (report.metrics.length) {
        <ul class="metric-list">
          @for (metric of report.metrics; track metric.id) {
            <li class="metric-row">
              <span class="metric-label">{{ metric.metricLabel }}</span>
              <span class="metric-track">
                <span class="metric-fill" [style.width.%]="clamp(metric.score)"></span>
              </span>
              <span class="metric-score">{{ percent(metric.score) }}</span>
            </li>
          }
        </ul>
      }
      @if (report.coachNote) {
        <p class="coach-note">{{ report.coachNote }}</p>
      }
    </article>
  `,
})
export class ReportCardComponent {
  @Input() report!: ProgressReportDto;

  percent(value: number): string {
    return `${this.clamp(value).toLocaleString('fa-IR', { maximumFractionDigits: 1 })}٪`;
  }

  clamp(value: number): number {
    return Math.max(0, Math.min(100, value ?? 0));
  }

  date(value: string): string {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return `${d.getFullYear()}/${(d.getMonth() + 1).toLocaleString('fa-IR')}/${d.getDate().toLocaleString('fa-IR')}`;
  }
}