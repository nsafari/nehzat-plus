import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, interval } from 'rxjs';
import { NotificationService } from '../../../../core/services/notification.service';
import type {
  EvaluationAnswerDto,
  EvaluationQuestionDto,
  RandomEvaluationDto,
} from '../../../../core/models/lesson-planner.models';
import { EvaluationService } from '../../evaluation.service';

@Component({
  selector: 'app-evaluation-take',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './evaluation-take.component.html',
  styleUrls: ['./evaluation-take.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EvaluationTakeComponent implements OnInit {
  private readonly evaluation = inject(EvaluationService);
  private readonly notify = inject(NotificationService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly exam = signal<RandomEvaluationDto | null>(null);
  readonly loading = signal(true);
  readonly currentIndex = signal(0);
  readonly answers = signal<Record<number, string>>({});
  readonly answering = signal('');
  readonly submitting = signal(false);
  readonly remainingSeconds = signal(0);
  readonly timeUp = signal(false);

  readonly currentQuestion = computed<EvaluationQuestionDto | null>(() => {
    const exam = this.exam();
    if (!exam) {
      return null;
    }
    return exam.questions[this.currentIndex()] ?? null;
  });

  readonly answeredCount = computed(() => {
    const exam = this.exam();
    if (!exam) {
      return 0;
    }
    return exam.questions.filter((q) => this.answers()[q.questionId] !== undefined).length;
  });

  readonly progressPercent = computed(() => {
    const exam = this.exam();
    if (!exam || exam.questions.length === 0) {
      return 0;
    }
    return Math.round((this.answeredCount() / exam.questions.length) * 100);
  });

  readonly remainingLabel = computed(() => {
    const total = this.remainingSeconds();
    const minutes = Math.floor(total / 60);
    const seconds = total % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  });

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.notify.show('شناسه آزمون نامعتبر است', 'error');
      this.router.navigate(['/evaluations']);
      return;
    }
    this.evaluation
      .getEvaluation(id)
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (exam) => {
          this.exam.set(exam);
          const restored: Record<number, string> = {};
          for (const a of exam.answers ?? []) {
            restored[a.questionId] = a.answerText;
          }
          this.answers.set(restored);
          if (exam.status === 'in_progress') {
            this.remainingSeconds.set(exam.questions.length * 60);
            this.startTimer();
          }
        },
        error: () => this.notify.show('خطا در دریافت آزمون', 'error'),
      });
  }

  private startTimer(): void {
    interval(1000)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.remainingSeconds.update((s) => {
          if (this.timeUp() || this.submitting()) {
            return s;
          }
          if (s <= 1) {
            this.timeUp.set(true);
            this.submit();
            return 0;
          }
          return s - 1;
        });
      });
  }

  selectQuestion(index: number): void {
    this.currentIndex.set(index);
  }

  next(): void {
    const exam = this.exam();
    if (!exam || this.currentIndex() >= exam.questions.length - 1) {
      return;
    }
    this.currentIndex.update((i) => i + 1);
  }

  prev(): void {
    if (this.currentIndex() <= 0) {
      return;
    }
    this.currentIndex.update((i) => i - 1);
  }

  selectOption(questionId: number, option: string): void {
    this.answers.update((a) => ({ ...a, [questionId]: option }));
  }

  onEssayInput(questionId: number, value: string): void {
    this.answers.update((a) => ({ ...a, [questionId]: value }));
  }

  essayValue(questionId: number): string {
    return this.answers()[questionId] ?? '';
  }

  isSelected(questionId: number, option: string): boolean {
    return this.answers()[questionId] === option;
  }

  isAnswered(questionId: number): boolean {
    return this.answers()[questionId] !== undefined && this.answers()[questionId].trim() !== '';
  }

  canSubmit(): boolean {
    const exam = this.exam();
    return !!exam && this.answeredCount() === exam.questions.length;
  }

  submit(): void {
    const exam = this.exam();
    if (!exam || this.submitting()) {
      return;
    }
    const answers: EvaluationAnswerDto[] = exam.questions.map((q) => ({
      questionId: q.questionId,
      answerText: this.answers()[q.questionId]?.trim() ?? '',
      isCorrect: false,
      pointsEarned: 0,
    }));
    this.submitting.set(true);
    this.evaluation
      .submitAnswers({ randomEvaluationId: exam.id, answers })
      .pipe(
        finalize(() => this.submitting.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (graded) => {
          this.exam.set(graded);
          this.notify.show('پاسخ‌ها ثبت شد', 'success');
        },
        error: () => {
          this.notify.show('خطا در ثبت پاسخ‌ها', 'error');
          this.timeUp.set(false);
        },
      });
  }

  backToList(): void {
    this.router.navigate(['/evaluations']);
  }

  faNum(value: number): string {
    return value.toLocaleString('fa-IR');
  }

  faPercent(value: number): string {
    return `${value.toLocaleString('fa-IR')}٪`;
  }

  scorePercent(score: number, total: number): number {
    if (!score || !total) {
      return 0;
    }
    return Math.round((score / total) * 100);
  }
}