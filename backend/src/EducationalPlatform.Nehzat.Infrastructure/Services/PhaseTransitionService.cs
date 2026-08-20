using Microsoft.EntityFrameworkCore;
using EducationalPlatform.Nehzat.Application.Common;
using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Infrastructure.Data;

namespace EducationalPlatform.Nehzat.Infrastructure.Services;

public class PhaseTransitionService : IPhaseTransitionService
{
    private readonly AppDbContext _db;

    public PhaseTransitionService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<PhaseTransitionResultDto?> CheckAndTransitionAsync(int userId)
    {
        var user = await _db.Users.FindAsync(userId);
        if (user?.StudentId is null) return null;

        var student = await _db.Students.FindAsync(user.StudentId.Value);
        if (student is null) return null;

        var oldPhase = student.Phase ?? "A";
        var newPhase = PhaseCalculator.GetPhase(student.DateOfBirth);
        var age = PhaseCalculator.CalculateAge(student.DateOfBirth ?? DateTime.MinValue);
        var hasTransitioned = oldPhase != newPhase;

        if (hasTransitioned)
        {
            student.Phase = newPhase;
            student.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();
        }

        return new PhaseTransitionResultDto(
            OldPhase: oldPhase,
            NewPhase: newPhase,
            HasTransitioned: hasTransitioned,
            Message: hasTransitioned
                ? $"فاز شما از {GetPhaseName(oldPhase)} به {GetPhaseName(newPhase)} تغییر یافت"
                : $"شما همچنان در فاز {GetPhaseName(newPhase)} هستید",
            Age: age
        );
    }

    public async Task<int> CheckAllAsync()
    {
        var students = await _db.Students
            .Where(s => s.Status == "active" && s.DateOfBirth != null)
            .ToListAsync();

        var transitions = 0;
        foreach (var student in students)
        {
            var oldPhase = student.Phase ?? "A";
            var newPhase = PhaseCalculator.GetPhase(student.DateOfBirth);
            if (oldPhase != newPhase)
            {
                student.Phase = newPhase;
                student.UpdatedAt = DateTime.UtcNow;
                transitions++;
            }
        }

        if (transitions > 0)
            await _db.SaveChangesAsync();

        return transitions;
    }

    private static string GetPhaseName(string phase) => phase switch
    {
        "A" => "فاز اول (۵-۶ سال)",
        "B" => "فاز دوم (۷-۸ سال)",
        "C" => "فاز سوم (۹-۱۱ سال)",
        "D" => "فاز چهارم (۱۲-۱۳ سال)",
        "E" => "فاز پنجم (۱۴-۲۱ سال)",
        _ => phase
    };
}
