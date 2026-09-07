import { Observable } from 'rxjs';

import {
  CreateExpSciQuizQuestionRequest,
  CreateExpSciQuizRequest,
  CreateExperimentRequest,
  CreateLessonRequest,
  CreateMathContributionPayload,
  CreateMathLessonPayload,
  CreateMathQuestionPayload,
  CreateMathScholarPayload,
  CreateMathTopicPayload,
  CreatePhaseRequest,
  CreateTopicRequest,
  ExpSciQuizDto,
  ExpSciQuizQuestionDto,
  ExperimentDto,
  LessonDto,
  MathContribution,
  MathLesson,
  MathProgress,
  MathQuestion,
  MathScholar,
  MathTopic,
  PhaseDto,
  RecordMathProgressPayload,
  StudentProgressDto,
  TopicDto,
  UpdateExpSciQuizQuestionRequest,
  UpdateExpSciQuizRequest,
  UpdateExperimentRequest,
  UpdateLessonRequest,
  UpdateMathContributionPayload,
  UpdateMathLessonPayload,
  UpdateMathProgressPayload,
  UpdateMathQuestionPayload,
  UpdateMathScholarPayload,
  UpdateMathTopicPayload,
  UpdatePhaseRequest,
  UpdateStudentProgressRequest,
  UpdateTopicRequest,
} from '../../models/lesson-planner.models';

export abstract class MathSciencesApi {
  // Math Module
  abstract getMathTopics(): Observable<MathTopic[]>;
  abstract getMathTopicById(id: number): Observable<MathTopic>;
  abstract createMathTopic(payload: CreateMathTopicPayload): Observable<MathTopic>;
  abstract updateMathTopic(id: number, payload: UpdateMathTopicPayload): Observable<MathTopic>;
  abstract deleteMathTopic(id: number): Observable<void>;
  abstract searchMathTopics(query: string, maxResults?: number): Observable<MathTopic[]>;

  abstract getMathLessons(topicId?: number): Observable<MathLesson[]>;
  abstract getMathLessonById(id: number): Observable<MathLesson>;
  abstract createMathLesson(payload: CreateMathLessonPayload): Observable<MathLesson>;
  abstract updateMathLesson(id: number, payload: UpdateMathLessonPayload): Observable<MathLesson>;
  abstract deleteMathLesson(id: number): Observable<void>;
  abstract searchMathLessons(query: string, maxResults?: number): Observable<MathLesson[]>;

  abstract getMathQuestions(lessonId?: number): Observable<MathQuestion[]>;
  abstract getMathQuestionById(id: number): Observable<MathQuestion>;
  abstract createMathQuestion(payload: CreateMathQuestionPayload): Observable<MathQuestion>;
  abstract updateMathQuestion(
    id: number,
    payload: UpdateMathQuestionPayload,
  ): Observable<MathQuestion>;
  abstract deleteMathQuestion(id: number): Observable<void>;

  abstract getMathStudentProgress(studentId: number): Observable<MathProgress[]>;
  abstract getMathStudentLessonProgress(
    studentId: number,
    lessonId: number,
  ): Observable<MathProgress>;
  abstract recordMathProgress(payload: RecordMathProgressPayload): Observable<MathProgress>;
  abstract updateMathProgress(
    id: number,
    payload: UpdateMathProgressPayload,
  ): Observable<MathProgress>;

  abstract getMathDashboardStats(): Observable<Record<string, unknown>>;

  abstract getMathScholars(): Observable<MathScholar[]>;
  abstract getMathScholarById(id: number): Observable<MathScholar>;
  abstract createMathScholar(payload: CreateMathScholarPayload): Observable<MathScholar>;
  abstract updateMathScholar(
    id: number,
    payload: UpdateMathScholarPayload,
  ): Observable<MathScholar>;
  abstract deleteMathScholar(id: number): Observable<void>;
  abstract searchMathScholars(query: string, maxResults?: number): Observable<MathScholar[]>;

  abstract getMathContributions(
    scholarId?: number,
    topicId?: number,
  ): Observable<MathContribution[]>;
  abstract getMathContributionById(id: number): Observable<MathContribution>;
  abstract createMathContribution(
    payload: CreateMathContributionPayload,
  ): Observable<MathContribution>;
  abstract updateMathContribution(
    id: number,
    payload: UpdateMathContributionPayload,
  ): Observable<MathContribution>;
  abstract deleteMathContribution(id: number): Observable<void>;

  // Experimental Sciences (علوم تجربی)
  abstract getExperimentalSciencesPhases(): Observable<PhaseDto[]>;
  abstract getExperimentalSciencesPhase(id: number): Observable<PhaseDto>;
  abstract createExperimentalSciencesPhase(request: CreatePhaseRequest): Observable<PhaseDto>;
  abstract updateExperimentalSciencesPhase(
    id: number,
    request: UpdatePhaseRequest,
  ): Observable<void>;
  abstract deleteExperimentalSciencesPhase(id: number): Observable<void>;

  abstract getExperimentalSciencesTopics(): Observable<TopicDto[]>;
  abstract getExperimentalSciencesTopicsByPhase(phaseId: number): Observable<TopicDto[]>;
  abstract getExperimentalSciencesTopic(id: number): Observable<TopicDto>;
  abstract createExperimentalSciencesTopic(request: CreateTopicRequest): Observable<TopicDto>;
  abstract updateExperimentalSciencesTopic(
    id: number,
    request: UpdateTopicRequest,
  ): Observable<void>;
  abstract deleteExperimentalSciencesTopic(id: number): Observable<void>;

  abstract getExperimentalSciencesLessonsByTopic(topicId: number): Observable<LessonDto[]>;
  abstract getExperimentalSciencesLesson(id: number): Observable<LessonDto>;
  abstract createExperimentalSciencesLesson(request: CreateLessonRequest): Observable<LessonDto>;
  abstract updateExperimentalSciencesLesson(
    id: number,
    request: UpdateLessonRequest,
  ): Observable<void>;
  abstract deleteExperimentalSciencesLesson(id: number): Observable<void>;

  abstract getExperimentalSciencesExperimentsByLesson(
    lessonId: number,
  ): Observable<ExperimentDto[]>;
  abstract getExperimentalSciencesExperiment(id: number): Observable<ExperimentDto>;
  abstract createExperimentalSciencesExperiment(
    request: CreateExperimentRequest,
  ): Observable<ExperimentDto>;
  abstract updateExperimentalSciencesExperiment(
    id: number,
    request: UpdateExperimentRequest,
  ): Observable<void>;
  abstract deleteExperimentalSciencesExperiment(id: number): Observable<void>;

  abstract getExperimentalSciencesQuizByLesson(lessonId: number): Observable<ExpSciQuizDto>;
  abstract getExperimentalSciencesQuiz(id: number): Observable<ExpSciQuizDto>;
  abstract createExperimentalSciencesQuiz(
    request: CreateExpSciQuizRequest,
  ): Observable<ExpSciQuizDto>;
  abstract updateExperimentalSciencesQuiz(
    id: number,
    request: UpdateExpSciQuizRequest,
  ): Observable<void>;
  abstract deleteExperimentalSciencesQuiz(id: number): Observable<void>;

  abstract getExperimentalSciencesQuizQuestions(
    quizId: number,
  ): Observable<ExpSciQuizQuestionDto[]>;
  abstract getExperimentalSciencesQuizQuestion(id: number): Observable<ExpSciQuizQuestionDto>;
  abstract createExperimentalSciencesQuizQuestion(
    request: CreateExpSciQuizQuestionRequest,
  ): Observable<ExpSciQuizQuestionDto>;
  abstract updateExperimentalSciencesQuizQuestion(
    id: number,
    request: UpdateExpSciQuizQuestionRequest,
  ): Observable<void>;
  abstract deleteExperimentalSciencesQuizQuestion(id: number): Observable<void>;

  abstract getExperimentalSciencesStudentProgress(
    studentId: number,
  ): Observable<StudentProgressDto[]>;
  abstract getExperimentalSciencesStudentProgressByTopic(
    studentId: number,
    topicId: number,
  ): Observable<StudentProgressDto>;
  abstract updateExperimentalSciencesStudentProgress(
    studentId: number,
    topicId: number,
    request: UpdateStudentProgressRequest,
  ): Observable<void>;

  abstract getExperimentalSciencesDashboardStats(): Observable<any>;
}
