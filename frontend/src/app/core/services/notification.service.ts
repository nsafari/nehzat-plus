import { Injectable, signal } from '@angular/core';
import type { NudgeSchedule } from '../models/lesson-planner.models';

export interface Notification {
  id: number;
  message: string;
  type: 'error' | 'success' | 'info';
}

export type NudgePermission = 'granted' | 'denied' | 'default';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private counter = 0;
  private readonly duration = 5000;
  private readonly schedulesKey = 'lp-daily-nudge-schedules';
  private schedules: NudgeSchedule[] = this.loadSchedules();
  private timers = new Map<number, ReturnType<typeof setTimeout>>();

  notifications = signal<Notification[]>([]);
  dailyNudgeSchedules = signal<NudgeSchedule[]>(this.schedules);

  show(message: string, type: 'error' | 'success' | 'info' = 'error'): void {
    const id = ++this.counter;
    this.notifications.update((list) => [...list, { id, message, type }]);

    setTimeout(() => this.dismiss(id), this.duration);
  }

  dismiss(id: number): void {
    this.notifications.update((list) => list.filter((n) => n.id !== id));
  }

  get isBrowserSupported(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window;
  }

  get isPermissionGranted(): boolean {
    return this.isBrowserSupported && window.Notification.permission === 'granted';
  }

  async requestPermission(): Promise<NudgePermission> {
    if (!this.isBrowserSupported) {
      return 'default';
    }
    if (window.Notification.permission === 'granted') {
      return 'granted';
    }
    if (window.Notification.permission === 'denied') {
      return 'denied';
    }
    return window.Notification.requestPermission();
  }

  scheduleDailyNudge(hour: number, minute: number, message = 'امروز برنامه روزانه خود را کامل کن', domain: NudgeSchedule['domain'] = 'scientific'): number {
    const schedule: NudgeSchedule = {
      id: ++this.counter,
      hour,
      minute,
      message,
      domain,
      enabled: true
    };
    this.schedules.push(schedule);
    this.persistSchedules();
    this.dailyNudgeSchedules.set([...this.schedules]);
    this.armDailyTimer(schedule);
    return schedule.id;
  }

  scheduleNudgeForActivity(activityType: string, message = `یادآوری: ${activityType}`, delayMinutes = 30): number {
    const id = ++this.counter;
    const timer = setTimeout(() => {
      this.fireNudge(message);
      this.timers.delete(id);
    }, Math.max(0, delayMinutes) * 60 * 1000);
    this.timers.set(id, timer);
    return id;
  }

  cancelNudgeSchedule(id: number): void {
    const existing = this.schedules.find((schedule) => schedule.id === id);
    if (existing) {
      existing.enabled = false;
    }
    this.persistSchedules();
    this.dailyNudgeSchedules.set([...this.schedules]);
  }

  private fireNudge(message: string): void {
    this.show(message, 'info');
    if (this.isPermissionGranted) {
      try {
        new window.Notification('یادآور نهضت', {
          body: message,
          icon: 'assets/nehzat.png',
          tag: 'lp-daily-nudge'
        });
      } catch {
        // Some environments block constructing a Notification; the in-app toast still shows.
      }
    }
  }

  private armDailyTimer(schedule: NudgeSchedule): void {
    if (!schedule.enabled) {
      return;
    }
    const delay = this.nextFireDelay(schedule.hour, schedule.minute);
    const timer = setTimeout(() => {
      if (!schedule.enabled) {
        return;
      }
      this.fireNudge(schedule.message);
      this.armDailyTimer(schedule);
    }, delay);
    this.timers.set(schedule.id, timer);
  }

  private nextFireDelay(hour: number, minute: number): number {
    const now = new Date();
    const next = new Date(now);
    next.setHours(hour, minute, 0, 0);
    if (next.getTime() <= now.getTime()) {
      next.setDate(next.getDate() + 1);
    }
    return next.getTime() - now.getTime();
  }

  private loadSchedules(): NudgeSchedule[] {
    try {
      const raw = localStorage.getItem(this.schedulesKey);
      if (!raw) {
        return [];
      }
      const parsed: NudgeSchedule[] = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private persistSchedules(): void {
    try {
      localStorage.setItem(this.schedulesKey, JSON.stringify(this.schedules));
    } catch {
      // Storage may be unavailable (e.g. private mode); scheduling still works in-memory.
    }
  }
}
