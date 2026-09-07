import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { roleGuard } from '../../core/guards/role.guard';

export const CAREER_PATHWAYS_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard, roleGuard('trainee')],
    loadComponent: () => import('./career-pathways.component').then((m) => m.CareerPathwaysComponent)
  }
];
