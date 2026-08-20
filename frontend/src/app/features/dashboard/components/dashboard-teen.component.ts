import { Component, computed, inject } from '@angular/core';
import { PHASE_CONFIG } from '../../../core/tokens/phase.token';

@Component({
  selector: 'app-dashboard-teen',
  standalone: true,
  template: `
    <div class="teen-dashboard">
      <header class="teen-header">
        <h1>داشبورد</h1>
        <p class="phase-label">فاز {{ phase() }} — مسیر پیشرفت تو</p>
      </header>

      <section class="stats-row">
        <div class="stat-item">
          <strong>۸۵٪</strong>
          <span>نمره کل</span>
        </div>
        <div class="stat-item">
          <strong>۷</strong>
          <span>روز متوالی</span>
        </div>
        <div class="stat-item">
          <strong>۴۲</strong>
          <span>دقیقه امروز</span>
        </div>
      </section>

      <section class="teen-grid">
        <div class="teen-card" (click)="onCardClick('tasks')">
          <span class="card-icon">📋</span>
          <div class="card-body">
            <h2>تکالیف</h2>
            <p>۳ تا انجام نشده</p>
          </div>
          <span class="badge badge-warn">۳</span>
        </div>

        <div class="teen-card" (click)="onCardClick('courses')">
          <span class="card-icon">📖</span>
          <div class="card-body">
            <h2>دوره‌ها</h2>
            <p>۲ دوره فعال</p>
          </div>
          <span class="badge">جاری</span>
        </div>

        <div class="teen-card" (click)="onCardClick('progress')">
          <span class="card-icon">📊</span>
          <div class="card-body">
            <h2>آمار پیشرفت</h2>
            <p>نمودار نمرات</p>
          </div>
        </div>

        <div class="teen-card" (click)="onCardClick('career')">
          <span class="card-icon">🎯</span>
          <div class="card-body">
            <h2>هدایت شغلی</h2>
            <p>مسیر مناسب تو</p>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .teen-dashboard {
      padding: 24px;
      min-height: 100vh;
      max-width: 1000px;
      margin: 0 auto;
    }
    .teen-header {
      margin-bottom: 24px;
    }
    .teen-header h1 {
      font-size: 24px;
      margin: 0 0 4px;
    }
    .phase-label {
      color: var(--lp-text-muted);
      font-size: 13px;
      margin: 0;
    }
    .stats-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin-bottom: 28px;
    }
    .stat-item {
      background: var(--lp-bg-card);
      border-radius: 16px;
      box-shadow: var(--lp-shadow);
      padding: 16px;
      text-align: center;
    }
    .stat-item strong {
      display: block;
      font-size: 26px;
      color: var(--lp-primary);
    }
    .stat-item span {
      font-size: 12px;
      color: var(--lp-text-muted);
    }
    .teen-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 14px;
    }
    .teen-card {
      display: flex;
      align-items: center;
      gap: 14px;
      background: var(--lp-bg-card);
      border-radius: 18px;
      box-shadow: var(--lp-shadow);
      padding: 18px;
      cursor: pointer;
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }
    .teen-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
    }
    .teen-card:active {
      transform: scale(0.98);
    }
    .card-icon {
      font-size: 30px;
      line-height: 1;
    }
    .card-body {
      flex: 1;
      min-width: 0;
    }
    .card-body h2 {
      font-size: 15px;
      font-weight: 700;
      margin: 0 0 4px;
      color: var(--lp-text);
    }
    .card-body p {
      font-size: 12px;
      color: var(--lp-text-muted);
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .badge {
      flex-shrink: 0;
      background: var(--lp-primary-light, rgba(0, 0, 0, 0.06));
      color: var(--lp-text-muted);
      border-radius: 999px;
      padding: 3px 10px;
      font-size: 11px;
      font-weight: 600;
    }
    .badge-warn {
      background: #FFF0F0;
      color: #E04F4F;
    }
  `],
})
export class DashboardTeenComponent {
  private readonly phaseConfig = inject(PHASE_CONFIG);
  readonly phase = computed(() => this.phaseConfig().phase);

  onCardClick(section: string): void {
    console.log(`[dashboard-teen] رفتن به «${section}» — به‌زودی`);
  }
}
