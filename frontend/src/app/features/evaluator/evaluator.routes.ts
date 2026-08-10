import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';
import { EvaluatorComponent } from './evaluator.component';
import { EvaluatorQueuePageComponent } from './evaluator-queue-page.component';
import { EvaluatorFormPageComponent } from './evaluator-form-page.component';
import { EvaluatorReviewPageComponent } from './evaluator-review-page.component';
import { EvaluatorAnalyticsPageComponent } from './evaluator-analytics-page.component';
import { SpiritualShellComponent } from '../shared/spiritual-shell/spiritual-shell.component';

@Component({
  standalone: true,
  imports: [SpiritualShellComponent],
  template: '<app-spiritual-shell />'
})
export class EvaluatorSpiritualPageComponent {}

export const EVALUATOR_ROUTES: Routes = [
  {
    path: '',
    component: EvaluatorComponent,
    canActivate: [roleGuard('evaluator')],
    children: [
      { path: '', redirectTo: 'queue', pathMatch: 'full' },
      { path: 'queue', component: EvaluatorQueuePageComponent },
      { path: 'form', component: EvaluatorFormPageComponent },
      { path: 'form/:id', component: EvaluatorFormPageComponent },
      { path: 'review', component: EvaluatorReviewPageComponent },
      { path: 'analytics', component: EvaluatorAnalyticsPageComponent },
    ]
  },
  {
    path: 'spiritual',
    canActivate: [roleGuard('evaluator')],
    component: EvaluatorSpiritualPageComponent
  }
];
