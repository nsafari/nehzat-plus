import type {
  UserXp,
  XpBadge,
  DailyNudge,
  DailyActivity,
} from '../../models/lesson-planner.models';
import { initialXpBadges } from './mock-data-context.data';

export interface GamificationSeedContext {
  setUserXp: (userXp: UserXp | null) => void;
  setXpBadges: (xpBadges: XpBadge[]) => void;
  setXpActivities: (xpActivities: any[]) => void;
  dailyNudges: DailyNudge[];
  dailyActivities: DailyActivity[];
  now: () => string;
  yesterday: () => string;
}

type GamificationXpSeedContext = Pick<
  GamificationSeedContext,
  'now' | 'setUserXp' | 'setXpBadges' | 'setXpActivities'
>;
type GamificationNudgeSeedContext = Pick<GamificationSeedContext, 'now' | 'dailyNudges'>;
type GamificationActivitySeedContext = Pick<
  GamificationSeedContext,
  'now' | 'yesterday' | 'dailyActivities'
>;

export function seedXpData(ctx: GamificationXpSeedContext): void {
  const now = ctx.now();
  ctx.setUserXp({
    userId: 42,
    totalXp: 620,
    level: 2,
    currentLevelXp: 400,
    nextLevelXp: 900,
    levelProgressXp: 220,
    levelProgressPercent: 44,
    updatedAt: now,
  });
  ctx.setXpBadges([...initialXpBadges]);
  ctx.setXpActivities([
    {
      id: 1,
      type: 'xp',
      xpAmount: 50,
      badgeId: null,
      badgeName: null,
      badgeIcon: null,
      reason: 'تکمیل تمرین ریاضی',
      createdAt: now,
    },
    {
      id: 2,
      type: 'badge',
      xpAmount: 0,
      badgeId: 2,
      badgeName: 'متربیِ کوشا',
      badgeIcon: '📖',
      reason: 'دریافت نشان «متربیِ کوشا»',
      createdAt: now,
    },
    {
      id: 3,
      type: 'xp',
      xpAmount: 30,
      badgeId: null,
      badgeName: null,
      badgeIcon: null,
      reason: 'تکمیل تکلیف روزانه',
      createdAt: now,
    },
  ]);
}

export function seedDailyNudgeData(ctx: GamificationNudgeSeedContext): void {
  const today = new Date().toISOString().split('T')[0];
  const now = ctx.now();
  ctx.dailyNudges.push(
    {
      id: 1,
      userId: 42,
      domain: 'scientific',
      message: 'امروز ۳۰ دقیقه تمرین ریاضی در نظر گرفته‌ای؟',
      scheduledFor: `${today}T08:00:00.000Z`,
      status: 'pending',
      createdAt: now,
    },
    {
      id: 2,
      userId: 42,
      domain: 'spiritual',
      message: 'تعهد معنوی امروز: یک صفحه قرآن با تامل بخوان.',
      scheduledFor: `${today}T07:30:00.000Z`,
      status: 'pending',
      createdAt: now,
    },
    {
      id: 3,
      userId: 42,
      domain: 'physical',
      message: 'فعالیت بدنی امروز ثبت شد؟ ۲۰ دقیقه پیاده‌روی فراموش نشود.',
      scheduledFor: `${today}T17:00:00.000Z`,
      status: 'pending',
      createdAt: now,
    },
  );
}

export function seedDailyActivityData(ctx: GamificationActivitySeedContext): void {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = ctx.yesterday();
  const dayBefore = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const now = ctx.now();
  ctx.dailyActivities.push(
    {
      id: 1,
      userId: 42,
      activityDate: today,
      activityMinutes: 40,
      steps: 6500,
      sleepHours: 7.5,
      notes: 'پیاده‌روی عصرگاهی',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 2,
      userId: 42,
      activityDate: yesterday,
      activityMinutes: 30,
      steps: 4200,
      sleepHours: 8,
      notes: 'ورزش صبحگاهی',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 3,
      userId: 42,
      activityDate: dayBefore,
      activityMinutes: 0,
      steps: 0,
      sleepHours: 0,
      notes: '',
      createdAt: now,
      updatedAt: now,
    },
  );
}
