import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import type {
  CalendarEventDto,
  CreateCalendarEventRequest,
  UpdateCalendarEventRequest,
} from '../../models/lesson-planner.models';

@Injectable({ providedIn: 'root' })
export class MockCalendarService {
  private nextId = 100;

  private events: CalendarEventDto[];

  constructor() {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth();
    const at = (day: number, hour: number): string => {
      const d = new Date(y, m, day, hour, 0, 0, 0);
      return d.toISOString();
    };
    this.events = [
      {
        id: 1,
        title: 'جلسه توجیهی هفتگی',
        description: 'بررسی پیشرفت متربیان هفته',
        start: at(2, 10),
        end: at(2, 11),
        allDay: false,
        type: 'session',
        color: '#8b5cf6',
        location: 'سالن جلسات',
        creatorUserId: 1,
        isPublic: true,
        attendees: [
          { userId: 2, fullName: 'علی احمدی', responseStatus: 'accepted' },
          { userId: 3, fullName: 'فاطمه محمدی', responseStatus: 'pending' },
        ],
      },
      {
        id: 2,
        title: 'تعطیلی رسمی',
        description: 'تعطیلات ماه',
        start: at(12, 0),
        end: at(12, 23),
        allDay: true,
        type: 'holiday',
        color: '#ef4444',
        location: '',
        creatorUserId: 1,
        isPublic: true,
        attendees: [],
      },
      {
        id: 3,
        title: 'آزمون میان‌دوره',
        description: 'آزمون درس ریاضی',
        start: at(18, 9),
        end: at(18, 11),
        allDay: false,
        type: 'exam',
        color: '#f59e0b',
        location: 'کلاس ۲',
        creatorUserId: 1,
        isPublic: true,
        attendees: [
          { userId: 2, fullName: 'علی احمدی', responseStatus: 'accepted' },
          { userId: 3, fullName: 'فاطمه محمدی', responseStatus: 'tentative' },
        ],
      },
      {
        id: 4,
        title: 'ارسال گزارش ماهانه',
        description: '',
        start: at(25, 14),
        end: at(25, 15),
        allDay: false,
        type: 'work',
        color: '#3b82f6',
        location: '',
        creatorUserId: 1,
        isPublic: false,
        attendees: [],
      },
    ];
  }

  getEvents(from: Date, to: Date): Observable<CalendarEventDto[]> {
    const filtered = this.events.filter(
      (e) => new Date(e.start) >= from && new Date(e.start) <= to,
    );
    return of(filtered).pipe(delay(200));
  }

  createEvent(req: CreateCalendarEventRequest): Observable<CalendarEventDto> {
    const event: CalendarEventDto = {
      id: this.nextId++,
      creatorUserId: 1,
      attendees: (req.attendeeUserIds ?? []).map((userId) => ({
        userId,
        fullName: `کاربر ${userId}`,
        responseStatus: 'pending',
      })),
      ...req,
    };
    this.events = [...this.events, event];
    return of(event).pipe(delay(200));
  }

  updateEvent(id: number, req: UpdateCalendarEventRequest): Observable<CalendarEventDto> {
    const idx = this.events.findIndex((e) => e.id === id);
    if (idx < 0) {
      return of(this.events[this.events.length - 1]).pipe(delay(200));
    }
    const updated: CalendarEventDto = {
      ...this.events[idx],
      ...req,
      attendees:
        req.attendeeUserIds !== undefined
          ? req.attendeeUserIds.map((userId) => ({
              userId,
              fullName: `کاربر ${userId}`,
              responseStatus: 'pending' as const,
            }))
          : this.events[idx].attendees,
    };
    this.events = this.events.map((e) => (e.id === id ? updated : e));
    return of(updated).pipe(delay(200));
  }

  deleteEvent(id: number): Observable<void> {
    this.events = this.events.filter((e) => e.id !== id);
    return of(undefined).pipe(delay(200));
  }

  respondToEvent(id: number, response: 'accepted' | 'declined' | 'tentative'): Observable<void> {
    this.events = this.events.map((e) => {
      if (e.id !== id) return e;
      return {
        ...e,
        attendees: e.attendees.map((a) =>
          a.userId === 1 ? { ...a, responseStatus: response } : a,
        ),
      };
    });
    return of(undefined).pipe(delay(200));
  }
}