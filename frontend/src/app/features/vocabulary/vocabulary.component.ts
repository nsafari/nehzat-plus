import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LESSON_PLANNER_API } from '../../core/services/lesson-planner-api.token';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-vocabulary',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="vocabulary-page" dir="rtl">
      <header class="page-header">
        <h1>مر vocab</h1>
<nav class="vocab-nav">
        <button routerLink="/vocabulary/texts" [routerLinkActive]="['active']">متن‌های لغوی</button>
        <button routerLink="/vocabulary/words" [routerLinkActive]="['active']"> لغات</button>
        <button routerLink="/vocabulary/cards" [routerLinkActive]="['active']">کارت‌های کلامی</button>
        <button routerLink="/vocabulary/book-marker" [routerLinkActive]="['active']">
          <i class="fas fa-book-open"></i> نشاننامه کتاب
        </button>
      </nav>
      </header>

      <main class="vocabulary-main">
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class VocabularyComponent implements OnInit {
  private api = inject(LESSON_PLANNER_API);
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadData(): void {
    // Load initial data
    console.log('Vocabulary component initialized');
  }
}