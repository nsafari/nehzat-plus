import type { Routes } from '@angular/router';

export const COURIER_REPORT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/courier-report-page.component').then((m) => m.CourierReportPageComponent),
  },
];
