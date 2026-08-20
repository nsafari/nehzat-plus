import { Component, computed, inject } from '@angular/core';
import { PHASE_CONFIG } from '../../../core/tokens/phase.token';

@Component({
  selector: 'app-dashboard-child',
  standalone: true,
  template: `
    <div class="child-dashboard">
      <header class="child-header">
        <h1>🌟 سلام رفیق!</h1>
        <p class="phase-label">فاز {{ phase() }} — جای بچه‌های باهوش</p>
      </header>

      <div class="child-grid">
        <div class="child-card card-games" (click)="onCardClick('games')">
          <span class="card-icon">🎮</span>
          <h2>بازی‌ها</h2>
        </div>

        <div class="child-card card-lessons" (click)="onCardClick('lessons')">
          <span class="card-icon">📚</span>
          <h2>درس‌ها</h2>
        </div>

        <div class="child-card card-draw" (click)="onCardClick('draw')">
          <span class="card-icon">🎨</span>
          <h2>نقاشی</h2>
        </div>

        <div class="child-card card-rewards" (click)="onCardClick('rewards')">
          <span class="card-icon">🏆</span>
          <h2>جوایز</h2>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .child-dashboard {
      padding: 24px;
      min-height: 100vh;
    }
    .child-header {
      text-align: center;
      margin-bottom: 36px;
    }
    .child-header h1 {
      font-size: 32px;
      margin: 0 0 8px;
    }
    .phase-label {
      color: var(--lp-text-muted);
      font-size: 14px;
      margin: 0;
    }
    .child-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      gap: 20px;
      max-width: 760px;
      margin: 0 auto;
    }
    .child-card {
      --card-accent: var(--lp-primary);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 14px;
      min-height: 180px;
      padding: 24px;
      border-radius: 28px;
      background: color-mix(in srgb, var(--card-accent) 14%, var(--lp-bg-card));
      border: 2px solid color-mix(in srgb, var(--card-accent) 30%, transparent);
      cursor: pointer;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      user-select: none;
    }
    .child-card:hover {
      transform: translateY(-6px) scale(1.02);
      box-shadow: 0 10px 24px color-mix(in srgb, var(--card-accent) 35%, transparent);
    }
    .child-card:active {
      transform: scale(0.97);
    }
    .card-games    { --card-accent: #FF6B6B; }
    .card-lessons  { --card-accent: #4ECDC4; }
    .card-draw     { --card-accent: #FFA94D; }
    .card-rewards  { --card-accent: #F7B731; }
    .card-icon {
      font-size: 56px;
      line-height: 1;
      filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.12));
    }
    .child-card h2 {
      font-size: 20px;
      font-weight: 700;
      margin: 0;
      color: var(--lp-text);
    }
  `],
})
export class DashboardChildComponent {
  private readonly phaseConfig = inject(PHASE_CONFIG);
  readonly phase = computed(() => this.phaseConfig().phase);

  onCardClick(section: string): void {
    console.log(`[dashboard-child] رفتن به «${section}» — به‌زودی`);
  }
}
