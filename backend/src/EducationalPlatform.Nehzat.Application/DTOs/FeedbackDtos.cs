namespace EducationalPlatform.Nehzat.Application.DTOs;

public record FeedbackDto
{
    public string Phase { get; init; } = string.Empty;
    public string Title { get; init; } = string.Empty;
    public string MainText { get; init; } = string.Empty;
    public string? Emoji { get; init; }
    public int Grade { get; init; }
    public int MaxGrade { get; init; } = 100;
    public List<ChartDataPointDto> ChartData { get; init; } = new();
    public string? Analysis { get; init; }
    public List<string>? Suggestions { get; init; }
    public string? SubjectName { get; init; }
    public DateTime FeedbackDate { get; init; }
    public int SubmissionId { get; init; }
}

public record ChartDataPointDto
{
    public string Label { get; init; } = string.Empty;
    public double Value { get; init; }
    public string? Color { get; init; }
}
