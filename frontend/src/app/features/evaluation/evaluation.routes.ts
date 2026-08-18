import { Routes } from '@angular/router';

export const EVALUATION_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/evaluation-list/evaluation-list.component').then(
        (m) => m.EvaluationListComponent,
      ),
  },
  {
    path: 'take/:id',
    loadComponent: () =>
      import('./components/evaluation-take/evaluation-take.component').then(
        (m) => m.EvaluationTakeComponent,
      ),
  },
];