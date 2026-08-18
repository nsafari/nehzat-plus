import { Constructor, HttpServiceContext } from './base';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import {
  ApiMessageResponse,
  AwardXpPayload,
  AwardXpResult,
  AvailablePath,
  BiweeklyProgressResponse,
  CreateCurriculumVersionPayload,
  CreateMonthlyBookletPayload,
  DailyActivity,
  DailyNudge,
  DailySpiritualEntry,
  DomainProgress,
  FinalizePathPayload,
  MarkOccasionPracticePayload,
  MonthlyBooklet,
  NudgeSchedule,
  PathRankingPayload,
  ProgressionResult,
  SpacedRepetitionCard,
  SpiritualOccasion,
  SpiritualOccasionDetail,
  SpiritualPracticeItem,
  SrsStats,
  StreakInfo,
  StudentPathHistory,
  StudentPathSelection,
  UpdateCurriculumVersionPayload,
  UpdateMonthlyBookletPayload,
  UpdateSkillProgressPayload,
  UpsertDailyActivityPayload,
  UpsertDailySpiritualEntryPayload,
  UpsertSrsCardPayload,
  UserOccasionProgress,
  UserXp,
  XpActivity,
  XpBadge,
  CurriculumVersion,
} from '../../models/lesson-planner.models';

export function WithSpiritualDaily<TBase extends Constructor<HttpServiceContext>>(Base: TBase) {
  return class extends Base {
    getSpiritualPractices(): Observable<SpiritualPracticeItem[]> {
      return this.http.get<SpiritualPracticeItem[]>(this.url('/spiritual/catalog/practices/all'));
    }

    getSpiritualPracticesForMe(
      age?: number,
      gender?: string,
      role?: string,
    ): Observable<SpiritualPracticeItem[]> {
      let params = new HttpParams();
      if (age !== undefined) params = params.set('age', age.toString());
      if (gender) params = params.set('gender', gender);
      if (role) params = params.set('role', role);
      return this.http.get<SpiritualPracticeItem[]>(this.url('/spiritual/catalog/practices'), {
        params,
      });
    }

    getSpiritualOccasions(): Observable<SpiritualOccasion[]> {
      return this.http.get<SpiritualOccasion[]>(this.url('/spiritual/catalog/occasions'));
    }

    getSpiritualOccasionDetail(occasionId: number): Observable<SpiritualOccasionDetail> {
      return this.http.get<SpiritualOccasionDetail>(
        this.url(`/spiritual/catalog/occasions/${occasionId}`),
      );
    }

    getDailySpiritualEntry(userId: number, date: string): Observable<DailySpiritualEntry> {
      return this.http.get<DailySpiritualEntry>(this.url(`/spiritual/entries/user/${userId}`), {
        params: new HttpParams().set('date', date),
      });
    }

    upsertDailySpiritualEntry(
      payload: UpsertDailySpiritualEntryPayload,
    ): Observable<DailySpiritualEntry> {
      return this.http.post<DailySpiritualEntry>(this.url('/spiritual/entries'), payload);
    }

    getSpiritualEntryHistory(
      userId: number,
      fromDate?: string,
      toDate?: string,
    ): Observable<DailySpiritualEntry[]> {
      let params = new HttpParams();
      if (fromDate) params = params.set('fromDate', fromDate);
      if (toDate) params = params.set('toDate', toDate);
      return this.http.get<DailySpiritualEntry[]>(
        this.url(`/spiritual/entries/user/${userId}/history`),
        { params },
      );
    }

    getSpiritualStreak(userId: number): Observable<{ streak: number }> {
      return this.http.get<{ streak: number }>(
        this.url(`/spiritual/entries/user/${userId}/streak`),
      );
    }

    upsertDailyActivity(payload: UpsertDailyActivityPayload): Observable<DailyActivity> {
      return this.http.post<DailyActivity>(this.url('/physical-activity'), payload);
    }

    getTodayActivity(): Observable<DailyActivity | null> {
      return this.http.get<DailyActivity | null>(this.url('/physical-activity/today'));
    }

    getActivityHistory(fromDate?: string, toDate?: string): Observable<DailyActivity[]> {
      let params = new HttpParams();
      if (fromDate) params = params.set('fromDate', fromDate);
      if (toDate) params = params.set('toDate', toDate);
      return this.http.get<DailyActivity[]>(this.url('/physical-activity/history'), { params });
    }

    getActivityStreak(): Observable<{ streak: number }> {
      return this.http.get<{ streak: number }>(this.url('/physical-activity/streak'));
    }

    getSrsCardsDueToday(): Observable<SpacedRepetitionCard[]> {
      return this.http.get<SpacedRepetitionCard[]>(this.url('/api/spaced-repetition/due'));
    }

    reviewSrsCard(cardId: number, quality: number): Observable<SpacedRepetitionCard> {
      return this.http.post<SpacedRepetitionCard>(
        this.url(`/api/spaced-repetition/${cardId}/review`),
        { quality },
      );
    }

    getSrsStats(): Observable<SrsStats> {
      return this.http.get<SrsStats>(this.url('/api/spaced-repetition/stats'));
    }

    upsertSrsCard(payload: UpsertSrsCardPayload): Observable<SpacedRepetitionCard> {
      return this.http.post<SpacedRepetitionCard>(this.url('/api/spaced-repetition'), payload);
    }

    getUserXp(): Observable<UserXp> {
      return this.http.get<UserXp>(this.url('/api/xp'));
    }

    awardXp(payload: AwardXpPayload): Observable<AwardXpResult> {
      return this.http.post<AwardXpResult>(this.url('/api/xp/award'), payload);
    }

    getBadges(): Observable<XpBadge[]> {
      return this.http.get<XpBadge[]>(this.url('/api/xp/badges'));
    }

    getRecentActivity(limit: number = 10): Observable<XpActivity[]> {
      const params = limit ? new HttpParams().set('limit', limit.toString()) : undefined;
      return this.http.get<XpActivity[]>(this.url('/api/xp/activity'), { params });
    }

    getDomainProgress(): Observable<DomainProgress[]> {
      return this.http.get<DomainProgress[]>(this.url('/student/domain-progress'));
    }

    getUserStreaks(): Observable<StreakInfo> {
      return this.http.get<StreakInfo>(this.url('/student/streaks'));
    }

    getDailyNudges(): Observable<DailyNudge[]> {
      return this.http.get<DailyNudge[]>(this.url('/daily-nudges'));
    }

    getNudgeSchedules(): Observable<NudgeSchedule[]> {
      return this.http.get<NudgeSchedule[]>(this.url('/daily-nudges/schedules'));
    }

    dismissNudge(nudgeId: number): Observable<ApiMessageResponse> {
      return this.http.post<ApiMessageResponse>(this.url(`/daily-nudges/${nudgeId}/dismiss`), {});
    }

    getUserOccasionProgress(
      userId: number,
      occasionId?: number,
      hijriYear?: number,
    ): Observable<UserOccasionProgress[]> {
      let params = new HttpParams();
      if (occasionId !== undefined) params = params.set('occasionId', occasionId.toString());
      if (hijriYear !== undefined) params = params.set('hijriYear', hijriYear.toString());
      return this.http.get<UserOccasionProgress[]>(
        this.url(`/spiritual/occasions/progress/user/${userId}`),
        { params },
      );
    }

    markOccasionPractice(payload: MarkOccasionPracticePayload): Observable<UserOccasionProgress> {
      return this.http.post<UserOccasionProgress>(
        this.url('/spiritual/occasions/progress/mark'),
        payload,
      );
    }

    getAvailablePaths(studentId: number): Observable<AvailablePath[]> {
      return this.http.get<AvailablePath[]>(this.url(`/spiritual/path/available/${studentId}`));
    }

    submitPathRanking(
      studentId: number,
      payload: PathRankingPayload,
    ): Observable<StudentPathSelection> {
      return this.http.post<StudentPathSelection>(
        this.url(`/spiritual/path/ranking/${studentId}`),
        payload,
      );
    }

    finalizePath(payload: FinalizePathPayload): Observable<StudentPathSelection> {
      return this.http.post<StudentPathSelection>(this.url('/spiritual/path/finalize'), payload);
    }

    switchFinalizedPath(payload: FinalizePathPayload): Observable<StudentPathSelection> {
      return this.http.post<StudentPathSelection>(this.url('/spiritual/path/switch'), payload);
    }

    getStudentPathSelection(studentId: number): Observable<StudentPathSelection> {
      return this.http.get<StudentPathSelection>(
        this.url(`/spiritual/path/selection/${studentId}`),
      );
    }

    getStudentPathHistory(studentId: number): Observable<unknown[]> {
      return this.http.get<unknown[]>(this.url(`/spiritual/path/history/${studentId}`));
    }

    getMonthlyBooklets(studentId?: number): Observable<MonthlyBooklet[]> {
      let params = new HttpParams();
      if (studentId !== undefined) params = params.set('studentId', studentId.toString());
      return this.http.get<MonthlyBooklet[]>(this.url('/monthly-booklets'), { params });
    }

    getMonthlyBookletById(id: number): Observable<MonthlyBooklet> {
      return this.http.get<MonthlyBooklet>(this.url(`/api/monthly-booklets/${id}`));
    }

    getMonthlyBookletsByStudent(studentId: number): Observable<MonthlyBooklet[]> {
      return this.http.get<MonthlyBooklet[]>(
        this.url(`/api/monthly-booklets/by-student/${studentId}`),
      );
    }

    getMonthlyBookletByPeriod(
      studentId: number,
      year: number,
      month: number,
    ): Observable<MonthlyBooklet> {
      return this.http.get<MonthlyBooklet>(
        this.url(`/api/monthly-booklets/by-student/${studentId}/${year}/${month}`),
      );
    }

    createMonthlyBooklet(payload: CreateMonthlyBookletPayload): Observable<MonthlyBooklet> {
      return this.http.post<MonthlyBooklet>(this.url('/monthly-booklets'), payload);
    }

    updateMonthlyBooklet(
      id: number,
      payload: UpdateMonthlyBookletPayload,
    ): Observable<MonthlyBooklet> {
      return this.http.put<MonthlyBooklet>(this.url(`/api/monthly-booklets/${id}`), payload);
    }

    deleteMonthlyBooklet(id: number): Observable<ApiMessageResponse> {
      return this.http.delete<ApiMessageResponse>(this.url(`/api/monthly-booklets/${id}`));
    }

    checkProgression(studentId: number): Observable<ProgressionResult> {
      return this.http.get<ProgressionResult>(this.url(`/api/progression/check/${studentId}`));
    }

    checkRingProgression(ringId: number): Observable<ProgressionResult[]> {
      return this.http.get<ProgressionResult[]>(this.url(`/api/progression/ring/${ringId}`));
    }

    recordProgression(payload: {
      studentId: number;
      fromLevel: string;
      toLevel: string;
    }): Observable<StudentPathHistory> {
      return this.http.post<StudentPathHistory>(this.url('/api/progression/record'), payload);
    }

    getBiweeklyProgress(studentId: number): Observable<BiweeklyProgressResponse> {
      return this.http.get<BiweeklyProgressResponse>(
        this.url(`/students/${studentId}/progress/biweekly`),
      );
    }
  };
}
