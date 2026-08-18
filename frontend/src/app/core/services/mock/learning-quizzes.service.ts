import { Observable } from 'rxjs';
import { MockDataContext } from './mock-data-context';
import { MockLearningCurriculumBaseService } from './learning-curriculum.service';

/**
 * Quizzes, enrollments and progress sub-domain for the learning platform.
 * Split from the former monolithic MockLearningService.
 */
export abstract class MockLearningQuizzesBaseService extends MockLearningCurriculumBaseService {
  constructor(ctx: MockDataContext) {
    super(ctx);
  }

  getQuizzes(lessonId: number): Observable<any[]> {
    return this.ctx.delayed(this.ctx.quizzes.filter((q: any) => q.lessonId === lessonId));
  }

  getQuiz(id: number): Observable<any> {
    const quiz = this.ctx.quizzes.find((q: any) => q.id === id);
    if (!quiz) throw new Error('Quiz not found');
    return this.ctx.delayed(quiz);
  }

  getQuizById(id: number): Observable<any> {
    return this.getQuiz(id);
  }

  createQuiz(payload: any): Observable<any> {
    const quiz = { id: this.ctx.nextId(this.ctx.quizzes), ...payload };
    this.ctx.quizzes.push(quiz);
    return this.ctx.delayed(quiz);
  }

  updateQuiz(id: number, payload: any): Observable<any> {
    const quiz = this.ctx.quizzes.find((q: any) => q.id === id);
    if (!quiz) throw new Error('Quiz not found');
    Object.assign(quiz, payload);
    return this.ctx.delayed(quiz);
  }

  deleteQuiz(id: number): Observable<void> {
    this.ctx.quizzes = this.ctx.quizzes.filter((q: any) => q.id !== id);
    return this.ctx.delayed(undefined);
  }

  getQuizQuestions(quizId: number): Observable<any[]> {
    return this.ctx.delayed(this.ctx.persLitQuizQuestions.filter((q: any) => q.quizId === quizId));
  }

  createQuizQuestion(payload: any): Observable<any> {
    const question = { id: this.ctx.nextId(this.ctx.persLitQuizQuestions), ...payload };
    this.ctx.persLitQuizQuestions.push(question);
    return this.ctx.delayed(question);
  }

  updateQuizQuestion(id: number, payload: any): Observable<any> {
    const question = this.ctx.persLitQuizQuestions.find((q: any) => q.id === id);
    if (!question) throw new Error('Question not found');
    Object.assign(question, payload);
    return this.ctx.delayed(question);
  }

  deleteQuizQuestion(id: number): Observable<void> {
    this.ctx.persLitQuizQuestions = this.ctx.persLitQuizQuestions.filter((q: any) => q.id !== id);
    return this.ctx.delayed(undefined);
  }

  enrollUser(payload: any): Observable<any> {
    const enrollment = { id: this.ctx.nextId(this.ctx.userEnrollments), ...payload };
    this.ctx.userEnrollments.push(enrollment);
    return this.ctx.delayed(enrollment);
  }

  getUserEnrollments(userId?: number): Observable<any[]> {
    let enrollments = [...this.ctx.userEnrollments];
    if (userId !== undefined) enrollments = enrollments.filter((e: any) => e.userId === userId);
    return this.ctx.delayed(enrollments);
  }

  getUserDashboard(userId: number, pathId: number): Observable<any> {
    return this.ctx.delayed({
      userId,
      pathId,
      progress: 0,
      completedLessons: 0,
      totalLessons: 0,
    });
  }

  getLearningDashboardStats(): Observable<any> {
    return this.ctx.delayed({
      totalPaths: this.ctx.learningPaths.length,
      totalLevels: this.ctx.learningLevels.length,
      totalModules: this.ctx.studyModules.length,
      totalLessons: this.ctx.studyLessons.length,
      totalEnrollments: this.ctx.userEnrollments.length,
    });
  }

  updateLessonProgress(payload: {
    lessonId: number;
    status: string;
    score?: number;
  }): Observable<any> {
    const progress = this.ctx.lessonProgress.find((p: any) => p.lessonId === payload.lessonId);
    if (progress) {
      progress.status = payload.status;
      progress.score = payload.score ?? progress.score;
      progress.updatedAt = this.ctx.now();
      return this.ctx.delayed(progress);
    }
    const newProgress = {
      id: this.ctx.nextId(this.ctx.lessonProgress),
      lessonId: payload.lessonId,
      status: payload.status,
      score: payload.score ?? 0,
      createdAt: this.ctx.now(),
      updatedAt: this.ctx.now(),
    };
    this.ctx.lessonProgress.push(newProgress);
    return this.ctx.delayed(newProgress);
  }

  submitQuiz(payload: any): Observable<any> {
    return this.ctx.delayed({
      score: 0,
      totalQuestions: 0,
      correctAnswers: 0,
      completedAt: this.ctx.now(),
    });
  }

  getUserQuizAttempts(enrollmentId: number): Observable<any[]> {
    return this.ctx.delayed(
      this.ctx.quizAttempts.filter((a: any) => a.enrollmentId === enrollmentId),
    );
  }
}
