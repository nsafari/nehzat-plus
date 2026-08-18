import { Observable } from 'rxjs';

import { MockLessonPlannerApiBase, type MockApiCtor } from './mock-lesson-planner-base';
import {
  ApiMessageResponse,
  AwardXpPayload,
  AwardXpResult,
  DailyActivity,
  DailyNudge,
  DomainProgress,
  NudgeSchedule,
  SpacedRepetitionCard,
  SrsStats,
  StreakInfo,
  UpsertDailyActivityPayload,
  UpsertSrsCardPayload,
  UserXp,
  XpActivity,
  XpBadge,
} from './mock-lesson-planner-models';

/**
 * dailyActivities delegation mixin: every method forwards to the injected
 * MockDailyActivitiesService instance (see MockLessonPlannerApiBase.dailyActivities).
 */
export function withDaily<T extends MockApiCtor>(Base: T) {
  return class extends Base {
    // ===== Daily Activities =====
    upsertDailyActivity(payload: UpsertDailyActivityPayload): Observable<DailyActivity> {
      return this.dailyActivities.upsertDailyActivity(payload);
    }

    getTodayActivity(): Observable<DailyActivity | null> {
      return this.dailyActivities.getTodayActivity();
    }

    getActivityHistory(fromDate?: string, toDate?: string): Observable<DailyActivity[]> {
      return this.dailyActivities.getActivityHistory(fromDate, toDate);
    }

    getActivityStreak(): Observable<{ streak: number }> {
      return this.dailyActivities.getActivityStreak();
    }

    // ===== SRS =====
    getSrsCardsDueToday(): Observable<SpacedRepetitionCard[]> {
      return this.dailyActivities.getSrsCardsDueToday();
    }

    reviewSrsCard(cardId: number, quality: number): Observable<SpacedRepetitionCard> {
      return this.dailyActivities.reviewSrsCard(cardId, quality);
    }

    getSrsStats(): Observable<SrsStats> {
      return this.dailyActivities.getSrsStats();
    }

    upsertSrsCard(payload: UpsertSrsCardPayload): Observable<SpacedRepetitionCard> {
      return this.dailyActivities.upsertSrsCard(payload);
    }

    // ===== XP System =====
    getUserXp(): Observable<UserXp> {
      return this.dailyActivities.getUserXp();
    }

    awardXp(payload: AwardXpPayload): Observable<AwardXpResult> {
      return this.dailyActivities.awardXp(payload);
    }

    getBadges(): Observable<XpBadge[]> {
      return this.dailyActivities.getBadges();
    }

    getRecentActivity(limit?: number): Observable<XpActivity[]> {
      return this.dailyActivities.getRecentActivity(limit);
    }

    // ===== Domain Progress & Streaks =====
    getDomainProgress(): Observable<DomainProgress[]> {
      return this.dailyActivities.getDomainProgress();
    }

    getUserStreaks(): Observable<StreakInfo> {
      return this.dailyActivities.getUserStreaks();
    }

    // ===== Daily Nudges =====
    getDailyNudges(): Observable<DailyNudge[]> {
      return this.dailyActivities.getDailyNudges();
    }

    getNudgeSchedules(): Observable<NudgeSchedule[]> {
      return this.dailyActivities.getNudgeSchedules();
    }

    dismissNudge(nudgeId: number): Observable<ApiMessageResponse> {
      return this.dailyActivities.dismissNudge(nudgeId);
    }
  };
}
