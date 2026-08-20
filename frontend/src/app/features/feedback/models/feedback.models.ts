export interface FeedbackDto {
  phase: PhaseType;
  title: string;
  mainText: string;
  stickerUrl?: string;
  soundUrl?: string;
  emoji?: string;
  chartData?: ChartDataPoint[];
  grade?: number;
  maxGrade?: number;
  analysis?: string;
  suggestions?: string[];
  feedbackDate: string;
  subjectName?: string;
  submissionId: number;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export type PhaseType = 'A' | 'B' | 'C' | 'D' | 'E';

export interface PhaseTransitionInfo {
  newPhase: string;
  oldPhase: string | null;
  message: string;
}
