import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { roleGuard } from '../../core/guards/role.guard';

export const STUDY_PATHS_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    redirectTo: 'student',
  },
  {
    path: 'student',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./student/student-study-paths.component').then((m) => m.StudentStudyPathsComponent),
  },
  {
    path: 'student/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./student/study-path-detail.component').then((m) => m.StudyPathDetailComponent),
  },
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard('headquarters')],
    loadComponent: () =>
      import('./admin/study-path-admin.component').then((m) => m.StudyPathAdminComponent),
  },
];
