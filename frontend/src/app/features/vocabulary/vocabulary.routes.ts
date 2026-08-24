import { Routes } from '@angular/router';
import { VocabularyComponent } from './vocabulary.component';
import { VocabularyTextListComponent } from './vocabulary-text-list/vocabulary-text-list.component';
import { VocabularyWordListComponent } from './vocabulary-word-list/vocabulary-word-list.component';
import { VocabularyCardListComponent } from './vocabulary-card-list/vocabulary-card-list.component';

export const vocabularyRoutes: Routes = [
  {
    path: '',
    component: VocabularyComponent,
    children: [
      {
        path: 'texts',
        component: VocabularyTextListComponent,
        data: { title: 'متن‌های لغوی' }
      },
      {
        path: 'words',
        component: VocabularyWordListComponent,
        data: { title: ' لغات' }
      },
      {
        path: 'cards',
        component: VocabularyCardListComponent,
        data: { title: 'کارت‌های کلامی' }
      },
      {
        path: '',
        redirectTo: 'texts',
        pathMatch: 'full'
      }
    ]
  }
];