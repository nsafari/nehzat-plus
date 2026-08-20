using Microsoft.EntityFrameworkCore;
using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Domain.Entities;
using EducationalPlatform.Nehzat.Infrastructure.Data;

namespace EducationalPlatform.Nehzat.Infrastructure.Services;

public class MaktabLookupService : IMaktabLookupService
{
    private readonly AppDbContext _db;

    public MaktabLookupService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<MaktabLookupResponse> DetermineMaktabAsync(DateTime birthDate, string gender)
    {
        var age = CalculateAge(birthDate);
        var normalizedGender = NormalizeGender(gender);

        var lookup = await _db.MaktabLookups
            .Where(l => l.Gender == normalizedGender && l.AgeMin <= age && l.AgeMax >= age)
            .FirstOrDefaultAsync();

        if (lookup == null)
            throw new KeyNotFoundException($"مکتبی برای جنسیت '{gender}' و سن '{age}' یافت نشد.");

        int? ringNumber = null;
        if (lookup.Phase == "E")
        {
            ringNumber = age - 13;
            if (ringNumber < 1 || ringNumber > 8)
                ringNumber = null;
        }

        var ageCluster = GetAgeCluster(age);

        return new MaktabLookupResponse(
            lookup.MaktabName,
            lookup.MaktabNameEn,
            lookup.Phase,
            ringNumber,
            age,
            ageCluster
        );
    }

    public async Task<List<MaktabLookupResponse>> GetAllLookupsAsync()
    {
        var lookups = await _db.MaktabLookups
            .OrderBy(l => l.Phase)
            .ThenBy(l => l.Gender)
            .ToListAsync();

        return lookups.Select(l => new MaktabLookupResponse(
            l.MaktabName,
            l.MaktabNameEn,
            l.Phase,
            null,
            0,
            l.Phase
        )).ToList();
    }

    private static int CalculateAge(DateTime birthDate)
    {
        var today = DateTime.UtcNow;
        var age = today.Year - birthDate.Year;
        if (birthDate.Date > today.AddYears(-age)) age--;
        return age;
    }

    private static string NormalizeGender(string gender)
    {
        return gender.ToLower() switch
        {
            "male" or "m" or "پسر" or "مرد" => "male",
            "female" or "f" or "دختر" or "زن" => "female",
            _ => gender.ToLower()
        };
    }

    private static string GetAgeCluster(int age)
    {
        return age switch
        {
            >= 5 and <= 6 => "A",
            >= 7 and <= 8 => "B",
            >= 9 and <= 11 => "C",
            >= 12 and <= 13 => "D",
            >= 14 and <= 21 => "E",
            _ => "unknown"
        };
    }
}
