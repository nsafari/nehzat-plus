namespace EducationalPlatform.Nehzat.Application.DTOs;

public class QuestionDto
{
    public int Id { get; set; }
    public string Text { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Difficulty { get; set; } = "medium";
    public string Type { get; set; } = "multiple_choice";
    public List<string> Options { get; set; } = new();
    public string CorrectAnswer { get; set; } = string.Empty;
    public int Points { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateQuestionRequest
{
    public string Text { get; set; } = string.Empty;
    public string Category { get; set; } = "math";
    public string Difficulty { get; set; } = "medium";
    public string Type { get; set; } = "multiple_choice";
    public List<string> Options { get; set; } = new();
    public string CorrectAnswer { get; set; } = string.Empty;
    public int Points { get; set; } = 10;
}

public class RandomEvaluationDto
{
    public int Id { get; set; }
    public int StudentId { get; set; }
    public string StudentName { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public DateTime StartedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public int TotalQuestions { get; set; }
    public int CorrectAnswers { get; set; }
    public decimal TotalScore { get; set; }
    public string Status { get; set; } = "in_progress";
    public List<EvaluationQuestionDto> Questions { get; set; } = new();
    public List<EvaluationAnswerDto> Answers { get; set; } = new();
}

public class EvaluationQuestionDto
{
    public int QuestionId { get; set; }
    public string Text { get; set; } = string.Empty;
    public List<string> Options { get; set; } = new();
    public int Points { get; set; }
}

public class EvaluationAnswerDto
{
    public int QuestionId { get; set; }
    public string AnswerText { get; set; } = string.Empty;
    public bool IsCorrect { get; set; }
    public int PointsEarned { get; set; }
}

public class StartEvaluationRequest
{
    public int StudentId { get; set; }
    public string Category { get; set; } = "math";
    public int QuestionCount { get; set; } = 10;
}

public class SubmitAnswersRequest
{
    public int RandomEvaluationId { get; set; }
    public List<EvaluationAnswerDto> Answers { get; set; } = new();
}

public class EvaluationStatsDto
{
    public int TotalEvaluations { get; set; }
    public int CompletedEvaluations { get; set; }
    public int TotalQuestions { get; set; }
    public Dictionary<string, int> CategoryBreakdown { get; set; } = new();
    public List<EvaluationTrendPointDto> ScoreTrend { get; set; } = new();
}

public class EvaluationTrendPointDto
{
    public DateTime Date { get; set; }
    public decimal AverageScore { get; set; }
}