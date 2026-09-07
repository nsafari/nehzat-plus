import { Observable } from 'rxjs';

import { MockLessonPlannerApiBase, type MockApiCtor } from './mock-lesson-planner-base';
import {
  CreatePersianLiteratureAnalysisPayload,
  CreatePersianLiteraturePoemPayload,
  CreatePersianLiteraturePoetPayload,
  PersianLiteratureAnalysis,
  PersianLiteraturePoem,
  PersianLiteraturePoet,
} from './mock-lesson-planner-models';

/**
 * withLiterature delegation mixin: every method forwards to the injected
 * MockLiteratureService instance (see MockLessonPlannerApiBase.literature).
 */
export function withLiterature<T extends MockApiCtor>(Base: T) {
  return class extends Base {
    // ===== Persian Literature =====
    getPoets(difficulty?: string): Observable<PersianLiteraturePoet[]> {
      return this.literature.getPoets(difficulty);
    }

    getPoetById(id: number): Observable<PersianLiteraturePoet> {
      return this.literature.getPoetById(id);
    }

    createPoet(payload: CreatePersianLiteraturePoetPayload): Observable<PersianLiteraturePoet> {
      return this.literature.createPoet(payload);
    }

    updatePoet(
      id: number,
      payload: Partial<CreatePersianLiteraturePoetPayload>,
    ): Observable<PersianLiteraturePoet> {
      return this.literature.updatePoet(id, payload);
    }

    deletePoet(id: number): Observable<void> {
      return this.literature.deletePoet(id);
    }

    searchPoets(query: string): Observable<PersianLiteraturePoet[]> {
      return this.literature.searchPoets(query);
    }

    getPoems(
      poetId?: number,
      genre?: string,
      difficulty?: string,
    ): Observable<PersianLiteraturePoem[]> {
      return this.literature.getPoems(poetId, genre, difficulty);
    }

    getPoemById(id: number): Observable<PersianLiteraturePoem> {
      return this.literature.getPoemById(id);
    }

    createPoem(payload: CreatePersianLiteraturePoemPayload): Observable<PersianLiteraturePoem> {
      return this.literature.createPoem(payload);
    }

    updatePoem(
      id: number,
      payload: Partial<CreatePersianLiteraturePoemPayload>,
    ): Observable<PersianLiteraturePoem> {
      return this.literature.updatePoem(id, payload);
    }

    deletePoem(id: number): Observable<void> {
      return this.literature.deletePoem(id);
    }

    searchPoems(query: string): Observable<PersianLiteraturePoem[]> {
      return this.literature.searchPoems(query);
    }

    getAnalysesByPoem(poemId: number): Observable<PersianLiteratureAnalysis[]> {
      return this.literature.getAnalysesByPoem(poemId);
    }

    getAnalysisById(id: number): Observable<PersianLiteratureAnalysis> {
      return this.literature.getAnalysisById(id);
    }

    createAnalysis(
      payload: CreatePersianLiteratureAnalysisPayload,
    ): Observable<PersianLiteratureAnalysis> {
      return this.literature.createAnalysis(payload);
    }

    updateAnalysis(
      id: number,
      payload: Partial<CreatePersianLiteratureAnalysisPayload>,
    ): Observable<PersianLiteratureAnalysis> {
      return this.literature.updateAnalysis(id, payload);
    }

    deleteAnalysis(id: number): Observable<void> {
      return this.literature.deleteAnalysis(id);
    }

    getLiteratureDashboardStats(): Observable<any> {
      return this.literature.getLiteratureDashboardStats();
    }
  };
}
