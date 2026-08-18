import moment from 'moment-jalaali';
import type { Moment } from 'moment';
import 'moment-hijri';

export interface TripleDate {
  gregorian: string;
  hijri: string;
  jalali: string;
}

export interface TripleDateDetail extends TripleDate {
  dayOfWeekPersian: string;
  dayOfWeekArabic: string;
  monthNameJalali: string;
  monthNameHijri: string;
}

const PERSIAN_DAYS = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'];
const ARABIC_DAYS = ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];

const JALALI_MONTHS = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
];

const HIJRI_MONTHS = [
  'محرم', 'صفر', 'ربیع‌الأول', 'ربیع‌الثانی', 'جمادی‌الأول', 'جمادی‌الثانی',
  'رجب', 'شعبان', 'رمضان', 'شوال', 'ذی‌القعدة', 'ذی‌الحجة'
];

export function toTripleDate(date: string | Date | Moment): TripleDate {
  const m = moment(date);
  return {
    gregorian: m.format('YYYY/MM/DD'),
    hijri: (m as any).format('iYYYY/iMM/iDD'),
    jalali: m.format('jYYYY/jMM/jDD'),
  };
}

export function toTripleDateDetail(date: string | Date | Moment): TripleDateDetail {
  const m = moment(date);
  const base = toTripleDate(m);
  const dayIndex = m.day();
  const jalaliMonth = parseInt(m.format('jM')) - 1;
  const hijriMonth = parseInt((m as any).format('iM')) - 1;

  return {
    ...base,
    dayOfWeekPersian: PERSIAN_DAYS[dayIndex] || '',
    dayOfWeekArabic: ARABIC_DAYS[dayIndex] || '',
    monthNameJalali: JALALI_MONTHS[jalaliMonth] || '',
    monthNameHijri: HIJRI_MONTHS[hijriMonth] || '',
  };
}

export function getJalaliMonthDays(year: number, month: number): Date[] {
  const days: Date[] = [];
  const firstDay = moment(`${year}/${month}/01`, 'jYYYY/jM/jD').toDate();
  const daysInMonth = moment(firstDay).daysInMonth();

  for (let i = 0; i < daysInMonth; i++) {
    const day = moment(firstDay).add(i, 'days').toDate();
    days.push(day);
  }

  return days;
}

export function getHijriMonthDays(year: number, month: number): Date[] {
  const days: Date[] = [];
  const firstDay = (moment as any)(`${year}/${month}/01`, 'iYYYY/iM/iD').toDate();
  const daysInMonth = (moment as any)(firstDay).iDaysInMonth();

  for (let i = 0; i < daysInMonth; i++) {
    const day = moment(firstDay).add(i, 'days').toDate();
    days.push(day);
  }

  return days;
}

export function getHijriOccasion(year: number, month: number, day: number): string | null {
  const occasions: Record<string, string> = {
    '1/1': 'سالروز هجرت پیامبر',
    '1/9': 'تاسوعای حسینی',
    '1/10': 'عاشورای حسینی',
    '2/20': 'اربعین حسینی',
    '2/28': 'رحلت پیامبر اکرم',
    '2/30': 'شهادت امام رضا (ع)',
    '3/8': 'شهادت امام حسن عسکری (ع)',
    '3/17': 'ولادت پیامبر اکرم و امام صادق (ع)',
    '7/13': 'ولادت امام علی (ع)',
    '7/15': 'وفات حضرت زینب (س)',
    '8/3': 'ولادت امام حسین (ع)',
    '8/4': 'ولادت حضرت ابوالفضل (ع)',
    '8/11': 'ولادت امام سجاد (ع)',
    '9/15': 'ولادت امام حسن (ع)',
    '9/21': 'شهادت امام علی (ع)',
    '10/1': 'عید فطر',
    '10/25': 'شهادت امام صادق (ع)',
    '12/10': 'عید قربان',
    '12/18': 'عید غدیر',
  };

  return occasions[`${month}/${day}`] || null;
}
