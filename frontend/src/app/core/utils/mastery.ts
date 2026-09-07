export type MasteryLevel = 'novice' | 'familiar' | 'proficient' | 'master';

export interface MasteryConfig {
  level: MasteryLevel;
  label: string;
  emoji: string;
  minAttempts: number;
  minScore: number;
}

export const MASTERY_LEVELS: MasteryConfig[] = [
  { level: 'novice', label: 'نوآموز', emoji: '🌱', minAttempts: 0, minScore: 0 },
  { level: 'familiar', label: 'آشنا', emoji: '📖', minAttempts: 1, minScore: 50 },
  { level: 'proficient', label: 'ماهر', emoji: '💪', minAttempts: 2, minScore: 75 },
  { level: 'master', label: 'مسلط', emoji: '🏆', minAttempts: 3, minScore: 90 }
];

export function computeMasteryLevel(attemptCount: number, bestScore: number): MasteryLevel {
  let level: MasteryLevel = 'novice';
  for (const config of MASTERY_LEVELS) {
    if (attemptCount >= config.minAttempts && bestScore >= config.minScore) {
      level = config.level;
    }
  }
  return level;
}

export function getMasteryLabel(level: MasteryLevel): string {
  return MASTERY_LEVELS.find(c => c.level === level)?.label ?? 'نوآموز';
}

export function getMasteryEmoji(level: MasteryLevel): string {
  return MASTERY_LEVELS.find(c => c.level === level)?.emoji ?? '🌱';
}