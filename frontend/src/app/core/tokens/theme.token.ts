import { InjectionToken, Signal } from '@angular/core';

export interface PhaseTheme {
  colors: {
    primary: string;
    primaryLight: string;
    bgCard: string;
    bgPage: string;
    text: string;
    textMuted: string;
    accent: string;
  };
  radius: {
    card: string;
    button: string;
    input: string;
  };
  font: {
    family: string;
    sizeBase: string;
    sizeHeading: string;
  };
  shadow: string;
  iconPack?: 'playful' | 'standard' | 'minimal';
}

export const PHASE_THEME = new InjectionToken<Signal<PhaseTheme>>('PHASE_THEME');