import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { roleGuard } from '../../core/guards/role.guard';

export const EXPERIMENTAL_SCIENCES_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'topics',
        pathMatch: 'full'
      },
      {
        path: 'topics',
        loadComponent: () => import('./pages/topic-list/topic-list.component').then(m => m.TopicListComponent),
        canActivate: [roleGuard('trainee')]
      },
      {
        path: 'topics/:topicId/lessons',
        loadComponent: () => import('./pages/lesson-view/lesson-view.component').then(m => m.LessonViewComponent),
        canActivate: [roleGuard('trainee')]
      },
      {
        path: 'lessons/:lessonId/experiments',
        loadComponent: () => import('./pages/experiment-guide/experiment-guide.component').then(m => m.ExperimentGuideComponent),
        canActivate: [roleGuard('trainee')]
      },
      {
        path: 'lessons/:lessonId/quiz',
        loadComponent: () => import('./pages/quiz/quiz.component').then(m => m.QuizComponent),
        canActivate: [roleGuard('trainee')]
      },
      {
        path: 'progress',
        loadComponent: () => import('./pages/progress-dashboard/progress-dashboard.component').then(m => m.ProgressDashboardComponent),
        canActivate: [roleGuard('trainee')]
      }
    ]
  }
];
