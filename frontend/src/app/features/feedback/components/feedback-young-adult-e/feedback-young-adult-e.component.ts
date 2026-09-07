import { Component, input } from '@angular/core';
import { FeedbackDto } from '../../models/feedback.models';

@Component({
  selector: 'app-feedback-young-adult-e',
  standalone: true,
  template: `
    <div class="phase-e">
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
          <h4>📋 تحلیل جامع</h4>
          <p>{{ analysis }}</p>
        </div>
      }
      @if (feedback().suggestions; as sugs) {
        <div class="suggestions-box">
          <h4>💡 پیشنهادات</h4>
          <ul>
            @for (sug of sugs; track $index) {
              <li>{{ sug }}</li>
            }
          </ul>
        </div>
      }
    </div>
  `,
  styles: [`
    .phase-e { padding: 1rem; }
    h3 { font-size: 1.3rem; margin-bottom: 0.5rem; color: #2c3e50; }
    .score-display { margin: 0.5rem 0; display: flex; gap: 0.5rem; align-items: center; }
    .score { font-weight: bold; color: #2196F3; font-size: 1.4rem; }
    .chart { margin-top: 1rem; }
    .bar-row { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.4rem; }
    .bar-label { width: 90px; font-size: 0.85rem; }
    .bar-track { flex: 1; height: 22px; background: #eee; border-radius: 10px; overflow: hidden; }
    .bar-fill { height: 100%; border-radius: 10px; }
    .bar-value { width: 45px; text-align: right; font-size: 0.85rem; }
    .analysis-box { margin-top: 1rem; background: #e8f4f8; border-radius: 10px; padding: 1rem; }
    .suggestions-box { margin-top: 1rem; background: #fff3cd; border-radius: 10px; padding: 1rem; }
    .suggestions-box ul { margin: 0.5rem 0 0 0; padding-left: 1.5rem; }
    .suggestions-box li { margin-bottom: 0.3rem; }
  `]
})
export class FeedbackYoungAdultEComponent {
  feedback = input.required<FeedbackDto>();
}
