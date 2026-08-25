namespace EducationalPlatform.Nehzat.Application.DTOs;

public class QuranRingDto
{
    public int Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string AgeGroup { get; set; } = string.Empty;
    public string? Gender { get; set; }
    public int? MinAge { get; set; }
    public int? MaxAge { get; set; }
    public int SortOrder { get; set; }
    public bool IsActive { get; set; }
    public bool HasSpecializedPath { get; set; }
    public int? SpecializedPeriods { get; set; }
    public int? SpecializedTimePercent { get; set; }
    public DateTime CreatedAt { get; set; }
    public List<QuranRingSessionDto> Sessions { get; set; } = [];
    public List<QuranRingSurahDto> RingSurahs { get; set; } = [];
    public List<QuranRingResourceDto> Resources { get; set; } = [];
}

public class CreateQuranRingRequest
{
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string AgeGroup { get; set; } = string.Empty;
    public string? Gender { get; set; }
    public int? MinAge { get; set; }
    public int? MaxAge { get; set; }
    public int SortOrder { get; set; }
    public bool HasSpecializedPath { get; set; }
    public int? SpecializedPeriods { get; set; }
    public int? SpecializedTimePercent { get; set; }
}

public class UpdateQuranRingRequest
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    public string? AgeGroup { get; set; }
    public string? Gender { get; set; }
    public int? MinAge { get; set; }
    public int? MaxAge { get; set; }
    public int? SortOrder { get; set; }
    public bool? IsActive { get; set; }
    public bool? HasSpecializedPath { get; set; }
    public int? SpecializedPeriods { get; set; }
    public int? SpecializedTimePercent { get; set; }
}

public class QuranRingSessionDto
{
    public int Id { get; set; }
    public int RingId { get; set; }
    public int SessionNumber { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string SessionType { get; set; } = "REGULAR";
    public int? StartPage { get; set; }
    public int? EndPage { get; set; }
    public int? StartSurahId { get; set; }
    public int? EndSurahId { get; set; }
    public int? StartAyah { get; set; }
    public int? EndAyah { get; set; }
    public int Surfaces { get; set; }
    public int EstimatedMinutes { get; set; }
    public int? PrerequisiteSessionId { get; set; }
    public bool IsAssessment { get; set; }
    public string Half { get; set; } = string.Empty;
    public int SortOrder { get; set; }
    public bool IsActive { get; set; }
    public List<QuranSessionStepDto> Steps { get; set; } = [];
}

public class CreateQuranRingSessionRequest
{
    public int RingId { get; set; }
    public int SessionNumber { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? SessionType { get; set; }
    public int? StartPage { get; set; }
    public int? EndPage { get; set; }
    public int? StartSurahId { get; set; }
    public int? EndSurahId { get; set; }
    public int? StartAyah { get; set; }
    public int? EndAyah { get; set; }
    public int Surfaces { get; set; }
    public int EstimatedMinutes { get; set; }
    public int? PrerequisiteSessionId { get; set; }
    public bool IsAssessment { get; set; }
    public string Half { get; set; } = string.Empty;
    public int SortOrder { get; set; }
}

public class UpdateQuranRingSessionRequest
{
    public string? Title { get; set; }
    public string? Description { get; set; }
    public string? SessionType { get; set; }
    public int? StartPage { get; set; }
    public int? EndPage { get; set; }
    public int? StartSurahId { get; set; }
    public int? EndSurahId { get; set; }
    public int? StartAyah { get; set; }
    public int? EndAyah { get; set; }
    public int? Surfaces { get; set; }
    public int? EstimatedMinutes { get; set; }
    public int? PrerequisiteSessionId { get; set; }
    public bool? IsAssessment { get; set; }
    public string? Half { get; set; }
    public int? SortOrder { get; set; }
    public bool? IsActive { get; set; }
}

public class QuranSessionStepDto
{
    public int Id { get; set; }
    public int SessionId { get; set; }
    public int StepOrder { get; set; }
    public string StepType { get; set; } = string.Empty;
    public string? Title { get; set; }
    public string? Description { get; set; }
    public int EstimatedMinutes { get; set; }
    public bool IsOptional { get; set; }
    public string? ResourcesJson { get; set; }
    public string? CompletionCriteria { get; set; }
}

public class CreateQuranSessionStepRequest
{
    public int SessionId { get; set; }
    public int StepOrder { get; set; }
    public string StepType { get; set; } = string.Empty;
    public string? Title { get; set; }
    public string? Description { get; set; }
    public int EstimatedMinutes { get; set; }
    public bool IsOptional { get; set; }
    public string? ResourcesJson { get; set; }
    public string? CompletionCriteria { get; set; }
}

public class StudentQuranSessionProgressDto
{
    public int Id { get; set; }
    public int StudentId { get; set; }
    public string? StudentName { get; set; }
    public int SessionId { get; set; }
    public int? RingId { get; set; }
    public string? RingName { get; set; }
    public string Status { get; set; } = string.Empty;
    public int ProgressPercent { get; set; }
    public int LinesMemorized { get; set; }
    public int SurfacesCompleted { get; set; }
    public int? AssessmentScore { get; set; }
    public string? CoachNotes { get; set; }
    public DateTime? StartedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public List<StudentStepProgressDto> StepProgress { get; set; } = [];
}

public class UpdateSessionProgressRequest
{
    public string? Status { get; set; }
    public int? ProgressPercent { get; set; }
    public int? LinesMemorized { get; set; }
    public int? SurfacesCompleted { get; set; }
    public int? AssessmentScore { get; set; }
    public string? CoachNotes { get; set; }
}

public class StudentStepProgressDto
{
    public int Id { get; set; }
    public int SessionProgressId { get; set; }
    public int StepId { get; set; }
    public string? StepType { get; set; }
    public string Status { get; set; } = string.Empty;
    public int? Score { get; set; }
    public int RepetitionCount { get; set; }
    public string? Notes { get; set; }
    public DateTime? CompletedAt { get; set; }
    public DateTime? StartedAt { get; set; }
}

public class UpdateStepProgressRequest
{
    public string? Status { get; set; }
    public int? Score { get; set; }
    public int? RepetitionCount { get; set; }
    public string? Notes { get; set; }
}

public class StudentSpeedCategoryDto
{
    public int Id { get; set; }
    public int StudentId { get; set; }
    public string? StudentName { get; set; }
    public int RingId { get; set; }
    public string? RingName { get; set; }
    public string Category { get; set; } = "STAMINA";
    public int DailyLines { get; set; }
    public int MasteryScore { get; set; }
    public int ActiveDays { get; set; }
    public int ActualDailyLines { get; set; }
    public string? PreviousCategory { get; set; }
    public string? ChangeReason { get; set; }
    public bool IsEligibleForPromotion { get; set; }
    public bool IsAtRiskOfDemotion { get; set; }
    public DateTime AssignedAt { get; set; }
    public DateTime LastEvaluationAt { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class UpdateSpeedCategoryRequest
{
    public string? Category { get; set; }
    public int? DailyLines { get; set; }
    public int? MasteryScore { get; set; }
    public int? ActiveDays { get; set; }
    public int? ActualDailyLines { get; set; }
    public string? PreviousCategory { get; set; }
    public string? ChangeReason { get; set; }
    public bool? IsEligibleForPromotion { get; set; }
    public bool? IsAtRiskOfDemotion { get; set; }
}

public class TadabborEntryDto
{
    public int Id { get; set; }
    public int StudentId { get; set; }
    public string? StudentName { get; set; }
    public int? AyahId { get; set; }
    public int? AyahNumber { get; set; }
    public int? SurahId { get; set; }
    public string? SurahName { get; set; }
    public string Word { get; set; } = string.Empty;
    public string? WhyThisWord { get; set; }
    public string? SynonymsJson { get; set; }
    public string? JalalainReference { get; set; }
    public string? DifferenceFromSynonyms { get; set; }
    public string? StudentNote { get; set; }
    public string? CoachNote { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateTadabborEntryRequest
{
    public int StudentId { get; set; }
    public int? AyahId { get; set; }
    public int? AyahNumber { get; set; }
    public int? SurahId { get; set; }
    public string Word { get; set; } = string.Empty;
    public string? WhyThisWord { get; set; }
    public string? SynonymsJson { get; set; }
    public string? JalalainReference { get; set; }
    public string? DifferenceFromSynonyms { get; set; }
    public string? StudentNote { get; set; }
}

public class UpdateTadabborEntryRequest
{
    public string? Word { get; set; }
    public string? WhyThisWord { get; set; }
    public string? SynonymsJson { get; set; }
    public string? JalalainReference { get; set; }
    public string? DifferenceFromSynonyms { get; set; }
    public string? StudentNote { get; set; }
    public string? CoachNote { get; set; }
}

public class QuranAssetEvaluationDto
{
    public int Id { get; set; }
    public int StudentId { get; set; }
    public string? StudentName { get; set; }
    public int RingId { get; set; }
    public string? RingName { get; set; }
    public int EvaluatorUserId { get; set; }
    public string? EvaluatorName { get; set; }
    public DateTime EvaluationDate { get; set; }
    public int? MemorizationScore { get; set; }
    public string? MemorizationNotes { get; set; }
    public int? PhoneticSkillScore { get; set; }
    public string? PhoneticSkillNotes { get; set; }
    public int? LinguisticFoundationScore { get; set; }
    public string? LinguisticFoundationNotes { get; set; }
    public int? SemanticComprehensionScore { get; set; }
    public string? SemanticComprehensionNotes { get; set; }
    public int? TadabborWritingScore { get; set; }
    public string? TadabborWritingNotes { get; set; }
    public int? DailyThroughputScore { get; set; }
    public string? DailyThroughputNotes { get; set; }
    public int? EnvironmentalSupportScore { get; set; }
    public string? EnvironmentalSupportNotes { get; set; }
    public int? MotivationIdentityScore { get; set; }
    public string? MotivationIdentityNotes { get; set; }
    public int TotalScore { get; set; }
    public string? SuggestedSpeedCategory { get; set; }
    public int? SuggestedRingId { get; set; }
    public string? GeneralNotes { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateAssetEvaluationRequest
{
    public int StudentId { get; set; }
    public int RingId { get; set; }
    public int EvaluatorUserId { get; set; }
    public int? MemorizationScore { get; set; }
    public string? MemorizationNotes { get; set; }
    public int? PhoneticSkillScore { get; set; }
    public string? PhoneticSkillNotes { get; set; }
    public int? LinguisticFoundationScore { get; set; }
    public string? LinguisticFoundationNotes { get; set; }
    public int? SemanticComprehensionScore { get; set; }
    public string? SemanticComprehensionNotes { get; set; }
    public int? TadabborWritingScore { get; set; }
    public string? TadabborWritingNotes { get; set; }
    public int? DailyThroughputScore { get; set; }
    public string? DailyThroughputNotes { get; set; }
    public int? EnvironmentalSupportScore { get; set; }
    public string? EnvironmentalSupportNotes { get; set; }
    public int? MotivationIdentityScore { get; set; }
    public string? MotivationIdentityNotes { get; set; }
    public string? SuggestedSpeedCategory { get; set; }
    public int? SuggestedRingId { get; set; }
    public string? GeneralNotes { get; set; }
}

public class CoachInterviewDto
{
    public int Id { get; set; }
    public int CoachUserId { get; set; }
    public string? CoachName { get; set; }
    public int RingId { get; set; }
    public string? RingName { get; set; }
    public DateTime InterviewDate { get; set; }
    public string? Q1_ProcessSteps { get; set; }
    public string? Q2_PhoneticLayer { get; set; }
    public string? Q3_TranslationLayer { get; set; }
    public string? Q4_SpeedCategories { get; set; }
    public string? Q5_MainChallenges { get; set; }
    public string? Q6_CurrentSolutions { get; set; }
    public string? Q7_DailyListening { get; set; }
    public string? Q8_Memorization { get; set; }
    public string? Q9_Tajweed { get; set; }
    public string? Q10_Vocabulary { get; set; }
    public string? Q11_Syntax { get; set; }
    public string? Q12_Tadabbor { get; set; }
    public string? Q13_Writing { get; set; }
    public string? Q14_Presentations { get; set; }
    public string? Q15_Discussions { get; set; }
    public string? Q16_ParentReports { get; set; }
    public string? Q17_Resources { get; set; }
    public string? Q18_Needs { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateCoachInterviewRequest
{
    public int CoachUserId { get; set; }
    public int RingId { get; set; }
    public string? Q1_ProcessSteps { get; set; }
    public string? Q2_PhoneticLayer { get; set; }
    public string? Q3_TranslationLayer { get; set; }
    public string? Q4_SpeedCategories { get; set; }
    public string? Q5_MainChallenges { get; set; }
    public string? Q6_CurrentSolutions { get; set; }
    public string? Q7_DailyListening { get; set; }
    public string? Q8_Memorization { get; set; }
    public string? Q9_Tajweed { get; set; }
    public string? Q10_Vocabulary { get; set; }
    public string? Q11_Syntax { get; set; }
    public string? Q12_Tadabbor { get; set; }
    public string? Q13_Writing { get; set; }
    public string? Q14_Presentations { get; set; }
    public string? Q15_Discussions { get; set; }
    public string? Q16_ParentReports { get; set; }
    public string? Q17_Resources { get; set; }
    public string? Q18_Needs { get; set; }
}

public class StudentInterviewDto
{
    public int Id { get; set; }
    public int StudentId { get; set; }
    public string? StudentName { get; set; }
    public int RingId { get; set; }
    public string? RingName { get; set; }
    public int InterviewerUserId { get; set; }
    public string? InterviewerName { get; set; }
    public DateTime InterviewDate { get; set; }
    public string? S1_DailyListening { get; set; }
    public string? S2_FamilyListening { get; set; }
    public string? S3_MemorizedSurahs { get; set; }
    public string? S4_DailyProcess { get; set; }
    public string? S5_TimeSpent { get; set; }
    public string? S6_Difficulties { get; set; }
    public string? S7_EasyParts { get; set; }
    public string? S8_SelfSpeedCategory { get; set; }
    public string? S9_Motivation { get; set; }
    public string? S10_Goal { get; set; }
    public string? S11_Tadabbor { get; set; }
    public string? S12_Writing { get; set; }
    public string? S13_Books { get; set; }
    public string? S14_Discussion { get; set; }
    public string? S15_Presentations { get; set; }
    public string? S16_FamilyOpinion { get; set; }
    public string? S17_Needs { get; set; }
    public string? S18_Satisfaction { get; set; }
    public string? S19_Suggestion { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateStudentInterviewRequest
{
    public int StudentId { get; set; }
    public int RingId { get; set; }
    public int InterviewerUserId { get; set; }
    public string? S1_DailyListening { get; set; }
    public string? S2_FamilyListening { get; set; }
    public string? S3_MemorizedSurahs { get; set; }
    public string? S4_DailyProcess { get; set; }
    public string? S5_TimeSpent { get; set; }
    public string? S6_Difficulties { get; set; }
    public string? S7_EasyParts { get; set; }
    public string? S8_SelfSpeedCategory { get; set; }
    public string? S9_Motivation { get; set; }
    public string? S10_Goal { get; set; }
    public string? S11_Tadabbor { get; set; }
    public string? S12_Writing { get; set; }
    public string? S13_Books { get; set; }
    public string? S14_Discussion { get; set; }
    public string? S15_Presentations { get; set; }
    public string? S16_FamilyOpinion { get; set; }
    public string? S17_Needs { get; set; }
    public string? S18_Satisfaction { get; set; }
    public string? S19_Suggestion { get; set; }
}

public class QuranRingSurahDto
{
    public int Id { get; set; }
    public int RingId { get; set; }
    public int SurahId { get; set; }
    public string? SurahName { get; set; }
    public int? SurahNumber { get; set; }
    public string ActivityType { get; set; } = string.Empty;
    public int SortOrder { get; set; }
}

public class CreateQuranRingSurahRequest
{
    public int RingId { get; set; }
    public int SurahId { get; set; }
    public string ActivityType { get; set; } = string.Empty;
    public int SortOrder { get; set; }
}

public class QuranRingResourceDto
{
    public int Id { get; set; }
    public int RingId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string ResourceType { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Url { get; set; }
    public bool IsPrimary { get; set; }
    public int SortOrder { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateQuranRingResourceRequest
{
    public int RingId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string ResourceType { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Url { get; set; }
    public bool IsPrimary { get; set; }
    public int SortOrder { get; set; }
}

public class QuranRingFilterDto
{
    public string? Search { get; set; }
    public string? AgeGroup { get; set; }
    public string? Gender { get; set; }
    public bool? IsActive { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
}

public class SessionFilterDto
{
    public int? RingId { get; set; }
    public bool? IsAssessment { get; set; }
    public bool? IsActive { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
}

public class StudentProgressFilterDto
{
    public int? StudentId { get; set; }
    public int? RingId { get; set; }
    public string? Status { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
}

public class TadabborFilterDto
{
    public int? StudentId { get; set; }
    public int? SurahId { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
}

public class EvaluationFilterDto
{
    public int? StudentId { get; set; }
    public int? RingId { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
}

public class InterviewFilterDto
{
    public int? RingId { get; set; }
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
}

public class QuranRingDashboardDto
{
    public int TotalRings { get; set; }
    public int ActiveRings { get; set; }
    public int TotalStudents { get; set; }
    public int TotalSessions { get; set; }
    public int CompletedSessions { get; set; }
    public int PendingAssessments { get; set; }
    public Dictionary<string, int> StudentsBySpeedCategory { get; set; } = [];
    public Dictionary<string, int> StudentsByRing { get; set; } = [];
    public List<StudentQuranSessionProgressDto> RecentProgress { get; set; } = [];
}
