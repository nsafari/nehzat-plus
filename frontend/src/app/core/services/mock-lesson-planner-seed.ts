import type {
  IssueSurvey,
  IssueSurveyQuestion,
  IssueSurveyResponse,
  IssueSurveyComment,
} from '../models/lesson-planner.models';
import { SURVEY_CATEGORIES } from './mock-lesson-planner-seed-data';

interface HasId {
  id: number;
}

export interface SeedContext {
  issueSurveys: IssueSurvey[];
  issueQuestions: IssueSurveyQuestion[];
  issueResponses: IssueSurveyResponse[];
  issueComments: IssueSurveyComment[];
  nextId: (arr: HasId[]) => number;
  now: () => string;
}

function generateLikertScore(category: string): number {
  const weights: Record<string, number[]> = {
    'والدین و خانواده': [1, 2, 2, 3, 3, 4],
    'سازماندهی و مستندسازی': [1, 2, 2, 3, 3, 4],
    'منابع مالی و مشاوره': [1, 2, 2, 3, 3, 4],
    آموزشی: [1, 2, 3, 3, 4, 4, 5],
    فرهنگی: [1, 2, 3, 3, 4, 5],
    'خط و خوشنویسی': [1, 2, 3, 3, 4, 5],
    ارتباطات: [1, 2, 2, 3, 3, 4],
    معلمان: [1, 2, 3, 3, 4, 4, 5],
    آموزجوها: [1, 2, 3, 3, 4, 5],
    'متغیرهای دیگر': [1, 2, 2, 3, 3, 4],
  };
  const options = weights[category] ?? [1, 2, 3, 4, 5];
  return options[Math.floor(Math.random() * options.length)];
}

function seedQuestions(ctx: SeedContext, now: string): void {
  let qId = 1;
  for (const cat of SURVEY_CATEGORIES) {
    for (let i = 0; i < cat.questions.length; i++) {
      ctx.issueQuestions.push({
        id: qId++,
        surveyId: 1,
        questionText: cat.questions[i],
        category: cat.name,
        subCategory: '',
        targetAudience: 'متربی',
        sortOrder: i,
        isActive: true,
        createdAt: now,
      });
    }
  }
}

const RESPONDENT_NAMES = [
  'علی احمدی',
  'فاطمه محمدی',
  'محمد رضایی',
  'مریم کریمی',
  'رضا حسینی',
  'زهرا علیپور',
  'امیرحسین نوری',
  'سارا موسوی',
  'مهدی کریمی',
  'نیلوفر احمدی',
  'امیرمهدی رضایی',
  'شیرین محمدی',
  'کیانوش طاهری',
  'مریم احمدی',
  'سجاد کریمی',
  'فاطمه موسوی',
  'رضا محمدی',
  'مهسا کریمی',
  'امیرحسین مهدوی',
  'زهرا نوری',
  'مریم حسینی',
  'امیررضا موسوی',
  'سارا علیپور',
  'مهدی احمدی',
  'نیلوفر کریمی',
  'کیانوش احمدی',
];

const COMMENT_TEXTS = [
  'نظرسنجی بسیار مفید و بینش‌آور بود.',
  'توصیه می‌کنم سال‌های بعد ادامه یابد.',
  'نیاز به بهبود در بخش زیرساخت هستند.',
  'از کیفیت آموزش راضی هستم.',
  'پیشنهاد تغییر برنامه درسی برای بهبود.',
];

function seedResponses(ctx: SeedContext, now: string): void {
  for (let r = 0; r < RESPONDENT_NAMES.length; r++) {
    const respondentId = r + 1;
    const responsesPerRespondent = 129;
    for (let i = 0; i < responsesPerRespondent && i < ctx.issueQuestions.length; i++) {
      const qIndex = (respondentId * 7 + i * 13) % ctx.issueQuestions.length;
      const question = ctx.issueQuestions[qIndex];
      if (!question) continue;

      const score = generateLikertScore(question.category);
      ctx.issueResponses.push({
        id: ctx.nextId(ctx.issueResponses) + i,
        surveyId: 1,
        questionId: question.id,
        questionText: question.questionText,
        respondentId,
        respondentRole: 'student',
        respondentBranchId: respondentId,
        score,
        answeredAt: now,
      });
    }
  }
}

function seedComments(ctx: SeedContext, now: string): void {
  for (let r = 0; r < RESPONDENT_NAMES.length; r++) {
    const respondentId = r + 1;
    const respondentName = RESPONDENT_NAMES[r];
    if (respondentId <= 5) {
      ctx.issueComments.push({
        id: ctx.nextId(ctx.issueComments),
        surveyId: 1,
        respondentId,
        respondentName,
        comment: COMMENT_TEXTS[respondentId % COMMENT_TEXTS.length],
        isPublic: true,
        createdAt: now,
      });
    }
  }
}

export function seedSurveyData(ctx: SeedContext): void {
  const now = ctx.now();
  seedQuestions(ctx, now);
  seedResponses(ctx, now);
  seedComments(ctx, now);
}
