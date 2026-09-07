import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const HALGHEH_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./halgheh-list.component').then((m) => m.HalghehListComponent),
  },
  {
    path: ':id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./halgheh-detail.component').then((m) => m.HalghehDetailComponent),
  },
];
