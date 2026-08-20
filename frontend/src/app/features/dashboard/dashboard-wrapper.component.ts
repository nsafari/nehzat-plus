import { Component, inject } from '@angular/core';
import { PHASE_CONFIG } from '../../core/tokens/phase.token';
import { DashboardChildComponent } from './components/dashboard-child.component';
import { DashboardTeenComponent } from './components/dashboard-teen.component';

@Component({
  selector: 'app-dashboard-wrapper',
  template: `
    @if (phaseConfig().isChild) {
      <app-dashboard-child />
    } @else {
      <app-dashboard-teen />
    }
  `,
  standalone: true,
  imports: [DashboardChildComponent, DashboardTeenComponent],
})
export class DashboardWrapperComponent {
  readonly phaseConfig = inject(PHASE_CONFIG);
}
