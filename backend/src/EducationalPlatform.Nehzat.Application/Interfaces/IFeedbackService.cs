using EducationalPlatform.Nehzat.Application.DTOs;

namespace EducationalPlatform.Nehzat.Application.Interfaces;

public interface IFeedbackService
{
    Task<FeedbackDto?> GetLatestFeedbackAsync(string userId);
    Task<List<FeedbackDto>> GetRecentFeedbacksAsync(string userId, int count = 5);
    Task<FeedbackDto?> GetSubmissionFeedbackAsync(int submissionId);
}
