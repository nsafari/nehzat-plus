import { Observable } from 'rxjs';

import {
  CareerPath,
  CareerPathMilestone,
  CareerPathProgress,
  CollaborationMetrics,
  CollaborationProject,
  CommunityMetrics,
  CreateCareerPathPayload,
  CreateCollaborationProjectPayload,
  CreateContentBlockPayload,
  CreateDiscussionPostPayload,
  CreateDiscussionThreadPayload,
  CreateLearningLevelPayload,
  CreateLearningPathPayload,
  CreatePersLitQuizPayload,
  CreatePersLitQuizQuestionPayload,
  CreateProjectDefensePayload,
  CreateSkillBasketPayload,
  CreateStudyLessonPayload,
  CreateStudyModulePayload,
  DefenseSchedule,
  DiscussionPost,
  DiscussionThread,
  EnrollUserRequest,
  LearningDashboardStatsDto,
  LearningLevel,
  LearningPath,
  LearningPathTreeDto,
  LessonContentBlock,
  PathwayRecommendation,
  PeerActivity,
  PeerReview,
  PortfolioItem,
  ProjectDefense,
  ProjectDefenseEvaluation,
  PublicShowcase,
  PersLitQuiz,
  PersLitQuizQuestion,
  QuizResultDto,
  SaveProgressPayload,
  ScheduleDefensePayload,
  SelectPathwayPayload,
  SkillBasket,
  SkillCertificate,
  SkillSharingMetrics,
  SubmitPeerReviewPayload,
  SubmitProjectDefensePayload,
  SubmitQuizRequest,
  StudyLesson,
  StudyModule,
  UpdateContentBlockPayload,
  UpdateLearningLevelPayload,
  UpdateLearningPathPayload,
  UpdatePersLitQuizPayload,
  UpdatePersLitQuizQuestionPayload,
  UpdateStudyLessonPayload,
  UpdateStudyModulePayload,
  UploadPortfolioItemPayload,
  UserDashboardDto,
  UserEnrollment,
  UserLessonProgress,
  UserQuizAttempt,
} from '../../models/lesson-planner.models';

export abstract class LearningCommunityApi {
  // ===== Persian Literature Learning System =====
  abstract getLearningPaths(): Observable<LearningPath[]>;
  abstract getLearningPath(id: number): Observable<LearningPath>;
  abstract getLearningPathTree(id: number): Observable<LearningPathTreeDto>;
  abstract createLearningPath(payload: CreateLearningPathPayload): Observable<LearningPath>;
  abstract updateLearningPath(
    id: number,
    payload: UpdateLearningPathPayload,
  ): Observable<LearningPath>;
  abstract deleteLearningPath(id: number): Observable<void>;

  abstract getLearningLevels(pathId: number): Observable<LearningLevel[]>;
  abstract getLearningLevel(id: number): Observable<LearningLevel>;
  abstract createLearningLevel(payload: CreateLearningLevelPayload): Observable<LearningLevel>;
  abstract updateLearningLevel(
    id: number,
    payload: UpdateLearningLevelPayload,
  ): Observable<LearningLevel>;
  abstract deleteLearningLevel(id: number): Observable<void>;

  abstract getStudyModules(levelId: number): Observable<StudyModule[]>;
  abstract getStudyModule(id: number): Observable<StudyModule>;
  abstract createStudyModule(payload: CreateStudyModulePayload): Observable<StudyModule>;
  abstract updateStudyModule(
    id: number,
    payload: UpdateStudyModulePayload,
  ): Observable<StudyModule>;
  abstract deleteStudyModule(id: number): Observable<void>;

  abstract getStudyLessons(moduleId: number): Observable<StudyLesson[]>;
  abstract getStudyLesson(id: number): Observable<StudyLesson>;
  abstract getLessonById(id: number): Observable<StudyLesson>;
  abstract createStudyLesson(payload: CreateStudyLessonPayload): Observable<StudyLesson>;
  abstract updateStudyLesson(
    id: number,
    payload: UpdateStudyLessonPayload,
  ): Observable<StudyLesson>;
  abstract deleteStudyLesson(id: number): Observable<void>;

  abstract getContentBlocks(lessonId: number): Observable<LessonContentBlock[]>;
  abstract createContentBlock(payload: CreateContentBlockPayload): Observable<LessonContentBlock>;
  abstract updateContentBlock(
    id: number,
    payload: UpdateContentBlockPayload,
  ): Observable<LessonContentBlock>;
  abstract deleteContentBlock(id: number): Observable<void>;

  abstract getQuizzes(lessonId: number): Observable<PersLitQuiz[]>;
  abstract getQuiz(id: number): Observable<PersLitQuiz>;
  abstract getQuizById(id: number): Observable<PersLitQuiz>;
  abstract createQuiz(payload: CreatePersLitQuizPayload): Observable<PersLitQuiz>;
  abstract updateQuiz(id: number, payload: UpdatePersLitQuizPayload): Observable<PersLitQuiz>;
  abstract deleteQuiz(id: number): Observable<void>;

  abstract getQuizQuestions(quizId: number): Observable<PersLitQuizQuestion[]>;
  abstract createQuizQuestion(
    payload: CreatePersLitQuizQuestionPayload,
  ): Observable<PersLitQuizQuestion>;
  abstract updateQuizQuestion(
    id: number,
    payload: UpdatePersLitQuizQuestionPayload,
  ): Observable<PersLitQuizQuestion>;
  abstract deleteQuizQuestion(id: number): Observable<void>;

  abstract enrollUser(payload: EnrollUserRequest): Observable<UserEnrollment>;
  abstract getUserEnrollments(userId?: number): Observable<UserEnrollment[]>;
  abstract getUserDashboard(userId: number, pathId: number): Observable<UserDashboardDto>;
  abstract getLearningDashboardStats(): Observable<LearningDashboardStatsDto>;

  abstract updateLessonProgress(payload: {
    lessonId: number;
    status: string;
    score?: number;
  }): Observable<UserLessonProgress>;

  abstract submitQuiz(payload: SubmitQuizRequest): Observable<QuizResultDto>;
  abstract getUserQuizAttempts(enrollmentId: number): Observable<UserQuizAttempt[]>;

  // ===== Career Pathways Module (Phase 7) =====
  abstract getCareerPaths(): Observable<CareerPath[]>;
  abstract getCareerPathById(id: number): Observable<CareerPath>;
  abstract createCareerPath(payload: CreateCareerPathPayload): Observable<CareerPath>;
  abstract getCareerPathMilestones(pathId: number): Observable<CareerPathMilestone[]>;
  abstract getCareerPathProgress(pathId: number): Observable<CareerPathProgress>;
  abstract saveProgress(payload: SaveProgressPayload): Observable<CareerPathProgress>;
  abstract getPathwayRecommendations(): Observable<PathwayRecommendation[]>;
  abstract selectPathway(payload: SelectPathwayPayload): Observable<void>;

  // ===== Social/Collaboration Module (Phase 5) =====
  abstract getCollaborationProjects(): Observable<CollaborationProject[]>;
  abstract createCollaborationProject(
    payload: CreateCollaborationProjectPayload,
  ): Observable<CollaborationProject>;
  abstract getDiscussions(projectId: number): Observable<DiscussionThread[]>;
  abstract createDiscussionThread(
    payload: CreateDiscussionThreadPayload,
  ): Observable<DiscussionThread>;
  abstract getDiscussionPosts(threadId: number): Observable<DiscussionPost[]>;
  abstract createDiscussionPost(payload: CreateDiscussionPostPayload): Observable<DiscussionPost>;
  abstract getPeerReviews(): Observable<PeerReview[]>;
  abstract submitPeerReview(payload: SubmitPeerReviewPayload): Observable<PeerReview>;

  // ===== Career & Portfolio Module (Phase 6) =====
  abstract getPortfolioItems(): Observable<PortfolioItem[]>;
  abstract uploadPortfolioItem(payload: UploadPortfolioItemPayload): Observable<PortfolioItem>;
  abstract getSkillCertificates(): Observable<SkillCertificate[]>;
  abstract getSkillBasket(): Observable<SkillBasket | null>;
  abstract createSkillBasket(payload: CreateSkillBasketPayload): Observable<SkillBasket>;

  // ===== Project Defense Module (Phase 8) =====
  abstract getProjectDefenses(): Observable<ProjectDefense[]>;
  abstract getProjectDefenseById(id: number): Observable<ProjectDefense>;
  abstract createProjectDefense(payload: CreateProjectDefensePayload): Observable<ProjectDefense>;
  abstract submitProjectDefense(payload: SubmitProjectDefensePayload): Observable<ProjectDefense>;
  abstract getProjectDefenseEvaluations(defenseId: number): Observable<ProjectDefenseEvaluation[]>;
  abstract scheduleDefense(payload: ScheduleDefensePayload): Observable<DefenseSchedule>;
  abstract getDefenseSchedule(studentId: number): Observable<DefenseSchedule | null>;

  // ===== Community Metrics Module (Phase 9) =====
  abstract getCommunityMetrics(): Observable<CommunityMetrics>;
  abstract getPeerActivity(limit?: number): Observable<PeerActivity[]>;
  abstract getSkillSharingMetrics(): Observable<SkillSharingMetrics>;
  abstract getCollaborationMetrics(): Observable<CollaborationMetrics>;
  abstract getPublicShowcases(limit?: number): Observable<PublicShowcase[]>;
}
