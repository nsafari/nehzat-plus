import { Component, input } from '@angular/core';
import { FeedbackDto } from '../../models/feedback.models';

@Component({
  selector: 'app-feedback-teen-d',
  standalone: true,
  template: `
    <div class="phase-d">
      <h3>{{ feedback().title }}</h3>
      <p>{{ feedback().mainText }}</p>
      @if (feedback().grade != null) {
        <div class="score-display">
          <span class="label">نمره:</span>
          <span class="score">{{ feedback().grade }} / {{ feedback().maxGrade }}</span>
        </div>
      }
      @if (feedback().chartData; as data) {
        <div class="chart">
          @for (item of data; track item.label) {
            <div class="bar-row">
              <span class="bar-label">{{ item.label }}</span>
              <div class="bar-track">
                <div class="bar-fill" [style.width.%]="item.value" [style.background]="item.color"></div>
              </div>
              <span class="bar-value">{{ item.value }}%</span>
            </div>
          }
        </div>
      }
      @if (feedback().analysis; as analysis) {
        <div class="analysis-box">
          <h4>📈 تحلیل</h4>
          <p>{{ analysis }}</p>
        </div>
      }
    </div>
  `,
  styles: [`
    .phase-d { padding: 1rem; }
    h3 { font-size: 1.2rem; margin-bottom: 0.5rem; }
    .score-display { margin: 0.5rem 0; display: flex; gap: 0.5rem; align-items: center; }
    .score { font-weight: bold; color: #9B59B6; font-size: 1.3rem; }
    .chart { margin-top: 1rem; }
    .bar-row { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; }
    .bar-label { width: 80px; font-size: 0.85rem; }
    .bar-track { flex: 1; height: 20px; background: #eee; border-radius: 10px; overflow: hidden; }
    .bar-fill { height: 100%; border-radius: 10px; }
    .bar-value { width: 40px; text-align: right; }
    .analysis-box { margin-top: 1rem; background: #f3e5f5; border-radius: 10px; padding: 1rem; }
    .analysis-box h4 { margin: 0 0 0.5rem 0; }
  `]
})
export class FeedbackTeenDComponent {
  feedback = input.required<FeedbackDto>();
}
