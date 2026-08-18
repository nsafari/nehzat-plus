import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MockDataContext } from './mock-data-context';
import { MockSpiritualPathsBaseService } from './spiritual-paths.service';
import {
  SpiritualPracticeItem,
  SpiritualOccasion,
  SpiritualOccasionDetail,
  DailySpiritualEntry,
  UserOccasionProgress,
  UpsertDailySpiritualEntryPayload,
  MarkOccasionPracticePayload,
  ApiMessageResponse,
} from '../../models/lesson-planner.models';

/**
 * Spiritual practices, occasions and daily entries sub-domain.
 * Path-selection methods live in MockSpiritualPathsBaseService.
 */
@Injectable({ providedIn: 'root' })
export class MockSpiritualService extends MockSpiritualPathsBaseService {
  constructor(ctx: MockDataContext) {
    super(ctx);
  }

  getSpiritualPractices(): Observable<SpiritualPracticeItem[]> {
    return this.ctx.delayed([...this.ctx.spiritualPracticeItems]);
  }

  getSpiritualPracticesForMe(
    age?: number,
    gender?: string,
    role?: string,
  ): Observable<SpiritualPracticeItem[]> {
    let items = [...this.ctx.spiritualPracticeItems];
    if (age !== undefined) {
      items = items.filter(
        (p) =>
          (p.minAge === undefined || p.minAge <= age) &&
          (p.maxAge === undefined || p.maxAge >= age),
      );
    }
    if (gender) {
      items = items.filter((p) => p.genderMask === 'mixed' || p.genderMask === gender);
    }
    if (role) {
      items = items.filter((p) => p.roleMask === '*' || p.roleMask === role);
    }
    return this.ctx.delayed(items);
  }

  getSpiritualOccasions(): Observable<SpiritualOccasion[]> {
    return this.ctx.delayed([...this.ctx.spiritualOccasions]);
  }

  getSpiritualOccasionDetail(occasionId: number): Observable<SpiritualOccasionDetail> {
    const occasion = this.ctx.spiritualOccasions.find((o) => o.id === occasionId);
    if (!occasion) return this.ctx.delayed({} as SpiritualOccasionDetail);
    return this.ctx.delayed({
      ...occasion,
      practices: this.ctx.spiritualPracticeItems.slice(0, 3),
    });
  }

  getDailySpiritualEntry(userId: number, date: string): Observable<DailySpiritualEntry> {
    const entry = this.ctx.dailySpiritualEntries.find(
      (e) => e.userId === userId && e.entryDate === date,
    );
    if (!entry) return this.ctx.delayed({} as DailySpiritualEntry);
    return this.ctx.delayed(entry);
  }

  upsertDailySpiritualEntry(
    payload: UpsertDailySpiritualEntryPayload,
  ): Observable<DailySpiritualEntry> {
    const now = this.ctx.now();
    const existing = this.ctx.dailySpiritualEntries.find(
      (e) => e.userId === payload.userId && e.entryDate === payload.entryDate,
    );
    if (existing) {
      existing.moodScore = payload.moodScore;
      existing.notes = payload.notes;
      existing.completedSteps = payload.completedSteps;
      existing.updatedAt = now;
      return this.ctx.delayed(existing);
    }
    const entry: DailySpiritualEntry = {
      id: this.ctx.nextId(this.ctx.dailySpiritualEntries),
      userId: payload.userId,
      entryDate: payload.entryDate,
      moodScore: payload.moodScore,
      notes: payload.notes,
      completedSteps: payload.completedSteps,
      createdAt: now,
      updatedAt: now,
    };
    this.ctx.dailySpiritualEntries.push(entry);
    return this.ctx.delayed(entry);
  }

  getSpiritualEntryHistory(
    userId: number,
    fromDate?: string,
    toDate?: string,
  ): Observable<DailySpiritualEntry[]> {
    let entries = this.ctx.dailySpiritualEntries.filter((e) => e.userId === userId);
    if (fromDate) entries = entries.filter((e) => e.entryDate >= fromDate);
    if (toDate) entries = entries.filter((e) => e.entryDate <= toDate);
    entries.sort((a, b) => b.entryDate.localeCompare(a.entryDate));
    return this.ctx.delayed(entries);
  }

  getSpiritualStreak(userId: number): Observable<{ streak: number }> {
    const entries = this.ctx.dailySpiritualEntries
      .filter((e) => e.userId === userId)
      .sort((a, b) => b.entryDate.localeCompare(a.entryDate));
    let streak = 0;
    if (entries.length > 0) {
      const today = new Date().toISOString().split('T')[0];
      if (entries[0].entryDate === today || entries[0].entryDate === this.ctx.yesterday()) {
        streak = 1;
        for (let i = 1; i < entries.length; i++) {
          const prev = new Date(entries[i - 1].entryDate);
          const curr = new Date(entries[i].entryDate);
          const diffDays = (prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24);
          if (diffDays === 1) streak++;
          else break;
        }
      }
    }
    return this.ctx.delayed({ streak });
  }

  getUserOccasionProgress(
    userId: number,
    occasionId?: number,
    hijriYear?: number,
  ): Observable<UserOccasionProgress[]> {
    let progress = this.ctx.userOccasionProgress.filter((p) => p.userId === userId);
    if (occasionId !== undefined) progress = progress.filter((p) => p.occasionId === occasionId);
    return this.ctx.delayed(progress);
  }

  markOccasionPractice(payload: MarkOccasionPracticePayload): Observable<UserOccasionProgress> {
    const existing = this.ctx.userOccasionProgress.find(
      (p) =>
        p.userId === payload.userId &&
        p.occasionId === payload.occasionId &&
        p.practiceItemId === payload.practiceItemId,
    );
    if (existing) {
      existing.isCompleted = payload.isCompleted;
      existing.completedAt = payload.isCompleted ? this.ctx.now() : undefined;
      existing.notes = payload.notes;
      existing.updatedAt = this.ctx.now();
      return this.ctx.delayed(existing);
    }
    const progress: UserOccasionProgress = {
      id: this.ctx.nextId(this.ctx.userOccasionProgress),
      userId: payload.userId,
      occasionId: payload.occasionId,
      practiceItemId: payload.practiceItemId,
      hijriYear: payload.hijriYear,
      isCompleted: payload.isCompleted,
      completedAt: payload.isCompleted ? this.ctx.now() : undefined,
      notes: payload.notes,
      createdAt: this.ctx.now(),
      updatedAt: this.ctx.now(),
    };
    this.ctx.userOccasionProgress.push(progress);
    return this.ctx.delayed(progress);
  }
}
