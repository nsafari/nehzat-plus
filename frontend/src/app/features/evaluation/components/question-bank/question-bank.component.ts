import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  Output,
  EventEmitter,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { NotificationService } from '../../../../core/services/notification.service';
import type {
  CreateQuestionRequest,
  QuestionDto,
} from '../../../../core/models/lesson-planner.models';
import { EvaluationService } from '../../evaluation.service';

const DIFFICULTY_LABELS: Record<QuestionDto['difficulty'], string> = {
  easy: 'آسان',
  medium: 'متوسط',
  hard: 'سخت',
};

const TYPE_LABELS: Record<QuestionDto['type'], string> = {
  multiple_choice: 'چندگزینه‌ای',
  true_false: 'درست / نادرست',
  essay: 'تشریحی',
};

function emptyDraft(): CreateQuestionRequest {
  return {
    text: '',
    category: '',
    difficulty: 'medium',
    type: 'multiple_choice',
    options: ['', ''],
    correctAnswer: '',
    points: 5,
  };
}

@Component({
  selector: 'app-question-bank',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './question-bank.component.html',
  styleUrls: ['./question-bank.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestionBankComponent implements OnInit {
  private readonly evaluation = inject(EvaluationService);
  private readonly notify = inject(NotificationService);
  private readonly destroyRef = inject(DestroyRef);

  @Output() closed = new EventEmitter<void>();
  @Output() changed = new EventEmitter<void>();

  readonly questions = signal<QuestionDto[]>([]);
  readonly loading = signal(true);
  readonly filterCategory = signal('');
  readonly filterDifficulty = signal('');
  readonly searchText = signal('');
  readonly showCreate = signal(false);
  readonly saving = signal(false);
  readonly draft = signal<CreateQuestionRequest>(emptyDraft());

  readonly difficultyLabels = DIFFICULTY_LABELS;
  readonly typeLabels = TYPE_LABELS;

  readonly categories = computed(() => {
    const seen = new Set<string>();
    for (const q of this.questions()) {
      seen.add(q.category);
    }
    return [...seen];
  });

  readonly filteredQuestions = computed(() => {
    let list = this.questions();
    const category = this.filterCategory();
    if (category) {
      list = list.filter((q) => q.category === category);
    }
    const difficulty = this.filterDifficulty();
    if (difficulty) {
      list = list.filter((q) => q.difficulty === difficulty);
    }
    const search = this.searchText().trim();
    if (search) {
      list = list.filter((q) => q.text.includes(search));
    }
    return list;
  });

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.evaluation
      .getQuestions()
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (list) => this.questions.set(list),
        error: () => this.notify.show('خطا در دریافت بانک سوالات', 'error'),
      });
  }

  close(): void {
    this.closed.emit();
  }

  setFilterCategory(value: string): void {
    this.filterCategory.set(value);
  }

  setFilterDifficulty(value: string): void {
    this.filterDifficulty.set(value);
  }

  setSearch(value: string): void {
    this.searchText.set(value);
  }

  openCreate(): void {
    this.draft.set(emptyDraft());
    this.showCreate.set(true);
  }

  cancelCreate(): void {
    this.showCreate.set(false);
  }

  updateDraft(field: keyof CreateQuestionRequest, value: string | number): void {
    this.draft.update((d) => ({ ...d, [field]: value }));
  }

  setDraftType(value: QuestionDto['type']): void {
    this.draft.update((d) => {
      const options = value === 'multiple_choice' ? ['', ''] : value === 'true_false' ? ['درست', 'نادرست'] : [];
      return { ...d, type: value, options };
    });
  }

  updateOption(index: number, value: string): void {
    this.draft.update((d) => {
      const options = [...d.options];
      options[index] = value;
      return { ...d, options };
    });
  }

  addOption(): void {
    this.draft.update((d) => ({ ...d, options: [...d.options, ''] }));
  }

  removeOption(index: number): void {
    this.draft.update((d) => ({ ...d, options: d.options.filter((_, i) => i !== index) }));
  }

  setPoints(value: string): void {
    const points = Math.max(1, Math.min(50, Number(value) || 1));
    this.updateDraft('points', points);
  }

  faNum(value: number): string {
    return value.toLocaleString('fa-IR');
  }

  save(): void {
    const draft = this.draft();
    if (!draft.text.trim() || !draft.category.trim()) {
      this.notify.show('متن سوال و موضوع را وارد کنید', 'error');
      return;
    }
    if (draft.type === 'multiple_choice' && draft.options.some((o) => !o.trim())) {
      this.notify.show('همه گزینه‌ها را کامل کنید', 'error');
      return;
    }
    if (draft.type !== 'essay' && !draft.correctAnswer.trim()) {
      this.notify.show('پاسخ صحیح را وارد کنید', 'error');
      return;
    }
    this.saving.set(true);
    this.evaluation
      .createQuestion(draft)
      .pipe(
        finalize(() => this.saving.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (created) => {
          this.questions.update((list) => [...list, created]);
          this.showCreate.set(false);
          this.changed.emit();
          this.notify.show('سوال افزوده شد', 'success');
        },
        error: () => this.notify.show('خطا در افزودن سوال', 'error'),
      });
  }

  deleteQuestion(question: QuestionDto): void {
    this.evaluation
      .deleteQuestion(question.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.questions.update((list) => list.filter((q) => q.id !== question.id));
          this.changed.emit();
          this.notify.show('سوال حذف شد', 'success');
        },
        error: () => this.notify.show('خطا در حذف سوال', 'error'),
      });
  }

  trackByQuestion(_index: number, item: QuestionDto): number {
    return item.id;
  }
}