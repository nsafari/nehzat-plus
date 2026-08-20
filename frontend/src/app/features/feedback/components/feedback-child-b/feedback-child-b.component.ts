import { Component, input } from '@angular/core';
import { FeedbackDto } from '../../models/feedback.models';

@Component({
  selector: 'app-feedback-child-b',
  standalone: true,
  template: `
    <div class="phase-b">
      <div class="row">
        <span class="emoji">{{ feedback().emoji }}</span>
        <h3>{{ feedback().title }}</h3>
      </div>
      <p>{{ feedback().mainText }}</p>
      @if (feedback().grade != null) {
        <div class="score-box">
          <span class="score">{{ feedback().grade }} / {{ feedback().maxGrade }}</span>
        </div>
      }
      @if (feedback().stickerUrl) {
        <img [src]="feedback().stickerUrl" class="sticker" />
      }
    </div>
  `,
  styles: [`
    .phase-b { padding: 1.5rem; text-align: center; }
    .row { display: flex; align-items: center; justify-content: center; gap: 0.5rem; }
    .emoji { font-size: 2.5rem; }
    h3 { margin: 0; font-size: 1.3rem; }
    .score-box { background: #f0f8ff; border-radius: 12px; padding: 0.5rem 1.5rem; display: inline-block; }
    .score { font-size: 1.8rem; font-weight: bold; color: #2196F3; }
    .sticker { max-width: 100px; margin-top: 0.5rem; }
  `]
})
export class FeedbackChildBComponent {
  feedback = input.required<FeedbackDto>();
}
