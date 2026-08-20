import { Component, inject, OnInit, signal } from '@angular/core';
import { FeedbackService } from '../services/feedback.service';
import { PhaseTransitionService } from '../services/phase-transition.service';
import { FeedbackRendererComponent } from '../components/feedback-renderer/feedback-renderer.component';
import { FeedbackDto } from '../models/feedback.models';

@Component({
  selector: 'app-feedback-page',
  standalone: true,
  imports: [FeedbackRendererComponent],
  template: `
    <app-feedback-renderer [feedbacks]="feedbacks()" />
  `
})
export class FeedbackPageComponent implements OnInit {
  private feedbackService = inject(FeedbackService);
  private phaseTransition = inject(PhaseTransitionService);
  feedbacks = signal<FeedbackDto[]>([]);

  ngOnInit() {
    this.feedbackService.getRecent(10).subscribe(fbs => {
      this.feedbacks.set(fbs);
      const latest = fbs[0];
      if (latest) {
        this.phaseTransition.checkPhase(latest.phase);
      }
    });
  }
}
