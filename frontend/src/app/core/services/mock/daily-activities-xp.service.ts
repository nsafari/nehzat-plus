import { Observable } from 'rxjs';
import { MockDataContext } from './mock-data-context';
import {
  DailyNudge,
  UserXp,
  XpBadge,
  XpActivity,
  AwardXpResult,
  DomainProgress,
  StreakInfo,
  AwardXpPayload,
  NudgeSchedule,
  ApiMessageResponse,
} from '../../models/lesson-planner.models';

/**
 * XP system, domain progress, streaks and daily nudges sub-domain.
 * Split from the former monolithic MockDailyActivitiesService.
 */
export abstract class MockDailyActivitiesXpBaseService {
  constructor(protected ctx: MockDataContext) {}

  getUserXp(): Observable<UserXp> {
    return this.ctx.delayed(this.ctx.userXp!);
  }

  awardXp(payload: AwardXpPayload): Observable<AwardXpResult> {
    if (this.ctx.userXp) {
      this.ctx.userXp.totalXp += payload.xp;
      this.ctx.userXp.updatedAt = this.ctx.now();
    }
    const activity: XpActivity = {
      id: this.ctx.nextId(this.ctx.xpActivities),
      type: 'xp',
      xpAmount: payload.xp,
      badgeId: null,
      badgeName: null,
      badgeIcon: null,
      reason: payload.reason,
      createdAt: this.ctx.now(),
    };
    this.ctx.xpActivities.push(activity);
    return this.ctx.delayed({
      userXp: this.ctx.userXp!,
      awardedXp: payload.xp,
      leveledUp: false,
      newBadges: [],
    });
  }

  getBadges(): Observable<XpBadge[]> {
    return this.ctx.delayed([...this.ctx.xpBadges]);
  }

  getRecentActivity(limit?: number): Observable<XpActivity[]> {
    const activities = [...this.ctx.xpActivities].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    return this.ctx.delayed(limit ? activities.slice(0, limit) : activities);
  }

  getDomainProgress(): Observable<DomainProgress[]> {
    return this.ctx.delayed([
      { key: 'spiritual', labelFa: 'معنوی', icon: '🕌', score: 75 },
      { key: 'scientific', labelFa: 'علمی', icon: '📚', score: 60 },
      { key: 'physical', labelFa: 'بدنی', icon: '💪', score: 45 },
      { key: 'social', labelFa: 'اجتماعی', icon: '🤝', score: 55 },
      { key: 'artistic', labelFa: 'هنری', icon: '🎨', score: 70 },
      { key: 'career', labelFa: 'حرفه‌ای', icon: '💼', score: 40 },
    ]);
  }

  getUserStreaks(): Observable<StreakInfo> {
    const activityStreak = this.ctx.dailyActivities
      .filter((a) => (a.activityMinutes ?? 0) > 0)
      .sort((a, b) => b.activityDate.localeCompare(a.activityDate));
    let streak = 0;
    if (activityStreak.length > 0) {
      const today = new Date().toISOString().split('T')[0];
      if (
        activityStreak[0].activityDate === today ||
        activityStreak[0].activityDate === this.ctx.yesterday()
      ) {
        streak = 1;
        for (let i = 1; i < activityStreak.length; i++) {
          const prev = new Date(activityStreak[i - 1].activityDate);
          const curr = new Date(activityStreak[i].activityDate);
          const diffDays = (prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24);
          if (diffDays === 1) streak++;
          else break;
        }
      }
    }
    return this.ctx.delayed({
      academic: streak,
      spiritual: streak,
      physical: streak,
      unified: streak,
    });
  }

  getDailyNudges(): Observable<DailyNudge[]> {
    return this.ctx.delayed([...this.ctx.dailyNudges]);
  }

  getNudgeSchedules(): Observable<NudgeSchedule[]> {
    return this.ctx.delayed([
      {
        id: 1,
        domain: 'spiritual',
        hour: 7,
        minute: 30,
        message: 'تعهد معنوی امروز را ثبت کن',
        enabled: true,
      },
      {
        id: 2,
        domain: 'scientific',
        hour: 8,
        minute: 0,
        message: 'تمرین علمی امروز را انجام بده',
        enabled: true,
      },
      {
        id: 3,
        domain: 'physical',
        hour: 17,
        minute: 0,
        message: 'فعالیت بدنی امروز را فراموش نکن',
        enabled: true,
      },
    ]);
  }

  dismissNudge(nudgeId: number): Observable<ApiMessageResponse> {
    const nudge = this.ctx.dailyNudges.find((n) => n.id === nudgeId);
    if (nudge) nudge.status = 'dismissed';
    return this.ctx.delayed({ message: 'اعلان رد شد' });
  }
}
