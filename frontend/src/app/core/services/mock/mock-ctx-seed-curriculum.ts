import type { SubjectArea, TeachingMethod } from '../../models/lesson-planner.models';

export interface CurriculumSeedContext {
  subjectAreas: SubjectArea[];
  teachingMethods: TeachingMethod[];
  now: () => string;
}

export function seedCurriculumData(ctx: CurriculumSeedContext): void {
  const now = ctx.now();
  const subjectAreaData = [
    {
      key: 'quran',
      name: 'قرآن',
      description: 'آموزش قرآن کریم شامل روخوانی، روان‌خوانی، تجوید و حفظ',
      sortOrder: 1,
    },
    {
      key: 'ahkam',
      name: 'احکام',
      description: 'آموزش احکام شرعی بر اساس رساله مرجع تقلید',
      sortOrder: 2,
    },
    { key: 'aqayed', name: 'عقاید', description: 'آموزش مبانی اعتقادی و اصول دین', sortOrder: 3 },
    { key: 'akhlaq', name: 'اخلاق', description: 'آموزش مبانی اخلاقی و تهذیب نفس', sortOrder: 4 },
    { key: 'tarikh', name: 'تاریخ', description: 'آموزش تاریخ اسلام و تشیع', sortOrder: 5 },
    {
      key: 'sireh',
      name: 'سیره معصومین',
      description: 'آموزش سیره و زندگی معصومین',
      sortOrder: 6,
    },
    { key: 'manteq', name: 'منطق', description: 'آموزش علم منطق و قواعد استدلال', sortOrder: 7 },
    { key: 'falsafeh', name: 'فلسفه', description: 'آموزش مبانی فلسفه اسلامی', sortOrder: 8 },
    { key: 'feqh', name: 'فقه', description: 'آموزش فقه استدلالی و مسائل شرعی', sortOrder: 9 },
    { key: 'osul', name: 'اصول', description: 'آموزش اصول فقه و مبانی استنباط', sortOrder: 10 },
    {
      key: 'tajvid',
      name: 'تجوید',
      description: 'آموزش قواعد تجوید و قرائت صحیح قرآن',
      sortOrder: 11,
    },
    { key: 'tfsir', name: 'تفسیر', description: 'آموزش تفسیر قرآن کریم', sortOrder: 12 },
    { key: 'hadith', name: 'حدیث', description: 'آموزش علوم حدیث و متون روایی', sortOrder: 13 },
    {
      key: 'erfan',
      name: 'عرفان',
      description: 'آموزش عرفان اسلامی و سیر و سلوک',
      sortOrder: 14,
    },
    { key: 'lughat', name: 'لغت عربی', description: 'آموزش لغت و صرف و نحو عربی', sortOrder: 15 },
    {
      key: 'balaghah',
      name: 'بلاغت',
      description: 'آموزش علوم بلاغی (معانی، بیان، بدیع)',
      sortOrder: 16,
    },
    {
      key: 'tarbiat',
      name: 'تربیت',
      description: 'آموزش مبانی تربیتی و روش‌های پرورش',
      sortOrder: 17,
    },
    {
      key: 'ejtemae',
      name: 'اجتماعی',
      description: 'آموزش مبانی اجتماعی و سیاسی اسلام',
      sortOrder: 18,
    },
    {
      key: 'tarbiat-badani',
      name: 'تربیت بدنی',
      description: 'آموزش ورزش و تربیت بدنی',
      sortOrder: 19,
    },
    {
      key: 'fani-va-herfeh',
      name: 'فنی و حرفه‌ای',
      description: 'آموزش مهارت‌های فنی و حرفه‌ای',
      sortOrder: 20,
    },
  ];
  subjectAreaData.forEach((d, i) => {
    ctx.subjectAreas.push({ id: i + 1, ...d, createdAt: now });
  });

  const teachingMethodData = [
    {
      key: 'lecture',
      name: 'سخنرانی',
      description: 'ارائه مطالب توسط مربی به صورت شفاهی',
      sortOrder: 1,
    },
    { key: 'qa', name: 'پرسش و پاسخ', description: 'تعامل دوسویه مربی و متربی', sortOrder: 2 },
    { key: 'discussion', name: 'بحث گروهی', description: 'بحث و گفتگوی گروهی', sortOrder: 3 },
    { key: 'memorization', name: 'حفظ', description: 'حفظ آیات، روایات یا اشعار', sortOrder: 4 },
    {
      key: 'practice',
      name: 'تمرین عملی',
      description: 'انجام تمرین عملی توسط متربی',
      sortOrder: 5,
    },
    {
      key: 'storytelling',
      name: 'قصه‌گویی',
      description: 'بیان داستان‌های آموزنده',
      sortOrder: 6,
    },
    { key: 'roleplay', name: 'نقش‌آفرینی', description: 'ایفای نقش توسط متربیان', sortOrder: 7 },
    { key: 'project', name: 'پروژه تحقیقاتی', description: 'انجام تحقیق و پروژه', sortOrder: 8 },
    {
      key: 'visual',
      name: 'تصویری',
      description: 'استفاده از تصاویر و فیلم‌های آموزشی',
      sortOrder: 9,
    },
    { key: 'recitation', name: 'تلاوت', description: 'تلاوت و شنیدن قرآن', sortOrder: 10 },
    { key: 'writing', name: 'نوشتاری', description: 'انجام تکالیف کتبی و انشا', sortOrder: 11 },
    {
      key: 'gamification',
      name: 'بازی و سرگرمی',
      description: 'آموزش از طریق بازی و مسابقه',
      sortOrder: 12,
    },
    {
      key: 'field-trip',
      name: 'بازدید و اردو',
      description: 'آموزش در محیط بیرون',
      sortOrder: 13,
    },
    {
      key: 'peer-learning',
      name: 'یادگیری همتا',
      description: 'آموزش توسط هم‌کلاسی‌ها',
      sortOrder: 14,
    },
    { key: 'questionnaire', name: 'پرسشنامه', description: 'استفاده از پرسشنامه', sortOrder: 15 },
    {
      key: 'demonstration',
      name: 'نمایش عملی',
      description: 'اجرای عملی توسط مربی',
      sortOrder: 16,
    },
    {
      key: 'brainstorming',
      name: 'طوفان فکری',
      description: 'تولید ایده توسط گروه',
      sortOrder: 17,
    },
    {
      key: 'problem-solving',
      name: 'حل مسئله',
      description: 'ارائه مسئله و یافتن راه حل',
      sortOrder: 18,
    },
  ];
  teachingMethodData.forEach((d, i) => {
    ctx.teachingMethods.push({ id: i + 1, ...d, createdAt: now });
  });
}
