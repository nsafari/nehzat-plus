import { Injectable, signal } from '@angular/core';
import { PhaseTransitionInfo } from '../models/feedback.models';

@Injectable({ providedIn: 'root' })
export class PhaseTransitionService {
  private readonly STORAGE_KEY = 'maktab_phase';
  readonly showBanner = signal(false);
  readonly transitionInfo = signal<PhaseTransitionInfo | null>(null);

  checkPhase(currentPhase: string): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    const info: PhaseTransitionInfo = {
      newPhase: currentPhase,
      oldPhase: stored,
      message: '',
    };

    if (!stored) {
      info.message = this.getMessage(null, currentPhase);
      this.trigger(info);
      return;
    }

    if (stored !== currentPhase) {
      info.message = this.getMessage(stored, currentPhase);
      this.trigger(info);
    }
  }

  dismiss(): void {
    this.showBanner.set(false);
  }

  private trigger(info: PhaseTransitionInfo): void {
    localStorage.setItem(this.STORAGE_KEY, info.newPhase);
    this.transitionInfo.set(info);
    this.showBanner.set(true);
    setTimeout(() => this.dismiss(), 6000);
  }

  private getMessage(oldPhase: string | null, newPhase: string): string {
    if (!oldPhase) return '🎉 به سیستم بازخورد خوش آمدی!';
    const map: Record<string, Record<string, string>> = {
      A: { B: '🎈 آفرین! به مرحله جدید رسیدی! حالا می\u200cتونی پیشرفتتو بهتر ببینی.' },
      B: { C: '📊 وقتشه! نمره\u200cهات رو به صورت نمودار می\u200cبینی.' },
      C: { D: '📈 آفرین! تحلیل عمیق\u200cتر برات فعال شد.' },
      D: { E: '📋 گزارشات جامع در اختیارت قرار می\u200cگیره. به اوج رسیدی!' },
    };
    return map[oldPhase]?.[newPhase] ?? '🎉 به مرحله جدید خوش آمدی!';
  }
}
