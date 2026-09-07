import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import type {
  DailyNudge,
  NudgeDomain
} from '../../../../core/models/lesson-planner.models';

@Component({
  selector: 'app-dashboard-nudge-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (loadingNudges) {
      <p class="muted">در حال دریافت یادآورها...</p>
    } @else if (dailyNudges.length > 0) {
      <div class="smart-nudges">
        <h5 class="smart-nudges__title"><i class="bi bi-bell-fill"></i> یادآورهای هوشمند</h5>
        <div class="smart-nudges__list">
          @for (nudge of dailyNudges; track nudge.id) {
            <article [class]="'nudge-card nudge-card--' + nudge.domain">
              <i class="bi" [class]="nudgeDomainIcon(nudge.domain)"></i>
              <p class="nudge-card__message">{{ nudge.message }}</p>
              <button
                type="button"
                class="nudge-card__dismiss"
                (click)="dismiss.emit(nudge.id)"
                aria-label="بستن یادآور"
              >
                ×
              </button>
            </article>
          }
        </div>
      </div>
    }
  `,
  styleUrls: ['./dashboard-nudge-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardNudgePanelComponent {
  @Input() dailyNudges: DailyNudge[] = [];
  @Input() loadingNudges = false;

  @Output() dismiss = new EventEmitter<number>();

  nudgeDomainIcon(domain: NudgeDomain): string {
    switch (domain) {
      case 'scientific':
        return 'bi-journal-bookmark';
      case 'spiritual':
        return 'bi-moon-stars';
      case 'physical':
        return 'bi-activity';
      default:
        return 'bi-bell';
    }
  }
}
