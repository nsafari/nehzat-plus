import { Routes } from '@angular/router';
import { VocabularyComponent } from './vocabulary.component';
import { VocabularyTextListComponent } from './vocabulary-text-list/vocabulary-text-list.component';
import { VocabularyWordListComponent } from './vocabulary-word-list/vocabulary-word-list.component';
import { VocabularyCardListComponent } from './vocabulary-card-list/vocabulary-card-list.component';
import { VocabularyBookMarkerComponent } from './vocabulary-book-marker/vocabulary-book-marker.component';

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
        path: 'book-marker',
        component: VocabularyBookMarkerComponent,
        data: { title: 'نشاننامه کتاب' }
      },
      {
        path: '',
        redirectTo: 'texts',
        pathMatch: 'full'
      }
    ]
  }
];