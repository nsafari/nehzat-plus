export const SRS_MIN_EASE_FACTOR = 1.3;
export const SRS_DEFAULT_EASE_FACTOR = 2.5;
export const SRS_MAX_INTERVAL_DAYS = 365;

export type SrsQuality = 1 | 2 | 3 | 4;

export interface SrsCardState {
  interval: number;
  easeFactor: number;
  repetition: number;
}

export interface SrsScheduleResult extends SrsCardState {
  nextReviewAt: string;
}

export const SRS_QUALITY_LABELS: Record<SrsQuality, string> = {
  1: 'دوباره',
  2: 'سخت',
  3: 'خوب',
  4: 'آسان'
};

export function calculateEaseFactor(currentEaseFactor: number, quality: SrsQuality): number {
  const next = currentEaseFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  return Math.max(SRS_MIN_EASE_FACTOR, next);
}

export function getNextReviewInterval(
  currentInterval: number,
  easeFactor: number,
  repetition: number
): number {
  if (repetition <= 0) return 1;
  if (repetition === 1) return 3;
  if (repetition === 2) return 7;
  if (repetition === 3) return 21;
  return Math.min(
    Math.max(1, Math.round(currentInterval * easeFactor)),
    SRS_MAX_INTERVAL_DAYS
  );
}

export function scheduleReview(quality: SrsQuality, current?: SrsCardState): SrsScheduleResult {
  const easeFactor = calculateEaseFactor(current?.easeFactor ?? SRS_DEFAULT_EASE_FACTOR, quality);

  if (quality < 3) {
    return {
      interval: 1,
      easeFactor,
      repetition: 0,
      nextReviewAt: addDays(new Date(), 1).toISOString()
    };
  }

  const repetition = (current?.repetition ?? 0) + 1;
  const interval = getNextReviewInterval(current?.interval ?? 0, easeFactor, repetition);

  return {
    interval,
    easeFactor,
    repetition,
    nextReviewAt: addDays(new Date(), interval).toISOString()
  };
}

export function getNextReviewDateLabel(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('fa-IR', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}