import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const MAKTAB_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./maktab-overview.component').then((m) => m.MaktabOverviewComponent),
  },
  {
    path: ':id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./maktab-detail.component').then((m) => m.MaktabDetailComponent),
  },
];
