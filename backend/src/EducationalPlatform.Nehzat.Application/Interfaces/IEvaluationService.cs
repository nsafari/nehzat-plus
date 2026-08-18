using EducationalPlatform.Nehzat.Application.DTOs;

namespace EducationalPlatform.Nehzat.Application.Interfaces;

public interface IEvaluationService
{
    // Question Bank
    Task<List<QuestionDto>> GetQuestionsAsync(int userId, string? category = null, string? difficulty = null);
    Task<QuestionDto> CreateQuestionAsync(int userId, CreateQuestionRequest req);
    Task DeleteQuestionAsync(int userId, int questionId);

    // Evaluations
    Task<RandomEvaluationDto> StartEvaluationAsync(int userId, StartEvaluationRequest req);
    Task<RandomEvaluationDto> GetEvaluationAsync(int userId, int evaluationId);
    Task<RandomEvaluationDto> SubmitAnswersAsync(int userId, SubmitAnswersRequest req);
    Task<List<RandomEvaluationDto>> GetMyEvaluationsAsync(int userId, int limit = 20);
    Task<EvaluationStatsDto> GetStatsAsync(int userId);
}