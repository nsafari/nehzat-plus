import { Component, inject } from '@angular/core';
import { PhaseTransitionService } from '../../services/phase-transition.service';

@Component({
  selector: 'app-phase-transition-banner',
  standalone: true,
  template: `
    @if (service.showBanner()) {
      @if (service.transitionInfo(); as info) {
        <div class="banner">
          <span class="icon">🎉</span>
          <p>{{ info.message }}</p>
          <button class="close" (click)="service.dismiss()">✕</button>
        </div>
      }
    }
  `,
  styles: [`
    .banner {
      position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white; padding: 1rem; display: flex; align-items: center;
      justify-content: center; gap: 1rem; font-size: 1.1rem;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2); animation: slideDown 0.5s ease-out;
    }
    .close {
      background: none; border: none; color: white; font-size: 1.5rem;
      cursor: pointer; position: absolute; right: 1rem; opacity: 0.8;
    }
    @keyframes slideDown {
      from { transform: translateY(-100%); }
      to { transform: translateY(0); }
    }
  `]
})
export class PhaseTransitionBannerComponent {
  service = inject(PhaseTransitionService);
}
