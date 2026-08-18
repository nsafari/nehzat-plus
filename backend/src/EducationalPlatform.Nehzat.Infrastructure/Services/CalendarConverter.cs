using System.Globalization;
using EducationalPlatform.Nehzat.Application.DTOs;

namespace EducationalPlatform.Nehzat.Infrastructure.Services;

public interface ICalendarConverter
{
    CalendarDateDto ToAllCalendars(DateTime utcDateTime);
    string ToJalaliString(DateTime utcDateTime);
    string ToHijriString(DateTime utcDateTime);
    string ToGregorianString(DateTime utcDateTime);
    DateTime FromJalali(int year, int month, int day);
    DateTime FromHijri(int year, int month, int day);
}

public class CalendarConverter : ICalendarConverter
{
    private static readonly PersianCalendar PersianCalendar = new();
    private static readonly HijriCalendar HijriCalendar = new();
    private static readonly GregorianCalendar GregorianCalendar = new();

    public CalendarDateDto ToAllCalendars(DateTime utcDateTime)
    {
        return new CalendarDateDto
        {
            Gregorian = utcDateTime,
            GregorianString = ToGregorianString(utcDateTime),
            Hijri = ToHijriString(utcDateTime),
            Jalali = ToJalaliString(utcDateTime)
        };
    }

    public string ToJalaliString(DateTime utcDateTime)
    {
        var year = PersianCalendar.GetYear(utcDateTime);
        var month = PersianCalendar.GetMonth(utcDateTime);
        var day = PersianCalendar.GetDayOfMonth(utcDateTime);
        return $"{year}/{month:00}/{day:00}";
    }

    public string ToHijriString(DateTime utcDateTime)
    {
        var year = HijriCalendar.GetYear(utcDateTime);
        var month = HijriCalendar.GetMonth(utcDateTime);
        var day = HijriCalendar.GetDayOfMonth(utcDateTime);
        return $"{year}/{month:00}/{day:00}";
    }

    public string ToGregorianString(DateTime utcDateTime)
    {
        return utcDateTime.ToString("yyyy/MM/dd");
    }

    public DateTime FromJalali(int year, int month, int day)
    {
        return PersianCalendar.ToDateTime(year, month, day, 0, 0, 0, 0);
    }

    public DateTime FromHijri(int year, int month, int day)
    {
        return HijriCalendar.ToDateTime(year, month, day, 0, 0, 0, 0);
    }

    public CalendarDateDetailDto ToDetailed(DateTime utcDateTime)
    {
        var baseDate = ToAllCalendars(utcDateTime);

        return new CalendarDateDetailDto
        {
            Gregorian = baseDate.Gregorian,
            GregorianString = baseDate.GregorianString,
            Hijri = baseDate.Hijri,
            Jalali = baseDate.Jalali,
            DayOfWeekPersian = GetPersianDayOfWeek(utcDateTime.DayOfWeek),
            DayOfWeekArabic = GetArabicDayOfWeek(utcDateTime.DayOfWeek),
            MonthNameJalali = GetJalaliMonthName(PersianCalendar.GetMonth(utcDateTime)),
            MonthNameHijri = GetHijriMonthName(HijriCalendar.GetMonth(utcDateTime))
        };
    }

    private static string GetPersianDayOfWeek(DayOfWeek day) => day switch
    {
        DayOfWeek.Saturday => "شنبه",
        DayOfWeek.Sunday => "یکشنبه",
        DayOfWeek.Monday => "دوشنبه",
        DayOfWeek.Tuesday => "سه‌شنبه",
        DayOfWeek.Wednesday => "چهارشنبه",
        DayOfWeek.Thursday => "پنجشنبه",
        DayOfWeek.Friday => "جمعه",
        _ => ""
    };

    private static string GetArabicDayOfWeek(DayOfWeek day) => day switch
    {
        DayOfWeek.Saturday => "السبت",
        DayOfWeek.Sunday => "الأحد",
        DayOfWeek.Monday => "الإثنين",
        DayOfWeek.Tuesday => "الثلاثاء",
        DayOfWeek.Wednesday => "الأربعاء",
        DayOfWeek.Thursday => "الخميس",
        DayOfWeek.Friday => "الجمعة",
        _ => ""
    };

    private static string GetJalaliMonthName(int month) => month switch
    {
        1 => "فروردین", 2 => "اردیبهشت", 3 => "خرداد",
        4 => "تیر", 5 => "مرداد", 6 => "شهریور",
        7 => "مهر", 8 => "آبان", 9 => "آذر",
        10 => "دی", 11 => "بهمن", 12 => "اسفند",
        _ => ""
    };

    private static string GetHijriMonthName(int month) => month switch
    {
        1 => "محرم", 2 => "صفر", 3 => "ربیع‌الأول",
        4 => "ربیع‌الثانی", 5 => "جمادی‌الأول", 6 => "جمادی‌الثانی",
        7 => "رجب", 8 => "شعبان", 9 => "رمضان",
        10 => "شوال", 11 => "ذی‌القعدة", 12 => "ذی‌الحجة",
        _ => ""
    };
}
