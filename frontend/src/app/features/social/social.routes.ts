import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { roleGuard } from '../../core/guards/role.guard';

export const SOCIAL_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard, roleGuard('trainee')],
    loadComponent: () => import('./social.component').then((m) => m.SocialComponent)
  }
];
