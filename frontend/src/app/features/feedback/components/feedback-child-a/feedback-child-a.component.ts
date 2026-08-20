import { Component, input } from '@angular/core';
import { FeedbackDto } from '../../models/feedback.models';

@Component({
  selector: 'app-feedback-child-a',
  standalone: true,
  template: `
    <div class="phase-a">
      <div class="header">
        <span class="emoji">{{ feedback().emoji }}</span>
        <h3>{{ feedback().title }}</h3>
      </div>
      <p>{{ feedback().mainText }}</p>
      @if (feedback().stickerUrl) {
        <img [src]="feedback().stickerUrl" alt="sticker" class="sticker" />
      }
    </div>
  `,
  styles: [`
    .phase-a { text-align: center; padding: 1.5rem; }
    .header { display: flex; align-items: center; justify-content: center; gap: 0.5rem; }
    .emoji { font-size: 3rem; }
    h3 { font-size: 1.5rem; color: #333; margin: 0; }
    .sticker { max-width: 120px; margin-top: 1rem; }
    p { font-size: 1rem; color: #555; line-height: 1.6; }
  `]
})
export class FeedbackChildAComponent {
  feedback = input.required<FeedbackDto>();
}
