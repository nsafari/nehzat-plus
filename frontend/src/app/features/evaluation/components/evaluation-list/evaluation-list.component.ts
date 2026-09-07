import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { NotificationService } from '../../../../core/services/notification.service';
import type {
  CreateQuestionRequest,
  EvaluationStatsDto,
  QuestionDto,
  RandomEvaluationDto,
} from '../../../../core/models/lesson-planner.models';
import { EvaluationService } from '../../evaluation.service';
import { QuestionBankComponent } from '../question-bank/question-bank.component';

const STATUS_LABELS: Record<RandomEvaluationDto['status'], string> = {
  in_progress: 'در حال انجام',
  completed: 'تکمیل‌شده',
  expired: 'منقضی‌شده',
};

const STUB_QUESTIONS: CreateQuestionRequest[] = [
  {
    text: 'مفهوم اصلی انقلاب اسلامی ایران چیست؟',
    category: 'انقلاب اسلامی',
    difficulty: 'easy',
    type: 'multiple_choice',
    options: ['استقلال و آزادی', 'سکولاریسم', 'وابستگی سیاسی', 'مصرف‌گرایی'],
    correctAnswer: 'استقلال و آزادی',
    points: 5,
  },
  {
    text: 'قرآن کریم چند جزء دارد؟',
    category: 'قرآن',
    difficulty: 'easy',
    type: 'multiple_choice',
    options: ['۱۰', '۲۰', '۳۰', '۴۰'],
    correctAnswer: '۳۰',
    points: 5,
  },
  {
    text: 'نهج‌البلاغه مجموعه سخنان چه کسی است؟',
    category: 'معارف',
    difficulty: 'medium',
    type: 'multiple_choice',
    options: ['امام علی (ع)', 'امام حسین (ع)', 'پیامبر اکرم (ص)', 'امام صادق (ع)'],
    correctAnswer: 'امام علی (ع)',
    points: 10,
  },
  {
    text: 'حج تمتع بر هر مسلمان مستطیع یک‌بار در طول عمر واجب است.',
    category: 'معارف',
    difficulty: 'medium',
    type: 'true_false',
    options: ['درست', 'نادرست'],
    correctAnswer: 'درست',
    points: 10,
  },
];

@Component({
  selector: 'app-evaluation-list',
  standalone: true,
  imports: [CommonModule, FormsModule, QuestionBankComponent],
  templateUrl: './evaluation-list.component.html',
  styleUrls: ['./evaluation-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EvaluationListComponent implements OnInit {
  private readonly evaluation = inject(EvaluationService);
  private readonly notify = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly evaluations = signal<RandomEvaluationDto[]>([]);
  readonly questions = signal<QuestionDto[]>([]);
  readonly stats = signal<EvaluationStatsDto | null>(null);
  readonly loading = signal(true);
  readonly loadingQuestions = signal(true);
  readonly showQuestionBank = signal(false);
  readonly showResults = signal(false);
  readonly showCreate = signal(false);
  readonly creating = signal(false);
  readonly createCategory = signal('');
  readonly createCount = signal(3);
  readonly seeding = signal(false);

  readonly statusLabels = STATUS_LABELS;

  readonly categories = computed(() => {
    const seen = new Set<string>();
    for (const q of this.questions()) {
      seen.add(q.category);
    }
    return [...seen];
  });

  get hasQuestions(): boolean {
    return this.questions().length > 0;
  }

  ngOnInit(): void {
    this.loadEvaluations();
    this.loadQuestions();
    this.loadStats();
  }

  loadEvaluations(): void {
    this.loading.set(true);
    this.evaluation
      .getMyEvaluations()
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (list) => this.evaluations.set(list),
        error: () => this.notify.show('خطا در دریافت آزمون‌ها', 'error'),
      });
  }

  loadQuestions(): void {
    this.loadingQuestions.set(true);
    this.evaluation
      .getQuestions()
      .pipe(
        finalize(() => this.loadingQuestions.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (list) => this.questions.set(list),
        error: () => this.notify.show('خطا در دریافت بانک سوالات', 'error'),
      });
  }

  loadStats(): void {
    this.evaluation
      .getEvaluationStats()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (s) => this.stats.set(s),
        error: () => this.notify.show('خطا در دریافت آمار آزمون‌ها', 'error'),
      });
  }

  toggleQuestionBank(): void {
    this.showQuestionBank.update((v) => !v);
  }

  toggleResults(): void {
    this.showResults.update((v) => !v);
    if (!this.stats()) {
      this.loadStats();
    }
  }

  openCreate(): void {
    if (!this.categories().length) {
      this.notify.show('ابتدا باید سوالی در بانک سوالات وجود داشته باشد', 'info');
      this.showQuestionBank.set(true);
      return;
    }
    this.createCategory.set(this.categories()[0]);
    this.createCount.set(3);
    this.showCreate.set(true);
  }

  closeCreate(): void {
    this.showCreate.set(false);
  }

  setCreateCategory(value: string): void {
    this.createCategory.set(value);
  }

  setCreateCount(value: string): void {
    this.createCount.set(Math.max(1, Math.min(20, Number(value) || 1)));
  }

  createExam(): void {
    const category = this.createCategory();
    const count = this.createCount();
    if (!category || this.creating()) {
      return;
    }
    this.creating.set(true);
    this.evaluation
      .startEvaluation({ studentId: 1, category, questionCount: count })
      .pipe(
        finalize(() => this.creating.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (exam) => {
          this.closeCreate();
          this.evaluations.update((list) => [exam, ...list]);
          this.notify.show('آزمون جدید ساخته شد', 'success');
          this.router.navigate(['/evaluations/take', exam.id]);
        },
        error: () => this.notify.show('خطا در ساخت آزمون', 'error'),
      });
  }

  startExam(exam: RandomEvaluationDto): void {
    if (exam.status === 'in_progress') {
      this.router.navigate(['/evaluations/take', exam.id]);
    }
  }

  seedQuestions(): void {
    if (this.seeding()) {
      return;
    }
    this.seeding.set(true);
    let done = 0;
    for (const stub of STUB_QUESTIONS) {
      this.evaluation.createQuestion(stub).subscribe({
        next: () => {
          done += 1;
          if (done === STUB_QUESTIONS.length) {
            this.seeding.set(false);
            this.loadQuestions();
            this.loadStats();
            this.notify.show('سوالات نمونه اضافه شدند', 'success');
          }
        },
        error: () => {
          done += 1;
          if (done === STUB_QUESTIONS.length) {
            this.seeding.set(false);
          }
        },
      });
    }
  }

  onBankChangelog(): void {
    this.loadQuestions();
    this.loadStats();
  }

  scorePercent(exam: RandomEvaluationDto): number {
    if (!exam.totalScore || !exam.totalQuestions) {
      return 0;
    }
    return Math.round((exam.totalScore / exam.totalQuestions) * 100);
  }

  faNum(value: number): string {
    return value.toLocaleString('fa-IR');
  }

  formatDate(iso?: string): string {
    if (!iso) {
      return '—';
    }
    return new Date(iso).toLocaleDateString('fa-IR', { day: 'numeric', month: 'short' });
  }

  trackByEval(_index: number, item: RandomEvaluationDto): number {
    return item.id;
  }

  trackByQuestion(_index: number, item: QuestionDto): number {
    return item.id;
  }
}