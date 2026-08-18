import { Observable } from 'rxjs';

import { MockLessonPlannerApiBase, type MockApiCtor } from './mock-lesson-planner-base';
import {
  CreateContentBlockPayload,
  CreateLearningLevelPayload,
  CreateLearningPathPayload,
  CreatePersLitQuizPayload,
  CreatePersLitQuizQuestionPayload,
  CreateStudyLessonPayload,
  CreateStudyModulePayload,
  EnrollUserRequest,
  LearningDashboardStatsDto,
  LearningLevel,
  LearningPath,
  LearningPathTreeDto,
  LessonContentBlock,
  PersLitQuiz,
  PersLitQuizQuestion,
  QuizResultDto,
  StudyLesson,
  StudyModule,
  SubmitQuizRequest,
  UpdateContentBlockPayload,
  UpdateLearningLevelPayload,
  UpdateLearningPathPayload,
  UpdatePersLitQuizPayload,
  UpdatePersLitQuizQuestionPayload,
  UpdateStudyLessonPayload,
  UpdateStudyModulePayload,
  UserDashboardDto,
  UserEnrollment,
  UserLessonProgress,
  UserQuizAttempt,
} from './mock-lesson-planner-models';

/**
 * withLearning delegation mixin: every method forwards to the injected
 * MockLearningService instance (see MockLessonPlannerApiBase.learning).
 */
export function withLearning<T extends MockApiCtor>(Base: T) {
  return class extends Base {
    // ===== Learning Platform =====
    getLearningPaths(): Observable<LearningPath[]> {
      return this.learning.getLearningPaths();
    }

    getLearningPath(id: number): Observable<LearningPath> {
      return this.learning.getLearningPath(id);
    }

    getLearningPathTree(id: number): Observable<LearningPathTreeDto> {
      return this.learning.getLearningPathTree(id);
    }

    createLearningPath(payload: CreateLearningPathPayload): Observable<LearningPath> {
      return this.learning.createLearningPath(payload);
    }

    updateLearningPath(id: number, payload: UpdateLearningPathPayload): Observable<LearningPath> {
      return this.learning.updateLearningPath(id, payload);
    }

    deleteLearningPath(id: number): Observable<void> {
      return this.learning.deleteLearningPath(id);
    }

    getLearningLevels(pathId: number): Observable<LearningLevel[]> {
      return this.learning.getLearningLevels(pathId);
    }

    getLearningLevel(id: number): Observable<LearningLevel> {
      return this.learning.getLearningLevel(id);
    }

    createLearningLevel(payload: CreateLearningLevelPayload): Observable<LearningLevel> {
      return this.learning.createLearningLevel(payload);
    }

    updateLearningLevel(
      id: number,
      payload: UpdateLearningLevelPayload,
    ): Observable<LearningLevel> {
      return this.learning.updateLearningLevel(id, payload);
    }

    deleteLearningLevel(id: number): Observable<void> {
      return this.learning.deleteLearningLevel(id);
    }

    getStudyModules(levelId: number): Observable<StudyModule[]> {
      return this.learning.getStudyModules(levelId);
    }

    getStudyModule(id: number): Observable<StudyModule> {
      return this.learning.getStudyModule(id);
    }

    createStudyModule(payload: CreateStudyModulePayload): Observable<StudyModule> {
      return this.learning.createStudyModule(payload);
    }

    updateStudyModule(id: number, payload: UpdateStudyModulePayload): Observable<StudyModule> {
      return this.learning.updateStudyModule(id, payload);
    }

    deleteStudyModule(id: number): Observable<void> {
      return this.learning.deleteStudyModule(id);
    }

    getStudyLessons(moduleId: number): Observable<StudyLesson[]> {
      return this.learning.getStudyLessons(moduleId);
    }

    getStudyLesson(id: number): Observable<StudyLesson> {
      return this.learning.getStudyLesson(id);
    }

    getLessonById(id: number): Observable<StudyLesson> {
      return this.learning.getLessonById(id);
    }

    createStudyLesson(payload: CreateStudyLessonPayload): Observable<StudyLesson> {
      return this.learning.createStudyLesson(payload);
    }

    updateStudyLesson(id: number, payload: UpdateStudyLessonPayload): Observable<StudyLesson> {
      return this.learning.updateStudyLesson(id, payload);
    }

    deleteStudyLesson(id: number): Observable<void> {
      return this.learning.deleteStudyLesson(id);
    }

    getContentBlocks(lessonId: number): Observable<LessonContentBlock[]> {
      return this.learning.getContentBlocks(lessonId);
    }

    createContentBlock(payload: CreateContentBlockPayload): Observable<LessonContentBlock> {
      return this.learning.createContentBlock(payload);
    }

    updateContentBlock(
      id: number,
      payload: UpdateContentBlockPayload,
    ): Observable<LessonContentBlock> {
      return this.learning.updateContentBlock(id, payload);
    }

    deleteContentBlock(id: number): Observable<void> {
      return this.learning.deleteContentBlock(id);
    }

    getQuizzes(lessonId: number): Observable<PersLitQuiz[]> {
      return this.learning.getQuizzes(lessonId);
    }

    getQuiz(id: number): Observable<PersLitQuiz> {
      return this.learning.getQuiz(id);
    }

    getQuizById(id: number): Observable<PersLitQuiz> {
      return this.learning.getQuizById(id);
    }

    createQuiz(payload: CreatePersLitQuizPayload): Observable<PersLitQuiz> {
      return this.learning.createQuiz(payload);
    }

    updateQuiz(id: number, payload: UpdatePersLitQuizPayload): Observable<PersLitQuiz> {
      return this.learning.updateQuiz(id, payload);
    }

    deleteQuiz(id: number): Observable<void> {
      return this.learning.deleteQuiz(id);
    }

    getQuizQuestions(quizId: number): Observable<PersLitQuizQuestion[]> {
      return this.learning.getQuizQuestions(quizId);
    }

    createQuizQuestion(payload: CreatePersLitQuizQuestionPayload): Observable<PersLitQuizQuestion> {
      return this.learning.createQuizQuestion(payload);
    }

    updateQuizQuestion(
      id: number,
      payload: UpdatePersLitQuizQuestionPayload,
    ): Observable<PersLitQuizQuestion> {
      return this.learning.updateQuizQuestion(id, payload);
    }

    deleteQuizQuestion(id: number): Observable<void> {
      return this.learning.deleteQuizQuestion(id);
    }

    enrollUser(payload: EnrollUserRequest): Observable<UserEnrollment> {
      return this.learning.enrollUser(payload);
    }

    getUserEnrollments(userId?: number): Observable<UserEnrollment[]> {
      return this.learning.getUserEnrollments(userId);
    }

    getUserDashboard(userId: number, pathId: number): Observable<UserDashboardDto> {
      return this.learning.getUserDashboard(userId, pathId);
    }

    getLearningDashboardStats(): Observable<LearningDashboardStatsDto> {
      return this.learning.getLearningDashboardStats();
    }

    updateLessonProgress(payload: {
      lessonId: number;
      status: string;
      score?: number;
    }): Observable<UserLessonProgress> {
      return this.learning.updateLessonProgress(payload);
    }

    submitQuiz(payload: SubmitQuizRequest): Observable<QuizResultDto> {
      return this.learning.submitQuiz(payload);
    }

    getUserQuizAttempts(enrollmentId: number): Observable<UserQuizAttempt[]> {
      return this.learning.getUserQuizAttempts(enrollmentId);
    }
  };
}
