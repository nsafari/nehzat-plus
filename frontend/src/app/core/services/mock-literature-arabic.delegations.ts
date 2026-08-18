import { Observable } from 'rxjs';

import { MockLessonPlannerApiBase, type MockApiCtor } from './mock-lesson-planner-base';
import {
  ArabicCourse,
  ArabicLesson,
  ArabicLiteratureAnalysis,
  ArabicLiteraturePoem,
  ArabicLiteraturePoet,
  ArabicUserProgress,
  CreateArabicCoursePayload,
  CreateArabicLessonPayload,
  CreateArabicLiteratureAnalysisPayload,
  CreateArabicLiteraturePoemPayload,
  CreateArabicLiteraturePoetPayload,
  RecordArabicProgressPayload,
  UpdateArabicCoursePayload,
  UpdateArabicLessonPayload,
} from './mock-lesson-planner-models';

/**
 * withLiteratureArabic delegation mixin
 * Arabic literature poets, poems, analyses and curriculum.: every method forwards to the injected
 * MockLiteratureService instance (see MockLessonPlannerApiBase.literatureArabic).
 */
export function withLiteratureArabic<T extends MockApiCtor>(Base: T) {
  return class extends Base {
    // ===== Arabic Literature =====
    getArabicPoets(difficulty?: string): Observable<ArabicLiteraturePoet[]> {
      return this.literature.getArabicPoets(difficulty);
    }

    getArabicPoetById(id: number): Observable<ArabicLiteraturePoet> {
      return this.literature.getArabicPoetById(id);
    }

    createArabicPoet(payload: CreateArabicLiteraturePoetPayload): Observable<ArabicLiteraturePoet> {
      return this.literature.createArabicPoet(payload);
    }

    updateArabicPoet(
      id: number,
      payload: Partial<CreateArabicLiteraturePoetPayload>,
    ): Observable<ArabicLiteraturePoet> {
      return this.literature.updateArabicPoet(id, payload);
    }

    deleteArabicPoet(id: number): Observable<void> {
      return this.literature.deleteArabicPoet(id);
    }

    searchArabicPoets(query: string): Observable<ArabicLiteraturePoet[]> {
      return this.literature.searchArabicPoets(query);
    }

    getArabicPoems(
      poetId?: number,
      genre?: string,
      difficulty?: string,
    ): Observable<ArabicLiteraturePoem[]> {
      return this.literature.getArabicPoems(poetId, genre, difficulty);
    }

    getArabicPoemById(id: number): Observable<ArabicLiteraturePoem> {
      return this.literature.getArabicPoemById(id);
    }

    createArabicPoem(payload: CreateArabicLiteraturePoemPayload): Observable<ArabicLiteraturePoem> {
      return this.literature.createArabicPoem(payload);
    }

    updateArabicPoem(
      id: number,
      payload: Partial<CreateArabicLiteraturePoemPayload>,
    ): Observable<ArabicLiteraturePoem> {
      return this.literature.updateArabicPoem(id, payload);
    }

    deleteArabicPoem(id: number): Observable<void> {
      return this.literature.deleteArabicPoem(id);
    }

    searchArabicPoems(query: string): Observable<ArabicLiteraturePoem[]> {
      return this.literature.searchArabicPoems(query);
    }

    getArabicAnalysesByPoem(poemId: number): Observable<ArabicLiteratureAnalysis[]> {
      return this.literature.getArabicAnalysesByPoem(poemId);
    }

    getArabicAnalysisById(id: number): Observable<ArabicLiteratureAnalysis> {
      return this.literature.getArabicAnalysisById(id);
    }

    createArabicAnalysis(
      payload: CreateArabicLiteratureAnalysisPayload,
    ): Observable<ArabicLiteratureAnalysis> {
      return this.literature.createArabicAnalysis(payload);
    }

    updateArabicAnalysis(
      id: number,
      payload: Partial<CreateArabicLiteratureAnalysisPayload>,
    ): Observable<ArabicLiteratureAnalysis> {
      return this.literature.updateArabicAnalysis(id, payload);
    }

    deleteArabicAnalysis(id: number): Observable<void> {
      return this.literature.deleteArabicAnalysis(id);
    }

    // ===== Arabic Literature Curriculum =====
    getArabicCourses(): Observable<ArabicCourse[]> {
      return this.literature.getArabicCourses();
    }

    getArabicCourseById(id: number): Observable<ArabicCourse> {
      return this.literature.getArabicCourseById(id);
    }

    createArabicCourse(payload: CreateArabicCoursePayload): Observable<ArabicCourse> {
      return this.literature.createArabicCourse(payload);
    }

    updateArabicCourse(id: number, payload: UpdateArabicCoursePayload): Observable<ArabicCourse> {
      return this.literature.updateArabicCourse(id, payload);
    }

    deleteArabicCourse(id: number): Observable<void> {
      return this.literature.deleteArabicCourse(id);
    }

    getArabicLessons(courseId: number): Observable<ArabicLesson[]> {
      return this.literature.getArabicLessons(courseId);
    }

    getArabicLessonById(id: number): Observable<ArabicLesson> {
      return this.literature.getArabicLessonById(id);
    }

    createArabicLesson(payload: CreateArabicLessonPayload): Observable<ArabicLesson> {
      return this.literature.createArabicLesson(payload);
    }

    updateArabicLesson(id: number, payload: UpdateArabicLessonPayload): Observable<ArabicLesson> {
      return this.literature.updateArabicLesson(id, payload);
    }

    deleteArabicLesson(id: number): Observable<void> {
      return this.literature.deleteArabicLesson(id);
    }

    getArabicUserProgress(): Observable<ArabicUserProgress[]> {
      return this.literature.getArabicUserProgress();
    }

    getArabicCourseProgress(courseId: number): Observable<ArabicUserProgress[]> {
      return this.literature.getArabicCourseProgress(courseId);
    }

    recordArabicProgress(payload: RecordArabicProgressPayload): Observable<ArabicUserProgress> {
      return this.literature.recordArabicProgress(payload);
    }

    getArabicDashboardStats(): Observable<Record<string, unknown>> {
      return this.literature.getArabicDashboardStats();
    }
  };
}
