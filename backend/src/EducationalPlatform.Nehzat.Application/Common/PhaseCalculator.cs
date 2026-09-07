namespace EducationalPlatform.Nehzat.Application.Common;

public static class PhaseCalculator
{
    public static string GetPhase(DateTime? dateOfBirth)
    {
        if (dateOfBirth is null) return "A";

        var age = CalculateAge(dateOfBirth.Value);

        return age switch
        {
            <= 6 => "A",
            <= 8 => "B",
            <= 11 => "C",
            <= 13 => "D",
            _ => "E"
        };
    }

    public static int CalculateAge(DateTime dateOfBirth)
    {
        var today = DateTime.UtcNow;
        var age = today.Year - dateOfBirth.Year;
        if (dateOfBirth.Date > today.AddYears(-age)) age--;
        return age;
    }

    public static int GetRingNumber(int age)
    {
        if (age < 14) return 0;
        return age - 13;
    }
}
