using Microsoft.EntityFrameworkCore;
using EducationalPlatform.Nehzat.Domain.Entities;
using EducationalPlatform.Nehzat.Infrastructure.Data;

namespace EducationalPlatform.Nehzat.Infrastructure.Seeders;

public class XpDataSeeder
{
    private readonly AppDbContext _db;

    public XpDataSeeder(AppDbContext db)
    {
        _db = db;
    }

    public async Task SeedAsync()
    {
        if (await _db.XpBadges.AnyAsync())
            return;

        var now = DateTime.UtcNow;
        var badges = new List<XpBadge>
        {
            new()
            {
                Code = "progress.sprout",
                Name = "آغاز راه",
                Description = "اولین قدم‌ها در مسیر رشد",
                Icon = "🌱",
                XpMilestone = 100,
                Category = "progress",
                IsActive = true,
                CreatedAt = now,
                UpdatedAt = now
            },
            new()
            {
                Code = "progress.learner",
                Name = "متربیِ کوشا",
                Description = "گردآوری ۵۰۰ امتیاز تجربه",
                Icon = "📖",
                XpMilestone = 500,
                Category = "progress",
                IsActive = true,
                CreatedAt = now,
                UpdatedAt = now
            },
            new()
            {
                Code = "progress.active",
                Name = "نشانِ پیشرفت",
                Description = "گردآوری ۱۰۰۰ امتیاز تجربه",
                Icon = "⭐",
                XpMilestone = 1000,
                Category = "progress",
                IsActive = true,
                CreatedAt = now,
                UpdatedAt = now
            },
            new()
            {
                Code = "progress.skilled",
                Name = "کارآزموده",
                Description = "گردآوری ۲۵۰۰ امتیاز تجربه",
                Icon = "💪",
                XpMilestone = 2500,
                Category = "progress",
                IsActive = true,
                CreatedAt = now,
                UpdatedAt = now
            },
            new()
            {
                Code = "quran.reciter",
                Name = "قهرمان قرآن",
                Description = "تداوم در برنامه‌های قرآنی",
                Icon = "🎧",
                XpMilestone = 2500,
                Category = "quran",
                IsActive = true,
                CreatedAt = now,
                UpdatedAt = now
            },
            new()
            {
                Code = "math.master",
                Name = "استاد ریاضی",
                Description = "استادی در تمرین‌های ریاضی",
                Icon = "🧮",
                XpMilestone = 2500,
                Category = "math",
                IsActive = true,
                CreatedAt = now,
                UpdatedAt = now
            },
            new()
            {
                Code = "progress.master",
                Name = "استادِ نشان‌ها",
                Description = "گردآوری ۵۰۰۰ امتیاز تجربه",
                Icon = "🏆",
                XpMilestone = 5000,
                Category = "progress",
                IsActive = true,
                CreatedAt = now,
                UpdatedAt = now
            },
            new()
            {
                Code = "behavior.persistent",
                Name = "بااراده",
                Description = "پایداری و استمرار در مسیر تربیت",
                Icon = "🎯",
                XpMilestone = 5000,
                Category = "behavior",
                IsActive = true,
                CreatedAt = now,
                UpdatedAt = now
            },
            new()
            {
                Code = "progress.legend",
                Name = "اسطوره‌ی متربیان",
                Description = "گردآوری ۱۰۰۰۰ امتیاز تجربه",
                Icon = "👑",
                XpMilestone = 10000,
                Category = "progress",
                IsActive = true,
                CreatedAt = now,
                UpdatedAt = now
            },
            new()
            {
                Code = "creativity.star",
                Name = "خلاقِ کوچک",
                Description = "کشف استعدادهای هنری و خلاقانه",
                Icon = "🎨",
                XpMilestone = 10000,
                Category = "creativity",
                IsActive = true,
                CreatedAt = now,
                UpdatedAt = now
            }
        };

        _db.XpBadges.AddRange(badges);
        await _db.SaveChangesAsync();
    }
}