import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { roleGuard } from '../../core/guards/role.guard';

export const TRAINING_COURSES_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard, roleGuard('trainee')],
    loadComponent: () => import('./training-courses.component').then(m => m.TrainingCoursesComponent)
  },
  {
    path: ':id',
    canActivate: [authGuard, roleGuard('trainee')],
    loadComponent: () => import('./training-course-detail/training-course-detail.component').then(m => m.TrainingCourseDetailComponent)
  },
  {
    path: ':id/sessions/:sessionId',
    canActivate: [authGuard, roleGuard('trainee')],
    loadComponent: () => import('./training-session-detail/training-session-detail.component').then(m => m.TrainingSessionDetailComponent)
  }
];
