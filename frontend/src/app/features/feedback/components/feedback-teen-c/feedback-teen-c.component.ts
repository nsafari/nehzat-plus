import { Component, input } from '@angular/core';
import { FeedbackDto } from '../../models/feedback.models';

@Component({
  selector: 'app-feedback-teen-c',
  standalone: true,
  template: `
    <div class="phase-c">
      <h3>{{ feedback().title }}</h3>
      <p>{{ feedback().mainText }}</p>
      @if (feedback().grade != null) {
        <div class="score-row">
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
    </div>
  `,
  styles: [`
    .phase-c { padding: 1rem; }
    h3 { font-size: 1.2rem; color: #333; margin-bottom: 0.5rem; }
    .score-row { display: flex; gap: 0.5rem; align-items: center; margin: 0.5rem 0; }
    .score { font-weight: bold; color: #4CAF50; font-size: 1.3rem; }
    .chart { margin-top: 1rem; }
    .bar-row { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; }
    .bar-label { width: 80px; font-size: 0.85rem; color: #555; }
    .bar-track { flex: 1; height: 20px; background: #eee; border-radius: 10px; overflow: hidden; }
    .bar-fill { height: 100%; border-radius: 10px; transition: width 0.6s ease; }
    .bar-value { width: 40px; text-align: right; font-size: 0.85rem; color: #333; }
  `]
})
export class FeedbackTeenCComponent {
  feedback = input.required<FeedbackDto>();
}
