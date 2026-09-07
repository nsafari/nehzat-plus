import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const COURSE_ROUTES: Routes = [
  {
    path: '',
    title: 'کتب',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/course-list/course-list.component').then((m) => m.CourseListComponent)
  },
  {
    path: ':id',
    title: ' جزئیات کتاب',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/course-detail/course-detail.component').then((m) => m.CourseDetailComponent)
  }
];