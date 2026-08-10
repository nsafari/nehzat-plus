export interface XpLevelConfig {
  level: number;
  title: string;
  minXp: number;
  nextLevelXp: number;
  requiredXp: number;
  emoji: string;
}

export const XP_LEVELS: XpLevelConfig[] = [
  { level: 0, title: 'تازه‌کار', minXp: 0, nextLevelXp: 100, requiredXp: 100, emoji: '🌱' },
  { level: 1, title: 'متربی فعال', minXp: 100, nextLevelXp: 400, requiredXp: 300, emoji: '📖' },
  { level: 2, title: 'متربی کوشا', minXp: 400, nextLevelXp: 900, requiredXp: 500, emoji: '✏️' },
  { level: 3, title: 'متربی ماهر', minXp: 900, nextLevelXp: 1600, requiredXp: 700, emoji: '💪' },
  { level: 4, title: 'متربی برتر', minXp: 1600, nextLevelXp: 2500, requiredXp: 900, emoji: '🏅' },
  { level: 5, title: 'فرهیخته', minXp: 2500, nextLevelXp: 3600, requiredXp: 1100, emoji: '🎖️' },
  { level: 6, title: 'استادِ مسیر', minXp: 3600, nextLevelXp: 4900, requiredXp: 1300, emoji: '🏆' },
  { level: 7, title: 'اسطورهٔ متربیان', minXp: 4900, nextLevelXp: 6400, requiredXp: 1500, emoji: '👑' }
];

export function calculateLevel(totalXp: number): number {
  return Math.floor(Math.sqrt(totalXp / 100));
}

export function xpForLevel(level: number): number {
  return 100 * level * level;
}

export function getLevelConfig(level: number): XpLevelConfig {
  const config = XP_LEVELS.find((l) => l.level === level);
  if (config) return config;
  return {
    level,
    title: 'افسانه',
    minXp: xpForLevel(level),
    nextLevelXp: xpForLevel(level + 1),
    requiredXp: xpForLevel(level + 1) - xpForLevel(level),
    emoji: '🌟'
  };
}

export function buildXpSummary(totalXp: number) {
  const level = calculateLevel(totalXp);
  const currentLevelXp = xpForLevel(level);
  const nextLevelXp = xpForLevel(level + 1);
  const range = nextLevelXp - currentLevelXp;
  const progress = totalXp - currentLevelXp;
  const percent = range > 0 ? Math.min(100, Math.max(0, Math.round((progress * 100) / range))) : 100;
  return {
    level,
    title: getLevelConfig(level).title,
    emoji: getLevelConfig(level).emoji,
    currentLevelXp,
    nextLevelXp,
    levelProgressXp: progress,
    levelProgressPercent: percent
  };
}
