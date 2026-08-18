import { Observable } from 'rxjs';

import { MockLessonPlannerApiBase, type MockApiCtor } from './mock-lesson-planner-base';
import {
  CreateMathContributionPayload,
  CreateMathLessonPayload,
  CreateMathQuestionPayload,
  CreateMathScholarPayload,
  CreateMathTopicPayload,
  MathContribution,
  MathLesson,
  MathProgress,
  MathQuestion,
  MathScholar,
  MathTopic,
  RecordMathProgressPayload,
  UpdateMathContributionPayload,
  UpdateMathLessonPayload,
  UpdateMathProgressPayload,
  UpdateMathQuestionPayload,
  UpdateMathScholarPayload,
  UpdateMathTopicPayload,
} from './mock-lesson-planner-models';

/**
 * math delegation mixin: every method forwards to the injected
 * MockMathService instance (see MockLessonPlannerApiBase.math).
 */
export function withMath<T extends MockApiCtor>(Base: T) {
  return class extends Base {
    // ===== Math =====
    getMathTopics(): Observable<MathTopic[]> {
      return this.math.getMathTopics();
    }

    getMathTopicById(id: number): Observable<MathTopic> {
      return this.math.getMathTopicById(id);
    }

    createMathTopic(payload: CreateMathTopicPayload): Observable<MathTopic> {
      return this.math.createMathTopic(payload);
    }

    updateMathTopic(id: number, payload: UpdateMathTopicPayload): Observable<MathTopic> {
      return this.math.updateMathTopic(id, payload);
    }

    deleteMathTopic(id: number): Observable<void> {
      return this.math.deleteMathTopic(id);
    }

    searchMathTopics(query: string, maxResults?: number): Observable<MathTopic[]> {
      return this.math.searchMathTopics(query, maxResults);
    }

    getMathLessons(topicId?: number): Observable<MathLesson[]> {
      return this.math.getMathLessons(topicId);
    }

    getMathLessonById(id: number): Observable<MathLesson> {
      return this.math.getMathLessonById(id);
    }

    createMathLesson(payload: CreateMathLessonPayload): Observable<MathLesson> {
      return this.math.createMathLesson(payload);
    }

    updateMathLesson(id: number, payload: UpdateMathLessonPayload): Observable<MathLesson> {
      return this.math.updateMathLesson(id, payload);
    }

    deleteMathLesson(id: number): Observable<void> {
      return this.math.deleteMathLesson(id);
    }

    searchMathLessons(query: string, maxResults?: number): Observable<MathLesson[]> {
      return this.math.searchMathLessons(query, maxResults);
    }

    getMathQuestions(lessonId?: number): Observable<MathQuestion[]> {
      return this.math.getMathQuestions(lessonId);
    }

    getMathQuestionById(id: number): Observable<MathQuestion> {
      return this.math.getMathQuestionById(id);
    }

    createMathQuestion(payload: CreateMathQuestionPayload): Observable<MathQuestion> {
      return this.math.createMathQuestion(payload);
    }

    updateMathQuestion(id: number, payload: UpdateMathQuestionPayload): Observable<MathQuestion> {
      return this.math.updateMathQuestion(id, payload);
    }

    deleteMathQuestion(id: number): Observable<void> {
      return this.math.deleteMathQuestion(id);
    }

    getMathStudentProgress(studentId: number): Observable<MathProgress[]> {
      return this.math.getMathStudentProgress(studentId);
    }

    getMathStudentLessonProgress(studentId: number, lessonId: number): Observable<MathProgress> {
      return this.math.getMathStudentLessonProgress(studentId, lessonId);
    }

    recordMathProgress(payload: RecordMathProgressPayload): Observable<MathProgress> {
      return this.math.recordMathProgress(payload);
    }

    updateMathProgress(id: number, payload: UpdateMathProgressPayload): Observable<MathProgress> {
      return this.math.updateMathProgress(id, payload);
    }

    getMathDashboardStats(): Observable<Record<string, unknown>> {
      return this.math.getMathDashboardStats();
    }

    getMathScholars(): Observable<MathScholar[]> {
      return this.math.getMathScholars();
    }

    getMathScholarById(id: number): Observable<MathScholar> {
      return this.math.getMathScholarById(id);
    }

    createMathScholar(payload: CreateMathScholarPayload): Observable<MathScholar> {
      return this.math.createMathScholar(payload);
    }

    updateMathScholar(id: number, payload: UpdateMathScholarPayload): Observable<MathScholar> {
      return this.math.updateMathScholar(id, payload);
    }

    deleteMathScholar(id: number): Observable<void> {
      return this.math.deleteMathScholar(id);
    }

    searchMathScholars(query: string, maxResults?: number): Observable<MathScholar[]> {
      return this.math.searchMathScholars(query, maxResults);
    }

    getMathContributions(scholarId?: number, topicId?: number): Observable<MathContribution[]> {
      return this.math.getMathContributions(scholarId, topicId);
    }

    getMathContributionById(id: number): Observable<MathContribution> {
      return this.math.getMathContributionById(id);
    }

    createMathContribution(payload: CreateMathContributionPayload): Observable<MathContribution> {
      return this.math.createMathContribution(payload);
    }

    updateMathContribution(
      id: number,
      payload: UpdateMathContributionPayload,
    ): Observable<MathContribution> {
      return this.math.updateMathContribution(id, payload);
    }

    deleteMathContribution(id: number): Observable<void> {
      return this.math.deleteMathContribution(id);
    }
  };
}
