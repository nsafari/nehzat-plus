using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities;

[Table("Nehzat_question_bank")]
public class Question
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Column(TypeName = "nvarchar(max)")]
    public string Text { get; set; } = string.Empty;

    [Column(TypeName = "nvarchar(100)")]
    public string Category { get; set; } = string.Empty;

    [Column(TypeName = "nvarchar(50)")]
    public string Difficulty { get; set; } = "medium";

    [Column(TypeName = "nvarchar(20)")]
    public string Type { get; set; } = "multiple_choice";

    [Column(TypeName = "nvarchar(max)")]
    public string OptionsJson { get; set; } = "[]";

    [Column(TypeName = "nvarchar(500)")]
    public string CorrectAnswer { get; set; } = string.Empty;

    public int Points { get; set; } = 10;

    public int CreatedByUserId { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public User CreatedBy { get; set; } = null!;
}

[Table("Nehzat_random_evaluations")]
public class RandomEvaluation
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public int StudentId { get; set; }

    public Student Student { get; set; } = null!;

    [Column(TypeName = "nvarchar(100)")]
    public string Title { get; set; } = string.Empty;

    [Column(TypeName = "nvarchar(50)")]
    public string Category { get; set; } = string.Empty;

    public DateTime StartedAt { get; set; } = DateTime.UtcNow;

    public DateTime? CompletedAt { get; set; }

    public int TotalQuestions { get; set; }

    public int CorrectAnswers { get; set; }

    public decimal TotalScore { get; set; }

    [Column(TypeName = "nvarchar(20)")]
    public string Status { get; set; } = "in_progress";

    public virtual ICollection<EvaluationAnswer> Answers { get; set; } = new List<EvaluationAnswer>();
}

[Table("Nehzat_evaluation_answers")]
public class EvaluationAnswer
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public int RandomEvaluationId { get; set; }

    public RandomEvaluation RandomEvaluation { get; set; } = null!;

    public int QuestionId { get; set; }

    public Question Question { get; set; } = null!;

    [Column(TypeName = "nvarchar(500)")]
    public string AnswerText { get; set; } = string.Empty;

    public bool IsCorrect { get; set; }

    public int PointsEarned { get; set; }

    public DateTime AnsweredAt { get; set; } = DateTime.UtcNow;
}
