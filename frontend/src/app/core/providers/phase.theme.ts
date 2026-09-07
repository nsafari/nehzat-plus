import { Provider, inject, computed } from '@angular/core';
import { PHASE_CONFIG } from '../tokens/phase.token';
import { PHASE_THEME, PhaseTheme } from '../tokens/theme.token';

const phaseThemes: Record<string, PhaseTheme> = {
  // Phase A — کودک (۵-۶ سال): شاد، گرد، رنگ‌های گرم
  A: {
    colors: {
      primary: '#FF6B6B',
      primaryLight: '#FFE0E0',
      bgCard: '#FFF5F5',
      bgPage: '#FFFAFA',
      text: '#2D3436',
      textMuted: '#B2BEC3',
      accent: '#FECA57',
    },
    radius: { card: '20px', button: '24px', input: '12px' },
    font: { family: "'Vazirmatn', 'Comic Neue', sans-serif", sizeBase: '14px', sizeHeading: '24px' },
    shadow: '0 4px 20px rgba(255, 107, 107, 0.15)',
    iconPack: 'playful',
  },
  // Phase B — نوجوان کوچک (۷-۸ سال): سرزنده، سبز-آبی
  B: {
    colors: {
      primary: '#4ECDC4',
      primaryLight: '#E0F7F5',
      bgCard: '#F0FFFE',
      bgPage: '#F8FFFE',
      text: '#2D3436',
      textMuted: '#B2BEC3',
      accent: '#FFEAA7',
    },
    radius: { card: '16px', button: '20px', input: '10px' },
    font: { family: "'Vazirmatn', sans-serif", sizeBase: '14px', sizeHeading: '22px' },
    shadow: '0 4px 16px rgba(78, 205, 196, 0.15)',
    iconPack: 'playful',
  },
  // Phase C — نوجوان (۹-۱۱ سال): بنفش، حرفه‌ای
  C: {
    colors: {
      primary: '#6C5CE7',
      primaryLight: '#EDE7FF',
      bgCard: '#F8F6FF',
      bgPage: '#FBFAFF',
      text: '#2D3436',
      textMuted: '#A0A0B8',
      accent: '#FD79A8',
    },
    radius: { card: '12px', button: '16px', input: '8px' },
    font: { family: "'Vazirmatn', sans-serif", sizeBase: '14px', sizeHeading: '20px' },
    shadow: '0 4px 12px rgba(108, 92, 231, 0.12)',
    iconPack: 'standard',
  },
  // Phase D — جوان (۱۲-۱۳ سال): نارنجی، مینیمال
  D: {
    colors: {
      primary: '#FF6B35',
      primaryLight: '#FFE8DC',
      bgCard: '#FFFBF8',
      bgPage: '#FFFDFC',
      text: '#2D3436',
      textMuted: '#ADA0A0',
      accent: '#2ECC71',
    },
    radius: { card: '10px', button: '12px', input: '6px' },
    font: { family: "'Vazirmatn', sans-serif", sizeBase: '14px', sizeHeading: '18px' },
    shadow: '0 2px 8px rgba(255, 107, 53, 0.10)',
    iconPack: 'minimal',
  },
  // Phase E — جوان بزرگسال (۱۴-۲۱ سال): آبی، مینیمال
  E: {
    colors: {
      primary: '#0984E3',
      primaryLight: '#DFE6E9',
      bgCard: '#FFFFFF',
      bgPage: '#F5F6FA',
      text: '#2D3436',
      textMuted: '#B2BEC3',
      accent: '#00B894',
    },
    radius: { card: '12px', button: '16px', input: '8px' },
    font: { family: "'Vazirmatn', sans-serif", sizeBase: '14px', sizeHeading: '20px' },
    shadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    iconPack: 'standard',
  },
  // Fallback
  default: {
    colors: {
      primary: '#0984E3',
      primaryLight: '#DFE6E9',
      bgCard: '#FFFFFF',
      bgPage: '#F5F6FA',
      text: '#2D3436',
      textMuted: '#B2BEC3',
      accent: '#00B894',
    },
    radius: { card: '12px', button: '16px', input: '8px' },
    font: { family: "'Vazirmatn', sans-serif", sizeBase: '14px', sizeHeading: '20px' },
    shadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    iconPack: 'standard',
  },
};

export function providePhaseTheme(): Provider {
  return {
    provide: PHASE_THEME,
    useFactory: () => {
      const phaseConfig = inject(PHASE_CONFIG);
      return computed<PhaseTheme>(() => {
        const phase = phaseConfig().phase;
        return phaseThemes[phase] || phaseThemes.default;
      });
    },
  };
}