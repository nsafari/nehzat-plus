import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import type { Assessment, AssessmentQuestion, AssessmentResult, Course } from '../../../core/models/lesson-planner.models';
import { LESSON_PLANNER_API } from '../../../core/services/lesson-planner-api.token';
import { NotificationService } from '../../../core/services/notification.service';

type TakerState = 'list' | 'taking' | 'result';

interface AnswerRecord {
  questionId: number;
  selectedOption: number;
}

interface QuestionFeedback {
  isCorrect: boolean;
  correctOptionIndex: number;
  correctOptionText: string;
  explanation: string | null;
}

@Component({
  selector: 'app-assessment-taker',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './assessment-taker.component.html',
  styleUrls: ['./assessment-taker.component.scss']
})
export class AssessmentTakerComponent implements OnInit {
  private readonly api = inject(LESSON_PLANNER_API);
  private readonly destroyRef = inject(DestroyRef);
  private readonly notify = inject(NotificationService);

  @Input() course: Course | null = null;
  @Input() studentId: number | null = null;
  @Output() closed = new EventEmitter<void>();

  state: TakerState = 'list';
  publishedAssessments: Assessment[] = [];
  currentAssessment: Assessment | null = null;
  questions: AssessmentQuestion[] = [];
  currentQuestionIndex = 0;
  answers: AnswerRecord[] = [];
  startingId: number | null = null;
  submitting = false;
  result: AssessmentResult | null = null;

  answerRevealed: Record<number, boolean> = {};

  get headerTitle(): string {
    switch (this.state) {
      case 'list': return 'امتحانات من';
      case 'taking': return 'شرکت در امتحان';
      case 'result': return 'نتیجه امتحان';
    }
  }

  get currentQuestion(): AssessmentQuestion {
    return this.questions[this.currentQuestionIndex];
  }

  get currentFeedback(): QuestionFeedback | null {
    return this.currentQuestion ? this.buildFeedback(this.currentQuestion) : null;
  }

  ngOnInit(): void {
    this.loadPublished();
  }

  loadPublished(): void {
    if (!this.course) return;
    this.api.getAssessmentsByCourse(this.course.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (assessments) => {
          this.publishedAssessments = assessments.filter((a) => a.status === 'published' && (a.questions?.length ?? 0) > 0);
        },
        error: () => {
          this.publishedAssessments = [];
        }
      });
  }

  startAssessment(assessment: Assessment): void {
    if (!this.studentId) return;
    this.startingId = assessment.id;

    this.api.startAssessment(assessment.id, this.studentId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.currentAssessment = assessment;
          this.questions = [...(assessment.questions ?? [])].sort((a, b) => a.order - b.order);
          this.currentQuestionIndex = 0;
          this.answers = [];
          this.answerRevealed = {};
          this.state = 'taking';
          this.startingId = null;
        },
        error: () => {
          this.notify.show('خطا در شروع امتحان', 'error');
          this.startingId = null;
        }
      });
  }

  selectOption(questionId: number, optionIndex: number): void {
    const existing = this.answers.find((a) => a.questionId === questionId);
    if (existing) {
      existing.selectedOption = optionIndex;
    } else {
      this.answers.push({ questionId, selectedOption: optionIndex });
    }
  }

  getAnswerFor(questionId: number): number | undefined {
    return this.answers.find((a) => a.questionId === questionId)?.selectedOption;
  }

  hasAnswer(questionId: number): boolean {
    return this.answers.some((a) => a.questionId === questionId);
  }

  prevQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  goToQuestion(index: number): void {
    if (index >= 0 && index < this.questions.length) {
      this.currentQuestionIndex = index;
    }
  }

  submitAssessment(): void {
    if (!this.currentAssessment || !this.studentId || this.submitting) return;

    if (this.hasAnswer(this.currentQuestion.id) && !this.isCurrentAnswerRevealed) {
      this.revealAnswer();
      return;
    }

    this.submitting = true;

    // Build the answers JSON
    const answersJson = JSON.stringify(this.answers);

    // Simple scoring: 1 point per correct answer
    let score = 0;
    for (const answer of this.answers) {
      const question = this.questions.find((q) => q.id === answer.questionId);
      if (question?.correctAnswerJson) {
        try {
          const correct = JSON.parse(question.correctAnswerJson);
          if (correct.correctOption === answer.selectedOption) {
            score += question.points;
          }
        } catch { /* skip */ }
      }
    }

    const maxPossibleScore = this.questions.reduce((sum, q) => sum + q.points, 0);
    const percentage = maxPossibleScore > 0 ? Math.round((score / maxPossibleScore) * 100) : 0;

    const timeSpentMinutes = Math.max(1, Math.round(
      (Date.now() - this.startTime) / 60000
    ));

    const payload = {
      studentId: this.studentId,
      completedAt: new Date().toISOString(),
      score,
      maxPossibleScore,
      percentage,
      status: percentage >= 50 ? 'completed' : 'failed',
      answersJson,
      timeSpentMinutes
    };

    this.api.submitAssessmentResult(this.currentAssessment.id, payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          this.result = result;
          this.state = 'result';
          this.submitting = false;
        },
        error: () => {
          this.notify.show('خطا در ارسال پاسخ‌ها', 'error');
          this.submitting = false;
        }
      });
  }

  close(): void {
    this.closed.emit();
  }

  private startTime = Date.now();

  parsedOptions(question: AssessmentQuestion): string[] {
    if (!question.optionsJson) return [];
    try {
      const parsed = JSON.parse(question.optionsJson);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  optionLabel(index: number): string {
    return String.fromCharCode(65 + index);
  }

  difficultyLabel(difficulty: string): string {
    const labels: Record<string, string> = {
      easy: 'آسان',
      medium: 'متوسط',
      hard: 'سخت'
    };
    return labels[difficulty] ?? difficulty;
  }

  get isCurrentAnswerRevealed(): boolean {
    return this.currentQuestion ? !!this.answerRevealed[this.currentQuestion.id] : false;
  }

  get isCurrentAnswerCorrect(): boolean {
    if (!this.currentQuestion) return false;
    const feedback = this.buildFeedback(this.currentQuestion);
    return feedback?.isCorrect ?? false;
  }

  get runningScore(): number {
    let score = 0;
    for (const answer of this.answers) {
      if (!this.answerRevealed[answer.questionId]) continue;
      const question = this.questions.find((q) => q.id === answer.questionId);
      if (question) {
        const feedback = this.buildFeedback(question);
        if (feedback?.isCorrect) score += question.points;
      }
    }
    return score;
  }

  get runningMaxScore(): number {
    let max = 0;
    for (const answer of this.answers) {
      if (!this.answerRevealed[answer.questionId]) continue;
      const question = this.questions.find((q) => q.id === answer.questionId);
      if (question) max += question.points;
    }
    return max;
  }

  revealAnswer(): void {
    if (!this.currentQuestion || this.isCurrentAnswerRevealed) return;
    this.answerRevealed[this.currentQuestion.id] = true;
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      if (this.hasAnswer(this.currentQuestion.id) && !this.isCurrentAnswerRevealed) {
        this.revealAnswer();
        return;
      }
      this.currentQuestionIndex++;
    }
  }

  buildFeedback(question: AssessmentQuestion): QuestionFeedback | null {
    if (!question.correctAnswerJson) return null;
    try {
      const correct = JSON.parse(question.correctAnswerJson);
      const correctIndex: number = correct.correctOption;
      const options = this.parsedOptions(question);
      const selected = this.getAnswerFor(question.id);
      return {
        isCorrect: selected === correctIndex,
        correctOptionIndex: correctIndex,
        correctOptionText: options[correctIndex] ?? '',
        explanation: question.explanation ?? null,
      };
    } catch {
      return null;
    }
  }

  isOptionCorrectOption(question: AssessmentQuestion, optionIndex: number): boolean {
    const feedback = this.buildFeedback(question);
    return feedback?.correctOptionIndex === optionIndex;
  }

  isOptionSelectedWrong(question: AssessmentQuestion, optionIndex: number): boolean {
    const selected = this.getAnswerFor(question.id);
    const feedback = this.buildFeedback(question);
    return selected === optionIndex && feedback !== null && !feedback.isCorrect;
  }

  optionClass(optionIndex: number): string {
    if (!this.isCurrentAnswerRevealed || !this.currentQuestion) return '';
    if (this.isOptionCorrectOption(this.currentQuestion, optionIndex)) return 'correct';
    if (this.isOptionSelectedWrong(this.currentQuestion, optionIndex)) return 'wrong';
    return '';
  }
}
