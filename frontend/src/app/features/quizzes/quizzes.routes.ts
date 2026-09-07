import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const QUIZ_ROUTES: Routes = [
  {
    path: '',
    title: 'آزمون‌ها',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/quiz-list/quiz-list.component').then((m) => m.QuizListComponent)
  },
  {
    path: ':id',
    title: ' جزئیات آزمون',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/quiz-detail/quiz-detail.component').then((m) => m.QuizDetailComponent)
  }
];