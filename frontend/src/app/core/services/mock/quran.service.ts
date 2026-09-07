import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MockDataContext } from './mock-data-context';

@Injectable({ providedIn: 'root' })
export class MockQuranService {
  constructor(private ctx: MockDataContext) {}

  getSurahs(): Observable<any[]> {
    return this.ctx.delayed([...this.ctx.quranSurahs]);
  }

  getSurahById(id: number): Observable<any> {
    const surah = this.ctx.quranSurahs.find((s: any) => s.id === id);
    if (!surah) throw new Error('Surah not found');
    return this.ctx.delayed(surah);
  }

  createSurah(surah: Partial<any>): Observable<any> {
    const newSurah = { id: this.ctx.nextId(this.ctx.quranSurahs), ...surah };
    this.ctx.quranSurahs.push(newSurah);
    return this.ctx.delayed(newSurah);
  }

  updateSurah(id: number, surah: Partial<any>): Observable<any> {
    const existing = this.ctx.quranSurahs.find((s: any) => s.id === id);
    if (!existing) throw new Error('Surah not found');
    Object.assign(existing, surah);
    return this.ctx.delayed(existing);
  }

  deleteSurah(id: number): Observable<void> {
    this.ctx.quranSurahs = this.ctx.quranSurahs.filter((s: any) => s.id !== id);
    return this.ctx.delayed(undefined);
  }

  getAyahs(surahId: number): Observable<any[]> {
    return this.ctx.delayed(this.ctx.quranAyahs.filter((a: any) => a.surahId === surahId));
  }

  getAyahsBySurah(surahId: number): Observable<any[]> {
    return this.getAyahs(surahId);
  }

  getAyahById(id: number): Observable<any> {
    const ayah = this.ctx.quranAyahs.find((a: any) => a.id === id);
    if (!ayah) throw new Error('Ayah not found');
    return this.ctx.delayed(ayah);
  }

  createAyah(ayah: Partial<any>): Observable<any> {
    const newAyah = { id: this.ctx.nextId(this.ctx.quranAyahs), ...ayah };
    this.ctx.quranAyahs.push(newAyah);
    return this.ctx.delayed(newAyah);
  }

  updateAyah(id: number, ayah: Partial<any>): Observable<any> {
    const existing = this.ctx.quranAyahs.find((a: any) => a.id === id);
    if (!existing) throw new Error('Ayah not found');
    Object.assign(existing, ayah);
    return this.ctx.delayed(existing);
  }

  deleteAyah(id: number): Observable<void> {
    this.ctx.quranAyahs = this.ctx.quranAyahs.filter((a: any) => a.id !== id);
    return this.ctx.delayed(undefined);
  }

  getTajweedRules(): Observable<any[]> {
    return this.ctx.delayed([...this.ctx.quranTajweedRules]);
  }

  getTajweedRule(id: number): Observable<any> {
    const rule = this.ctx.quranTajweedRules.find((r: any) => r.id === id);
    if (!rule) throw new Error('Rule not found');
    return this.ctx.delayed(rule);
  }

  createTajweedRule(rule: Partial<any>): Observable<any> {
    const newRule = { id: this.ctx.nextId(this.ctx.quranTajweedRules), ...rule };
    this.ctx.quranTajweedRules.push(newRule);
    return this.ctx.delayed(newRule);
  }

  updateTajweedRule(id: number, rule: Partial<any>): Observable<any> {
    const existing = this.ctx.quranTajweedRules.find((r: any) => r.id === id);
    if (!existing) throw new Error('Rule not found');
    Object.assign(existing, rule);
    return this.ctx.delayed(existing);
  }

  deleteTajweedRule(id: number): Observable<void> {
    this.ctx.quranTajweedRules = this.ctx.quranTajweedRules.filter((r: any) => r.id !== id);
    return this.ctx.delayed(undefined);
  }

  getRecitationLevels(): Observable<any[]> {
    return this.ctx.delayed([...this.ctx.quranRecitations]);
  }

  getRecitationLevel(id: number): Observable<any> {
    const level = this.ctx.quranRecitations.find((l: any) => l.id === id);
    if (!level) throw new Error('Level not found');
    return this.ctx.delayed(level);
  }

  createRecitationLevel(level: Partial<any>): Observable<any> {
    const newLevel = { id: this.ctx.nextId(this.ctx.quranRecitations), ...level };
    this.ctx.quranRecitations.push(newLevel);
    return this.ctx.delayed(newLevel);
  }

  updateRecitationLevel(id: number, level: Partial<any>): Observable<any> {
    const existing = this.ctx.quranRecitations.find((l: any) => l.id === id);
    if (!existing) throw new Error('Level not found');
    Object.assign(existing, level);
    return this.ctx.delayed(existing);
  }

  deleteRecitationLevel(id: number): Observable<void> {
    this.ctx.quranRecitations = this.ctx.quranRecitations.filter((l: any) => l.id !== id);
    return this.ctx.delayed(undefined);
  }

  getQuranCurricula(): Observable<any[]> {
    return this.ctx.delayed([...this.ctx.quranCurricula]);
  }

  getQuranCurriculumById(id: number): Observable<any> {
    const curriculum = this.ctx.quranCurricula.find((c: any) => c.id === id);
    if (!curriculum) throw new Error('Curriculum not found');
    return this.ctx.delayed(curriculum);
  }

  createQuranCurriculum(curriculum: Partial<any>): Observable<any> {
    const newCurriculum = { id: this.ctx.nextId(this.ctx.quranCurricula), ...curriculum };
    this.ctx.quranCurricula.push(newCurriculum);
    return this.ctx.delayed(newCurriculum);
  }

  updateQuranCurriculum(id: number, curriculum: Partial<any>): Observable<any> {
    const existing = this.ctx.quranCurricula.find((c: any) => c.id === id);
    if (!existing) throw new Error('Curriculum not found');
    Object.assign(existing, curriculum);
    return this.ctx.delayed(existing);
  }

  deleteQuranCurriculum(id: number): Observable<void> {
    this.ctx.quranCurricula = this.ctx.quranCurricula.filter((c: any) => c.id !== id);
    return this.ctx.delayed(undefined);
  }

  getQuranStudentProgress(studentId: number): Observable<any> {
    const progress = this.ctx.quranProgress.find((p: any) => p.studentId === studentId);
    return this.ctx.delayed(progress ?? {});
  }

  getQuranProgress(id: number): Observable<any> {
    const progress = this.ctx.quranProgress.find((p: any) => p.id === id);
    if (!progress) throw new Error('Progress not found');
    return this.ctx.delayed(progress);
  }

  createQuranProgress(progress: Partial<any>): Observable<any> {
    const newProgress = { id: this.ctx.nextId(this.ctx.quranProgress), ...progress };
    this.ctx.quranProgress.push(newProgress);
    return this.ctx.delayed(newProgress);
  }

  getQuranLessonPlans(): Observable<any[]> {
    return this.ctx.delayed([...this.ctx.quranLessonPlans]);
  }

  getQuranLessonPlanById(id: number): Observable<any> {
    const plan = this.ctx.quranLessonPlans.find((p: any) => p.id === id);
    if (!plan) throw new Error('Plan not found');
    return this.ctx.delayed(plan);
  }

  createQuranLessonPlan(payload: any): Observable<any> {
    const newPlan = { id: this.ctx.nextId(this.ctx.quranLessonPlans), ...payload };
    this.ctx.quranLessonPlans.push(newPlan);
    return this.ctx.delayed(newPlan);
  }

  updateQuranLessonPlan(id: number, payload: any): Observable<any> {
    const existing = this.ctx.quranLessonPlans.find((p: any) => p.id === id);
    if (!existing) throw new Error('Plan not found');
    Object.assign(existing, payload);
    return this.ctx.delayed(existing);
  }

  deleteQuranLessonPlan(id: number): Observable<void> {
    this.ctx.quranLessonPlans = this.ctx.quranLessonPlans.filter((p: any) => p.id !== id);
    return this.ctx.delayed(undefined);
  }

  getQuranDashboardStats(): Observable<any> {
    return this.ctx.delayed({
      totalSurahs: this.ctx.quranSurahs.length,
      totalAyahs: this.ctx.quranAyahs.length,
      totalCurricula: this.ctx.quranCurricula.length,
      studentProgress: this.ctx.quranProgress.length,
    });
  }

  searchAyahs(query: string, max?: number): Observable<any[]> {
    const results = this.ctx.quranAyahs.filter(
      (a: any) => a.text?.includes(query) || a.translation?.includes(query),
    );
    return this.ctx.delayed(max ? results.slice(0, max) : results);
  }
}
