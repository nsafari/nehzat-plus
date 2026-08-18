import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import type { MockUser, HasId } from './mock-data-context.data';
import { seedSurveyData } from '../mock-lesson-planner-seed';
import { seedXpData, seedDailyNudgeData, seedDailyActivityData } from './mock-ctx-seed-gamification';
import { seedArtsData } from './mock-ctx-seed-arts';
import { seedSpiritualPracticeData } from './mock-ctx-seed-spiritual-practice';
import { seedSpiritualOccasionsData } from './mock-ctx-seed-spiritual-occasions';
import { seedCurriculumData } from './mock-ctx-seed-curriculum';
import { seedAssignments } from './mock-ctx-seed-assignments';
import { MockDataContextState } from './mock-data-context.state';

export type { MockUser, HasId } from './mock-data-context.data';

@Injectable({ providedIn: 'root' })
export class MockDataContext extends MockDataContextState {
  readonly delayMs = 300;

  constructor() {
    super();
    this.reseed();
  }

  now(): string {
    return new Date().toISOString();
  }

  yesterday(): string {
    return new Date(Date.now() - 86400000).toISOString().split('T')[0];
  }

  nextId<T extends HasId>(items: T[] | string): number {
    if (typeof items === 'string') {
      switch (items) {
        case 'assessment':
          return this.assessments.length ? Math.max(...this.assessments.map((a) => a.id)) + 1 : 1;
        case 'question': {
          const allQuestions = this.assessments.flatMap((a) => a.questions ?? []);
          return allQuestions.length ? Math.max(...allQuestions.map((q: any) => q.id)) + 1 : 1;
        }
        case 'result': {
          const allResults = this.assessments.flatMap((a) => a.results ?? []);
          return allResults.length ? Math.max(...allResults.map((r: any) => r.id)) + 1 : 1;
        }
        default:
          return 1;
      }
    }
    return items.length ? Math.max(...items.map((i) => i.id)) + 1 : 1;
  }

  delayed<T>(value: T): Observable<T> {
    return of(value).pipe(delay(this.delayMs));
  }

  findUserByUsername(username: string): MockUser | undefined {
    return this.users.find((u) => u.username === username);
  }

  getEvaluatorName(id: number): string {
    const map: Record<number, string> = {
      1: 'دکتر رضایی',
      2: 'دکتر محمدی',
      3: 'دکتر حسینی',
    };
    return map[id] ?? `ارزیاب ${id}`;
  }

  private reseed(): void {
    seedAssignments({ courses: this.courses, assignments: this.assignments, attachments: this.attachments });
    seedCurriculumData({ subjectAreas: this.subjectAreas, teachingMethods: this.teachingMethods, now: () => this.now() });
    seedSpiritualPracticeData({ spiritualPracticeItems: this.spiritualPracticeItems, now: () => this.now() });
    seedSpiritualOccasionsData({ spiritualOccasions: this.spiritualOccasions, spiritualPaths: this.spiritualPaths, now: () => this.now() });
    seedSurveyData({
      issueSurveys: this.issueSurveys,
      issueQuestions: this.issueQuestions,
      issueResponses: this.issueResponses,
      issueComments: this.issueComments,
      nextId: (arr) => this.nextId(arr),
      now: () => this.now(),
    });
    seedDailyActivityData({ dailyActivities: this.dailyActivities, now: () => this.now(), yesterday: () => this.yesterday() });
    seedDailyNudgeData({ dailyNudges: this.dailyNudges, now: () => this.now() });
    seedXpData({
      setUserXp: (userXp) => (this.userXp = userXp),
      setXpBadges: (xpBadges) => (this.xpBadges = xpBadges),
      setXpActivities: (xpActivities) => (this.xpActivities = xpActivities),
      now: () => this.now(),
    });
    seedArtsData({ artworks: this.artworks, musicRecords: this.musicRecords, calligraphySamples: this.calligraphySamples, now: () => this.now() });
  }

  reset(): void {
    this.resetState();
    this.reseed();
  }
}