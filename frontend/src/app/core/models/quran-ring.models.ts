export type SpeedCategoryType = 'STAMINA' | 'SEMI_SPEED' | 'SPEED' | 'POINT_MEMORIZATION';
export type SessionType = 'REGULAR' | 'ASSESSMENT' | 'REVIEW';
export type SessionHalf = 'FIRST' | 'SECOND';
export type StepType = 'LISTENING' | 'VOCABULARY' | 'CONJUGATION' | 'SYNTAX' | 'TRANSLATION' | 'TADABBOR' | 'WRITING';
export type ResourceType = 'BOOK' | 'AUDIO' | 'WORKSHEET' | 'VIDEO';
export type ActivityType = 'MEMORIZATION' | 'RECITATION' | 'TAJWEED' | 'CONCEPTS' | 'TADABBOR';
export type SessionStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'ASSESSMENT_PENDING' | 'FAILED';
export type StepStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'SKIPPED';

export interface QuranRingDto {
  id: number;
  code: string;
  name: string;
  description?: string;
  ageGroup: string;
  gender?: string;
  minAge?: number;
  maxAge?: number;
  sortOrder: number;
  isActive: boolean;
  hasSpecializedPath: boolean;
  specializedPeriods?: number;
  specializedTimePercent?: number;
  createdAt: string;
  sessions?: QuranRingSessionDto[];
  ringSurahs?: QuranRingSurahDto[];
  resources?: QuranRingResourceDto[];
}

export interface CreateQuranRingRequest {
  code: string;
  name: string;
  description?: string;
  ageGroup: string;
  gender?: string;
  minAge?: number;
  maxAge?: number;
  sortOrder: number;
  hasSpecializedPath: boolean;
  specializedPeriods?: number;
  specializedTimePercent?: number;
}

export interface UpdateQuranRingRequest {
  name?: string;
  description?: string;
  ageGroup?: string;
  gender?: string;
  minAge?: number;
  maxAge?: number;
  sortOrder?: number;
  isActive?: boolean;
  hasSpecializedPath?: boolean;
  specializedPeriods?: number;
  specializedTimePercent?: number;
}

export interface QuranRingFilterDto {
  search?: string;
  ageGroup?: string;
  gender?: string;
  isActive?: boolean;
  page?: number;
  pageSize?: number;
}

export interface QuranRingSessionDto {
  id: number;
  ringId: number;
  sessionNumber: number;
  title: string;
  description?: string;
  sessionType: SessionType;
  startPage?: number;
  endPage?: number;
  startSurahId?: number;
  endSurahId?: number;
  startAyah?: number;
  endAyah?: number;
  surfaces: number;
  estimatedMinutes: number;
  prerequisiteSessionId?: number;
  isAssessment: boolean;
  half: SessionHalf;
  sortOrder: number;
  isActive: boolean;
  steps?: QuranSessionStepDto[];
  studentProgress?: StudentQuranSessionProgressDto[];
}

export interface CreateQuranRingSessionRequest {
  ringId: number;
  sessionNumber: number;
  title: string;
  description?: string;
  sessionType: SessionType;
  startPage?: number;
  endPage?: number;
  startSurahId?: number;
  endSurahId?: number;
  startAyah?: number;
  endAyah?: number;
  surfaces: number;
  estimatedMinutes: number;
  prerequisiteSessionId?: number;
  isAssessment: boolean;
  half: SessionHalf;
  sortOrder: number;
}

export interface UpdateQuranRingSessionRequest {
  title?: string;
  description?: string;
  sessionType?: SessionType;
  startPage?: number;
  endPage?: number;
  startSurahId?: number;
  endSurahId?: number;
  startAyah?: number;
  endAyah?: number;
  surfaces?: number;
  estimatedMinutes?: number;
  prerequisiteSessionId?: number;
  isAssessment?: boolean;
  half?: SessionHalf;
  sortOrder?: number;
  isActive?: boolean;
}

export interface SessionFilterDto {
  ringId?: number;
  sessionType?: SessionType;
  half?: SessionHalf;
  isAssessment?: boolean;
  isActive?: boolean;
  page?: number;
  pageSize?: number;
}

export interface QuranSessionStepDto {
  id: number;
  sessionId: number;
  stepType: StepType;
  title: string;
  description?: string;
  stepOrder: number;
  estimatedMinutes: number;
  isOptional: boolean;
  resourcesJson?: string;
  completionCriteria?: string;
  createdAt: string;
}

export interface CreateQuranSessionStepRequest {
  sessionId: number;
  stepType: StepType;
  title: string;
  description?: string;
  stepOrder: number;
  estimatedMinutes: number;
  isOptional: boolean;
  resourcesJson?: string;
  completionCriteria?: string;
}

export interface StudentQuranSessionProgressDto {
  id: number;
  studentId: number;
  sessionId: number;
  status: SessionStatus;
  progressPercent: number;
  linesMemorized: number;
  surfacesCompleted: number;
  assessmentScore?: number;
  coachNotes?: string;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  stepProgress?: StudentStepProgressDto[];
}

export interface StudentProgressFilterDto {
  studentId?: number;
  sessionId?: number;
  ringId?: number;
  status?: SessionStatus;
  page?: number;
  pageSize?: number;
}

export interface StartSessionRequest {
  studentId: number;
  sessionId: number;
}

export interface UpdateSessionProgressRequest {
  status?: SessionStatus;
  progressPercent?: number;
  linesMemorized?: number;
  surfacesCompleted?: number;
  assessmentScore?: number;
  coachNotes?: string;
}

export interface UpdateStepProgressRequest {
  status?: StepStatus;
  score?: number;
  repetitionCount?: number;
  notes?: string;
}

export interface StudentStepProgressDto {
  id: number;
  sessionProgressId: number;
  stepId: number;
  status: StepStatus;
  score?: number;
  repetitionCount: number;
  notes?: string;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
}

export interface StudentSpeedCategoryDto {
  id: number;
  studentId: number;
  ringId: number;
  category: SpeedCategoryType;
  dailyLines: number;
  assignedAt: string;
  previousCategory?: string;
  changeReason?: string;
  masteryScore?: number;
  actualDailyLines: number;
  activeDays: number;
  lastEvaluationAt?: string;
  isEligibleForPromotion: boolean;
  isAtRiskOfDemotion: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateSpeedCategoryRequest {
  category: SpeedCategoryType;
  dailyLines: number;
  changeReason?: string;
}

export interface TadabborEntryDto {
  id: number;
  studentId: number;
  ayahId: number;
  surahId: number;
  ayahNumber: number;
  word: string;
  whyThisWord: string;
  synonymsJson?: string;
  differenceFromSynonyms?: string;
  jalalainReference?: string;
  studentNote?: string;
  coachNote?: string;
  createdAt: string;
}

export interface TadabborFilterDto {
  studentId?: number;
  surahId?: number;
  ayahId?: number;
  page?: number;
  pageSize?: number;
}

export interface CreateTadabborEntryRequest {
  studentId: number;
  ayahId: number;
  surahId: number;
  ayahNumber: number;
  word: string;
  whyThisWord: string;
  synonymsJson?: string;
  differenceFromSynonyms?: string;
  jalalainReference?: string;
  studentNote?: string;
  coachNote?: string;
}

export interface UpdateTadabborEntryRequest {
  word?: string;
  whyThisWord?: string;
  synonymsJson?: string;
  differenceFromSynonyms?: string;
  jalalainReference?: string;
  studentNote?: string;
  coachNote?: string;
}

export interface QuranAssetEvaluationDto {
  id: number;
  studentId: number;
  ringId: number;
  evaluatorUserId: number;
  evaluationDate: string;
  memorizationScore: number;
  memorizationNotes?: string;
  phoneticSkillScore: number;
  phoneticSkillNotes?: string;
  linguisticFoundationScore: number;
  linguisticFoundationNotes?: string;
  semanticComprehensionScore: number;
  semanticComprehensionNotes?: string;
  tadabborWritingScore: number;
  tadabborWritingNotes?: string;
  dailyThroughputScore: number;
  dailyThroughputNotes?: string;
  environmentalSupportScore: number;
  environmentalSupportNotes?: string;
  motivationIdentityScore: number;
  motivationIdentityNotes?: string;
  totalScore: number;
  suggestedSpeedCategory: SpeedCategoryType;
  suggestedRingId?: number;
  generalNotes?: string;
  createdAt: string;
}

export interface EvaluationFilterDto {
  studentId?: number;
  ringId?: number;
  evaluatorUserId?: number;
  page?: number;
  pageSize?: number;
}

export interface CreateAssetEvaluationRequest {
  studentId: number;
  ringId: number;
  evaluatorUserId: number;
  evaluationDate: string;
  memorizationScore: number;
  memorizationNotes?: string;
  phoneticSkillScore: number;
  phoneticSkillNotes?: string;
  linguisticFoundationScore: number;
  linguisticFoundationNotes?: string;
  semanticComprehensionScore: number;
  semanticComprehensionNotes?: string;
  tadabborWritingScore: number;
  tadabborWritingNotes?: string;
  dailyThroughputScore: number;
  dailyThroughputNotes?: string;
  environmentalSupportScore: number;
  environmentalSupportNotes?: string;
  motivationIdentityScore: number;
  motivationIdentityNotes?: string;
  totalScore: number;
  suggestedSpeedCategory: SpeedCategoryType;
  suggestedRingId?: number;
  generalNotes?: string;
}

export interface CoachInterviewDto {
  id: number;
  coachUserId: number;
  ringId: number;
  interviewDate: string;
  q1_ProcessSteps?: string;
  q2_PhoneticLayer?: string;
  q3_TranslationLayer?: string;
  q4_SpeedCategories?: string;
  q5_MainChallenges?: string;
  q6_CurrentSolutions?: string;
  q7_DailyListening?: string;
  q8_Memorization?: string;
  q9_Tajweed?: string;
  q10_Vocabulary?: string;
  q11_Syntax?: string;
  q12_Tadabbor?: string;
  q13_Writing?: string;
  q14_Presentations?: string;
  q15_Discussions?: string;
  q16_ParentReports?: string;
  q17_Resources?: string;
  q18_Needs?: string;
  createdAt: string;
}

export interface InterviewFilterDto {
  coachUserId?: number;
  ringId?: number;
  page?: number;
  pageSize?: number;
}

export interface CreateCoachInterviewRequest {
  coachUserId: number;
  ringId: number;
  interviewDate: string;
  q1_ProcessSteps?: string;
  q2_PhoneticLayer?: string;
  q3_TranslationLayer?: string;
  q4_SpeedCategories?: string;
  q5_MainChallenges?: string;
  q6_CurrentSolutions?: string;
  q7_DailyListening?: string;
  q8_Memorization?: string;
  q9_Tajweed?: string;
  q10_Vocabulary?: string;
  q11_Syntax?: string;
  q12_Tadabbor?: string;
  q13_Writing?: string;
  q14_Presentations?: string;
  q15_Discussions?: string;
  q16_ParentReports?: string;
  q17_Resources?: string;
  q18_Needs?: string;
}

export interface StudentInterviewDto {
  id: number;
  studentId: number;
  ringId: number;
  interviewerUserId: number;
  interviewDate: string;
  s1_DailyListening?: string;
  s2_FamilyListening?: string;
  s3_MemorizedSurahs?: string;
  s4_DailyProcess?: string;
  s5_TimeSpent?: string;
  s6_Difficulties?: string;
  s7_EasyParts?: string;
  s8_SelfSpeedCategory?: string;
  s9_Motivation?: string;
  s10_Goal?: string;
  s11_Tadabbor?: string;
  s12_Writing?: string;
  s13_Books?: string;
  s14_Discussion?: string;
  s15_Presentations?: string;
  s16_FamilyOpinion?: string;
  s17_Needs?: string;
  s18_Satisfaction?: string;
  s19_Suggestion?: string;
  createdAt: string;
}

export interface CreateStudentInterviewRequest {
  studentId: number;
  ringId: number;
  interviewerUserId: number;
  interviewDate: string;
  s1_DailyListening?: string;
  s2_FamilyListening?: string;
  s3_MemorizedSurahs?: string;
  s4_DailyProcess?: string;
  s5_TimeSpent?: string;
  s6_Difficulties?: string;
  s7_EasyParts?: string;
  s8_SelfSpeedCategory?: string;
  s9_Motivation?: string;
  s10_Goal?: string;
  s11_Tadabbor?: string;
  s12_Writing?: string;
  s13_Books?: string;
  s14_Discussion?: string;
  s15_Presentations?: string;
  s16_FamilyOpinion?: string;
  s17_Needs?: string;
  s18_Satisfaction?: string;
  s19_Suggestion?: string;
}

export interface QuranRingSurahDto {
  id: number;
  ringId: number;
  surahId: number;
  activityType: ActivityType;
  sortOrder: number;
  createdAt: string;
}

export interface CreateQuranRingSurahRequest {
  ringId: number;
  surahId: number;
  activityType: ActivityType;
  sortOrder: number;
}

export interface QuranRingResourceDto {
  id: number;
  ringId: number;
  title: string;
  resourceType: ResourceType;
  description?: string;
  url: string;
  isPrimary: boolean;
  sortOrder: number;
  createdAt: string;
}

export interface CreateQuranRingResourceRequest {
  ringId: number;
  title: string;
  resourceType: ResourceType;
  description?: string;
  url: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface QuranRingDashboardDto {
  totalRings: number;
  totalSessions: number;
  totalStudents: number;
  studentsBySpeedCategory: Record<SpeedCategoryType, number>;
  averageProgressPercent: number;
  upcomingAssessments: number;
  completedSessionsToday: number;
}