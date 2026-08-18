import { Observable } from 'rxjs';

import { MockLessonPlannerApiBase, type MockApiCtor } from './mock-lesson-planner-base';
import {
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
  SubmitHadithReviewPayload,
  SubmitReviewPayload,
  UserHadithProgress,
} from './mock-lesson-planner-models';

/**
 * hadith delegation mixin: every method forwards to the injected
 * MockHadithService instance (see MockLessonPlannerApiBase.hadith).
 */
export function withHadith<T extends MockApiCtor>(Base: T) {
  return class extends Base {
    // ===== Hadith =====
    getHadithBooks(): Observable<HadithBook[]> {
      return this.hadith.getHadithBooks();
    }

    getHadithBookById(id: number): Observable<HadithBookDetail> {
      return this.hadith.getHadithBookById(id);
    }

    createHadithBook(payload: Partial<HadithBook>): Observable<HadithBook> {
      return this.hadith.createHadithBook(payload);
    }

    updateHadithBook(id: number, payload: Partial<HadithBook>): Observable<HadithBook> {
      return this.hadith.updateHadithBook(id, payload);
    }

    deleteHadithBook(id: number): Observable<void> {
      return this.hadith.deleteHadithBook(id);
    }

    getHadithChaptersByBook(bookId: number): Observable<HadithChapter[]> {
      return this.hadith.getHadithChaptersByBook(bookId);
    }

    getHadithChapterById(id: number): Observable<HadithChapterDetail> {
      return this.hadith.getHadithChapterById(id);
    }

    createHadithChapter(payload: Partial<HadithChapter>): Observable<HadithChapter> {
      return this.hadith.createHadithChapter(payload);
    }

    updateHadithChapter(id: number, payload: Partial<HadithChapter>): Observable<HadithChapter> {
      return this.hadith.updateHadithChapter(id, payload);
    }

    deleteHadithChapter(id: number): Observable<void> {
      return this.hadith.deleteHadithChapter(id);
    }

    getHadithsByChapter(chapterId: number): Observable<HadithItem[]> {
      return this.hadith.getHadithsByChapter(chapterId);
    }

    getHadithById(id: number): Observable<HadithItem> {
      return this.hadith.getHadithById(id);
    }

    createHadith(payload: Partial<HadithItem>): Observable<HadithItem> {
      return this.hadith.createHadith(payload);
    }

    updateHadith(id: number, payload: Partial<HadithItem>): Observable<HadithItem> {
      return this.hadith.updateHadith(id, payload);
    }

    deleteHadith(id: number): Observable<void> {
      return this.hadith.deleteHadith(id);
    }

    getDueHadithReviews(count: number): Observable<HadithReviewCard[]> {
      return this.hadith.getDueHadithReviews(count);
    }

    submitHadithReview(payload: SubmitReviewPayload): Observable<UserHadithProgress> {
      return this.hadith.submitHadithReview(payload);
    }

    getHadithProgressSummary(): Observable<Record<string, number>> {
      return this.hadith.getHadithProgressSummary();
    }

    getHadithAssessmentsByChapter(chapterId: number): Observable<HadithAssessment[]> {
      return this.hadith.getHadithAssessmentsByChapter(chapterId);
    }

    createHadithAssessment(payload: Partial<HadithAssessment>): Observable<HadithAssessment> {
      return this.hadith.createHadithAssessment(payload);
    }

    getHadithDashboardStats(): Observable<HadithDashboardStats> {
      return this.hadith.getHadithDashboardStats();
    }

    getHadithChapters(bookId: number): Observable<HadithChapter[]> {
      return this.hadith.getHadithChapters(bookId);
    }

    getHadithReviewStats(studentId: number): Observable<HadithReviewStats> {
      return this.hadith.getHadithReviewStats(studentId);
    }

    getPendingHadithReviews(studentId: number, limit?: number): Observable<HadithItem[]> {
      return this.hadith.getPendingHadithReviews(studentId, limit);
    }

    submitHadithStudentReview(
      studentId: number,
      payload: SubmitHadithReviewPayload,
    ): Observable<HadithReview> {
      return this.hadith.submitHadithStudentReview(studentId, payload);
    }
  };
}
