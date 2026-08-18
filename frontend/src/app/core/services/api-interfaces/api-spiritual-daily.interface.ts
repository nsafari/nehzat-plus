import { Observable } from 'rxjs';

import {
  ApiMessageResponse,
  AvailablePath,
  AwardXpPayload,
  AwardXpResult,
  DailyActivity,
  DailyNudge,
  DailySpiritualEntry,
  DomainProgress,
  FinalizePathPayload,
  MarkOccasionPracticePayload,
  MonthlyBooklet,
  CreateMonthlyBookletPayload,
  UpdateMonthlyBookletPayload,
  NudgeSchedule,
  PathRankingPayload,
  ProgressionResult,
  SpacedRepetitionCard,
  SpiritualOccasion,
  SpiritualOccasionDetail,
  SpiritualPracticeItem,
  SpiritualPath,
  SrsStats,
  StreakInfo,
  StudentPathHistory,
  StudentPathSelection,
  UpsertDailyActivityPayload,
  UpsertDailySpiritualEntryPayload,
  UpsertSrsCardPayload,
  UserOccasionProgress,
  UserXp,
  XpActivity,
  XpBadge,
} from '../../models/lesson-planner.models';

export abstract class SpiritualDailyApi {
    // Spiritual Practice & Path
    abstract getSpiritualPractices(): Observable<SpiritualPracticeItem[]>;
    abstract getSpiritualPracticesForMe(
      age?: number,
      gender?: string,
      role?: string,
    ): Observable<SpiritualPracticeItem[]>;
    abstract getSpiritualOccasions(): Observable<SpiritualOccasion[]>;
    abstract getSpiritualOccasionDetail(occasionId: number): Observable<SpiritualOccasionDetail>;
    abstract getDailySpiritualEntry(userId: number, date: string): Observable<DailySpiritualEntry>;
    abstract upsertDailySpiritualEntry(
      payload: UpsertDailySpiritualEntryPayload,
    ): Observable<DailySpiritualEntry>;
    abstract getSpiritualEntryHistory(
      userId: number,
      fromDate?: string,
      toDate?: string,
    ): Observable<DailySpiritualEntry[]>;
    abstract getSpiritualStreak(userId: number): Observable<{ streak: number }>;
    abstract getUserOccasionProgress(
      userId: number,
      occasionId?: number,
      hijriYear?: number,
    ): Observable<UserOccasionProgress[]>;
    abstract markOccasionPractice(
      payload: MarkOccasionPracticePayload,
    ): Observable<UserOccasionProgress>;
    abstract getAvailablePaths(studentId: number): Observable<AvailablePath[]>;
    abstract submitPathRanking(
      studentId: number,
      payload: PathRankingPayload,
    ): Observable<StudentPathSelection>;
    abstract finalizePath(payload: FinalizePathPayload): Observable<StudentPathSelection>;
    abstract switchFinalizedPath(payload: FinalizePathPayload): Observable<StudentPathSelection>;
    abstract getStudentPathSelection(studentId: number): Observable<StudentPathSelection>;
    abstract getStudentPathHistory(studentId: number): Observable<unknown[]>;

    abstract upsertDailyActivity(payload: UpsertDailyActivityPayload): Observable<DailyActivity>;
    abstract getTodayActivity(): Observable<DailyActivity | null>;
    abstract getActivityHistory(fromDate?: string, toDate?: string): Observable<DailyActivity[]>;
    abstract getActivityStreak(): Observable<{ streak: number }>;

    // Spaced Repetition (SRS)
    abstract getSrsCardsDueToday(): Observable<SpacedRepetitionCard[]>;
    abstract reviewSrsCard(cardId: number, quality: number): Observable<SpacedRepetitionCard>;
    abstract getSrsStats(): Observable<SrsStats>;
    abstract upsertSrsCard(payload: UpsertSrsCardPayload): Observable<SpacedRepetitionCard>;

    // XP System & Badges (Phase 1)
    abstract getUserXp(): Observable<UserXp>;
    abstract awardXp(payload: AwardXpPayload): Observable<AwardXpResult>;
    abstract getBadges(): Observable<XpBadge[]>;
    abstract getRecentActivity(limit?: number): Observable<XpActivity[]>;

    // Trainee dashboard: 6-domain radar + multi-domain streaks
    abstract getDomainProgress(): Observable<DomainProgress[]>;
    abstract getUserStreaks(): Observable<StreakInfo>;

    // Daily Smart Nudges (Phase 2)
    abstract getDailyNudges(): Observable<DailyNudge[]>;
    abstract getNudgeSchedules(): Observable<NudgeSchedule[]>;
    abstract dismissNudge(nudgeId: number): Observable<ApiMessageResponse>;

    // Progression (Phase 3.1)
    abstract checkProgression(studentId: number): Observable<ProgressionResult>;
    abstract checkRingProgression(ringId: number): Observable<ProgressionResult[]>;
    abstract recordProgression(payload: {
      studentId: number;
      fromLevel: string;
      toLevel: string,
    }): Observable<StudentPathHistory>;

    // Monthly Booklets (Phase 3.6)
    abstract getMonthlyBooklets(studentId?: number): Observable<MonthlyBooklet[]>;
    abstract getMonthlyBookletById(id: number): Observable<MonthlyBooklet>;
    abstract getMonthlyBookletsByStudent(studentId: number): Observable<MonthlyBooklet[]>;
    abstract getMonthlyBookletByPeriod(
      studentId: number,
      year: number,
      month: number,
    ): Observable<MonthlyBooklet>;
    abstract createMonthlyBooklet(payload: CreateMonthlyBookletPayload): Observable<MonthlyBooklet>;
    abstract updateMonthlyBooklet(
      id: number,
      payload: UpdateMonthlyBookletPayload,
    ): Observable<MonthlyBooklet>;
    abstract deleteMonthlyBooklet(id: number): Observable<ApiMessageResponse>;
}