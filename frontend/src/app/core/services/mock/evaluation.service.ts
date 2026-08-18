import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import type {
  QuestionDto,
  CreateQuestionRequest,
  RandomEvaluationDto,
  EvaluationAnswerDto,
  StartEvaluationRequest,
  SubmitAnswersRequest,
  EvaluationStatsDto,
  EvaluationTrendPointDto,
} from '../../models/lesson-planner.models';

@Injectable({ providedIn: 'root' })
export class MockEvaluationService {
  private questions: QuestionDto[] = [
    {
      id: 1,
      text: 'مفهوم اصلی انقلاب اسلامی ایران چیست؟',
      category: 'انقلاب اسلامی',
      difficulty: 'easy',
      type: 'multiple_choice',
      options: ['استقلال و آزادی', 'سکولاریسم', 'مصرف‌گرایی', 'وابستگی سیاسی'],
      correctAnswer: 'استقلال و آزادی',
      points: 5,
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      text: 'اولین رهبر جمهوری اسلامی ایران چه کسی بود؟',
      category: 'انقلاب اسلامی',
      difficulty: 'easy',
      type: 'multiple_choice',
      options: ['آیت‌الله خامنه‌ای', 'امام خمینی (ره)', 'دکتر مصدق', 'آیت‌الله بهشتی'],
      correctAnswer: 'امام خمینی (ره)',
      points: 5,
      createdAt: new Date().toISOString(),
    },
    {
      id: 3,
      text: 'قرآن کریم چند جزء دارد؟',
      category: 'قرآن',
      difficulty: 'easy',
      type: 'multiple_choice',
      options: ['۱۰', '۲۰', '۳۰', '۴۰'],
      correctAnswer: '۳۰',
      points: 5,
      createdAt: new Date().toISOString(),
    },
    {
      id: 4,
      text: 'نهج‌البلاغه مجموعه سخنان چه کسی است؟',
      category: 'معارف',
      difficulty: 'medium',
      type: 'multiple_choice',
      options: ['امام علی (ع)', 'امام حسین (ع)', 'پیامبر اکرم (ص)', 'امام صادق (ع)'],
      correctAnswer: 'امام علی (ع)',
      points: 10,
      createdAt: new Date().toISOString(),
    },
    {
      id: 5,
      text: 'حج تمتع بر هر مسلمان مستطیع یک‌بار در طول عمر واجب است.',
      category: 'معارف',
      difficulty: 'medium',
      type: 'true_false',
      options: ['درست', 'نادرست'],
      correctAnswer: 'درست',
      points: 10,
      createdAt: new Date().toISOString(),
    },
    {
      id: 6,
      text: 'فلسفه قیام عاشورا را در دو جمله توضیح دهید.',
      category: 'معارف',
      difficulty: 'hard',
      type: 'essay',
      options: [],
      correctAnswer: '',
      points: 15,
      createdAt: new Date().toISOString(),
    },
  ];

  private evaluations: RandomEvaluationDto[] = [
    {
      id: 1,
      studentId: 1,
      studentName: 'علی احمدی',
      title: 'آزمون معارف',
      category: 'معارف',
      startedAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
      completedAt: new Date(Date.now() - 3 * 24 * 3600 * 1000 + 3600 * 1000).toISOString(),
      totalQuestions: 2,
      correctAnswers: 2,
      totalScore: 20,
      status: 'completed',
      questions: [],
      answers: [],
    },
    {
      id: 2,
      studentId: 1,
      studentName: 'علی احمدی',
      title: 'آزمون قرآن',
      category: 'قرآن',
      startedAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
      totalQuestions: 3,
      correctAnswers: 0,
      totalScore: 0,
      status: 'in_progress',
      questions: [],
      answers: [],
    },
  ];

  private nextQuestionId = 7;
  private nextEvaluationId = 3;

  getQuestions(category?: string, difficulty?: string): Observable<QuestionDto[]> {
    let filtered = this.questions;
    if (category) {
      filtered = filtered.filter(q => q.category === category);
    }
    if (difficulty) {
      filtered = filtered.filter(q => q.difficulty === difficulty);
    }
    return of(filtered);
  }

  createQuestion(payload: CreateQuestionRequest): Observable<QuestionDto> {
    const newQuestion: QuestionDto = {
      id: this.nextQuestionId++,
      ...payload,
      createdAt: new Date().toISOString(),
    };
    this.questions = [...this.questions, newQuestion];
    return of(newQuestion);
  }

  deleteQuestion(id: number): Observable<void> {
    this.questions = this.questions.filter(q => q.id !== id);
    return of(void 0);
  }

  startEvaluation(payload: StartEvaluationRequest): Observable<RandomEvaluationDto> {
    const pool = this.questions.filter(q => q.category === payload.category);
    const selected = pool.slice(0, payload.questionCount).map(q => ({
      questionId: q.id,
      text: q.text,
      options: q.type === 'essay' ? [] : q.options,
      points: q.points,
    }));
    const evaluation: RandomEvaluationDto = {
      id: this.nextEvaluationId++,
      studentId: payload.studentId,
      studentName: 'علی احمدی',
      title: `آزمون ${payload.category}`,
      category: payload.category,
      startedAt: new Date().toISOString(),
      totalQuestions: selected.length,
      correctAnswers: 0,
      totalScore: 0,
      status: 'in_progress',
      questions: selected,
      answers: [],
    };
    this.evaluations = [evaluation, ...this.evaluations];
    return of(evaluation);
  }

  getEvaluation(id: number): Observable<RandomEvaluationDto> {
    const evaluation = this.evaluations.find(e => e.id === id);
    if (!evaluation) {
      return of(this.evaluations[0]);
    }
    const withoutAnswers = {
      ...evaluation,
      answers: evaluation.status === 'in_progress' ? [] : evaluation.answers,
    };
    return of(withoutAnswers);
  }

  submitAnswers(payload: SubmitAnswersRequest): Observable<RandomEvaluationDto> {
    const evaluation = this.evaluations.find(e => e.id === payload.randomEvaluationId);
    const graded = this.grade(payload.answers, evaluation?.questions ?? []);
    const updated: RandomEvaluationDto = evaluation
      ? { ...evaluation, ...graded, status: 'completed', completedAt: new Date().toISOString() }
      : {
          id: payload.randomEvaluationId,
          studentId: 1,
          studentName: 'علی احمدی',
          title: 'آزمون',
          category: 'عمومی',
          startedAt: new Date().toISOString(),
          completedAt: new Date().toISOString(),
          totalQuestions: graded.answers.length,
          correctAnswers: graded.correctAnswers,
          totalScore: graded.totalScore,
          status: 'completed',
          questions: [],
          answers: graded.answers,
        };
    this.evaluations = this.evaluations.map(e => (e.id === updated.id ? updated : e));
    return of(updated);
  }

  getMyEvaluations(limit?: number): Observable<RandomEvaluationDto[]> {
    const items = limit ? this.evaluations.slice(0, limit) : this.evaluations;
    return of(items);
  }

  getEvaluationStats(): Observable<EvaluationStatsDto> {
    const completed = this.evaluations.filter(e => e.status === 'completed');
    const categoryBreakdown: { [k: string]: number } = {};
    for (const e of this.evaluations) {
      categoryBreakdown[e.category] = (categoryBreakdown[e.category] ?? 0) + 1;
    }
    const scoreTrend: EvaluationTrendPointDto[] = completed.map(e => ({
      date: (e.completedAt ?? e.startedAt).slice(0, 10),
      averageScore: e.totalQuestions > 0 ? e.totalScore / e.totalQuestions : 0,
    }));
    return of({
      totalEvaluations: this.evaluations.length,
      completedEvaluations: completed.length,
      totalQuestions: this.questions.length,
      categoryBreakdown,
      scoreTrend,
    });
  }

  private grade(answers: EvaluationAnswerDto[], questions: RandomEvaluationDto['questions']): {
    answers: EvaluationAnswerDto[];
    correctAnswers: number;
    totalScore: number;
  } {
    const graded = answers.map(answer => {
      const question = questions.find(q => q.questionId === answer.questionId);
      if (!question) {
        return answer;
      }
      const isCorrect =
        question.options.length > 0 && answer.answerText.trim() === this.correctFor(question.questionId);
      return { ...answer, isCorrect, pointsEarned: isCorrect ? question.points : 0 };
    });
    const correctAnswers = graded.filter(a => a.isCorrect).length;
    const totalScore = graded.reduce((sum, a) => sum + (a.pointsEarned ?? 0), 0);
    return { answers: graded, correctAnswers, totalScore };
  }

  private correctFor(questionId: number): string {
    return this.questions.find(q => q.id === questionId)?.correctAnswer ?? '';
  }
}
