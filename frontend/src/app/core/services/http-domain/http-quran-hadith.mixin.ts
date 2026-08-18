import { Constructor, HttpServiceContext } from './base';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
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

export function WithQuranHadith<TBase extends Constructor<HttpServiceContext>>(Base: TBase) {
  return class extends Base {
    getSurahs(): Observable<Surah[]> {
      return this.http.get<Surah[]>(this.url('/api/quran/surahs'));
    }

    getSurahById(id: number): Observable<Surah> {
      return this.http.get<Surah>(this.url(`/api/quran/surahs/${id}`));
    }

    getAyahs(surahId: number): Observable<Ayah[]> {
      return this.http.get<Ayah[]>(this.url(`/api/quran/surahs/${surahId}/ayahs`));
    }

    getAyahById(id: number): Observable<Ayah> {
      return this.http.get<Ayah>(this.url(`/api/quran/ayahs/${id}`));
    }

    createSurah(surah: Partial<Surah>): Observable<Surah> {
      return this.http.post<Surah>(this.url('/api/quran/surahs'), surah);
    }

    updateSurah(id: number, surah: Partial<Surah>): Observable<Surah> {
      return this.http.put<Surah>(this.url(`/api/quran/surahs/${id}`), surah);
    }

    deleteSurah(id: number): Observable<void> {
      return this.http.delete<void>(this.url(`/api/quran/surahs/${id}`));
    }

    getAyahsBySurah(surahId: number): Observable<Ayah[]> {
      return this.http.get<Ayah[]>(this.url(`/api/quran/surahs/${surahId}/ayahs`));
    }

    createAyah(ayah: Partial<Ayah>): Observable<Ayah> {
      return this.http.post<Ayah>(this.url('/api/quran/ayahs'), ayah);
    }

    updateAyah(id: number, ayah: Partial<Ayah>): Observable<Ayah> {
      return this.http.put<Ayah>(this.url(`/api/quran/ayahs/${id}`), ayah);
    }

    deleteAyah(id: number): Observable<void> {
      return this.http.delete<void>(this.url(`/api/quran/ayahs/${id}`));
    }

    getTajweedRule(id: number): Observable<TajweedRule> {
      return this.http.get<TajweedRule>(this.url(`/api/quran/tajweed-rules/${id}`));
    }

    createTajweedRule(rule: Partial<TajweedRule>): Observable<TajweedRule> {
      return this.http.post<TajweedRule>(this.url('/api/quran/tajweed-rules'), rule);
    }

    updateTajweedRule(id: number, rule: Partial<TajweedRule>): Observable<TajweedRule> {
      return this.http.put<TajweedRule>(this.url(`/api/quran/tajweed-rules/${id}`), rule);
    }

    deleteTajweedRule(id: number): Observable<void> {
      return this.http.delete<void>(this.url(`/api/quran/tajweed-rules/${id}`));
    }

    getRecitationLevel(id: number): Observable<RecitationLevel> {
      return this.http.get<RecitationLevel>(this.url(`/api/quran/recitation-levels/${id}`));
    }

    createRecitationLevel(level: Partial<RecitationLevel>): Observable<RecitationLevel> {
      return this.http.post<RecitationLevel>(this.url('/api/quran/recitation-levels'), level);
    }

    updateRecitationLevel(
      id: number,
      level: Partial<RecitationLevel>,
    ): Observable<RecitationLevel> {
      return this.http.put<RecitationLevel>(this.url(`/api/quran/recitation-levels/${id}`), level);
    }

    deleteRecitationLevel(id: number): Observable<void> {
      return this.http.delete<void>(this.url(`/api/quran/recitation-levels/${id}`));
    }

    searchAyahs(query: string): Observable<Ayah[]> {
      let params = new HttpParams().set('query', query);
      return this.http.get<Ayah[]>(this.url('/api/quran/ayahs/search'), { params });
    }

    getTajweedRules(): Observable<TajweedRule[]> {
      return this.http.get<TajweedRule[]>(this.url('/api/quran/tajweed-rules'));
    }

    getRecitationLevels(): Observable<RecitationLevel[]> {
      return this.http.get<RecitationLevel[]>(this.url('/api/quran/recitation-levels'));
    }

    getQuranCurricula(): Observable<QuranCurriculum[]> {
      return this.http.get<QuranCurriculum[]>(this.url('/api/quran/curricula'));
    }

    getQuranCurriculumById(id: number): Observable<QuranCurriculum> {
      return this.http.get<QuranCurriculum>(this.url(`/api/quran/curricula/${id}`));
    }

    createQuranCurriculum(payload: Partial<QuranCurriculum>): Observable<QuranCurriculum> {
      return this.http.post<QuranCurriculum>(this.url('/api/quran/curricula'), payload);
    }

    updateQuranCurriculum(
      id: number,
      payload: Partial<QuranCurriculum>,
    ): Observable<QuranCurriculum> {
      return this.http.put<QuranCurriculum>(this.url(`/api/quran/curricula/${id}`), payload);
    }

    deleteQuranCurriculum(id: number): Observable<void> {
      return this.http.delete<void>(this.url(`/api/quran/curricula/${id}`));
    }

    getQuranStudentProgress(studentId: number): Observable<QuranStudentProgress> {
      return this.http.get<QuranStudentProgress>(
        this.url(`/api/quran/students/${studentId}/progress`),
      );
    }

    getQuranLessonPlans(): Observable<any[]> {
      return this.http.get<any[]>(this.url('/api/quran/lesson-plans'));
    }

    getQuranLessonPlanById(id: number): Observable<any> {
      return this.http.get<any>(this.url(`/api/quran/lesson-plans/${id}`));
    }

    createQuranLessonPlan(payload: any): Observable<any> {
      return this.http.post<any>(this.url('/api/quran/lesson-plans'), payload);
    }

    updateQuranLessonPlan(id: number, payload: any): Observable<any> {
      return this.http.put<any>(this.url(`/api/quran/lesson-plans/${id}`), payload);
    }

    deleteQuranLessonPlan(id: number): Observable<void> {
      return this.http.delete<void>(this.url(`/api/quran/lesson-plans/${id}`));
    }

    getQuranProgress(id: number): Observable<QuranStudentProgress> {
      return this.http.get<QuranStudentProgress>(this.url(`/api/quran/progress/${id}`));
    }

    createQuranProgress(progress: Partial<QuranStudentProgress>): Observable<QuranStudentProgress> {
      return this.http.post<QuranStudentProgress>(this.url('/api/quran/progress'), progress);
    }

    getQuranDashboardStats(): Observable<any> {
      return this.http.get<any>(this.url('/api/quran/dashboard/stats'));
    }

    getHadithBooks(): Observable<HadithBook[]> {
      return this.http.get<HadithBook[]>(this.url('/api/hadith/books'));
    }

    getHadithBookById(id: number): Observable<HadithBookDetail> {
      return this.http.get<HadithBookDetail>(this.url(`/api/hadith/books/${id}`));
    }

    createHadithBook(payload: Partial<HadithBook>): Observable<HadithBook> {
      return this.http.post<HadithBook>(this.url('/api/hadith/books'), payload);
    }

    updateHadithBook(id: number, payload: Partial<HadithBook>): Observable<HadithBook> {
      return this.http.put<HadithBook>(this.url(`/api/hadith/books/${id}`), payload);
    }

    deleteHadithBook(id: number): Observable<void> {
      return this.http.delete<void>(this.url(`/api/hadith/books/${id}`));
    }

    getHadithChaptersByBook(bookId: number): Observable<HadithChapter[]> {
      return this.http.get<HadithChapter[]>(this.url(`/api/hadith/books/${bookId}/chapters`));
    }

    getHadithChapterById(id: number): Observable<HadithChapterDetail> {
      return this.http.get<HadithChapterDetail>(this.url(`/api/hadith/chapters/${id}`));
    }

    createHadithChapter(payload: Partial<HadithChapter>): Observable<HadithChapter> {
      return this.http.post<HadithChapter>(this.url('/api/hadith/chapters'), payload);
    }

    updateHadithChapter(id: number, payload: Partial<HadithChapter>): Observable<HadithChapter> {
      return this.http.put<HadithChapter>(this.url(`/api/hadith/chapters/${id}`), payload);
    }

    deleteHadithChapter(id: number): Observable<void> {
      return this.http.delete<void>(this.url(`/api/hadith/chapters/${id}`));
    }

    getHadithsByChapter(chapterId: number): Observable<HadithItem[]> {
      return this.http.get<HadithItem[]>(this.url(`/api/hadith/chapters/${chapterId}/hadiths`));
    }

    getHadithById(id: number): Observable<HadithItem> {
      return this.http.get<HadithItem>(this.url(`/api/hadith/hadiths/${id}`));
    }

    createHadith(payload: Partial<HadithItem>): Observable<HadithItem> {
      return this.http.post<HadithItem>(this.url('/api/hadith/hadiths'), payload);
    }

    updateHadith(id: number, payload: Partial<HadithItem>): Observable<HadithItem> {
      return this.http.put<HadithItem>(this.url(`/api/hadith/hadiths/${id}`), payload);
    }

    deleteHadith(id: number): Observable<void> {
      return this.http.delete<void>(this.url(`/api/hadith/hadiths/${id}`));
    }

    getDueHadithReviews(count: number): Observable<HadithReviewCard[]> {
      let params = new HttpParams().set('count', count.toString());
      return this.http.get<HadithReviewCard[]>(this.url('/api/hadith/reviews/due'), { params });
    }

    submitHadithReview(payload: SubmitReviewPayload): Observable<UserHadithProgress> {
      return this.http.post<UserHadithProgress>(this.url('/api/hadith/reviews'), payload);
    }

    getHadithProgressSummary(): Observable<Record<string, number>> {
      return this.http.get<Record<string, number>>(this.url('/api/hadith/progress/summary'));
    }

    getHadithAssessmentsByChapter(chapterId: number): Observable<HadithAssessment[]> {
      return this.http.get<HadithAssessment[]>(
        this.url(`/api/hadith/chapters/${chapterId}/assessments`),
      );
    }

    createHadithAssessment(payload: Partial<HadithAssessment>): Observable<HadithAssessment> {
      return this.http.post<HadithAssessment>(this.url('/api/hadith/assessments'), payload);
    }

    getHadithDashboardStats(): Observable<HadithDashboardStats> {
      return this.http.get<HadithDashboardStats>(this.url('/api/hadith/dashboard/stats'));
    }

    getHadithChapters(bookId: number): Observable<HadithChapter[]> {
      return this.http.get<HadithChapter[]>(this.url(`/api/hadith/books/${bookId}/chapters`));
    }

    getHadithReviewStats(studentId: number): Observable<HadithReviewStats> {
      return this.http.get<HadithReviewStats>(this.url(`/api/hadith/reviews/stats/${studentId}`));
    }

    getPendingHadithReviews(studentId: number, limit?: number): Observable<HadithItem[]> {
      let params = new HttpParams();
      if (limit) params = params.set('limit', limit.toString());
      return this.http.get<HadithItem[]>(this.url(`/api/hadith/reviews/pending/${studentId}`), {
        params,
      });
    }

    submitHadithStudentReview(
      studentId: number,
      payload: SubmitHadithReviewPayload,
    ): Observable<HadithReview> {
      return this.http.post<HadithReview>(this.url(`/api/hadith/reviews/${studentId}`), payload);
    }
  };
}
