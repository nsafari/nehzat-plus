import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { roleGuard } from '../../core/guards/role.guard';

export const QURAN_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    children: [
      {
        path: 'surahs',
        canActivate: [roleGuard('trainee')],
        loadComponent: () => import('./pages/surah-list/surah-list.component').then(m => m.QuranListComponent)
      },
      {
        path: 'surahs/:id',
        canActivate: [roleGuard('trainee')],
        loadComponent: () => import('./pages/surah-detail/surah-detail.component').then(m => m.SurahDetailComponent)
      },
      {
        path: 'tajweed-rules',
        canActivate: [roleGuard('trainee')],
        loadComponent: () => import('./pages/tajweed-rules/tajweed-rules.component').then(m => m.TajweedRulesComponent)
      },
      {
        path: 'recitation-levels',
        canActivate: [roleGuard('trainee')],
        loadComponent: () => import('./pages/recitation-levels/recitation-levels.component').then(m => m.RecitationLevelsComponent)
      },
      {
        path: 'curricula',
        canActivate: [roleGuard('admin'), roleGuard('coach')],
        loadComponent: () => import('./pages/quran-curriculum/quran-curriculum.component').then(m => m.QuranCurriculumComponent)
      },
      {
        path: 'tafsir/:surahId/:ayahNumber',
        canActivate: [roleGuard('trainee')],
        loadComponent: () => import('./pages/tafsir/tafsir.component').then(m => m.TafsirComponent)
      },
      {
        path: 'search',
        canActivate: [roleGuard('trainee')],
        loadComponent: () => import('./pages/quran-search/quran-search.component').then(m => m.QuranSearchComponent)
      },
      {
        path: 'student-progress/:studentId',
        canActivate: [roleGuard('coach'), roleGuard('parent')],
        loadComponent: () => import('./pages/student-progress/student-progress.component').then(m => m.StudentProgressComponent)
      },
      {
        path: 'lesson-plans',
        canActivate: [roleGuard('admin'), roleGuard('coach')],
        loadComponent: () => import('./pages/lesson-plans/lesson-plans.component').then(m => m.LessonPlansComponent)
      },

      // ==================== QuranRing Routes ====================
      {
        path: 'rings',
        canActivate: [roleGuard('admin'), roleGuard('coach')],
        loadComponent: () => import('./ring-list/quran-ring-list.component').then(m => m.QuranRingListComponent)
      },
      {
        path: 'rings/:ringId/sessions',
        canActivate: [roleGuard('admin'), roleGuard('coach')],
        loadComponent: () => import('./session-tracker/session-tracker.component').then(m => m.SessionTrackerComponent)
      },
      {
        path: 'rings/:ringId/progress/:studentId',
        canActivate: [roleGuard('admin'), roleGuard('coach')],
        loadComponent: () => import('./student-progress/student-progress.component').then(m => m.StudentProgressComponent)
      },
      {
        path: 'rings/:ringId/evaluation/:studentId',
        canActivate: [roleGuard('admin'), roleGuard('coach')],
        loadComponent: () => import('./asset-evaluation/asset-evaluation.component').then(m => m.AssetEvaluationComponent)
      },
      {
        path: 'rings/:ringId/coach-interview',
        canActivate: [roleGuard('admin'), roleGuard('coach')],
        loadComponent: () => import('./coach-interview/coach-interview.component').then(m => m.CoachInterviewComponent)
      },
      {
        path: 'rings/:ringId/student-interview/:studentId',
        canActivate: [roleGuard('admin'), roleGuard('coach')],
        loadComponent: () => import('./student-interview/student-interview.component').then(m => m.StudentInterviewComponent)
      },
      {
        path: 'tadabbor',
        canActivate: [roleGuard('admin'), roleGuard('coach')],
        loadComponent: () => import('./tadabbor/tadabbor.component').then(m => m.TadabborComponent)
      },
      {
        path: 'dashboard',
        canActivate: [roleGuard('admin'), roleGuard('coach')],
        loadComponent: () => import('./dashboard/quran-ring-dashboard.component').then(m => m.QuranRingDashboardComponent)
      },

      { path: '', redirectTo: 'surahs', pathMatch: 'full' }
    ]
  }
];
