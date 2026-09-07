using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using EducationalPlatform.Nehzat.Domain.Entities;
using EducationalPlatform.Nehzat.Domain.Entities.Quran;
using EducationalPlatform.Nehzat.Infrastructure.Data;

namespace EducationalPlatform.Nehzat.Infrastructure.Seeders;

public class QuranRingSeeder
{
    private readonly AppDbContext _context;
    private readonly ILogger<QuranRingSeeder> _logger;

    public QuranRingSeeder(AppDbContext context, ILogger<QuranRingSeeder> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task SeedAsync()
    {
        if (await _context.QuranRings.AnyAsync())
        {
            _logger.LogInformation("Quran rings already seeded.");
            return;
        }

        _logger.LogInformation("Seeding Quran rings...");

        var rings = new List<QuranRing>
        {
            new()
            {
                Code = "NOVIN_1",
                Name = "حلقه نوآموز ۱ (علی‌اصغر/رقیه)",
                Description = "پس از آموزش قرآن شروع به استماع با خانواده",
                AgeGroup = "NOVICE",
                Gender = "MIXED",
                MinAge = 3,
                MaxAge = 5,
                SortOrder = 1,
                HasSpecializedPath = false,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new()
            {
                Code = "NOVIN_2",
                Name = "حلقه نوآموز ۲ (علی‌اصغر/رقیه)",
                Description = "روزانه یک صفحه با خانواده (صفحات 600-401)",
                AgeGroup = "NOVICE",
                Gender = "MIXED",
                MinAge = 4,
                MaxAge = 6,
                SortOrder = 2,
                HasSpecializedPath = false,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new()
            {
                Code = "GHASIM_1",
                Name = "حلقه قاسم/سکینه ۱",
                Description = "سوره نوح + حشر + تجوید/ترتیل + مفاهیم کلی (صفحات 400-201)",
                AgeGroup = "CHILD",
                Gender = "MIXED",
                MinAge = 6,
                MaxAge = 8,
                SortOrder = 3,
                HasSpecializedPath = false,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new()
            {
                Code = "GHASIM_2",
                Name = "حلقه قاسم/سکینه ۲",
                Description = "سوره فتح + حجرات + تجوید/ترتیل + مفاهیم کلی (صفحات 200-1) - یک ختم کامل",
                AgeGroup = "CHILD",
                Gender = "MIXED",
                MinAge = 7,
                MaxAge = 10,
                SortOrder = 4,
                HasSpecializedPath = false,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new()
            {
                Code = "RING_3",
                Name = "حلقه ۳",
                Description = "جزء سی + جزء ۲۹ — ترتیل + لغت + ترجمه + مفاهیم + استماع + حفظ (75 جلسه، حداکثر 4 ماه)",
                AgeGroup = "CHILD",
                Gender = "MIXED",
                MinAge = 8,
                MaxAge = 12,
                SortOrder = 5,
                HasSpecializedPath = false,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new()
            {
                Code = "RING_4",
                Name = "حلقه ۴",
                Description = "دو شاخه: تخصصی (2-3 جلسه، 50-70%) / عمومی (1 جلسه) — جزء سی تجزیه/صرف/حفظ + جزء 28-26",
                AgeGroup = "TEEN",
                Gender = "MIXED",
                MinAge = 10,
                MaxAge = 14,
                SortOrder = 6,
                HasSpecializedPath = true,
                SpecializedTimePercent = 50,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new()
            {
                Code = "RING_5",
                Name = "حلقه ۵",
                Description = "جزء سی + جزء 25-21 + نحو + تجزیه و ترکیب",
                AgeGroup = "TEEN",
                Gender = "MIXED",
                MinAge = 12,
                MaxAge = 16,
                SortOrder = 7,
                HasSpecializedPath = true,
                SpecializedTimePercent = 50,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new()
            {
                Code = "RING_6",
                Name = "حلقه ۶",
                Description = "جزء سی + جزء 20-16",
                AgeGroup = "TEEN",
                Gender = "MIXED",
                MinAge = 14,
                MaxAge = 18,
                SortOrder = 8,
                HasSpecializedPath = true,
                SpecializedTimePercent = 50,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new()
            {
                Code = "RING_7",
                Name = "حلقه ۷",
                Description = "جزء 15-11 — حداقل 20 جزء حفظ از حلقه 4-7 — انشالله حفظ کل",
                AgeGroup = "TEEN",
                Gender = "MIXED",
                MinAge = 16,
                MaxAge = 20,
                SortOrder = 9,
                HasSpecializedPath = true,
                SpecializedTimePercent = 50,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            }
        };

        _context.QuranRings.AddRange(rings);
        await _context.SaveChangesAsync();

        var ring3 = rings.First(r => r.Code == "RING_3");
        await SeedRing3SessionsAsync(ring3.Id);

        var ring4 = rings.First(r => r.Code == "RING_4");
        var ring5 = rings.First(r => r.Code == "RING_5");
        var ring6 = rings.First(r => r.Code == "RING_6");
        var ring7 = rings.First(r => r.Code == "RING_7");
        await SeedRing4SessionsAsync(ring4.Id);
        await SeedRing5SessionsAsync(ring5.Id);
        await SeedRing6SessionsAsync(ring6.Id);
        await SeedRing7SessionsAsync(ring7.Id);
        await SeedRingResourcesAsync(ring3.Id, ring4.Id, ring5.Id, ring6.Id, ring7.Id);

        _logger.LogInformation("Quran rings seeded successfully.");
    }

    private async Task SeedRing3SessionsAsync(int ring3Id)
    {
        var sessions = new List<QuranRingSession>();

        for (int i = 1; i <= 35; i++)
        {
            sessions.Add(new QuranRingSession
            {
                RingId = ring3Id,
                SessionNumber = i,
                Title = $"جلسه {i} - نیمه اول",
                Description = $"جلسه {i} از 35 جلسه نیمه اول جزء سی",
                StartSurahId = 78,
                EndSurahId = 78,
                StartAyah = 1,
                EndAyah = 10,
                SessionType = "REGULAR",
                IsAssessment = i is 6 or 12 or 20 or 31,
                EstimatedMinutes = 45,
                Half = "FIRST",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            });
        }

        for (int i = 36; i <= 75; i++)
        {
            sessions.Add(new QuranRingSession
            {
                RingId = ring3Id,
                SessionNumber = i,
                Title = $"جلسه {i} - نیمه دوم",
                Description = $"جلسه {i} از 75 جلسه جزء سی و بیست و نهم",
                StartSurahId = 78,
                EndSurahId = 78,
                StartAyah = 11,
                EndAyah = 20,
                SessionType = "REGULAR",
                IsAssessment = i is 45 or 55 or 75,
                EstimatedMinutes = 45,
                Half = "SECOND",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            });
        }

        _context.QuranRingSessions.AddRange(sessions);
        await _context.SaveChangesAsync();

        var stepTypes = new[] { "LISTENING", "VOCABULARY", "CONJUGATION", "SYNTAX", "TRANSLATION", "TADABBOR", "WRITING" };
        var stepTitles = new[] { "استماع", "لغت", "صرف", "نحو", "ترجمه نهایی", "تدبر", "کتابت" };
        var stepDurations = new[] { 10, 5, 5, 5, 5, 10, 5 };

        foreach (var session in sessions)
        {
            if (session.IsAssessment) continue;

            for (int stepOrder = 0; stepOrder < stepTypes.Length; stepOrder++)
            {
                _context.QuranSessionSteps.Add(new QuranSessionStep
                {
                    SessionId = session.Id,
                    StepOrder = stepOrder + 1,
                    StepType = stepTypes[stepOrder],
                    Title = stepTitles[stepOrder],
                    Description = $"مرحله {stepTitles[stepOrder]} جلسه {session.SessionNumber}",
                    EstimatedMinutes = stepDurations[stepOrder],
                    IsOptional = false,
                    CreatedAt = DateTime.UtcNow
                });
            }
        }

        await _context.SaveChangesAsync();
    }

    private static QuranRingSession MakeSession(int ringId, int num, string label, int sp, int ep, string ss, string es, int sa, int ea, string half, bool assess, int mins, int surfaces, Dictionary<string, Surah> surahs)
    {
        return new QuranRingSession
        {
            RingId = ringId,
            SessionNumber = num,
            Title = label,
            Description = label,
            StartPage = sp,
            EndPage = ep,
            StartSurahId = surahs.ContainsKey(ss) ? surahs[ss].Id : null,
            EndSurahId = surahs.ContainsKey(es) ? surahs[es].Id : null,
            StartAyah = sa,
            EndAyah = ea,
            SessionType = assess ? "ASSESSMENT" : "REGULAR",
            IsAssessment = assess,
            EstimatedMinutes = mins,
            Half = half,
            Surfaces = surfaces,
            SortOrder = num,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
    }

    private static void AddSteps(AppDbContext ctx, QuranRingSession session)
    {
        var types = new[] { "LISTENING", "VOCABULARY", "CONJUGATION", "SYNTAX", "TRANSLATION", "TADABBOR", "WRITING" };
        var titles = new[] { "\u0627\u0633\u062a\u0645\u0627\u0639", "\u0644\u063a\u062a", "\u0635\u0631\u0641", "\u0646\u062d\u0648", "\u062a\u0631\u062c\u0645\u0647 \u0646\u0647\u0627\u06cc\u06cc", "\u062a\u062f\u0628\u0631", "\u06a9\u062a\u0627\u0628\u062a" };
        var durations = new[] { 10, 5, 5, 5, 5, 10, 5 };
        for (int i = 0; i < types.Length; i++)
        {
            ctx.QuranSessionSteps.Add(new QuranSessionStep
            {
                SessionId = session.Id,
                StepOrder = i + 1,
                StepType = types[i],
                Title = titles[i],
                Description = titles[i],
                EstimatedMinutes = durations[i],
                IsOptional = false,
                CreatedAt = DateTime.UtcNow
            });
        }
    }

    private async Task SeedRing4SessionsAsync(int ringId)
    {
        var surahs = await _context.Surahs.ToDictionaryAsync(s => s.Number);
        var sessions = new List<QuranRingSession>();

        // Juz 30 review (7 sessions, pages 562-604)
        sessions.Add(MakeSession(ringId, 1, "Juz30-S1", 562, 567, "78", "79", 1, 40, "FIRST", false, 60, 30, surahs));
        sessions.Add(MakeSession(ringId, 2, "Juz30-S2", 568, 573, "79", "82", 1, 82, "FIRST", false, 60, 30, surahs));
        sessions.Add(MakeSession(ringId, 3, "Juz30-S3", 574, 579, "83", "87", 1, 19, "FIRST", false, 60, 30, surahs));
        sessions.Add(MakeSession(ringId, 4, "Juz30-Assess1", 580, 585, "88", "96", 1, 19, "FIRST", true, 60, 30, surahs));
        sessions.Add(MakeSession(ringId, 5, "Juz30-S5", 586, 591, "97", "100", 1, 11, "FIRST", false, 60, 30, surahs));
        sessions.Add(MakeSession(ringId, 6, "Juz30-S6", 592, 597, "101", "108", 1, 4, "FIRST", false, 60, 30, surahs));
        sessions.Add(MakeSession(ringId, 7, "Juz30-Final", 598, 604, "109", "114", 1, 6, "FIRST", true, 60, 30, surahs));

        // Juz 29 (3 sessions, pages 542-561)
        sessions.Add(MakeSession(ringId, 8, "Juz29-S1", 542, 548, "58", "59", 1, 24, "SECOND", false, 60, 30, surahs));
        sessions.Add(MakeSession(ringId, 9, "Juz29-Assess", 549, 555, "59", "62", 1, 11, "SECOND", true, 60, 30, surahs));
        sessions.Add(MakeSession(ringId, 10, "Juz29-S3", 556, 561, "62", "67", 1, 30, "SECOND", false, 60, 30, surahs));

        // Juz 28 (2 sessions, pages 522-541)
        sessions.Add(MakeSession(ringId, 11, "Juz28-S1", 522, 531, "50", "55", 1, 78, "SECOND", false, 60, 30, surahs));
        sessions.Add(MakeSession(ringId, 12, "Juz28-Final", 532, 541, "55", "58", 1, 29, "SECOND", true, 60, 30, surahs));

        _context.QuranRingSessions.AddRange(sessions);
        await _context.SaveChangesAsync();

        foreach (var s in sessions.Where(x => !x.IsAssessment))
            AddSteps(_context, s);
        await _context.SaveChangesAsync();
    }

    private async Task SeedRing5SessionsAsync(int ringId)
    {
        var surahs = await _context.Surahs.ToDictionaryAsync(s => s.Number);
        var sessions = new List<QuranRingSession>();

        // Juz 30 deeper analysis (5 sessions, pages 562-604)
        sessions.Add(MakeSession(ringId, 1, "Juz30-Deep1", 562, 570, "78", "80", 1, 42, "FIRST", false, 75, 45, surahs));
        sessions.Add(MakeSession(ringId, 2, "Juz30-Deep2", 571, 579, "81", "87", 1, 19, "FIRST", false, 75, 45, surahs));
        sessions.Add(MakeSession(ringId, 3, "Juz30-DeepAssess", 580, 588, "88", "99", 1, 8, "FIRST", true, 75, 45, surahs));
        sessions.Add(MakeSession(ringId, 4, "Juz30-Deep3", 589, 596, "100", "110", 1, 3, "FIRST", false, 75, 45, surahs));
        sessions.Add(MakeSession(ringId, 5, "Juz30-DeepFinal", 597, 604, "111", "114", 1, 6, "FIRST", true, 75, 45, surahs));

        // Juz 25-21 (5 sessions, pages 417-485)
        sessions.Add(MakeSession(ringId, 6, "Juz21-22", 417, 430, "33", "35", 1, 82, "SECOND", false, 75, 45, surahs));
        sessions.Add(MakeSession(ringId, 7, "Juz22-23", 431, 444, "35", "38", 1, 88, "SECOND", false, 75, 45, surahs));
        sessions.Add(MakeSession(ringId, 8, "Juz21-23-Assess", 445, 458, "38", "41", 1, 54, "SECOND", true, 75, 45, surahs));
        sessions.Add(MakeSession(ringId, 9, "Juz24-25", 459, 472, "41", "44", 1, 59, "SECOND", false, 75, 45, surahs));
        sessions.Add(MakeSession(ringId, 10, "Juz21-25-Final", 473, 485, "44", "46", 1, 35, "SECOND", true, 75, 45, surahs));

        _context.QuranRingSessions.AddRange(sessions);
        await _context.SaveChangesAsync();

        foreach (var s in sessions.Where(x => !x.IsAssessment))
            AddSteps(_context, s);
        await _context.SaveChangesAsync();
    }

    private async Task SeedRing6SessionsAsync(int ringId)
    {
        var surahs = await _context.Surahs.ToDictionaryAsync(s => s.Number);
        var sessions = new List<QuranRingSession>();

        // Juz 30 advanced (4 sessions, pages 562-604)
        sessions.Add(MakeSession(ringId, 1, "Juz30-Adv1", 562, 572, "78", "86", 1, 17, "FIRST", false, 90, 60, surahs));
        sessions.Add(MakeSession(ringId, 2, "Juz30-AdvAssess", 573, 583, "82", "91", 1, 5, "FIRST", true, 90, 60, surahs));
        sessions.Add(MakeSession(ringId, 3, "Juz30-Adv2", 584, 594, "91", "112", 1, 4, "FIRST", false, 90, 60, surahs));
        sessions.Add(MakeSession(ringId, 4, "Juz30-AdvFinal", 595, 604, "112", "114", 1, 6, "FIRST", true, 90, 60, surahs));

        // Juz 20-16 (6 sessions, pages 342-416)
        sessions.Add(MakeSession(ringId, 5, "Juz16-17", 342, 355, "21", "23", 1, 118, "SECOND", false, 90, 60, surahs));
        sessions.Add(MakeSession(ringId, 6, "Juz17-18", 356, 369, "23", "25", 1, 77, "SECOND", false, 90, 60, surahs));
        sessions.Add(MakeSession(ringId, 7, "Juz16-18-Assess", 370, 383, "25", "27", 1, 93, "SECOND", true, 90, 60, surahs));
        sessions.Add(MakeSession(ringId, 8, "Juz18-19", 384, 397, "27", "29", 1, 45, "SECOND", false, 90, 60, surahs));
        sessions.Add(MakeSession(ringId, 9, "Juz19-20", 398, 411, "29", "31", 1, 22, "SECOND", false, 90, 60, surahs));
        sessions.Add(MakeSession(ringId, 10, "Juz16-20-Final", 412, 416, "31", "33", 1, 30, "SECOND", true, 90, 60, surahs));

        _context.QuranRingSessions.AddRange(sessions);
        await _context.SaveChangesAsync();

        foreach (var s in sessions.Where(x => !x.IsAssessment))
            AddSteps(_context, s);
        await _context.SaveChangesAsync();
    }

    private async Task SeedRing7SessionsAsync(int ringId)
    {
        var surahs = await _context.Surahs.ToDictionaryAsync(s => s.Number);
        var sessions = new List<QuranRingSession>();

        // Juz 15-11 (8 sessions, pages 282-341)
        sessions.Add(MakeSession(ringId, 1, "Juz11-12", 282, 289, "15", "16", 1, 128, "FIRST", false, 90, 60, surahs));
        sessions.Add(MakeSession(ringId, 2, "Juz12-13", 290, 297, "16", "17", 1, 111, "FIRST", false, 90, 60, surahs));
        sessions.Add(MakeSession(ringId, 3, "Juz11-13-Assess", 298, 305, "17", "18", 1, 74, "FIRST", true, 90, 60, surahs));
        sessions.Add(MakeSession(ringId, 4, "Juz13-14", 306, 313, "18", "20", 1, 135, "FIRST", false, 90, 60, surahs));
        sessions.Add(MakeSession(ringId, 5, "Juz14-15", 314, 321, "20", "21", 1, 112, "SECOND", false, 90, 60, surahs));
        sessions.Add(MakeSession(ringId, 6, "Juz13-15-Assess", 322, 329, "21", "22", 1, 78, "SECOND", true, 90, 60, surahs));
        sessions.Add(MakeSession(ringId, 7, "Juz15", 330, 337, "22", "23", 1, 118, "SECOND", false, 90, 60, surahs));
        sessions.Add(MakeSession(ringId, 8, "Juz11-15-Final", 338, 341, "23", "24", 1, 20, "SECOND", true, 90, 60, surahs));

        _context.QuranRingSessions.AddRange(sessions);
        await _context.SaveChangesAsync();

        foreach (var s in sessions.Where(x => !x.IsAssessment))
            AddSteps(_context, s);
        await _context.SaveChangesAsync();
    }

    private async Task SeedRingResourcesAsync(int ring3Id, int ring4Id, int ring5Id, int ring6Id, int ring7Id)
    {
        var now = DateTime.UtcNow;
        var resources = new List<QuranRingResource>
        {
            new() { RingId = ring3Id, Title = "Resource-R3-1", ResourceType = "BOOK", Description = "Primary", IsPrimary = true, SortOrder = 1, CreatedAt = now },
            new() { RingId = ring3Id, Title = "Resource-R3-2", ResourceType = "BOOK", Description = "Dict", IsPrimary = false, SortOrder = 2, CreatedAt = now },
            new() { RingId = ring3Id, Title = "Resource-R3-3", ResourceType = "BOOK", Description = "Tafsir", IsPrimary = false, SortOrder = 3, CreatedAt = now },
            new() { RingId = ring4Id, Title = "Resource-R4-1", ResourceType = "WORKSHEET", Description = "Worksheet", IsPrimary = true, SortOrder = 1, CreatedAt = now },
            new() { RingId = ring4Id, Title = "Resource-R4-2", ResourceType = "BOOK", Description = "Translation", IsPrimary = false, SortOrder = 2, CreatedAt = now },
            new() { RingId = ring5Id, Title = "Resource-R5-1", ResourceType = "BOOK", Description = "Grammar", IsPrimary = true, SortOrder = 1, CreatedAt = now },
            new() { RingId = ring5Id, Title = "Resource-R5-2", ResourceType = "BOOK", Description = "Tafsir", IsPrimary = false, SortOrder = 2, CreatedAt = now },
            new() { RingId = ring6Id, Title = "Resource-R6-1", ResourceType = "BOOK", Description = "Advanced", IsPrimary = true, SortOrder = 1, CreatedAt = now },
            new() { RingId = ring6Id, Title = "Resource-R6-2", ResourceType = "BOOK", Description = "Tafsir", IsPrimary = false, SortOrder = 2, CreatedAt = now },
            new() { RingId = ring7Id, Title = "Resource-R7-1", ResourceType = "BOOK", Description = "Full Hifz", IsPrimary = true, SortOrder = 1, CreatedAt = now },
            new() { RingId = ring7Id, Title = "Resource-R7-2", ResourceType = "BOOK", Description = "Tafsir", IsPrimary = false, SortOrder = 2, CreatedAt = now },
            new() { RingId = ring7Id, Title = "Resource-R7-3", ResourceType = "BOOK", Description = "Qamus", IsPrimary = false, SortOrder = 3, CreatedAt = now },
        };

        _context.QuranRingResources.AddRange(resources);
        await _context.SaveChangesAsync();
    }
}
