import { Observable } from 'rxjs';

import { MockLessonPlannerApiBase, type MockApiCtor } from './mock-lesson-planner-base';
import {
  CreateExpSciQuizQuestionRequest,
  CreateExpSciQuizRequest,
  CreateExperimentRequest,
  CreateLessonRequest,
  CreatePhaseRequest,
  CreateTopicRequest,
  ExpSciQuizDto,
  ExpSciQuizQuestionDto,
  ExperimentDto,
  LessonDto,
  PhaseDto,
  StudentProgressDto,
  TopicDto,
  UpdateExpSciQuizQuestionRequest,
  UpdateExpSciQuizRequest,
  UpdateExperimentRequest,
  UpdateLessonRequest,
  UpdatePhaseRequest,
  UpdateStudentProgressRequest,
  UpdateTopicRequest,
} from './mock-lesson-planner-models';

/**
 * sciences delegation mixin: every method forwards to the injected
 * MockSciencesService instance (see MockLessonPlannerApiBase.sciences).
 */
export function withSciences<T extends MockApiCtor>(Base: T) {
  return class extends Base {
    // ===== Experimental Sciences =====
    getExperimentalSciencesPhases(): Observable<PhaseDto[]> {
      return this.sciences.getExperimentalSciencesPhases();
    }

    getExperimentalSciencesPhase(id: number): Observable<PhaseDto> {
      return this.sciences.getExperimentalSciencesPhase(id);
    }

    createExperimentalSciencesPhase(request: CreatePhaseRequest): Observable<PhaseDto> {
      return this.sciences.createExperimentalSciencesPhase(request);
    }

    updateExperimentalSciencesPhase(id: number, request: UpdatePhaseRequest): Observable<void> {
      return this.sciences.updateExperimentalSciencesPhase(id, request);
    }

    deleteExperimentalSciencesPhase(id: number): Observable<void> {
      return this.sciences.deleteExperimentalSciencesPhase(id);
    }

    getExperimentalSciencesTopics(): Observable<TopicDto[]> {
      return this.sciences.getExperimentalSciencesTopics();
    }

    getExperimentalSciencesTopicsByPhase(phaseId: number): Observable<TopicDto[]> {
      return this.sciences.getExperimentalSciencesTopicsByPhase(phaseId);
    }

    getExperimentalSciencesTopic(id: number): Observable<TopicDto> {
      return this.sciences.getExperimentalSciencesTopic(id);
    }

    createExperimentalSciencesTopic(request: CreateTopicRequest): Observable<TopicDto> {
      return this.sciences.createExperimentalSciencesTopic(request);
    }

    updateExperimentalSciencesTopic(id: number, request: UpdateTopicRequest): Observable<void> {
      return this.sciences.updateExperimentalSciencesTopic(id, request);
    }

    deleteExperimentalSciencesTopic(id: number): Observable<void> {
      return this.sciences.deleteExperimentalSciencesTopic(id);
    }

    getExperimentalSciencesLessonsByTopic(topicId: number): Observable<LessonDto[]> {
      return this.sciences.getExperimentalSciencesLessonsByTopic(topicId);
    }

    getExperimentalSciencesLesson(id: number): Observable<LessonDto> {
      return this.sciences.getExperimentalSciencesLesson(id);
    }

    createExperimentalSciencesLesson(request: CreateLessonRequest): Observable<LessonDto> {
      return this.sciences.createExperimentalSciencesLesson(request);
    }

    updateExperimentalSciencesLesson(id: number, request: UpdateLessonRequest): Observable<void> {
      return this.sciences.updateExperimentalSciencesLesson(id, request);
    }

    deleteExperimentalSciencesLesson(id: number): Observable<void> {
      return this.sciences.deleteExperimentalSciencesLesson(id);
    }

    getExperimentalSciencesExperimentsByLesson(lessonId: number): Observable<ExperimentDto[]> {
      return this.sciences.getExperimentalSciencesExperimentsByLesson(lessonId);
    }

    getExperimentalSciencesExperiment(id: number): Observable<ExperimentDto> {
      return this.sciences.getExperimentalSciencesExperiment(id);
    }

    createExperimentalSciencesExperiment(
      request: CreateExperimentRequest,
    ): Observable<ExperimentDto> {
      return this.sciences.createExperimentalSciencesExperiment(request);
    }

    updateExperimentalSciencesExperiment(
      id: number,
      request: UpdateExperimentRequest,
    ): Observable<void> {
      return this.sciences.updateExperimentalSciencesExperiment(id, request);
    }

    deleteExperimentalSciencesExperiment(id: number): Observable<void> {
      return this.sciences.deleteExperimentalSciencesExperiment(id);
    }

    getExperimentalSciencesQuizByLesson(lessonId: number): Observable<ExpSciQuizDto> {
      return this.sciences.getExperimentalSciencesQuizByLesson(lessonId);
    }

    getExperimentalSciencesQuiz(id: number): Observable<ExpSciQuizDto> {
      return this.sciences.getExperimentalSciencesQuiz(id);
    }

    createExperimentalSciencesQuiz(request: CreateExpSciQuizRequest): Observable<ExpSciQuizDto> {
      return this.sciences.createExperimentalSciencesQuiz(request);
    }

    updateExperimentalSciencesQuiz(id: number, request: UpdateExpSciQuizRequest): Observable<void> {
      return this.sciences.updateExperimentalSciencesQuiz(id, request);
    }

    deleteExperimentalSciencesQuiz(id: number): Observable<void> {
      return this.sciences.deleteExperimentalSciencesQuiz(id);
    }

    getExperimentalSciencesQuizQuestions(quizId: number): Observable<ExpSciQuizQuestionDto[]> {
      return this.sciences.getExperimentalSciencesQuizQuestions(quizId);
    }

    getExperimentalSciencesQuizQuestion(id: number): Observable<ExpSciQuizQuestionDto> {
      return this.sciences.getExperimentalSciencesQuizQuestion(id);
    }

    createExperimentalSciencesQuizQuestion(
      request: CreateExpSciQuizQuestionRequest,
    ): Observable<ExpSciQuizQuestionDto> {
      return this.sciences.createExperimentalSciencesQuizQuestion(request);
    }

    updateExperimentalSciencesQuizQuestion(
      id: number,
      request: UpdateExpSciQuizQuestionRequest,
    ): Observable<void> {
      return this.sciences.updateExperimentalSciencesQuizQuestion(id, request);
    }

    deleteExperimentalSciencesQuizQuestion(id: number): Observable<void> {
      return this.sciences.deleteExperimentalSciencesQuizQuestion(id);
    }

    getExperimentalSciencesStudentProgress(studentId: number): Observable<StudentProgressDto[]> {
      return this.sciences.getExperimentalSciencesStudentProgress(studentId);
    }

    getExperimentalSciencesStudentProgressByTopic(
      studentId: number,
      topicId: number,
    ): Observable<StudentProgressDto> {
      return this.sciences.getExperimentalSciencesStudentProgressByTopic(studentId, topicId);
    }

    updateExperimentalSciencesStudentProgress(
      studentId: number,
      topicId: number,
      request: UpdateStudentProgressRequest,
    ): Observable<void> {
      return this.sciences.updateExperimentalSciencesStudentProgress(studentId, topicId, request);
    }

    getExperimentalSciencesDashboardStats(): Observable<any> {
      return this.sciences.getExperimentalSciencesDashboardStats();
    }
  };
}
