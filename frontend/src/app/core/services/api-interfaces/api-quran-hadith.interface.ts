import { Observable } from 'rxjs';

import {
  Ayah,
  HadithAssessment,
  HadithBook,
  HadithBookDetail,
  HadithChapter,
  HadithChapterDetail,
  HadithDashboardStats,
  HadithItem,
  HadithReview,
  HadithReviewCard,
  HadithReviewStats,
  QuranCurriculum,
  QuranStudentProgress,
  RecitationLevel,
  SubmitHadithReviewPayload,
  SubmitReviewPayload,
  Surah,
  TajweedRule,
  UserHadithProgress,
} from '../../models/lesson-planner.models';

export abstract class QuranHadithApi {
  // ===== Quran Module =====
  abstract getSurahs(): Observable<Surah[]>;
  abstract getSurahById(id: number): Observable<Surah>;
  abstract createSurah(surah: Partial<Surah>): Observable<Surah>;
  abstract updateSurah(id: number, surah: Partial<Surah>): Observable<Surah>;
  abstract deleteSurah(id: number): Observable<void>;

  abstract getAyahs(surahId: number): Observable<Ayah[]>;
  abstract getAyahsBySurah(surahId: number): Observable<Ayah[]>;
  abstract getAyahById(id: number): Observable<Ayah>;
  abstract createAyah(ayah: Partial<Ayah>): Observable<Ayah>;
  abstract updateAyah(id: number, ayah: Partial<Ayah>): Observable<Ayah>;
  abstract deleteAyah(id: number): Observable<void>;

  abstract getTajweedRules(): Observable<TajweedRule[]>;
  abstract getTajweedRule(id: number): Observable<TajweedRule>;
  abstract createTajweedRule(rule: Partial<TajweedRule>): Observable<TajweedRule>;
  abstract updateTajweedRule(id: number, rule: Partial<TajweedRule>): Observable<TajweedRule>;
  abstract deleteTajweedRule(id: number): Observable<void>;

  abstract getRecitationLevels(): Observable<RecitationLevel[]>;
  abstract getRecitationLevel(id: number): Observable<RecitationLevel>;
  abstract createRecitationLevel(level: Partial<RecitationLevel>): Observable<RecitationLevel>;
  abstract updateRecitationLevel(
    id: number,
    level: Partial<RecitationLevel>,
  ): Observable<RecitationLevel>;
  abstract deleteRecitationLevel(id: number): Observable<void>;

  abstract getQuranCurricula(): Observable<QuranCurriculum[]>;
  abstract getQuranCurriculumById(id: number): Observable<QuranCurriculum>;
  abstract createQuranCurriculum(curriculum: Partial<QuranCurriculum>): Observable<QuranCurriculum>;
  abstract updateQuranCurriculum(
    id: number,
    curriculum: Partial<QuranCurriculum>,
  ): Observable<QuranCurriculum>;
  abstract deleteQuranCurriculum(id: number): Observable<void>;

  abstract getQuranStudentProgress(studentId: number): Observable<QuranStudentProgress>;
  abstract getQuranProgress(id: number): Observable<QuranStudentProgress>;
  abstract createQuranProgress(
    progress: Partial<QuranStudentProgress>,
  ): Observable<QuranStudentProgress>;

  abstract getQuranLessonPlans(): Observable<any[]>;
  abstract getQuranLessonPlanById(id: number): Observable<any>;
  abstract createQuranLessonPlan(payload: any): Observable<any>;
  abstract updateQuranLessonPlan(id: number, payload: any): Observable<any>;
  abstract deleteQuranLessonPlan(id: number): Observable<void>;

  abstract getQuranDashboardStats(): Observable<any>;
  abstract searchAyahs(query: string, max?: number): Observable<Ayah[]>;

  // ===== Hadith Module =====
  abstract getHadithBooks(): Observable<HadithBook[]>;
  abstract getHadithBookById(id: number): Observable<HadithBookDetail>;
  abstract createHadithBook(payload: Partial<HadithBook>): Observable<HadithBook>;
  abstract updateHadithBook(id: number, payload: Partial<HadithBook>): Observable<HadithBook>;
  abstract deleteHadithBook(id: number): Observable<void>;
  abstract getHadithChaptersByBook(bookId: number): Observable<HadithChapter[]>;
  abstract getHadithChapterById(id: number): Observable<HadithChapterDetail>;
  abstract createHadithChapter(payload: Partial<HadithChapter>): Observable<HadithChapter>;
  abstract updateHadithChapter(
    id: number,
    payload: Partial<HadithChapter>,
  ): Observable<HadithChapter>;
  abstract deleteHadithChapter(id: number): Observable<void>;
  abstract getHadithsByChapter(chapterId: number): Observable<HadithItem[]>;
  abstract getHadithById(id: number): Observable<HadithItem>;
  abstract createHadith(payload: Partial<HadithItem>): Observable<HadithItem>;
  abstract updateHadith(id: number, payload: Partial<HadithItem>): Observable<HadithItem>;
  abstract deleteHadith(id: number): Observable<void>;
  abstract getDueHadithReviews(count: number): Observable<HadithReviewCard[]>;
  abstract submitHadithReview(payload: SubmitReviewPayload): Observable<UserHadithProgress>;
  abstract getHadithProgressSummary(): Observable<Record<string, number>>;
  abstract getHadithAssessmentsByChapter(chapterId: number): Observable<HadithAssessment[]>;
  abstract createHadithAssessment(payload: Partial<HadithAssessment>): Observable<HadithAssessment>;
  abstract getHadithDashboardStats(): Observable<HadithDashboardStats>;
  abstract getHadithChapters(bookId: number): Observable<HadithChapter[]>;
  abstract getHadithReviewStats(studentId: number): Observable<HadithReviewStats>;
  abstract getPendingHadithReviews(studentId: number, limit?: number): Observable<HadithItem[]>;
  abstract submitHadithStudentReview(
    studentId: number,
    payload: SubmitHadithReviewPayload,
  ): Observable<HadithReview>;
}
