import { Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FeedbackDto } from '../../models/feedback.models';
import { FeedbackChildAComponent } from '../feedback-child-a/feedback-child-a.component';
import { FeedbackChildBComponent } from '../feedback-child-b/feedback-child-b.component';
import { FeedbackTeenCComponent } from '../feedback-teen-c/feedback-teen-c.component';
import { FeedbackTeenDComponent } from '../feedback-teen-d/feedback-teen-d.component';
import { FeedbackYoungAdultEComponent } from '../feedback-young-adult-e/feedback-young-adult-e.component';
import { PhaseTransitionBannerComponent } from '../phase-transition-banner/phase-transition-banner.component';

@Component({
  selector: 'app-feedback-renderer',
  standalone: true,
  imports: [
    DatePipe,
    FeedbackChildAComponent,
    FeedbackChildBComponent,
    FeedbackTeenCComponent,
    FeedbackTeenDComponent,
    FeedbackYoungAdultEComponent,
    PhaseTransitionBannerComponent,
  ],
  template: `
    <app-phase-transition-banner />
    <div class="feedback-list">
      @for (fb of feedbacks(); track fb.submissionId) {
        <div class="feedback-card">
          @switch (fb.phase) {
            @case ('A') { <app-feedback-child-a [feedback]="fb" /> }
            @case ('B') { <app-feedback-child-b [feedback]="fb" /> }
            @case ('C') { <app-feedback-teen-c [feedback]="fb" /> }
            @case ('D') { <app-feedback-teen-d [feedback]="fb" /> }
            @case ('E') { <app-feedback-young-adult-e [feedback]="fb" /> }
          }
          <div class="meta">
            <span class="badge">{{ fb.phase }}</span>
            @if (fb.subjectName) {
              <span class="subject">{{ fb.subjectName }}</span>
            }
            <span class="date">{{ fb.feedbackDate | date:'short' }}</span>
          </div>
        </div>
      } @empty {
        <div class="empty">
          <p>هنوز بازخوردی ثبت نشده.</p>
        </div>
      }
    </div>
  `,
  styles: [`
    .feedback-list { display: flex; flex-direction: column; gap: 1rem; }
    .feedback-card { position: relative; background: white; border-radius: 12px; padding: 1rem; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    .meta { display: flex; gap: 0.5rem; align-items: center; margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px solid #eee; font-size: 0.8rem; color: #888; direction: ltr; }
    .badge { background: #e0e0e0; border-radius: 6px; padding: 0.15rem 0.5rem; font-weight: bold; }
    .empty { text-align: center; padding: 2rem; color: #999; }
  `]
})
export class FeedbackRendererComponent {
  feedbacks = input<FeedbackDto[]>([]);
}
