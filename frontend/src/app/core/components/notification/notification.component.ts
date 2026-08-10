import { Component, inject } from '@angular/core';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  template: `
    <div class="lp-toast-container">
      @for (n of service.notifications(); track n.id) {
        <div class="lp-toast lp-toast--{{ n.type }}" role="alert" aria-live="assertive">
          <span class="lp-toast__message">{{ n.message }}</span>
          <button type="button" class="lp-toast__close" (click)="service.dismiss(n.id)">×</button>
        </div>
      }
    </div>
  `,
  styles: `
    .lp-toast-container {
      position: fixed;
      bottom: 1.5rem;
      left: 1rem;
      right: auto;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
      max-width: 420px;
      width: calc(100% - 2rem);
      pointer-events: none;
    }
    .lp-toast {
      pointer-events: auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
      padding: 0.85rem 1rem;
      border-radius: 14px;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
      animation: lp-toast-in 0.3s ease-out;
      font-weight: 600;
      font-size: 0.9rem;
    }
    .lp-toast--error {
      background: #fef2f2;
      border: 1px solid var(--lp-danger, #fca5a5);
      color: var(--lp-danger, #991b1b);
    }
    .lp-toast--success {
      background: #f0fdf4;
      border: 1px solid var(--lp-primary, #86efac);
      color: var(--lp-primary, #166534);
    }
    .lp-toast--info {
      background: var(--lp-primary-light, #e8f5ee);
      border: 1px solid var(--lp-primary, #1a6b3c);
      color: var(--lp-text, #1e1b14);
    }
    @media (prefers-reduced-motion: reduce) {
      .lp-toast {
        animation: none;
      }
    }
    .lp-toast__message {
      flex: 1;
    }
    .lp-toast__close {
      background: none;
      border: none;
      font-size: 1.25rem;
      cursor: pointer;
      opacity: 0.5;
      padding: 0 0.2rem;
      line-height: 1;
      color: inherit;
    }
    .lp-toast__close:hover {
      opacity: 1;
    }
    @keyframes lp-toast-in {
      from {
        opacity: 0;
        transform: translateY(1rem);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `
})
export class NotificationComponent {
  service = inject(NotificationService);
}
