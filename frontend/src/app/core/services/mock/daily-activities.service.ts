import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MockDataContext } from './mock-data-context';
import { MockDailyActivitiesXpBaseService } from './daily-activities-xp.service';
import {
  DailyActivity,
  SpacedRepetitionCard,
  SrsStats,
  UpsertDailyActivityPayload,
  UpsertSrsCardPayload,
} from '../../models/lesson-planner.models';

/**
 * Daily activity + spaced-repetition (SRS) sub-domain. XP/streaks/nudges
 * methods live in MockDailyActivitiesXpBaseService.
 */
@Injectable({ providedIn: 'root' })
export class MockDailyActivitiesService extends MockDailyActivitiesXpBaseService {
  constructor(ctx: MockDataContext) {
    super(ctx);
  }

  upsertDailyActivity(payload: UpsertDailyActivityPayload): Observable<DailyActivity> {
    const now = this.ctx.now();
    const userId = 42;
    const existing = this.ctx.dailyActivities.find(
      (a) => a.userId === userId && a.activityDate === payload.activityDate,
    );
    if (existing) {
      existing.activityMinutes = payload.activityMinutes ?? existing.activityMinutes;
      existing.steps = payload.steps ?? existing.steps;
      existing.sleepHours = payload.sleepHours ?? existing.sleepHours;
      existing.notes = payload.notes ?? existing.notes;
      existing.updatedAt = now;
      return this.ctx.delayed(existing);
    }
    const activity: DailyActivity = {
      id: this.ctx.nextId(this.ctx.dailyActivities),
      userId,
      activityDate: payload.activityDate,
      activityMinutes: payload.activityMinutes ?? 0,
      steps: payload.steps ?? 0,
      sleepHours: payload.sleepHours ?? 0,
      notes: payload.notes ?? '',
      createdAt: now,
      updatedAt: now,
    };
    this.ctx.dailyActivities.push(activity);
    return this.ctx.delayed(activity);
  }

  getTodayActivity(): Observable<DailyActivity | null> {
    const today = new Date().toISOString().split('T')[0];
    const activity = this.ctx.dailyActivities.find((a) => a.activityDate === today);
    return this.ctx.delayed(activity ?? null);
  }

  getActivityHistory(fromDate?: string, toDate?: string): Observable<DailyActivity[]> {
    let activities = [...this.ctx.dailyActivities];
    if (fromDate) activities = activities.filter((a) => a.activityDate >= fromDate);
    if (toDate) activities = activities.filter((a) => a.activityDate <= toDate);
    activities.sort((a, b) => b.activityDate.localeCompare(a.activityDate));
    return this.ctx.delayed(activities);
  }

  getActivityStreak(): Observable<{ streak: number }> {
    const activities = this.ctx.dailyActivities
      .filter((a) => (a.activityMinutes ?? 0) > 0)
      .sort((a, b) => b.activityDate.localeCompare(a.activityDate));
    let streak = 0;
    if (activities.length > 0) {
      const today = new Date().toISOString().split('T')[0];
      if (
        activities[0].activityDate === today ||
        activities[0].activityDate === this.ctx.yesterday()
      ) {
        streak = 1;
        for (let i = 1; i < activities.length; i++) {
          const prev = new Date(activities[i - 1].activityDate);
          const curr = new Date(activities[i].activityDate);
          const diffDays = (prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24);
          if (diffDays === 1) streak++;
          else break;
        }
      }
    }
    return this.ctx.delayed({ streak });
  }

  getSrsCardsDueToday(): Observable<SpacedRepetitionCard[]> {
    const today = this.ctx.now().split('T')[0];
    return this.ctx.delayed(
      this.ctx.srsCards.filter((c) => c.nextReviewAt.split('T')[0] <= today && c.userId === 42),
    );
  }

  reviewSrsCard(cardId: number, quality: number): Observable<SpacedRepetitionCard> {
    const card = this.ctx.srsCards.find((c) => c.id === cardId);
    if (!card) throw new Error('Card not found');
    const now = this.ctx.now();
    card.lastReviewedAt = now;
    card.repetition += 1;
    card.interval = quality >= 3 ? Math.max(1, Math.round(card.interval * card.easeFactor)) : 1;
    card.easeFactor = Math.max(1.3, card.easeFactor + (quality >= 3 ? 0.1 : -0.2));
    card.nextReviewAt = new Date(Date.now() + card.interval * 86400000).toISOString();
    card.updatedAt = now;
    return this.ctx.delayed(card);
  }

  getSrsStats(): Observable<SrsStats> {
    const cards = this.ctx.srsCards.filter((c) => c.userId === 42);
    const today = this.ctx.now().split('T')[0];
    return this.ctx.delayed({
      totalCards: cards.length,
      dueToday: cards.filter((c) => c.nextReviewAt.split('T')[0] <= today).length,
      learningCards: cards.filter((c) => c.repetition > 0 && c.repetition < 5).length,
      reviewCards: cards.filter((c) => c.repetition >= 5).length,
      averageEaseFactor: cards.length
        ? cards.reduce((sum, c) => sum + c.easeFactor, 0) / cards.length
        : 2.5,
    });
  }

  upsertSrsCard(payload: UpsertSrsCardPayload): Observable<SpacedRepetitionCard> {
    const existing = this.ctx.srsCards.find(
      (c) =>
        c.userId === 42 &&
        c.contentType === payload.contentType &&
        c.contentId === payload.contentId,
    );
    if (existing) return this.ctx.delayed(existing);
    const card: SpacedRepetitionCard = {
      id: this.ctx.nextId(this.ctx.srsCards),
      userId: 42,
      contentType: payload.contentType,
      contentId: payload.contentId ?? null,
      question: payload.question,
      answer: payload.answer,
      interval: 1,
      easeFactor: 2.5,
      repetition: 0,
      nextReviewAt: this.ctx.now(),
      lastReviewedAt: null,
      createdAt: this.ctx.now(),
      updatedAt: this.ctx.now(),
    };
    this.ctx.srsCards.push(card);
    return this.ctx.delayed(card);
  }
}
