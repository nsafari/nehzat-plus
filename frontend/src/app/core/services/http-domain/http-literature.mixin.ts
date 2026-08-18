import { Constructor, HttpServiceContext } from './base';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import {
  ArabicCourse,
  ArabicLesson,
  ArabicLiteratureAnalysis,
  ArabicLiteraturePoet,
  ArabicLiteraturePoem,
  ArabicUserProgress,
  CreateArabicCoursePayload,
  CreateArabicLessonPayload,
  CreateArabicLiteratureAnalysisPayload,
  CreateArabicLiteraturePoetPayload,
  CreateArabicLiteraturePoemPayload,
  CreatePersianLiteratureAnalysisPayload,
  CreatePersianLiteraturePoetPayload,
  CreatePersianLiteraturePoemPayload,
  PersianLiteratureAnalysis,
  PersianLiteraturePoet,
  PersianLiteraturePoem,
  RecordArabicProgressPayload,
  UpdateArabicCoursePayload,
  UpdateArabicLessonPayload,
} from '../../models/lesson-planner.models';

export function WithLiterature<TBase extends Constructor<HttpServiceContext>>(Base: TBase) {
  return class extends Base {
    getPoets(difficulty?: string): Observable<PersianLiteraturePoet[]> {
      let params = new HttpParams();
      if (difficulty) params = params.set('difficulty', difficulty);
      return this.http.get<PersianLiteraturePoet[]>(this.url('/api/persian-literature/poets'), {
        params,
      });
    }

    getPoetById(id: number): Observable<PersianLiteraturePoet> {
      return this.http.get<PersianLiteraturePoet>(this.url(`/api/persian-literature/poets/${id}`));
    }

    createPoet(payload: CreatePersianLiteraturePoetPayload): Observable<PersianLiteraturePoet> {
      return this.http.post<PersianLiteraturePoet>(
        this.url('/api/persian-literature/poets'),
        payload,
      );
    }

    updatePoet(
      id: number,
      payload: Partial<CreatePersianLiteraturePoetPayload>,
    ): Observable<PersianLiteraturePoet> {
      return this.http.put<PersianLiteraturePoet>(
        this.url(`/api/persian-literature/poets/${id}`),
        payload,
      );
    }

    deletePoet(id: number): Observable<void> {
      return this.http.delete<void>(this.url(`/api/persian-literature/poets/${id}`));
    }

    searchPoets(query: string): Observable<PersianLiteraturePoet[]> {
      return this.http.get<PersianLiteraturePoet[]>(
        this.url('/api/persian-literature/poets/search'),
        { params: { q: query } },
      );
    }

    getPoems(
      poetId?: number,
      genre?: string,
      difficulty?: string,
    ): Observable<PersianLiteraturePoem[]> {
      let params = new HttpParams();
      if (poetId) params = params.set('poetId', poetId.toString());
      if (genre) params = params.set('genre', genre);
      if (difficulty) params = params.set('difficulty', difficulty);
      return this.http.get<PersianLiteraturePoem[]>(this.url('/api/persian-literature/poems'), {
        params,
      });
    }

    getPoemById(id: number): Observable<PersianLiteraturePoem> {
      return this.http.get<PersianLiteraturePoem>(this.url(`/api/persian-literature/poems/${id}`));
    }

    createPoem(payload: CreatePersianLiteraturePoemPayload): Observable<PersianLiteraturePoem> {
      return this.http.post<PersianLiteraturePoem>(
        this.url('/api/persian-literature/poems'),
        payload,
      );
    }

    updatePoem(
      id: number,
      payload: Partial<CreatePersianLiteraturePoemPayload>,
    ): Observable<PersianLiteraturePoem> {
      return this.http.put<PersianLiteraturePoem>(
        this.url(`/api/persian-literature/poems/${id}`),
        payload,
      );
    }

    deletePoem(id: number): Observable<void> {
      return this.http.delete<void>(this.url(`/api/persian-literature/poems/${id}`));
    }

    searchPoems(query: string): Observable<PersianLiteraturePoem[]> {
      return this.http.get<PersianLiteraturePoem[]>(
        this.url('/api/persian-literature/poems/search'),
        { params: { q: query } },
      );
    }

    getAnalysesByPoem(poemId: number): Observable<PersianLiteratureAnalysis[]> {
      return this.http.get<PersianLiteratureAnalysis[]>(
        this.url(`/api/persian-literature/poems/${poemId}/analyses`),
      );
    }

    getAnalysisById(id: number): Observable<PersianLiteratureAnalysis> {
      return this.http.get<PersianLiteratureAnalysis>(
        this.url(`/api/persian-literature/analyses/${id}`),
      );
    }

    createAnalysis(
      payload: CreatePersianLiteratureAnalysisPayload,
    ): Observable<PersianLiteratureAnalysis> {
      return this.http.post<PersianLiteratureAnalysis>(
        this.url('/api/persian-literature/analyses'),
        payload,
      );
    }

    updateAnalysis(
      id: number,
      payload: Partial<CreatePersianLiteratureAnalysisPayload>,
    ): Observable<PersianLiteratureAnalysis> {
      return this.http.put<PersianLiteratureAnalysis>(
        this.url(`/api/persian-literature/analyses/${id}`),
        payload,
      );
    }

    deleteAnalysis(id: number): Observable<void> {
      return this.http.delete<void>(this.url(`/api/persian-literature/analyses/${id}`));
    }

    getLiteratureDashboardStats(): Observable<any> {
      return this.http.get<any>(this.url('/api/persian-literature/dashboard'));
    }

    getArabicPoets(difficulty?: string): Observable<ArabicLiteraturePoet[]> {
      let params = new HttpParams();
      if (difficulty) params = params.set('difficulty', difficulty);
      return this.http.get<ArabicLiteraturePoet[]>(this.url('/api/arabic-literature/poets'), {
        params,
      });
    }

    getArabicPoetById(id: number): Observable<ArabicLiteraturePoet> {
      return this.http.get<ArabicLiteraturePoet>(this.url(`/api/arabic-literature/poets/${id}`));
    }

    createArabicPoet(payload: CreateArabicLiteraturePoetPayload): Observable<ArabicLiteraturePoet> {
      return this.http.post<ArabicLiteraturePoet>(
        this.url('/api/arabic-literature/poets'),
        payload,
      );
    }

    updateArabicPoet(
      id: number,
      payload: Partial<CreateArabicLiteraturePoetPayload>,
    ): Observable<ArabicLiteraturePoet> {
      return this.http.put<ArabicLiteraturePoet>(
        this.url(`/api/arabic-literature/poets/${id}`),
        payload,
      );
    }

    deleteArabicPoet(id: number): Observable<void> {
      return this.http.delete<void>(this.url(`/api/arabic-literature/poets/${id}`));
    }

    searchArabicPoets(query: string): Observable<ArabicLiteraturePoet[]> {
      return this.http.get<ArabicLiteraturePoet[]>(
        this.url('/api/arabic-literature/poets/search'),
        { params: { q: query } },
      );
    }

    getArabicPoems(
      poetId?: number,
      genre?: string,
      difficulty?: string,
    ): Observable<ArabicLiteraturePoem[]> {
      let params = new HttpParams();
      if (poetId) params = params.set('poetId', poetId.toString());
      if (genre) params = params.set('genre', genre);
      if (difficulty) params = params.set('difficulty', difficulty);
      return this.http.get<ArabicLiteraturePoem[]>(this.url('/api/arabic-literature/poems'), {
        params,
      });
    }

    getArabicPoemById(id: number): Observable<ArabicLiteraturePoem> {
      return this.http.get<ArabicLiteraturePoem>(this.url(`/api/arabic-literature/poems/${id}`));
    }

    createArabicPoem(payload: CreateArabicLiteraturePoemPayload): Observable<ArabicLiteraturePoem> {
      return this.http.post<ArabicLiteraturePoem>(
        this.url('/api/arabic-literature/poems'),
        payload,
      );
    }

    updateArabicPoem(
      id: number,
      payload: Partial<CreateArabicLiteraturePoemPayload>,
    ): Observable<ArabicLiteraturePoem> {
      return this.http.put<ArabicLiteraturePoem>(
        this.url(`/api/arabic-literature/poems/${id}`),
        payload,
      );
    }

    deleteArabicPoem(id: number): Observable<void> {
      return this.http.delete<void>(this.url(`/api/arabic-literature/poems/${id}`));
    }

    searchArabicPoems(query: string): Observable<ArabicLiteraturePoem[]> {
      return this.http.get<ArabicLiteraturePoem[]>(
        this.url('/api/arabic-literature/poems/search'),
        { params: { q: query } },
      );
    }

    getArabicAnalysesByPoem(poemId: number): Observable<ArabicLiteratureAnalysis[]> {
      return this.http.get<ArabicLiteratureAnalysis[]>(
        this.url(`/api/arabic-literature/poems/${poemId}/analyses`),
      );
    }

    getArabicAnalysisById(id: number): Observable<ArabicLiteratureAnalysis> {
      return this.http.get<ArabicLiteratureAnalysis>(
        this.url(`/api/arabic-literature/analyses/${id}`),
      );
    }

    createArabicAnalysis(
      payload: CreateArabicLiteratureAnalysisPayload,
    ): Observable<ArabicLiteratureAnalysis> {
      return this.http.post<ArabicLiteratureAnalysis>(
        this.url('/api/arabic-literature/analyses'),
        payload,
      );
    }

    updateArabicAnalysis(
      id: number,
      payload: Partial<CreateArabicLiteratureAnalysisPayload>,
    ): Observable<ArabicLiteratureAnalysis> {
      return this.http.put<ArabicLiteratureAnalysis>(
        this.url(`/api/arabic-literature/analyses/${id}`),
        payload,
      );
    }

    deleteArabicAnalysis(id: number): Observable<void> {
      return this.http.delete<void>(this.url(`/api/arabic-literature/analyses/${id}`));
    }

    getArabicCourses(): Observable<ArabicCourse[]> {
      return this.http.get<ArabicCourse[]>(this.url('/api/arabic-literature/courses'));
    }

    getArabicCourseById(id: number): Observable<ArabicCourse> {
      return this.http.get<ArabicCourse>(this.url(`/api/arabic-literature/courses/${id}`));
    }

    createArabicCourse(payload: CreateArabicCoursePayload): Observable<ArabicCourse> {
      return this.http.post<ArabicCourse>(this.url('/api/arabic-literature/courses'), payload);
    }

    updateArabicCourse(id: number, payload: UpdateArabicCoursePayload): Observable<ArabicCourse> {
      return this.http.put<ArabicCourse>(this.url(`/api/arabic-literature/courses/${id}`), payload);
    }

    deleteArabicCourse(id: number): Observable<void> {
      return this.http.delete<void>(this.url(`/api/arabic-literature/courses/${id}`));
    }

    getArabicLessons(courseId: number): Observable<ArabicLesson[]> {
      return this.http.get<ArabicLesson[]>(
        this.url(`/api/arabic-literature/courses/${courseId}/lessons`),
      );
    }

    getArabicLessonById(id: number): Observable<ArabicLesson> {
      return this.http.get<ArabicLesson>(this.url(`/api/arabic-literature/lessons/${id}`));
    }

    createArabicLesson(payload: CreateArabicLessonPayload): Observable<ArabicLesson> {
      return this.http.post<ArabicLesson>(this.url('/api/arabic-literature/lessons'), payload);
    }

    updateArabicLesson(id: number, payload: UpdateArabicLessonPayload): Observable<ArabicLesson> {
      return this.http.put<ArabicLesson>(this.url(`/api/arabic-literature/lessons/${id}`), payload);
    }

    deleteArabicLesson(id: number): Observable<void> {
      return this.http.delete<void>(this.url(`/api/arabic-literature/lessons/${id}`));
    }

    getArabicUserProgress(): Observable<ArabicUserProgress[]> {
      return this.http.get<ArabicUserProgress[]>(this.url('/api/arabic-literature/progress'));
    }

    getArabicCourseProgress(courseId: number): Observable<ArabicUserProgress[]> {
      return this.http.get<ArabicUserProgress[]>(
        this.url(`/api/arabic-literature/courses/${courseId}/progress`),
      );
    }

    recordArabicProgress(payload: RecordArabicProgressPayload): Observable<ArabicUserProgress> {
      return this.http.post<ArabicUserProgress>(
        this.url('/api/arabic-literature/progress'),
        payload,
      );
    }

    getArabicDashboardStats(): Observable<Record<string, unknown>> {
      return this.http.get<Record<string, unknown>>(
        this.url('/api/arabic-literature/dashboard-stats'),
      );
    }
  };
}
