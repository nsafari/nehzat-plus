import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MockDataContext } from './mock-data-context';
import { MockLiteraturePersianBaseService } from './literature-persian.service';

/**
 * Arabic-literature sub-domain (poets, poems, analyses, courses, lessons,
 * progress). Persian-literature methods live in MockLiteraturePersianBaseService.
 */
@Injectable({ providedIn: 'root' })
export class MockLiteratureService extends MockLiteraturePersianBaseService {
  constructor(ctx: MockDataContext) {
    super(ctx);
  }

  getArabicPoets(difficulty?: string): Observable<any[]> {
    let poets = [...this.ctx.mockArabicPoets];
    if (difficulty) poets = poets.filter((p: any) => p.difficulty === difficulty);
    return this.ctx.delayed(poets);
  }

  getArabicPoetById(id: number): Observable<any> {
    const poet = this.ctx.mockArabicPoets.find((p: any) => p.id === id);
    if (!poet) throw new Error('Poet not found');
    return this.ctx.delayed(poet);
  }

  createArabicPoet(payload: any): Observable<any> {
    const poet = { id: this.ctx.nextId(this.ctx.mockArabicPoets), ...payload };
    this.ctx.mockArabicPoets.push(poet);
    return this.ctx.delayed(poet);
  }

  updateArabicPoet(id: number, payload: any): Observable<any> {
    const poet = this.ctx.mockArabicPoets.find((p: any) => p.id === id);
    if (!poet) throw new Error('Poet not found');
    Object.assign(poet, payload);
    return this.ctx.delayed(poet);
  }

  deleteArabicPoet(id: number): Observable<void> {
    this.ctx.mockArabicPoets = this.ctx.mockArabicPoets.filter((p: any) => p.id !== id);
    return this.ctx.delayed(undefined);
  }

  searchArabicPoets(query: string): Observable<any[]> {
    return this.ctx.delayed(this.ctx.mockArabicPoets.filter((p: any) => p.name?.includes(query)));
  }

  getArabicPoems(poetId?: number, genre?: string, difficulty?: string): Observable<any[]> {
    let poems = [...this.ctx.mockArabicPoems];
    if (poetId !== undefined) poems = poems.filter((p: any) => p.poetId === poetId);
    if (genre) poems = poems.filter((p: any) => p.genre === genre);
    if (difficulty) poems = poems.filter((p: any) => p.difficulty === difficulty);
    return this.ctx.delayed(poems);
  }

  getArabicPoemById(id: number): Observable<any> {
    const poem = this.ctx.mockArabicPoems.find((p: any) => p.id === id);
    if (!poem) throw new Error('Poem not found');
    return this.ctx.delayed(poem);
  }

  createArabicPoem(payload: any): Observable<any> {
    const poem = { id: this.ctx.nextId(this.ctx.mockArabicPoems), ...payload };
    this.ctx.mockArabicPoems.push(poem);
    return this.ctx.delayed(poem);
  }

  updateArabicPoem(id: number, payload: any): Observable<any> {
    const poem = this.ctx.mockArabicPoems.find((p: any) => p.id === id);
    if (!poem) throw new Error('Poem not found');
    Object.assign(poem, payload);
    return this.ctx.delayed(poem);
  }

  deleteArabicPoem(id: number): Observable<void> {
    this.ctx.mockArabicPoems = this.ctx.mockArabicPoems.filter((p: any) => p.id !== id);
    return this.ctx.delayed(undefined);
  }

  searchArabicPoems(query: string): Observable<any[]> {
    return this.ctx.delayed(
      this.ctx.mockArabicPoems.filter(
        (p: any) => p.title?.includes(query) || p.text?.includes(query),
      ),
    );
  }

  getArabicAnalysesByPoem(poemId: number): Observable<any[]> {
    return this.ctx.delayed(this.ctx.mockArabicAnalyses.filter((a: any) => a.poemId === poemId));
  }

  getArabicAnalysisById(id: number): Observable<any> {
    const analysis = this.ctx.mockArabicAnalyses.find((a: any) => a.id === id);
    if (!analysis) throw new Error('Analysis not found');
    return this.ctx.delayed(analysis);
  }

  createArabicAnalysis(payload: any): Observable<any> {
    const analysis = { id: this.ctx.nextId(this.ctx.mockArabicAnalyses), ...payload };
    this.ctx.mockArabicAnalyses.push(analysis);
    return this.ctx.delayed(analysis);
  }

  updateArabicAnalysis(id: number, payload: any): Observable<any> {
    const analysis = this.ctx.mockArabicAnalyses.find((a: any) => a.id === id);
    if (!analysis) throw new Error('Analysis not found');
    Object.assign(analysis, payload);
    return this.ctx.delayed(analysis);
  }

  deleteArabicAnalysis(id: number): Observable<void> {
    this.ctx.mockArabicAnalyses = this.ctx.mockArabicAnalyses.filter((a: any) => a.id !== id);
    return this.ctx.delayed(undefined);
  }

  getArabicCourses(): Observable<any[]> {
    return this.ctx.delayed([...this.ctx.mockArabicCourses]);
  }

  getArabicCourseById(id: number): Observable<any> {
    const course = this.ctx.mockArabicCourses.find((c: any) => c.id === id);
    if (!course) throw new Error('Course not found');
    return this.ctx.delayed(course);
  }

  createArabicCourse(payload: any): Observable<any> {
    const course = { id: this.ctx.nextId(this.ctx.mockArabicCourses), ...payload };
    this.ctx.mockArabicCourses.push(course);
    return this.ctx.delayed(course);
  }

  updateArabicCourse(id: number, payload: any): Observable<any> {
    const course = this.ctx.mockArabicCourses.find((c: any) => c.id === id);
    if (!course) throw new Error('Course not found');
    Object.assign(course, payload);
    return this.ctx.delayed(course);
  }

  deleteArabicCourse(id: number): Observable<void> {
    this.ctx.mockArabicCourses = this.ctx.mockArabicCourses.filter((c: any) => c.id !== id);
    return this.ctx.delayed(undefined);
  }

  getArabicLessons(courseId: number): Observable<any[]> {
    return this.ctx.delayed(this.ctx.mockArabicLessons.filter((l: any) => l.courseId === courseId));
  }

  getArabicLessonById(id: number): Observable<any> {
    const lesson = this.ctx.mockArabicLessons.find((l: any) => l.id === id);
    if (!lesson) throw new Error('Lesson not found');
    return this.ctx.delayed(lesson);
  }

  createArabicLesson(payload: any): Observable<any> {
    const lesson = { id: this.ctx.nextId(this.ctx.mockArabicLessons), ...payload };
    this.ctx.mockArabicLessons.push(lesson);
    return this.ctx.delayed(lesson);
  }

  updateArabicLesson(id: number, payload: any): Observable<any> {
    const lesson = this.ctx.mockArabicLessons.find((l: any) => l.id === id);
    if (!lesson) throw new Error('Lesson not found');
    Object.assign(lesson, payload);
    return this.ctx.delayed(lesson);
  }

  deleteArabicLesson(id: number): Observable<void> {
    this.ctx.mockArabicLessons = this.ctx.mockArabicLessons.filter((l: any) => l.id !== id);
    return this.ctx.delayed(undefined);
  }

  getArabicUserProgress(): Observable<any[]> {
    return this.ctx.delayed([...this.ctx.mockArabicProgress]);
  }

  getArabicCourseProgress(courseId: number): Observable<any[]> {
    return this.ctx.delayed(
      this.ctx.mockArabicProgress.filter((p: any) => p.courseId === courseId),
    );
  }

  recordArabicProgress(payload: any): Observable<any> {
    const progress = { id: this.ctx.nextId(this.ctx.mockArabicProgress), ...payload };
    this.ctx.mockArabicProgress.push(progress);
    return this.ctx.delayed(progress);
  }

  getArabicDashboardStats(): Observable<Record<string, unknown>> {
    return this.ctx.delayed({
      totalPoets: this.ctx.mockArabicPoets.length,
      totalPoems: this.ctx.mockArabicPoems.length,
      totalCourses: this.ctx.mockArabicCourses.length,
      totalLessons: this.ctx.mockArabicLessons.length,
    });
  }
}
