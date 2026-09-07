import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { LESSON_PLANNER_API } from '../../../../core/services/lesson-planner-api.token';
import { Course } from '../../../../core/models/lesson-planner.models';
import { PhaseConfig } from '../../../../core/tokens/phase.token';

@Component({
  selector: 'app-quiz-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  template: `
    <div class="quiz-container" dir="rtl">
      <div class="header-card">
        <h1>آزمون‌ها</h1>
        <p class="subtitle">انتخاب آزمون برای شروع</p>
      </div>

      <div *ngIf="loading" class="loading-state">
        <div class="spinner"></div>
        <p>در حال بارگذاری آزمون‌ها...</p>
      </div>

      <div *ngIf="!loading && quizzes.length > 0" class="quizzes-grid">
        <div class="quiz-card" *ngFor="let quiz of quizzes" [routerLink]="['/quizzes', quiz.id]" class="quiz-card-link">
          <div class="quiz-card-header">
            <h3>{{ quiz.title }}</h3>
            <span class="quiz-card-phase">{{ getPhaseLabel(quiz.phase) }}</span>
          </div>
          <div class="quiz-card-body">
            <p class="quiz-card-description">{{ quiz.description }}</p>
            <div class="quiz-card-meta">
              <span>{{ quiz.questions?.length || 0 }} سوال</span>
              <span>⏱ {{ quiz.timeLimitMinutes }} دقیقه</span>
              <span>📈 نمره قبولی: {{ quiz.passingScore }}%</span>
            </div>
          </div>
          <div class="quiz-card-footer">
            <button mat-raised-button color="primary" class="take-quiz-btn">
              <mat-icon>play_arrow</mat-icon>
              شروع آزمون
            </button>
          </div>
        </div>
      </div>

      <div *ngIf="!loading && quizzes.length === 0" class="empty-state">
        <p>هنوز آزمون تعریف نشده است.</p>
        <button class="retry-btn" (click)="retry()">بارگذاری مجدد</button>
      </div>
    </div>
  `,
  styles: [`
    .quiz-container { padding: 20px; max-width: 1100px; margin: 0 auto; direction: rtl; }
    .header-card { margin-bottom: 24px; padding: 32px; background: linear-gradient(135deg, var(--lp-primary, #4a148c), var(--lp-accent, #7b1fa2)); color: #fff; border-radius: 12px; text-align: center; }
    .header-card h1 { margin: 0 0 8px; font-size: 28px; }
    .subtitle { margin: 0; opacity: 0.85; font-size: 14px; }
    .loading-state { text-align: center; padding: 60px 0; color: var(--lp-text-muted, #888); }
    .spinner { width: 40px; height: 40px; border: 4px solid var(--lp-border, #e0e0e0); border-top-color: var(--lp-primary, #4a148c); border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .error-state { text-align: center; padding: 40px; color: var(--lp-danger, #c62828); }
    .retry-btn { padding: 8px 20px; background: var(--lp-primary, #4a148c); color: #fff; border: none; border-radius: 6px; cursor: pointer; margin-top: 12px; }
    .quizzes-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px; }
    .quiz-card { background: var(--lp-surface, #fff); border: 1px solid var(--lp-border, #e0e0e0); border-radius: 12px; padding: 24px; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; }
    .quiz-card:hover { transform: translateY(-3px); box-shadow: 0 6px 20px rgba(0,0,0,0.1); }
    .quiz-card-header { margin-bottom: 16px; }
    .quiz-card-header h3 { margin: 0 0 4px; font-size: 18px; color: var(--lp-text, #333); }
    .quiz-card-phase { font-size: 11px; color: var(--lp-text-muted, #888); background: var(--lp-surface-alt, #f5f5f5); padding: 2px 8px; border-radius: 4px; margin-left: 8px; }
    .quiz-card-body { }
    .quiz-card-description { margin: 0 0 16px; font-size: 13px; color: var(--lp-text-muted, #666); line-height: 1.5; }
    .quiz-card-meta { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .quiz-card-meta span { font-size: 12px; color: var(--lp-text-muted, #888); }
    .quiz-card-footer { display: flex; justify-content: flex-end; }
    .take-quiz-btn { padding: 10px 24px; background: var(--lp-primary, #4a148c); color: #fff; border: none; border-radius: 8px; font-size: 14px; cursor: pointer; }
    .empty-state { text-align: center; padding: 60px 0; color: var(--lp-text-muted, #888); }
  `]
})
export class QuizListComponent implements OnInit {
  private api = inject(LESSON_PLANNER_API);
  private router = inject(Router);
  quizzes: any[] = [];
  loading = true;

  ngOnInit(): void {
    this.loadQuizzes();
  }

  private loadQuizzes(): void {
    this.loading = true;
    this.api.getQuizzes(0).subscribe({
      next: (data) => {
        this.quizzes = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  retry(): void {
    this.loadQuizzes();
  }

  getPhaseLabel(phase: string | undefined): string {
    if (!phase) return '';
    const phaseLabels: Record<string, string> = {
      'A': 'فاز اول (۵-۶ سال)',
      'B': 'فاز دوم (۷-۸ سال)',
      'C': 'فاز سوم (۹-۱۱ سال)',
      'D': 'فاز چهارم (۱۲-۱۳ سال)',
      'E': 'فاز پنجم (۱۴-۲۱ سال)'
    };
    return phaseLabels[phase] || phase;
  }
}