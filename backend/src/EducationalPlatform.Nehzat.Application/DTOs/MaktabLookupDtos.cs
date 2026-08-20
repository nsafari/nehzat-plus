namespace EducationalPlatform.Nehzat.Application.DTOs;

public record MaktabLookupRequest(
    DateTime BirthDate,
    string Gender
);

public record MaktabLookupResponse(
    string MaktabName,
    string? MaktabNameEn,
    string Phase,
    int? RingNumber,
    int Age,
    string AgeCluster
);
