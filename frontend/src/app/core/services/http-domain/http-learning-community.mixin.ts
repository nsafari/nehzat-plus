import { Constructor, HttpServiceContext } from './base';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
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
  CreateQuizPayload,
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
  PersLitQuiz,
  PersLitQuizQuestion,
  PortfolioItem,
  ProjectDefense,
  ProjectDefenseEvaluation,
  PublicShowcase,
  QuizResultDto,
  SaveProgressPayload,
  ScheduleDefensePayload,
  SelectPathwayPayload,
  SkillBasket,
  SkillCertificate,
  SkillSharingMetrics,
  StudyLesson,
  StudyModule,
  SubmitPeerReviewPayload,
  SubmitProjectDefensePayload,
  SubmitQuizRequest,
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

export function WithLearningCommunity<TBase extends Constructor<HttpServiceContext>>(Base: TBase) {
  return class extends Base {
    getLearningPaths(): Observable<LearningPath[]> {
      return this.http.get<LearningPath[]>(this.url('/api/learning/paths'));
    }

    getLearningPath(id: number): Observable<LearningPath> {
      return this.http.get<LearningPath>(this.url(`/api/learning/paths/${id}`));
    }

    getLearningPathTree(id: number): Observable<LearningPathTreeDto> {
      return this.http.get<LearningPathTreeDto>(this.url(`/api/learning/paths/${id}/tree`));
    }

    createLearningPath(payload: CreateLearningPathPayload): Observable<LearningPath> {
      return this.http.post<LearningPath>(this.url('/api/learning/paths'), payload);
    }

    updateLearningPath(id: number, payload: UpdateLearningPathPayload): Observable<LearningPath> {
      return this.http.put<LearningPath>(this.url(`/api/learning/paths/${id}`), payload);
    }

    deleteLearningPath(id: number): Observable<void> {
      return this.http.delete<void>(this.url(`/api/learning/paths/${id}`));
    }

    getLearningLevels(pathId: number): Observable<LearningLevel[]> {
      return this.http.get<LearningLevel[]>(this.url(`/api/learning/paths/${pathId}/levels`));
    }

    getLearningLevel(id: number): Observable<LearningLevel> {
      return this.http.get<LearningLevel>(this.url(`/api/learning/levels/${id}`));
    }

    createLearningLevel(payload: CreateLearningLevelPayload): Observable<LearningLevel> {
      return this.http.post<LearningLevel>(this.url('/api/learning/levels'), payload);
    }

    updateLearningLevel(
      id: number,
      payload: UpdateLearningLevelPayload,
    ): Observable<LearningLevel> {
      return this.http.put<LearningLevel>(this.url(`/api/learning/levels/${id}`), payload);
    }

    deleteLearningLevel(id: number): Observable<void> {
      return this.http.delete<void>(this.url(`/api/learning/levels/${id}`));
    }

    getStudyModules(levelId: number): Observable<StudyModule[]> {
      return this.http.get<StudyModule[]>(this.url(`/api/learning/levels/${levelId}/modules`));
    }

    getStudyModule(id: number): Observable<StudyModule> {
      return this.http.get<StudyModule>(this.url(`/api/learning/modules/${id}`));
    }

    createStudyModule(payload: CreateStudyModulePayload): Observable<StudyModule> {
      return this.http.post<StudyModule>(this.url('/api/learning/modules'), payload);
    }

    updateStudyModule(id: number, payload: UpdateStudyModulePayload): Observable<StudyModule> {
      return this.http.put<StudyModule>(this.url(`/api/learning/modules/${id}`), payload);
    }

    deleteStudyModule(id: number): Observable<void> {
      return this.http.delete<void>(this.url(`/api/learning/modules/${id}`));
    }

    getStudyLessons(moduleId: number): Observable<StudyLesson[]> {
      return this.http.get<StudyLesson[]>(this.url(`/api/learning/modules/${moduleId}/lessons`));
    }

    getStudyLesson(id: number): Observable<StudyLesson> {
      return this.http.get<StudyLesson>(this.url(`/api/learning/lessons/${id}`));
    }

    getLessonById(id: number): Observable<StudyLesson> {
      return this.http.get<StudyLesson>(this.url(`/api/learning/lessons/${id}`));
    }

    createStudyLesson(payload: CreateStudyLessonPayload): Observable<StudyLesson> {
      return this.http.post<StudyLesson>(this.url('/api/learning/lessons'), payload);
    }

    updateStudyLesson(id: number, payload: UpdateStudyLessonPayload): Observable<StudyLesson> {
      return this.http.put<StudyLesson>(this.url(`/api/learning/lessons/${id}`), payload);
    }

    deleteStudyLesson(id: number): Observable<void> {
      return this.http.delete<void>(this.url(`/api/learning/lessons/${id}`));
    }

    getContentBlocks(lessonId: number): Observable<LessonContentBlock[]> {
      return this.http.get<LessonContentBlock[]>(
        this.url(`/api/learning/lessons/${lessonId}/content-blocks`),
      );
    }

    createContentBlock(payload: CreateContentBlockPayload): Observable<LessonContentBlock> {
      return this.http.post<LessonContentBlock>(this.url('/api/learning/content-blocks'), payload);
    }

    updateContentBlock(
      id: number,
      payload: UpdateContentBlockPayload,
    ): Observable<LessonContentBlock> {
      return this.http.put<LessonContentBlock>(
        this.url(`/api/learning/content-blocks/${id}`),
        payload,
      );
    }

    deleteContentBlock(id: number): Observable<void> {
      return this.http.delete<void>(this.url(`/api/learning/content-blocks/${id}`));
    }

    getQuizzes(lessonId: number): Observable<PersLitQuiz[]> {
      return this.http.get<PersLitQuiz[]>(this.url(`/api/learning/lessons/${lessonId}/quizzes`));
    }

    getQuiz(id: number): Observable<PersLitQuiz> {
      return this.http.get<PersLitQuiz>(this.url(`/api/learning/quizzes/${id}`));
    }

    getQuizById(id: number): Observable<PersLitQuiz> {
      return this.http.get<PersLitQuiz>(this.url(`/api/learning/quizzes/${id}`));
    }

    createQuiz(payload: CreatePersLitQuizPayload): Observable<PersLitQuiz> {
      return this.http.post<PersLitQuiz>(this.url('/api/learning/quizzes'), payload);
    }

    updateQuiz(id: number, payload: UpdatePersLitQuizPayload): Observable<PersLitQuiz> {
      return this.http.put<PersLitQuiz>(this.url(`/api/learning/quizzes/${id}`), payload);
    }

    deleteQuiz(id: number): Observable<void> {
      return this.http.delete<void>(this.url(`/api/learning/quizzes/${id}`));
    }

    getQuizQuestions(quizId: number): Observable<PersLitQuizQuestion[]> {
      return this.http.get<PersLitQuizQuestion[]>(
        this.url(`/api/learning/quizzes/${quizId}/questions`),
      );
    }

    createQuizQuestion(payload: CreatePersLitQuizQuestionPayload): Observable<PersLitQuizQuestion> {
      return this.http.post<PersLitQuizQuestion>(this.url('/api/learning/quiz-questions'), payload);
    }

    updateQuizQuestion(
      id: number,
      payload: UpdatePersLitQuizQuestionPayload,
    ): Observable<PersLitQuizQuestion> {
      return this.http.put<PersLitQuizQuestion>(
        this.url(`/api/learning/quiz-questions/${id}`),
        payload,
      );
    }

    deleteQuizQuestion(id: number): Observable<void> {
      return this.http.delete<void>(this.url(`/api/learning/quiz-questions/${id}`));
    }

    enrollUser(payload: EnrollUserRequest): Observable<UserEnrollment> {
      return this.http.post<UserEnrollment>(this.url('/api/learning/enroll'), payload);
    }

    getUserEnrollments(userId?: number): Observable<UserEnrollment[]> {
      const url = userId
        ? this.url(`/api/learning/enrollments/${userId}`)
        : this.url('/api/learning/enrollments');
      return this.http.get<UserEnrollment[]>(url);
    }

    getUserDashboard(userId: number, pathId: number): Observable<UserDashboardDto> {
      return this.http.get<UserDashboardDto>(
        this.url(`/api/learning/dashboard/${userId}/${pathId}`),
      );
    }

    getLearningDashboardStats(): Observable<LearningDashboardStatsDto> {
      return this.http.get<LearningDashboardStatsDto>(this.url('/api/learning/dashboard/stats'));
    }

    updateLessonProgress(payload: {
      lessonId: number;
      status: string;
      score?: number;
    }): Observable<UserLessonProgress> {
      return this.http.patch<UserLessonProgress>(
        this.url(`/api/learning/progress/${payload.lessonId}`),
        { status: payload.status, score: payload.score },
      );
    }

    submitQuiz(payload: SubmitQuizRequest): Observable<any> {
      return this.http.post<any>(this.url('/api/learning/quiz/submit'), payload);
    }

    getUserQuizAttempts(enrollmentId: number): Observable<UserQuizAttempt[]> {
      return this.http.get<UserQuizAttempt[]>(
        this.url(`/api/learning/quiz-attempts/${enrollmentId}`),
      );
    }

    getCareerPaths(): Observable<CareerPath[]> {
      return this.http.get<CareerPath[]>(this.url('/api/career-paths'));
    }

    getCareerPathById(id: number): Observable<CareerPath> {
      return this.http.get<CareerPath>(this.url(`/api/career-paths/${id}`));
    }

    createCareerPath(payload: CreateCareerPathPayload): Observable<CareerPath> {
      return this.http.post<CareerPath>(this.url('/api/career-paths'), payload);
    }

    getCareerPathMilestones(pathId: number): Observable<CareerPathMilestone[]> {
      return this.http.get<CareerPathMilestone[]>(
        this.url(`/api/career-paths/${pathId}/milestones`),
      );
    }

    getCareerPathProgress(pathId: number): Observable<CareerPathProgress> {
      return this.http.get<CareerPathProgress>(this.url(`/api/career-paths/${pathId}/progress`));
    }

    saveProgress(payload: SaveProgressPayload): Observable<CareerPathProgress> {
      return this.http.put<CareerPathProgress>(this.url('/api/career-paths/progress'), payload);
    }

    getPathwayRecommendations(): Observable<PathwayRecommendation[]> {
      return this.http.get<PathwayRecommendation[]>(this.url('/api/career-paths/recommendations'));
    }

    selectPathway(payload: SelectPathwayPayload): Observable<void> {
      return this.http.post<void>(this.url('/api/career-paths/select'), payload);
    }

    getCollaborationProjects(): Observable<CollaborationProject[]> {
      return this.http.get<CollaborationProject[]>(this.url('/api/social/projects'));
    }

    createCollaborationProject(
      payload: CreateCollaborationProjectPayload,
    ): Observable<CollaborationProject> {
      return this.http.post<CollaborationProject>(this.url('/api/social/projects'), payload);
    }

    getDiscussions(projectId: number): Observable<DiscussionThread[]> {
      return this.http.get<DiscussionThread[]>(
        this.url(`/api/social/projects/${projectId}/discussions`),
      );
    }

    createDiscussionThread(payload: CreateDiscussionThreadPayload): Observable<DiscussionThread> {
      return this.http.post<DiscussionThread>(this.url('/api/social/discussions'), payload);
    }

    getDiscussionPosts(threadId: number): Observable<DiscussionPost[]> {
      return this.http.get<DiscussionPost[]>(this.url(`/api/social/discussions/${threadId}/posts`));
    }

    createDiscussionPost(payload: CreateDiscussionPostPayload): Observable<DiscussionPost> {
      return this.http.post<DiscussionPost>(this.url('/api/social/posts'), payload);
    }

    getPeerReviews(): Observable<PeerReview[]> {
      return this.http.get<PeerReview[]>(this.url('/api/social/peer-reviews'));
    }

    submitPeerReview(payload: SubmitPeerReviewPayload): Observable<PeerReview> {
      return this.http.post<PeerReview>(this.url('/api/social/peer-reviews'), payload);
    }

    getPortfolioItems(): Observable<PortfolioItem[]> {
      return this.http.get<PortfolioItem[]>(this.url('/api/portfolio/items'));
    }

    uploadPortfolioItem(payload: UploadPortfolioItemPayload): Observable<PortfolioItem> {
      return this.http.post<PortfolioItem>(this.url('/api/portfolio/items'), payload);
    }

    getSkillCertificates(): Observable<SkillCertificate[]> {
      return this.http.get<SkillCertificate[]>(this.url('/api/portfolio/certificates'));
    }

    getSkillBasket(): Observable<SkillBasket> {
      return this.http.get<SkillBasket>(this.url('/api/portfolio/skills'));
    }

    createSkillBasket(payload: CreateSkillBasketPayload): Observable<SkillBasket> {
      return this.http.post<SkillBasket>(this.url('/api/portfolio/skills'), payload);
    }

    getProjectDefenses(): Observable<ProjectDefense[]> {
      return this.http.get<ProjectDefense[]>(this.url('/api/project-defenses'));
    }

    getProjectDefenseById(id: number): Observable<ProjectDefense> {
      return this.http.get<ProjectDefense>(this.url(`/api/project-defenses/${id}`));
    }

    createProjectDefense(payload: CreateProjectDefensePayload): Observable<ProjectDefense> {
      return this.http.post<ProjectDefense>(this.url('/api/project-defenses'), payload);
    }

    submitProjectDefense(payload: SubmitProjectDefensePayload): Observable<ProjectDefense> {
      return this.http.post<ProjectDefense>(this.url('/api/project-defenses/submit'), payload);
    }

    getProjectDefenseEvaluations(defenseId: number): Observable<ProjectDefenseEvaluation[]> {
      return this.http.get<ProjectDefenseEvaluation[]>(
        this.url(`/api/project-defenses/${defenseId}/evaluations`),
      );
    }

    scheduleDefense(payload: ScheduleDefensePayload): Observable<DefenseSchedule> {
      return this.http.post<DefenseSchedule>(this.url('/api/project-defenses/schedule'), payload);
    }

    getDefenseSchedule(studentId: number): Observable<DefenseSchedule | null> {
      return this.http.get<DefenseSchedule | null>(
        this.url(`/api/project-defenses/schedule/${studentId}`),
      );
    }

    getCommunityMetrics(): Observable<CommunityMetrics> {
      return this.http.get<CommunityMetrics>(this.url('/api/community/metrics'));
    }

    getPeerActivity(limit?: number): Observable<PeerActivity[]> {
      let params = new HttpParams();
      if (limit) params = params.set('limit', limit.toString());
      return this.http.get<PeerActivity[]>(this.url('/api/community/activity'), { params });
    }

    getSkillSharingMetrics(): Observable<SkillSharingMetrics> {
      return this.http.get<SkillSharingMetrics>(this.url('/api/community/skill-sharing'));
    }

    getCollaborationMetrics(): Observable<CollaborationMetrics> {
      return this.http.get<CollaborationMetrics>(this.url('/api/community/collaboration'));
    }

    getPublicShowcases(limit?: number): Observable<PublicShowcase[]> {
      let params = new HttpParams();
      if (limit) params = params.set('limit', limit.toString());
      return this.http.get<PublicShowcase[]>(this.url('/api/community/showcase'), { params });
    }
  };
}
