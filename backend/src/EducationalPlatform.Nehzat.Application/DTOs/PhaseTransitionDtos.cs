namespace EducationalPlatform.Nehzat.Application.DTOs;

public record PhaseTransitionResultDto(
    string OldPhase,
    string NewPhase,
    bool HasTransitioned,
    string Message,
    int Age
);
