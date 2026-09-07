import { Observable } from 'rxjs';

import { MockLessonPlannerApiBase, type MockApiCtor } from './mock-lesson-planner-base';
import {
  AvailablePath,
  DailySpiritualEntry,
  FinalizePathPayload,
  MarkOccasionPracticePayload,
  PathRankingPayload,
  SpiritualOccasion,
  SpiritualOccasionDetail,
  SpiritualPracticeItem,
  StudentPathSelection,
  UpsertDailySpiritualEntryPayload,
  UserOccasionProgress,
} from './mock-lesson-planner-models';

/**
 * spiritual delegation mixin: every method forwards to the injected
 * MockSpiritualService instance (see MockLessonPlannerApiBase.spiritual).
 */
export function withSpiritual<T extends MockApiCtor>(Base: T) {
  return class extends Base {
    // ===== Spiritual Practice & Path =====
    getSpiritualPractices(): Observable<SpiritualPracticeItem[]> {
      return this.spiritual.getSpiritualPractices();
    }

    getSpiritualPracticesForMe(
      age?: number,
      gender?: string,
      role?: string,
    ): Observable<SpiritualPracticeItem[]> {
      return this.spiritual.getSpiritualPracticesForMe(age, gender, role);
    }

    getSpiritualOccasions(): Observable<SpiritualOccasion[]> {
      return this.spiritual.getSpiritualOccasions();
    }

    getSpiritualOccasionDetail(occasionId: number): Observable<SpiritualOccasionDetail> {
      return this.spiritual.getSpiritualOccasionDetail(occasionId);
    }

    getDailySpiritualEntry(userId: number, date: string): Observable<DailySpiritualEntry> {
      return this.spiritual.getDailySpiritualEntry(userId, date);
    }

    upsertDailySpiritualEntry(
      payload: UpsertDailySpiritualEntryPayload,
    ): Observable<DailySpiritualEntry> {
      return this.spiritual.upsertDailySpiritualEntry(payload);
    }

    getSpiritualEntryHistory(
      userId: number,
      fromDate?: string,
      toDate?: string,
    ): Observable<DailySpiritualEntry[]> {
      return this.spiritual.getSpiritualEntryHistory(userId, fromDate, toDate);
    }

    getSpiritualStreak(userId: number): Observable<{ streak: number }> {
      return this.spiritual.getSpiritualStreak(userId);
    }

    getUserOccasionProgress(
      userId: number,
      occasionId?: number,
      hijriYear?: number,
    ): Observable<UserOccasionProgress[]> {
      return this.spiritual.getUserOccasionProgress(userId, occasionId, hijriYear);
    }

    markOccasionPractice(payload: MarkOccasionPracticePayload): Observable<UserOccasionProgress> {
      return this.spiritual.markOccasionPractice(payload);
    }

    getAvailablePaths(studentId: number): Observable<AvailablePath[]> {
      return this.spiritual.getAvailablePaths(studentId);
    }

    submitPathRanking(
      studentId: number,
      payload: PathRankingPayload,
    ): Observable<StudentPathSelection> {
      return this.spiritual.submitPathRanking(studentId, payload);
    }

    finalizePath(payload: FinalizePathPayload): Observable<StudentPathSelection> {
      return this.spiritual.finalizePath(payload);
    }

    switchFinalizedPath(payload: FinalizePathPayload): Observable<StudentPathSelection> {
      return this.spiritual.switchFinalizedPath(payload);
    }

    getStudentPathSelection(studentId: number): Observable<StudentPathSelection> {
      return this.spiritual.getStudentPathSelection(studentId);
    }

    getStudentPathHistory(studentId: number): Observable<unknown[]> {
      return this.spiritual.getStudentPathHistory(studentId);
    }
  };
}
