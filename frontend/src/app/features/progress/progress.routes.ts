import { Routes } from '@angular/router';

export const PROGRESS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/dashboard-summary/dashboard-summary.component').then(
        (m) => m.DashboardSummaryComponent,
      ),
  },
];