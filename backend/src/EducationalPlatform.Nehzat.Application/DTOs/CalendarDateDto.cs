namespace EducationalPlatform.Nehzat.Application.DTOs;

public class CalendarDateDto
{
    public DateTime Gregorian { get; set; }
    public string GregorianString { get; set; } = string.Empty;
    public string Hijri { get; set; } = string.Empty;
    public string Jalali { get; set; } = string.Empty;
}

public class CalendarDateDetailDto : CalendarDateDto
{
    public string DayOfWeekPersian { get; set; } = string.Empty;
    public string DayOfWeekArabic { get; set; } = string.Empty;
    public string MonthNameJalali { get; set; } = string.Empty;
    public string MonthNameHijri { get; set; } = string.Empty;
}
