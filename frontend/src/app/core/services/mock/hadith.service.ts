import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MockDataContext } from './mock-data-context';

@Injectable({ providedIn: 'root' })
export class MockHadithService {
  constructor(private ctx: MockDataContext) {}

  getHadithBooks(): Observable<any[]> {
    return this.ctx.delayed([...this.ctx.hadithBooks]);
  }

  getHadithBookById(id: number): Observable<any> {
    const book = this.ctx.hadithBooks.find((b: any) => b.id === id);
    if (!book) throw new Error('Book not found');
    return this.ctx.delayed(book);
  }

  createHadithBook(payload: Partial<any>): Observable<any> {
    const book = { id: this.ctx.nextId(this.ctx.hadithBooks), ...payload };
    this.ctx.hadithBooks.push(book);
    return this.ctx.delayed(book);
  }

  updateHadithBook(id: number, payload: Partial<any>): Observable<any> {
    const book = this.ctx.hadithBooks.find((b: any) => b.id === id);
    if (!book) throw new Error('Book not found');
    Object.assign(book, payload);
    return this.ctx.delayed(book);
  }

  deleteHadithBook(id: number): Observable<void> {
    this.ctx.hadithBooks = this.ctx.hadithBooks.filter((b: any) => b.id !== id);
    return this.ctx.delayed(undefined);
  }

  getHadithChaptersByBook(bookId: number): Observable<any[]> {
    return this.ctx.delayed(this.ctx.hadithChapters.filter((c: any) => c.bookId === bookId));
  }

  getHadithChapterById(id: number): Observable<any> {
    const chapter = this.ctx.hadithChapters.find((c: any) => c.id === id);
    if (!chapter) throw new Error('Chapter not found');
    return this.ctx.delayed(chapter);
  }

  createHadithChapter(payload: Partial<any>): Observable<any> {
    const chapter = { id: this.ctx.nextId(this.ctx.hadithChapters), ...payload };
    this.ctx.hadithChapters.push(chapter);
    return this.ctx.delayed(chapter);
  }

  updateHadithChapter(id: number, payload: Partial<any>): Observable<any> {
    const chapter = this.ctx.hadithChapters.find((c: any) => c.id === id);
    if (!chapter) throw new Error('Chapter not found');
    Object.assign(chapter, payload);
    return this.ctx.delayed(chapter);
  }

  deleteHadithChapter(id: number): Observable<void> {
    this.ctx.hadithChapters = this.ctx.hadithChapters.filter((c: any) => c.id !== id);
    return this.ctx.delayed(undefined);
  }

  getHadithsByChapter(chapterId: number): Observable<any[]> {
    return this.ctx.delayed(this.ctx.hadiths.filter((h: any) => h.chapterId === chapterId));
  }

  getHadithById(id: number): Observable<any> {
    const hadith = this.ctx.hadiths.find((h: any) => h.id === id);
    if (!hadith) throw new Error('Hadith not found');
    return this.ctx.delayed(hadith);
  }

  createHadith(payload: Partial<any>): Observable<any> {
    const hadith = { id: this.ctx.nextId(this.ctx.hadiths), ...payload };
    this.ctx.hadiths.push(hadith);
    return this.ctx.delayed(hadith);
  }

  updateHadith(id: number, payload: Partial<any>): Observable<any> {
    const hadith = this.ctx.hadiths.find((h: any) => h.id === id);
    if (!hadith) throw new Error('Hadith not found');
    Object.assign(hadith, payload);
    return this.ctx.delayed(hadith);
  }

  deleteHadith(id: number): Observable<void> {
    this.ctx.hadiths = this.ctx.hadiths.filter((h: any) => h.id !== id);
    return this.ctx.delayed(undefined);
  }

  getDueHadithReviews(count: number): Observable<any[]> {
    return this.ctx.delayed(this.ctx.hadiths.slice(0, count));
  }

  submitHadithReview(payload: any): Observable<any> {
    return this.ctx.delayed({ id: 1, ...payload, reviewedAt: this.ctx.now() });
  }

  getHadithProgressSummary(): Observable<Record<string, number>> {
    return this.ctx.delayed({});
  }

  getHadithAssessmentsByChapter(chapterId: number): Observable<any[]> {
    return this.ctx.delayed(
      this.ctx.hadithAssessments.filter((a: any) => a.chapterId === chapterId),
    );
  }

  createHadithAssessment(payload: Partial<any>): Observable<any> {
    const assessment = { id: this.ctx.nextId(this.ctx.hadithAssessments), ...payload };
    this.ctx.hadithAssessments.push(assessment);
    return this.ctx.delayed(assessment);
  }

  getHadithDashboardStats(): Observable<any> {
    return this.ctx.delayed({
      totalBooks: this.ctx.hadithBooks.length,
      totalChapters: this.ctx.hadithChapters.length,
      totalHadiths: this.ctx.hadiths.length,
    });
  }

  getHadithChapters(bookId: number): Observable<any[]> {
    return this.getHadithChaptersByBook(bookId);
  }

  getHadithReviewStats(studentId: number): Observable<any> {
    return this.ctx.delayed({ totalReviews: 0, completedReviews: 0 });
  }

  getPendingHadithReviews(studentId: number, limit?: number): Observable<any[]> {
    const hadiths = this.ctx.hadiths.slice(0, limit ?? 10);
    return this.ctx.delayed(hadiths);
  }

  submitHadithStudentReview(studentId: number, payload: any): Observable<any> {
    return this.ctx.delayed({ id: 1, studentId, ...payload, reviewedAt: this.ctx.now() });
  }
}
