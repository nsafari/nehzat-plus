import { Observable } from 'rxjs';

import { MockLessonPlannerApiBase, type MockApiCtor } from './mock-lesson-planner-base';
import {
  Ayah,
  QuranCurriculum,
  QuranStudentProgress,
  RecitationLevel,
  Surah,
  TajweedRule,
} from './mock-lesson-planner-models';

/**
 * quran delegation mixin: every method forwards to the injected
 * MockQuranService instance (see MockLessonPlannerApiBase.quran).
 */
export function withQuran<T extends MockApiCtor>(Base: T) {
  return class extends Base {
    // ===== Quran =====
    getSurahs(): Observable<Surah[]> {
      return this.quran.getSurahs();
    }

    getSurahById(id: number): Observable<Surah> {
      return this.quran.getSurahById(id);
    }

    createSurah(surah: Partial<Surah>): Observable<Surah> {
      return this.quran.createSurah(surah);
    }

    updateSurah(id: number, surah: Partial<Surah>): Observable<Surah> {
      return this.quran.updateSurah(id, surah);
    }

    deleteSurah(id: number): Observable<void> {
      return this.quran.deleteSurah(id);
    }

    getAyahs(surahId: number): Observable<Ayah[]> {
      return this.quran.getAyahs(surahId);
    }

    getAyahsBySurah(surahId: number): Observable<Ayah[]> {
      return this.quran.getAyahsBySurah(surahId);
    }

    getAyahById(id: number): Observable<Ayah> {
      return this.quran.getAyahById(id);
    }

    createAyah(ayah: Partial<Ayah>): Observable<Ayah> {
      return this.quran.createAyah(ayah);
    }

    updateAyah(id: number, ayah: Partial<Ayah>): Observable<Ayah> {
      return this.quran.updateAyah(id, ayah);
    }

    deleteAyah(id: number): Observable<void> {
      return this.quran.deleteAyah(id);
    }

    getTajweedRules(): Observable<TajweedRule[]> {
      return this.quran.getTajweedRules();
    }

    getTajweedRule(id: number): Observable<TajweedRule> {
      return this.quran.getTajweedRule(id);
    }

    createTajweedRule(rule: Partial<TajweedRule>): Observable<TajweedRule> {
      return this.quran.createTajweedRule(rule);
    }

    updateTajweedRule(id: number, rule: Partial<TajweedRule>): Observable<TajweedRule> {
      return this.quran.updateTajweedRule(id, rule);
    }

    deleteTajweedRule(id: number): Observable<void> {
      return this.quran.deleteTajweedRule(id);
    }

    getRecitationLevels(): Observable<RecitationLevel[]> {
      return this.quran.getRecitationLevels();
    }

    getRecitationLevel(id: number): Observable<RecitationLevel> {
      return this.quran.getRecitationLevel(id);
    }

    createRecitationLevel(level: Partial<RecitationLevel>): Observable<RecitationLevel> {
      return this.quran.createRecitationLevel(level);
    }

    updateRecitationLevel(
      id: number,
      level: Partial<RecitationLevel>,
    ): Observable<RecitationLevel> {
      return this.quran.updateRecitationLevel(id, level);
    }

    deleteRecitationLevel(id: number): Observable<void> {
      return this.quran.deleteRecitationLevel(id);
    }

    getQuranCurricula(): Observable<QuranCurriculum[]> {
      return this.quran.getQuranCurricula();
    }

    getQuranCurriculumById(id: number): Observable<QuranCurriculum> {
      return this.quran.getQuranCurriculumById(id);
    }

    createQuranCurriculum(curriculum: Partial<QuranCurriculum>): Observable<QuranCurriculum> {
      return this.quran.createQuranCurriculum(curriculum);
    }

    updateQuranCurriculum(
      id: number,
      curriculum: Partial<QuranCurriculum>,
    ): Observable<QuranCurriculum> {
      return this.quran.updateQuranCurriculum(id, curriculum);
    }

    deleteQuranCurriculum(id: number): Observable<void> {
      return this.quran.deleteQuranCurriculum(id);
    }

    getQuranStudentProgress(studentId: number): Observable<QuranStudentProgress> {
      return this.quran.getQuranStudentProgress(studentId);
    }

    getQuranProgress(id: number): Observable<QuranStudentProgress> {
      return this.quran.getQuranProgress(id);
    }

    createQuranProgress(progress: Partial<QuranStudentProgress>): Observable<QuranStudentProgress> {
      return this.quran.createQuranProgress(progress);
    }

    getQuranLessonPlans(): Observable<any[]> {
      return this.quran.getQuranLessonPlans();
    }

    getQuranLessonPlanById(id: number): Observable<any> {
      return this.quran.getQuranLessonPlanById(id);
    }

    createQuranLessonPlan(payload: any): Observable<any> {
      return this.quran.createQuranLessonPlan(payload);
    }

    updateQuranLessonPlan(id: number, payload: any): Observable<any> {
      return this.quran.updateQuranLessonPlan(id, payload);
    }

    deleteQuranLessonPlan(id: number): Observable<void> {
      return this.quran.deleteQuranLessonPlan(id);
    }

    getQuranDashboardStats(): Observable<any> {
      return this.quran.getQuranDashboardStats();
    }

    searchAyahs(query: string, max?: number): Observable<Ayah[]> {
      return this.quran.searchAyahs(query, max);
    }
  };
}
