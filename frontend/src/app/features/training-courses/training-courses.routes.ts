import { Routes } from '@angular/router';

export const TRAINING_COURSES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./training-courses.component').then(m => m.TrainingCoursesComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./training-course-detail/training-course-detail.component').then(m => m.TrainingCourseDetailComponent)
  },
  {
    path: ':id/sessions/:sessionId',
    loadComponent: () => import('./training-session-detail/training-session-detail.component').then(m => m.TrainingSessionDetailComponent)
  }
];
