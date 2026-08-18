import { Constructor, HttpServiceContext } from './base';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import {
  CreateMathContributionPayload,
  CreateMathLessonPayload,
  CreateMathQuestionPayload,
  CreateMathScholarPayload,
  CreateMathTopicPayload,
  CreatePhaseRequest,
  CreateExpSciQuizQuestionRequest,
  CreateExpSciQuizRequest,
  CreateExperimentRequest,
  CreateLessonRequest,
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

export function WithMathSciences<TBase extends Constructor<HttpServiceContext>>(Base: TBase) {
  return class extends Base {
    getMathTopics(): Observable<MathTopic[]> {
      return this.http.get<MathTopic[]>(this.url('/api/math/topics'));
    }

    getMathTopicById(id: number): Observable<MathTopic> {
      return this.http.get<MathTopic>(this.url(`/api/math/topics/${id}`));
    }

    createMathTopic(payload: CreateMathTopicPayload): Observable<MathTopic> {
      return this.http.post<MathTopic>(this.url('/api/math/topics'), payload);
    }

    updateMathTopic(id: number, payload: UpdateMathTopicPayload): Observable<MathTopic> {
      return this.http.put<MathTopic>(this.url(`/api/math/topics/${id}`), payload);
    }

    deleteMathTopic(id: number): Observable<void> {
      return this.http.delete<void>(this.url(`/api/math/topics/${id}`));
    }

    searchMathTopics(query: string, maxResults?: number): Observable<MathTopic[]> {
      let params = new HttpParams().set('query', query);
      if (maxResults) params = params.set('maxResults', maxResults.toString());
      return this.http.get<MathTopic[]>(this.url('/api/math/topics/search'), { params });
    }

    getMathLessons(topicId?: number): Observable<MathLesson[]> {
      let params = new HttpParams();
      if (topicId) params = params.set('topicId', topicId.toString());
      return this.http.get<MathLesson[]>(this.url('/api/math/lessons'), { params });
    }

    getMathLessonById(id: number): Observable<MathLesson> {
      return this.http.get<MathLesson>(this.url(`/api/math/lessons/${id}`));
    }

    createMathLesson(payload: CreateMathLessonPayload): Observable<MathLesson> {
      return this.http.post<MathLesson>(this.url('/api/math/lessons'), payload);
    }

    updateMathLesson(id: number, payload: UpdateMathLessonPayload): Observable<MathLesson> {
      return this.http.put<MathLesson>(this.url(`/api/math/lessons/${id}`), payload);
    }

    deleteMathLesson(id: number): Observable<void> {
      return this.http.delete<void>(this.url(`/api/math/lessons/${id}`));
    }

    searchMathLessons(query: string, maxResults?: number): Observable<MathLesson[]> {
      let params = new HttpParams().set('query', query);
      if (maxResults) params = params.set('maxResults', maxResults.toString());
      return this.http.get<MathLesson[]>(this.url('/api/math/lessons/search'), { params });
    }

    getMathQuestions(lessonId?: number): Observable<MathQuestion[]> {
      let params = new HttpParams();
      if (lessonId) params = params.set('lessonId', lessonId.toString());
      return this.http.get<MathQuestion[]>(this.url('/api/math/questions'), { params });
    }

    getMathQuestionById(id: number): Observable<MathQuestion> {
      return this.http.get<MathQuestion>(this.url(`/api/math/questions/${id}`));
    }

    createMathQuestion(payload: CreateMathQuestionPayload): Observable<MathQuestion> {
      return this.http.post<MathQuestion>(this.url('/api/math/questions'), payload);
    }

    updateMathQuestion(id: number, payload: UpdateMathQuestionPayload): Observable<MathQuestion> {
      return this.http.put<MathQuestion>(this.url(`/api/math/questions/${id}`), payload);
    }

    deleteMathQuestion(id: number): Observable<void> {
      return this.http.delete<void>(this.url(`/api/math/questions/${id}`));
    }

    getMathStudentProgress(studentId: number): Observable<MathProgress[]> {
      return this.http.get<MathProgress[]>(this.url(`/api/math/progress/${studentId}`));
    }

    getMathStudentLessonProgress(studentId: number, lessonId: number): Observable<MathProgress> {
      return this.http.get<MathProgress>(
        this.url(`/api/math/progress/${studentId}/lesson/${lessonId}`),
      );
    }

    recordMathProgress(payload: RecordMathProgressPayload): Observable<MathProgress> {
      return this.http.post<MathProgress>(this.url('/api/math/progress'), payload);
    }

    updateMathProgress(id: number, payload: UpdateMathProgressPayload): Observable<MathProgress> {
      return this.http.put<MathProgress>(this.url(`/api/math/progress/${id}`), payload);
    }

    getMathDashboardStats(): Observable<Record<string, unknown>> {
      return this.http.get<Record<string, unknown>>(this.url('/api/math/stats'));
    }

    getMathScholars(): Observable<MathScholar[]> {
      return this.http.get<MathScholar[]>(this.url('/api/math/scholars'));
    }

    getMathScholarById(id: number): Observable<MathScholar> {
      return this.http.get<MathScholar>(this.url(`/api/math/scholars/${id}`));
    }

    createMathScholar(payload: CreateMathScholarPayload): Observable<MathScholar> {
      return this.http.post<MathScholar>(this.url('/api/math/scholars'), payload);
    }

    updateMathScholar(id: number, payload: UpdateMathScholarPayload): Observable<MathScholar> {
      return this.http.put<MathScholar>(this.url(`/api/math/scholars/${id}`), payload);
    }

    deleteMathScholar(id: number): Observable<void> {
      return this.http.delete<void>(this.url(`/api/math/scholars/${id}`));
    }

    searchMathScholars(query: string, maxResults?: number): Observable<MathScholar[]> {
      let params = new HttpParams().set('query', query);
      if (maxResults) params = params.set('maxResults', maxResults.toString());
      return this.http.get<MathScholar[]>(this.url('/api/math/scholars/search'), { params });
    }

    getMathContributions(scholarId?: number, topicId?: number): Observable<MathContribution[]> {
      let params = new HttpParams();
      if (scholarId) params = params.set('scholarId', scholarId.toString());
      if (topicId) params = params.set('topicId', topicId.toString());
      return this.http.get<MathContribution[]>(this.url('/api/math/contributions'), { params });
    }

    getMathContributionById(id: number): Observable<MathContribution> {
      return this.http.get<MathContribution>(this.url(`/api/math/contributions/${id}`));
    }

    createMathContribution(payload: CreateMathContributionPayload): Observable<MathContribution> {
      return this.http.post<MathContribution>(this.url('/api/math/contributions'), payload);
    }

    updateMathContribution(
      id: number,
      payload: UpdateMathContributionPayload,
    ): Observable<MathContribution> {
      return this.http.put<MathContribution>(this.url(`/api/math/contributions/${id}`), payload);
    }

    deleteMathContribution(id: number): Observable<void> {
      return this.http.delete<void>(this.url(`/api/math/contributions/${id}`));
    }

    getExperimentalSciencesPhases(): Observable<PhaseDto[]> {
      return this.http.get<PhaseDto[]>(this.url('/api/experimental-science/phases'));
    }

    getExperimentalSciencesPhase(id: number): Observable<PhaseDto> {
      return this.http.get<PhaseDto>(this.url(`/api/experimental-science/phases/${id}`));
    }

    createExperimentalSciencesPhase(request: CreatePhaseRequest): Observable<PhaseDto> {
      return this.http.post<PhaseDto>(this.url('/api/experimental-science/phases'), request);
    }

    updateExperimentalSciencesPhase(id: number, request: UpdatePhaseRequest): Observable<void> {
      return this.http.put<void>(this.url(`/api/experimental-science/phases/${id}`), request);
    }

    deleteExperimentalSciencesPhase(id: number): Observable<void> {
      return this.http.delete<void>(this.url(`/api/experimental-science/phases/${id}`));
    }

    getExperimentalSciencesTopics(): Observable<TopicDto[]> {
      return this.http.get<TopicDto[]>(this.url('/api/experimental-science/topics'));
    }

    getExperimentalSciencesTopicsByPhase(phaseId: number): Observable<TopicDto[]> {
      return this.http.get<TopicDto[]>(
        this.url(`/api/experimental-science/phases/${phaseId}/topics`),
      );
    }

    getExperimentalSciencesTopic(id: number): Observable<TopicDto> {
      return this.http.get<TopicDto>(this.url(`/api/experimental-science/topics/${id}`));
    }

    createExperimentalSciencesTopic(request: CreateTopicRequest): Observable<TopicDto> {
      return this.http.post<TopicDto>(this.url('/api/experimental-science/topics'), request);
    }

    updateExperimentalSciencesTopic(id: number, request: UpdateTopicRequest): Observable<void> {
      return this.http.put<void>(this.url(`/api/experimental-science/topics/${id}`), request);
    }

    deleteExperimentalSciencesTopic(id: number): Observable<void> {
      return this.http.delete<void>(this.url(`/api/experimental-science/topics/${id}`));
    }

    getExperimentalSciencesLessonsByTopic(topicId: number): Observable<LessonDto[]> {
      return this.http.get<LessonDto[]>(
        this.url(`/api/experimental-science/topics/${topicId}/lessons`),
      );
    }

    getExperimentalSciencesLesson(id: number): Observable<LessonDto> {
      return this.http.get<LessonDto>(this.url(`/api/experimental-science/lessons/${id}`));
    }

    createExperimentalSciencesLesson(request: CreateLessonRequest): Observable<LessonDto> {
      return this.http.post<LessonDto>(this.url('/api/experimental-science/lessons'), request);
    }

    updateExperimentalSciencesLesson(id: number, request: UpdateLessonRequest): Observable<void> {
      return this.http.put<void>(this.url(`/api/experimental-science/lessons/${id}`), request);
    }

    deleteExperimentalSciencesLesson(id: number): Observable<void> {
      return this.http.delete<void>(this.url(`/api/experimental-science/lessons/${id}`));
    }

    getExperimentalSciencesExperimentsByLesson(lessonId: number): Observable<ExperimentDto[]> {
      return this.http.get<ExperimentDto[]>(
        this.url(`/api/experimental-science/lessons/${lessonId}/experiments`),
      );
    }

    getExperimentalSciencesExperiment(id: number): Observable<ExperimentDto> {
      return this.http.get<ExperimentDto>(this.url(`/api/experimental-science/experiments/${id}`));
    }

    createExperimentalSciencesExperiment(
      request: CreateExperimentRequest,
    ): Observable<ExperimentDto> {
      return this.http.post<ExperimentDto>(
        this.url('/api/experimental-science/experiments'),
        request,
      );
    }

    updateExperimentalSciencesExperiment(
      id: number,
      request: UpdateExperimentRequest,
    ): Observable<void> {
      return this.http.put<void>(this.url(`/api/experimental-science/experiments/${id}`), request);
    }

    deleteExperimentalSciencesExperiment(id: number): Observable<void> {
      return this.http.delete<void>(this.url(`/api/experimental-science/experiments/${id}`));
    }

    getExperimentalSciencesQuizByLesson(lessonId: number): Observable<ExpSciQuizDto> {
      return this.http.get<ExpSciQuizDto>(
        this.url(`/api/experimental-science/lessons/${lessonId}/quiz`),
      );
    }

    getExperimentalSciencesQuiz(id: number): Observable<ExpSciQuizDto> {
      return this.http.get<ExpSciQuizDto>(this.url(`/api/experimental-science/quizzes/${id}`));
    }

    createExperimentalSciencesQuiz(request: CreateExpSciQuizRequest): Observable<ExpSciQuizDto> {
      return this.http.post<ExpSciQuizDto>(this.url('/api/experimental-science/quizzes'), request);
    }

    updateExperimentalSciencesQuiz(id: number, request: UpdateExpSciQuizRequest): Observable<void> {
      return this.http.put<void>(this.url(`/api/experimental-science/quizzes/${id}`), request);
    }

    deleteExperimentalSciencesQuiz(id: number): Observable<void> {
      return this.http.delete<void>(this.url(`/api/experimental-science/quizzes/${id}`));
    }

    getExperimentalSciencesQuizQuestions(quizId: number): Observable<ExpSciQuizQuestionDto[]> {
      return this.http.get<ExpSciQuizQuestionDto[]>(
        this.url(`/api/experimental-science/quizzes/${quizId}/questions`),
      );
    }

    getExperimentalSciencesQuizQuestion(id: number): Observable<ExpSciQuizQuestionDto> {
      return this.http.get<ExpSciQuizQuestionDto>(
        this.url(`/api/experimental-science/quiz-questions/${id}`),
      );
    }

    createExperimentalSciencesQuizQuestion(
      request: CreateExpSciQuizQuestionRequest,
    ): Observable<ExpSciQuizQuestionDto> {
      return this.http.post<ExpSciQuizQuestionDto>(
        this.url('/api/experimental-science/quiz-questions'),
        request,
      );
    }

    updateExperimentalSciencesQuizQuestion(
      id: number,
      request: UpdateExpSciQuizQuestionRequest,
    ): Observable<void> {
      return this.http.put<void>(
        this.url(`/api/experimental-science/quiz-questions/${id}`),
        request,
      );
    }

    deleteExperimentalSciencesQuizQuestion(id: number): Observable<void> {
      return this.http.delete<void>(this.url(`/api/experimental-science/quiz-questions/${id}`));
    }

    getExperimentalSciencesStudentProgress(studentId: number): Observable<StudentProgressDto[]> {
      return this.http.get<StudentProgressDto[]>(
        this.url(`/api/experimental-science/progress/${studentId}`),
      );
    }

    getExperimentalSciencesStudentProgressByTopic(
      studentId: number,
      topicId: number,
    ): Observable<StudentProgressDto> {
      return this.http.get<StudentProgressDto>(
        this.url(`/api/experimental-science/progress/${studentId}/topic/${topicId}`),
      );
    }

    updateExperimentalSciencesStudentProgress(
      studentId: number,
      topicId: number,
      request: UpdateStudentProgressRequest,
    ): Observable<void> {
      return this.http.put<void>(
        this.url(`/api/experimental-science/progress/${studentId}/topic/${topicId}`),
        request,
      );
    }

    getExperimentalSciencesDashboardStats(): Observable<any> {
      return this.http.get<any>(this.url('/api/experimental-science/dashboard-stats'));
    }
  };
}
