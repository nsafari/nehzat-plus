import { Observable } from 'rxjs';

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

export abstract class LiteratureApi {
    // Persian Literature
    abstract getPoets(difficulty?: string): Observable<PersianLiteraturePoet[]>;
    abstract getPoetById(id: number): Observable<PersianLiteraturePoet>;
    abstract createPoet(payload: CreatePersianLiteraturePoetPayload): Observable<PersianLiteraturePoet>;
    abstract updatePoet(id: number, payload: Partial<CreatePersianLiteraturePoetPayload>): Observable<PersianLiteraturePoet>;
    abstract deletePoet(id: number): Observable<void>;
    abstract searchPoets(query: string): Observable<PersianLiteraturePoet[]>;

    abstract getPoems(poetId?: number, genre?: string, difficulty?: string): Observable<PersianLiteraturePoem[]>;
    abstract getPoemById(id: number): Observable<PersianLiteraturePoem>;
    abstract createPoem(payload: CreatePersianLiteraturePoemPayload): Observable<PersianLiteraturePoem>;
    abstract updatePoem(id: number, payload: Partial<CreatePersianLiteraturePoemPayload>): Observable<PersianLiteraturePoem>;
    abstract deletePoem(id: number): Observable<void>;
    abstract searchPoems(query: string): Observable<PersianLiteraturePoem[]>;

    abstract getAnalysesByPoem(poemId: number): Observable<PersianLiteratureAnalysis[]>;
    abstract getAnalysisById(id: number): Observable<PersianLiteratureAnalysis>;
    abstract createAnalysis(payload: CreatePersianLiteratureAnalysisPayload): Observable<PersianLiteratureAnalysis>;
    abstract updateAnalysis(id: number, payload: Partial<CreatePersianLiteratureAnalysisPayload>): Observable<PersianLiteratureAnalysis>;
    abstract deleteAnalysis(id: number): Observable<void>;

    abstract getLiteratureDashboardStats(): Observable<any>;

    // Arabic Literature
    abstract getArabicPoets(difficulty?: string): Observable<ArabicLiteraturePoet[]>;
    abstract getArabicPoetById(id: number): Observable<ArabicLiteraturePoet>;
    abstract createArabicPoet(payload: CreateArabicLiteraturePoetPayload): Observable<ArabicLiteraturePoet>;
    abstract updateArabicPoet(id: number, payload: Partial<CreateArabicLiteraturePoetPayload>): Observable<ArabicLiteraturePoet>;
    abstract deleteArabicPoet(id: number): Observable<void>;
    abstract searchArabicPoets(query: string): Observable<ArabicLiteraturePoet[]>;

    abstract getArabicPoems(poetId?: number, genre?: string, difficulty?: string): Observable<ArabicLiteraturePoem[]>;
    abstract getArabicPoemById(id: number): Observable<ArabicLiteraturePoem>;
    abstract createArabicPoem(payload: CreateArabicLiteraturePoemPayload): Observable<ArabicLiteraturePoem>;
    abstract updateArabicPoem(id: number, payload: Partial<CreateArabicLiteraturePoemPayload>): Observable<ArabicLiteraturePoem>;
    abstract deleteArabicPoem(id: number): Observable<void>;
    abstract searchArabicPoems(query: string): Observable<ArabicLiteraturePoem[]>;

    abstract getArabicAnalysesByPoem(poemId: number): Observable<ArabicLiteratureAnalysis[]>;
    abstract getArabicAnalysisById(id: number): Observable<ArabicLiteratureAnalysis>;
    abstract createArabicAnalysis(payload: CreateArabicLiteratureAnalysisPayload): Observable<ArabicLiteratureAnalysis>;
    abstract updateArabicAnalysis(id: number, payload: Partial<CreateArabicLiteratureAnalysisPayload>): Observable<ArabicLiteratureAnalysis>;
    abstract deleteArabicAnalysis(id: number): Observable<void>;

    abstract getArabicDashboardStats(): Observable<Record<string, unknown>>;
}