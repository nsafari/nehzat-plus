import type { Student, Branch, Course, Assignment, AssignmentAttachment, AssignmentSubmission,
  Coach, BranchManager, Parent, Evaluator, Madrasah, MaktabBranch, SubjectArea, TeachingMethod,
  Ring, RingStudent, CurriculumObjective, Book, RingBook, RingTeachingMethod, EvaluationRecord,
  Assessment, MonthlyBooklet, CurriculumVersion, StudentPathHistory, Teacher, TeacherCourse,
  AssignmentGrading, Competition, CompetitionParticipant, League, LeagueRanking, IssueSurvey,
  IssueSurveyQuestion, IssueItemPool, IssueSurveyResponse, IssueSurveyComment, IssueAction,
  SpiritualPracticeItem, SpiritualOccasion, SpiritualPath, DailySpiritualEntry,
   UserOccasionProgress, StudentPathSelection, ServiceSurvey, ServiceSurveyQuestion,
   ServiceSurveyResponse, XpBadge, DailyActivity, SpacedRepetitionCard, UserXp, DailyNudge,
   Artwork, MusicRecord, CalligraphySample, CollaborationProject, DiscussionThread,
   DiscussionPost, PeerReview, PortfolioItem, SkillCertificate, SkillBasket,
   Accommodation, StudyPath, StudyPathStep, StudentStudyPath, StudyPathAccommodation,
   AgeGroup,
} from '../../models/lesson-planner.models';
import { MockUser, initialUsers, initialStudents, initialBranches, initialCourses,
  initialAssignments, initialAttachments, initialSubmissions, initialCoaches,
  initialBranchManagers, initialParents, initialEvaluators, initialMadrasahs,
  initialMaktabBranches, initialSubjectAreas, initialTeachingMethods, initialRings,
  initialRingStudents, initialObjectives, initialBooks, initialRingBooks,
  initialRingTeachingMethods, initialEvaluations, initialAssessments,
  initialCourseEnrollments, initialInviteCodes, initialSpiritualPracticeItems,
  initialSpiritualOccasions, initialSpiritualPaths, initialDailySpiritualEntries,
  initialDailyActivities, initialSrsCards, initialUserXp, initialDailyNudges,
  initialArtworks, initialMusicRecords, initialCalligraphySamples,
  initialCollaborationProjects, initialDiscussionThreads, initialDiscussionPosts,
  initialPeerReviews, initialPortfolioItems, initialSkillCertificates,
  initialSkillBaskets, initialUserOccasionProgress, initialStudentPathSelections,
  initialMonthlyBooklets, initialCurriculumVersions, initialProgressionRecords,
  initialTeachers, initialTeacherCourses, initialAssignmentGradings, initialXpBadges,
  initialXpActivities, initialCompetitions, initialCompetitionParticipants,
  initialCompetitionScores, initialLeagues, initialLeagueRankings, initialIssueSurveys,
  initialIssueQuestions, initialIssueResponses, initialIssueComments, initialIssueActions,
  initialIssueItemPools, initialServiceSurveys, initialServiceQuestions,
  initialServiceResponses, initialNextLiteratureId, initialNextArabicLitId,
  initialNextXpId, initialNextLearningId, initialMockPoets, initialMockPoems,
  initialMockAnalyses, initialMockArabicPoets, initialMockArabicPoems,
  initialMockArabicAnalyses, initialMockArabicCourses, initialMockArabicLessons,
  initialMockArabicProgress, initialMathTopics, initialMathLessons, initialMathQuestions,
  initialMathProgress, initialMathScholars, initialMathContributions, initialQuranSurahs,
  initialQuranAyahs, initialQuranTajweedRules, initialQuranRecitations,
  initialQuranCurricula, initialQuranProgress, initialQuranLessonPlans, initialHadithBooks,
  initialHadithChapters, initialHadiths, initialHadithReviews, initialHadithAssessments,
  initialSciencePhases, initialScienceTopics, initialScienceLessons,
  initialScienceExperiments, initialScienceQuizzes, initialScienceQuestions,
  initialScienceProgress, initialLearningPaths, initialLearningLevels, initialStudyModules,
  initialStudyLessons, initialContentBlocks, initialQuizzes, initialPersLitQuizQuestions,
  initialUserEnrollments, initialLessonProgress, initialQuizAttempts,
  initialProjectDefenses, initialDefenseEvaluations, initialDefenseSchedule,
  initialCareerPaths, initialPathwayRecommendations,
} from './mock-data-context.data';

export abstract class MockDataContextState {
  // ── Core data arrays ──
  users: MockUser[] = [...initialUsers];
  students: Student[] = [...initialStudents];
  branches: Branch[] = [...initialBranches];
  courses: Course[] = [...initialCourses];

  assignments: Assignment[] = [...initialAssignments];
  attachments: AssignmentAttachment[] = [...initialAttachments];
  submissions: AssignmentSubmission[] = [...initialSubmissions];
  coaches: Coach[] = [...initialCoaches];
  branchManagers: BranchManager[] = [...initialBranchManagers];
  parents: Parent[] = [...initialParents];
  evaluators: Evaluator[] = [...initialEvaluators];
  madrasahs: Madrasah[] = [...initialMadrasahs];
  maktabBranches: MaktabBranch[] = [...initialMaktabBranches];
  subjectAreas: SubjectArea[] = [...initialSubjectAreas];
  ageGroups: AgeGroup[] = [
    { id: 1, key: 'children-6-8', name: '۶ تا هشت سال', description: 'کودکان ۶ تا ۸ سال', minAge: 6, maxAge: 8, sortOrder: 1 },
    { id: 2, key: 'children-9-11', name: '۹ تا یازده سال', description: 'کودکان ۹ تا ۱۱ سال', minAge: 9, maxAge: 11, sortOrder: 2 },
    { id: 3, key: 'teens-12-14', name: '۱۲ تا چهارده سال', description: 'نوجوانان ۱۲ تا ۱۴ سال', minAge: 12, maxAge: 14, sortOrder: 3 },
    { id: 4, key: 'teens-15-17', name: '۱۵ تا هفده سال', description: 'نوجوانان ۱۵ تا ۱۷ سال', minAge: 15, maxAge: 17, sortOrder: 4 },
    { id: 5, key: 'youth-18-21', name: '۱۸ تا بیست و یک سال', description: 'جوانان ۱۸ تا ۲۱ سال', minAge: 18, maxAge: 21, sortOrder: 5 },
  ];
  teachingMethods: TeachingMethod[] = [...initialTeachingMethods];
  rings: Ring[] = [...initialRings];
  ringStudents: RingStudent[] = [...initialRingStudents];
  objectives: CurriculumObjective[] = [...initialObjectives];
  books: Book[] = [...initialBooks];
  ringBooks: RingBook[] = [...initialRingBooks];
  ringTeachingMethods: RingTeachingMethod[] = [...initialRingTeachingMethods];
  evaluations: EvaluationRecord[] = [...initialEvaluations];
  assessments: Assessment[] = [...initialAssessments];
  courseEnrollments = new Map(initialCourseEnrollments);
  inviteCodes = new Map(initialInviteCodes);

  // ── Spiritual ──
  spiritualPracticeItems: SpiritualPracticeItem[] = [...initialSpiritualPracticeItems];
  spiritualOccasions: SpiritualOccasion[] = [...initialSpiritualOccasions];
  spiritualPaths: SpiritualPath[] = [...initialSpiritualPaths];
  dailySpiritualEntries: DailySpiritualEntry[] = [...initialDailySpiritualEntries];

  // ── Daily / Gamification ──
  dailyActivities: DailyActivity[] = [...initialDailyActivities];
  srsCards: SpacedRepetitionCard[] = [...initialSrsCards];
  userXp: UserXp | null = initialUserXp;
  dailyNudges: DailyNudge[] = [...initialDailyNudges];

  // ── Arts ──
  artworks: Artwork[] = [...initialArtworks];
  musicRecords: MusicRecord[] = [...initialMusicRecords];
  calligraphySamples: CalligraphySample[] = [...initialCalligraphySamples];

  // ── Collaborations ──
  collaborationProjects: CollaborationProject[] = [...initialCollaborationProjects];
  discussionThreads: DiscussionThread[] = [...initialDiscussionThreads];
  discussionPosts: DiscussionPost[] = [...initialDiscussionPosts];
  peerReviews: PeerReview[] = [...initialPeerReviews];
  portfolioItems: PortfolioItem[] = [...initialPortfolioItems];
  skillCertificates: SkillCertificate[] = [...initialSkillCertificates];
  skillBaskets: SkillBasket[] = [...initialSkillBaskets];

  // ── Paths / Booklets / Curriculum ──
  userOccasionProgress: UserOccasionProgress[] = [...initialUserOccasionProgress];
  studentPathSelections: StudentPathSelection[] = [...initialStudentPathSelections];
  monthlyBooklets: MonthlyBooklet[] = [...initialMonthlyBooklets];
  curriculumVersions: CurriculumVersion[] = [...initialCurriculumVersions];
  progressionRecords: StudentPathHistory[] = [...initialProgressionRecords];

  // ── Teachers ──
  teachers: Teacher[] = [...initialTeachers];
  teacherCourses: TeacherCourse[] = [...initialTeacherCourses];
  assignmentGradings: AssignmentGrading[] = [...initialAssignmentGradings];

  // ── XP badges (mutable, seeded) ──
  xpBadges: XpBadge[] = [...initialXpBadges];
  xpActivities: any[] = [...initialXpActivities];

  // ── Competitions ──
  competitions: Competition[] = [...initialCompetitions];
  competitionParticipants: CompetitionParticipant[] = [...initialCompetitionParticipants];
  competitionScores: any[] = [...initialCompetitionScores];
  leagues: League[] = [...initialLeagues];
  leagueRankings: LeagueRanking[] = [...initialLeagueRankings];

  // ── Surveys ──
  issueSurveys: IssueSurvey[] = [...initialIssueSurveys];
  issueQuestions: IssueSurveyQuestion[] = [...initialIssueQuestions];
  issueResponses: IssueSurveyResponse[] = [...initialIssueResponses];
  issueComments: IssueSurveyComment[] = [...initialIssueComments];
  issueActions: IssueAction[] = [...initialIssueActions];
  issueItemPools: IssueItemPool[] = [...initialIssueItemPools];
  serviceSurveys: ServiceSurvey[] = [...initialServiceSurveys];
  serviceQuestions: ServiceSurveyQuestion[] = [...initialServiceQuestions];
  serviceResponses: ServiceSurveyResponse[] = [...initialServiceResponses];

  // ── Inline counters ──
  nextLiteratureId = initialNextLiteratureId;
  nextArabicLitId = initialNextArabicLitId;
  nextXpId = initialNextXpId;
  nextLearningId = initialNextLearningId;

  // ── Inline data (Persian Literature) ──
  mockPoets: any[] = [...initialMockPoets];
  mockPoems: any[] = [...initialMockPoems];
  mockAnalyses: any[] = [...initialMockAnalyses];

  // ── Inline data (Arabic Literature) ──
  mockArabicPoets: any[] = [...initialMockArabicPoets];
  mockArabicPoems: any[] = [...initialMockArabicPoems];
  mockArabicAnalyses: any[] = [...initialMockArabicAnalyses];
  mockArabicCourses: any[] = [...initialMockArabicCourses];
  mockArabicLessons: any[] = [...initialMockArabicLessons];
  mockArabicProgress: any[] = [...initialMockArabicProgress];

  // ── Math inline data ──
  mathTopics: any[] = [...initialMathTopics];
  mathLessons: any[] = [...initialMathLessons];
  mathQuestions: any[] = [...initialMathQuestions];
  mathProgress: any[] = [...initialMathProgress];
  mathScholars: any[] = [...initialMathScholars];
  mathContributions: any[] = [...initialMathContributions];

  // ── Quran inline data ──
  quranSurahs: any[] = [...initialQuranSurahs];
  quranAyahs: any[] = [...initialQuranAyahs];
  quranTajweedRules: any[] = [...initialQuranTajweedRules];
  quranRecitations: any[] = [...initialQuranRecitations];
  quranCurricula: any[] = [...initialQuranCurricula];
  quranProgress: any[] = [...initialQuranProgress];
  quranLessonPlans: any[] = [...initialQuranLessonPlans];

  // ── Hadith inline data ──
  hadithBooks: any[] = [...initialHadithBooks];
  hadithChapters: any[] = [...initialHadithChapters];
  hadiths: any[] = [...initialHadiths];
  hadithReviews: any[] = [...initialHadithReviews];
  hadithAssessments: any[] = [...initialHadithAssessments];

  // ── Sciences inline data ──
  sciencePhases: any[] = [...initialSciencePhases];
  scienceTopics: any[] = [...initialScienceTopics];
  scienceLessons: any[] = [...initialScienceLessons];
  scienceExperiments: any[] = [...initialScienceExperiments];
  scienceQuizzes: any[] = [...initialScienceQuizzes];
  scienceQuestions: any[] = [...initialScienceQuestions];
  scienceProgress: any[] = [...initialScienceProgress];

  // ── Learning Platform inline data ──
  learningPaths: any[] = [...initialLearningPaths];
  learningLevels: any[] = [...initialLearningLevels];
  studyModules: any[] = [...initialStudyModules];
  studyLessons: any[] = [...initialStudyLessons];
  contentBlocks: any[] = [...initialContentBlocks];
  quizzes: any[] = [...initialQuizzes];
  persLitQuizQuestions: any[] = [...initialPersLitQuizQuestions];
  userEnrollments: any[] = [...initialUserEnrollments];
  lessonProgress: any[] = [...initialLessonProgress];
  quizAttempts: any[] = [...initialQuizAttempts];
  projectDefenses: any[] = [...initialProjectDefenses];
  defenseEvaluations: any[] = [...initialDefenseEvaluations];
  defenseSchedule: any[] = [...initialDefenseSchedule];

  // ── Career Paths inline data ──
  careerPaths: any[] = [...initialCareerPaths];
  pathwayRecommendations: any[] = [...initialPathwayRecommendations];

  // ── Study Path System ──
  studyPaths: StudyPath[] = [];
  studyPathSteps: StudyPathStep[] = [];
  accommodations: Accommodation[] = [
    { id: 1, code: 'auditory', name: 'شنوایی', description: 'مناسب برای یادگیری شنوایی', icon: '🎧' },
    { id: 2, code: 'visual', name: 'بصری', description: 'مناسب برای یادگیری بصری', icon: '👁️' },
    { id: 3, code: 'kinesthetic', name: 'حس‌پذیر', description: 'مناسب برای یادگیری عملی', icon: '✋' },
  ];
  studyPathAccommodations: StudyPathAccommodation[] = [];
  studentStudyPaths: StudentStudyPath[] = [];

  currentUsername: string | null = null;

  /** Restores every state collection to its initial seed values. */
  resetState(): void {
    this.users = [...initialUsers];
    this.students = [...initialStudents];
    this.branches = [...initialBranches];
    this.courses = [...initialCourses];
    this.assignments = [...initialAssignments];
    this.attachments = [...initialAttachments];
    this.submissions = [...initialSubmissions];
    this.coaches = [...initialCoaches];
    this.branchManagers = [...initialBranchManagers];
    this.parents = [...initialParents];
    this.evaluators = [...initialEvaluators];
    this.madrasahs = [...initialMadrasahs];
    this.maktabBranches = [...initialMaktabBranches];
    this.subjectAreas = [...initialSubjectAreas];
    this.ageGroups = [
      { id: 1, key: 'children-6-8', name: '۶ تا هشت سال', description: 'کودکان ۶ تا ۸ سال', minAge: 6, maxAge: 8, sortOrder: 1 },
      { id: 2, key: 'children-9-11', name: '۹ تا یازده سال', description: 'کودکان ۹ تا ۱۱ سال', minAge: 9, maxAge: 11, sortOrder: 2 },
      { id: 3, key: 'teens-12-14', name: '۱۲ تا چهارده سال', description: 'نوجوانان ۱۲ تا ۱۴ سال', minAge: 12, maxAge: 14, sortOrder: 3 },
      { id: 4, key: 'teens-15-17', name: '۱۵ تا هفده سال', description: 'نوجوانان ۱۵ تا ۱۷ سال', minAge: 15, maxAge: 17, sortOrder: 4 },
      { id: 5, key: 'youth-18-21', name: '۱۸ تا بیست و یک سال', description: 'جوانان ۱۸ تا ۲۱ سال', minAge: 18, maxAge: 21, sortOrder: 5 },
    ];
    this.teachingMethods = [...initialTeachingMethods];
    this.rings = [...initialRings];
    this.ringStudents = [...initialRingStudents];
    this.objectives = [...initialObjectives];
    this.books = [...initialBooks];
    this.ringBooks = [...initialRingBooks];
    this.ringTeachingMethods = [...initialRingTeachingMethods];
    this.evaluations = [...initialEvaluations];
    this.assessments = [...initialAssessments];
    this.courseEnrollments = new Map(initialCourseEnrollments);
    this.inviteCodes = new Map(initialInviteCodes);
    this.spiritualPracticeItems = [...initialSpiritualPracticeItems];
    this.spiritualOccasions = [...initialSpiritualOccasions];
    this.spiritualPaths = [...initialSpiritualPaths];
    this.dailySpiritualEntries = [...initialDailySpiritualEntries];
    this.dailyActivities = [...initialDailyActivities];
    this.srsCards = [...initialSrsCards];
    this.userXp = initialUserXp;
    this.dailyNudges = [...initialDailyNudges];
    this.artworks = [...initialArtworks];
    this.musicRecords = [...initialMusicRecords];
    this.calligraphySamples = [...initialCalligraphySamples];
    this.collaborationProjects = [...initialCollaborationProjects];
    this.discussionThreads = [...initialDiscussionThreads];
    this.discussionPosts = [...initialDiscussionPosts];
    this.peerReviews = [...initialPeerReviews];
    this.portfolioItems = [...initialPortfolioItems];
    this.skillCertificates = [...initialSkillCertificates];
    this.skillBaskets = [...initialSkillBaskets];
    this.userOccasionProgress = [...initialUserOccasionProgress];
    this.studentPathSelections = [...initialStudentPathSelections];
    this.monthlyBooklets = [...initialMonthlyBooklets];
    this.curriculumVersions = [...initialCurriculumVersions];
    this.progressionRecords = [...initialProgressionRecords];
    this.teachers = [...initialTeachers];
    this.teacherCourses = [...initialTeacherCourses];
    this.assignmentGradings = [...initialAssignmentGradings];
    this.xpBadges = [...initialXpBadges];
    this.xpActivities = [...initialXpActivities];
    this.competitions = [...initialCompetitions];
    this.competitionParticipants = [...initialCompetitionParticipants];
    this.competitionScores = [...initialCompetitionScores];
    this.leagues = [...initialLeagues];
    this.leagueRankings = [...initialLeagueRankings];
    this.issueSurveys = [...initialIssueSurveys];
    this.issueQuestions = [...initialIssueQuestions];
    this.issueResponses = [...initialIssueResponses];
    this.issueComments = [...initialIssueComments];
    this.issueActions = [...initialIssueActions];
    this.issueItemPools = [...initialIssueItemPools];
    this.serviceSurveys = [...initialServiceSurveys];
    this.serviceQuestions = [...initialServiceQuestions];
    this.serviceResponses = [...initialServiceResponses];
    this.mockPoets = [...initialMockPoets];
    this.mockPoems = [...initialMockPoems];
    this.mockAnalyses = [...initialMockAnalyses];
    this.mockArabicPoets = [...initialMockArabicPoets];
    this.mockArabicPoems = [...initialMockArabicPoems];
    this.mockArabicAnalyses = [...initialMockArabicAnalyses];
    this.mockArabicCourses = [...initialMockArabicCourses];
    this.mockArabicLessons = [...initialMockArabicLessons];
    this.mockArabicProgress = [...initialMockArabicProgress];
    this.mathTopics = [...initialMathTopics];
    this.mathLessons = [...initialMathLessons];
    this.mathQuestions = [...initialMathQuestions];
    this.mathProgress = [...initialMathProgress];
    this.mathScholars = [...initialMathScholars];
    this.mathContributions = [...initialMathContributions];
    this.quranSurahs = [...initialQuranSurahs];
    this.quranAyahs = [...initialQuranAyahs];
    this.quranTajweedRules = [...initialQuranTajweedRules];
    this.quranRecitations = [...initialQuranRecitations];
    this.quranCurricula = [...initialQuranCurricula];
    this.quranProgress = [...initialQuranProgress];
    this.quranLessonPlans = [...initialQuranLessonPlans];
    this.hadithBooks = [...initialHadithBooks];
    this.hadithChapters = [...initialHadithChapters];
    this.hadiths = [...initialHadiths];
    this.hadithReviews = [...initialHadithReviews];
    this.hadithAssessments = [...initialHadithAssessments];
    this.sciencePhases = [...initialSciencePhases];
    this.scienceTopics = [...initialScienceTopics];
    this.scienceLessons = [...initialScienceLessons];
    this.scienceExperiments = [...initialScienceExperiments];
    this.scienceQuizzes = [...initialScienceQuizzes];
    this.scienceQuestions = [...initialScienceQuestions];
    this.scienceProgress = [...initialScienceProgress];
    this.learningPaths = [...initialLearningPaths];
    this.learningLevels = [...initialLearningLevels];
    this.studyModules = [...initialStudyModules];
    this.studyLessons = [...initialStudyLessons];
    this.contentBlocks = [...initialContentBlocks];
    this.quizzes = [...initialQuizzes];
    this.persLitQuizQuestions = [...initialPersLitQuizQuestions];
    this.userEnrollments = [...initialUserEnrollments];
    this.lessonProgress = [...initialLessonProgress];
    this.quizAttempts = [...initialQuizAttempts];
    this.projectDefenses = [...initialProjectDefenses];
    this.defenseEvaluations = [...initialDefenseEvaluations];
    this.defenseSchedule = [...initialDefenseSchedule];
    this.careerPaths = [...initialCareerPaths];
    this.pathwayRecommendations = [...initialPathwayRecommendations];
    this.studyPaths = [];
    this.studyPathSteps = [];
    this.accommodations = [];
    this.studyPathAccommodations = [];
    this.studentStudyPaths = [];
    this.currentUsername = null;
  }
}
