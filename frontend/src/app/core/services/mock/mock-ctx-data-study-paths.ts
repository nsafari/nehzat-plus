import type { Accommodation, CognitiveLevel } from '../../models/lesson-planner.models';

export const initialStudyPaths: any[] = [
  {
    id: 1,
    key: 'math-advanced',
    title: 'ریاضیات پیشرفته',
    description: 'مسیر جامع ریاضیات برای دانش‌آموزان دبیرستان',
    ageGroupId: 4,
    subjectAreaId: 1,
    cognitiveLevel: 'analysis' as CognitiveLevel,
    isActive: true,
    sortOrder: 1,
  },
  {
    id: 2,
    key: 'biology-cellular',
    title: 'زیست‌شناسی سلولی',
    description: 'مباحث پیشرفته زیست‌شناسی سلولی و مولکولی',
    ageGroupId: 3,
    subjectAreaId: 2,
    cognitiveLevel: 'understanding' as CognitiveLevel,
    isActive: true,
    sortOrder: 2,
  },
  {
    id: 3,
    key: 'persian-literature',
    title: 'ادبیات فارسی نوین',
    description: 'مروری بر ادبیات فارسی قرن بیستم',
    ageGroupId: 4,
    subjectAreaId: 3,
    cognitiveLevel: 'synthesis' as CognitiveLevel,
    isActive: true,
    sortOrder: 3,
  },
];

export const initialStudyPathSteps: any[] = [
  { id: 1, studyPathId: 1, stepOrder: 1, title: 'الجبرا', description: 'آشنایی با مفاهیم پایه الجبرا', cognitiveLevel: 'awareness' as CognitiveLevel, estimatedDurationMinutes: 600, createdAt: '2025-01-15T08:00:00Z', updatedAt: '2025-01-15T08:00:00Z' },
  { id: 2, studyPathId: 1, stepOrder: 2, title: 'هندسه', description: 'مفاهیم هندسه مدرن', cognitiveLevel: 'understanding' as CognitiveLevel, estimatedDurationMinutes: 900, createdAt: '2025-01-15T08:00:00Z', updatedAt: '2025-01-15T08:00:00Z' },
  { id: 3, studyPathId: 1, stepOrder: 3, title: 'توابع', description: 'مطالعه توابع مختلط', cognitiveLevel: 'analysis' as CognitiveLevel, estimatedDurationMinutes: 1200, createdAt: '2025-01-15T08:00:00Z', updatedAt: '2025-01-15T08:00:00Z' },
  { id: 4, studyPathId: 1, stepOrder: 4, title: 'آمار و احتمالات', description: 'احتمالات پیشرفته و آمار توصیفی', cognitiveLevel: 'understanding' as CognitiveLevel, estimatedDurationMinutes: 720, createdAt: '2025-01-15T08:00:00Z', updatedAt: '2025-01-15T08:00:00Z' },
  { id: 5, studyPathId: 1, stepOrder: 5, title: 'حل مسئله', description: 'تمرین حل مسائل پیچیده', cognitiveLevel: 'application' as CognitiveLevel, estimatedDurationMinutes: 1080, createdAt: '2025-01-15T08:00:00Z', updatedAt: '2025-01-15T08:00:00Z' },
  { id: 6, studyPathId: 2, stepOrder: 1, title: 'ساختار سلول', description: 'مورفولوژی سلول‌های گیاهی و جانوری', cognitiveLevel: 'awareness' as CognitiveLevel, estimatedDurationMinutes: 480, createdAt: '2025-01-15T08:00:00Z', updatedAt: '2025-01-15T08:00:00Z' },
  { id: 7, studyPathId: 2, stepOrder: 2, title: 'تنفس سلولی', description: 'فرآیندهای تنفس هوایی و بی‌هوا', cognitiveLevel: 'understanding' as CognitiveLevel, estimatedDurationMinutes: 720, createdAt: '2025-01-15T08:00:00Z', updatedAt: '2025-01-15T08:00:00Z' },
  { id: 8, studyPathId: 2, stepOrder: 3, title: 'تقسیم سلولی', description: 'میتوز و مهوز', cognitiveLevel: 'analysis' as CognitiveLevel, estimatedDurationMinutes: 600, createdAt: '2025-01-15T08:00:00Z', updatedAt: '2025-01-15T08:00:00Z' },
  { id: 9, studyPathId: 2, stepOrder: 4, title: 'DNA و بیولوژی مولکولی', description: 'ساختار و تابع DNA و RNA', cognitiveLevel: 'understanding' as CognitiveLevel, estimatedDurationMinutes: 900, createdAt: '2025-01-15T08:00:00Z', updatedAt: '2025-01-15T08:00:00Z' },
  { id: 10, studyPathId: 3, stepOrder: 1, title: 'ادبیات عصر مشروطه', description: 'نگام‌نگاران و آثارشان', cognitiveLevel: 'understanding' as CognitiveLevel, estimatedDurationMinutes: 720, createdAt: '2025-01-15T08:00:00Z', updatedAt: '2025-01-15T08:00:00Z' },
  { id: 11, studyPathId: 3, stepOrder: 2, title: 'ادبیات معاصر', description: 'شاعران و رمان‌نویسان معاصر', cognitiveLevel: 'analysis' as CognitiveLevel, estimatedDurationMinutes: 1200, createdAt: '2025-01-15T08:00:00Z', updatedAt: '2025-01-15T08:00:00Z' },
  { id: 12, studyPathId: 3, stepOrder: 3, title: 'تحلیل ادبی', description: 'روش‌های تحلیل و نقد ادبی', cognitiveLevel: 'analysis' as CognitiveLevel, estimatedDurationMinutes: 900, createdAt: '2025-01-15T08:00:00Z', updatedAt: '2025-01-15T08:00:00Z' },
  { id: 13, studyPathId: 3, stepOrder: 4, title: 'دستیار شاعر', description: 'آشنایی با وزن و قافیه شعر فارسی', cognitiveLevel: 'awareness' as CognitiveLevel, estimatedDurationMinutes: 1080, createdAt: '2025-01-15T08:00:00Z', updatedAt: '2025-01-15T08:00:00Z' },
];

export const initialAccommodations: Accommodation[] = [
  { id: 1, code: 'auditory', name: 'شنوایی', description: 'مناسب برای یادگیری شنوایی', icon: '🎧', createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z' },
  { id: 2, code: 'visual', name: 'بصری', description: 'مناسب برای یادگیری بصری', icon: '👁️', createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z' },
  { id: 3, code: 'kinesthetic', name: 'حس‌پذیر', description: 'مناسب برای یادگیری عملی', icon: '✋', createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z' },
  { id: 4, code: 'reading_writing', name: 'خواندن-نوشتن', description: 'متن و تمرینات نوشتاری', icon: '📝', createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z' },
];
