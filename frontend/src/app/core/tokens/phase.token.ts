import { InjectionToken, Signal } from '@angular/core';

export interface PhaseConfig {
  phase: 'A' | 'B' | 'C' | 'D' | 'E';
  isChild: boolean;
  isPreTeen: boolean;
  isTeen: boolean;
  isYoungAdult: boolean;
  ringNumber: number | null;
}

export const PHASE_CONFIG = new InjectionToken<Signal<PhaseConfig>>('PHASE_CONFIG');
