import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MockDataContext } from './mock-data-context';

@Injectable({ providedIn: 'root' })
export class MockSciencesService {
  constructor(private ctx: MockDataContext) {}

  getExperimentalSciencesPhases(): Observable<any[]> {
    return this.ctx.delayed([...this.ctx.sciencePhases]);
  }

  getExperimentalSciencesPhase(id: number): Observable<any> {
    const phase = this.ctx.sciencePhases.find((p: any) => p.id === id);
    if (!phase) throw new Error('Phase not found');
    return this.ctx.delayed(phase);
  }

  createExperimentalSciencesPhase(request: any): Observable<any> {
    const phase = { id: this.ctx.nextId(this.ctx.sciencePhases), ...request };
    this.ctx.sciencePhases.push(phase);
    return this.ctx.delayed(phase);
  }

  updateExperimentalSciencesPhase(id: number, request: any): Observable<void> {
    const phase = this.ctx.sciencePhases.find((p: any) => p.id === id);
    if (!phase) throw new Error('Phase not found');
    Object.assign(phase, request);
    return this.ctx.delayed(undefined);
  }

  deleteExperimentalSciencesPhase(id: number): Observable<void> {
    this.ctx.sciencePhases = this.ctx.sciencePhases.filter((p: any) => p.id !== id);
    return this.ctx.delayed(undefined);
  }

  getExperimentalSciencesTopics(): Observable<any[]> {
    return this.ctx.delayed([...this.ctx.scienceTopics]);
  }

  getExperimentalSciencesTopicsByPhase(phaseId: number): Observable<any[]> {
    return this.ctx.delayed(this.ctx.scienceTopics.filter((t: any) => t.phaseId === phaseId));
  }

  getExperimentalSciencesTopic(id: number): Observable<any> {
    const topic = this.ctx.scienceTopics.find((t: any) => t.id === id);
    if (!topic) throw new Error('Topic not found');
    return this.ctx.delayed(topic);
  }

  createExperimentalSciencesTopic(request: any): Observable<any> {
    const topic = { id: this.ctx.nextId(this.ctx.scienceTopics), ...request };
    this.ctx.scienceTopics.push(topic);
    return this.ctx.delayed(topic);
  }

  updateExperimentalSciencesTopic(id: number, request: any): Observable<void> {
    const topic = this.ctx.scienceTopics.find((t: any) => t.id === id);
    if (!topic) throw new Error('Topic not found');
    Object.assign(topic, request);
    return this.ctx.delayed(undefined);
  }

  deleteExperimentalSciencesTopic(id: number): Observable<void> {
    this.ctx.scienceTopics = this.ctx.scienceTopics.filter((t: any) => t.id !== id);
    return this.ctx.delayed(undefined);
  }

  getExperimentalSciencesLessonsByTopic(topicId: number): Observable<any[]> {
    return this.ctx.delayed(this.ctx.scienceLessons.filter((l: any) => l.topicId === topicId));
  }

  getExperimentalSciencesLesson(id: number): Observable<any> {
    const lesson = this.ctx.scienceLessons.find((l: any) => l.id === id);
    if (!lesson) throw new Error('Lesson not found');
    return this.ctx.delayed(lesson);
  }

  createExperimentalSciencesLesson(request: any): Observable<any> {
    const lesson = { id: this.ctx.nextId(this.ctx.scienceLessons), ...request };
    this.ctx.scienceLessons.push(lesson);
    return this.ctx.delayed(lesson);
  }

  updateExperimentalSciencesLesson(id: number, request: any): Observable<void> {
    const lesson = this.ctx.scienceLessons.find((l: any) => l.id === id);
    if (!lesson) throw new Error('Lesson not found');
    Object.assign(lesson, request);
    return this.ctx.delayed(undefined);
  }

  deleteExperimentalSciencesLesson(id: number): Observable<void> {
    this.ctx.scienceLessons = this.ctx.scienceLessons.filter((l: any) => l.id !== id);
    return this.ctx.delayed(undefined);
  }

  getExperimentalSciencesExperimentsByLesson(lessonId: number): Observable<any[]> {
    return this.ctx.delayed(
      this.ctx.scienceExperiments.filter((e: any) => e.lessonId === lessonId),
    );
  }

  getExperimentalSciencesExperiment(id: number): Observable<any> {
    const experiment = this.ctx.scienceExperiments.find((e: any) => e.id === id);
    if (!experiment) throw new Error('Experiment not found');
    return this.ctx.delayed(experiment);
  }

  createExperimentalSciencesExperiment(request: any): Observable<any> {
    const experiment = { id: this.ctx.nextId(this.ctx.scienceExperiments), ...request };
    this.ctx.scienceExperiments.push(experiment);
    return this.ctx.delayed(experiment);
  }

  updateExperimentalSciencesExperiment(id: number, request: any): Observable<void> {
    const experiment = this.ctx.scienceExperiments.find((e: any) => e.id === id);
    if (!experiment) throw new Error('Experiment not found');
    Object.assign(experiment, request);
    return this.ctx.delayed(undefined);
  }

  deleteExperimentalSciencesExperiment(id: number): Observable<void> {
    this.ctx.scienceExperiments = this.ctx.scienceExperiments.filter((e: any) => e.id !== id);
    return this.ctx.delayed(undefined);
  }

  getExperimentalSciencesQuizByLesson(lessonId: number): Observable<any> {
    const quiz = this.ctx.scienceQuizzes.find((q: any) => q.lessonId === lessonId);
    return this.ctx.delayed(quiz ?? {});
  }

  getExperimentalSciencesQuiz(id: number): Observable<any> {
    const quiz = this.ctx.scienceQuizzes.find((q: any) => q.id === id);
    if (!quiz) throw new Error('Quiz not found');
    return this.ctx.delayed(quiz);
  }

  createExperimentalSciencesQuiz(request: any): Observable<any> {
    const quiz = { id: this.ctx.nextId(this.ctx.scienceQuizzes), ...request };
    this.ctx.scienceQuizzes.push(quiz);
    return this.ctx.delayed(quiz);
  }

  updateExperimentalSciencesQuiz(id: number, request: any): Observable<void> {
    const quiz = this.ctx.scienceQuizzes.find((q: any) => q.id === id);
    if (!quiz) throw new Error('Quiz not found');
    Object.assign(quiz, request);
    return this.ctx.delayed(undefined);
  }

  deleteExperimentalSciencesQuiz(id: number): Observable<void> {
    this.ctx.scienceQuizzes = this.ctx.scienceQuizzes.filter((q: any) => q.id !== id);
    return this.ctx.delayed(undefined);
  }

  getExperimentalSciencesQuizQuestions(quizId: number): Observable<any[]> {
    return this.ctx.delayed(this.ctx.scienceQuestions.filter((q: any) => q.quizId === quizId));
  }

  getExperimentalSciencesQuizQuestion(id: number): Observable<any> {
    const question = this.ctx.scienceQuestions.find((q: any) => q.id === id);
    if (!question) throw new Error('Question not found');
    return this.ctx.delayed(question);
  }

  createExperimentalSciencesQuizQuestion(request: any): Observable<any> {
    const question = { id: this.ctx.nextId(this.ctx.scienceQuestions), ...request };
    this.ctx.scienceQuestions.push(question);
    return this.ctx.delayed(question);
  }

  updateExperimentalSciencesQuizQuestion(id: number, request: any): Observable<void> {
    const question = this.ctx.scienceQuestions.find((q: any) => q.id === id);
    if (!question) throw new Error('Question not found');
    Object.assign(question, request);
    return this.ctx.delayed(undefined);
  }

  deleteExperimentalSciencesQuizQuestion(id: number): Observable<void> {
    this.ctx.scienceQuestions = this.ctx.scienceQuestions.filter((q: any) => q.id !== id);
    return this.ctx.delayed(undefined);
  }

  getExperimentalSciencesStudentProgress(studentId: number): Observable<any[]> {
    return this.ctx.delayed(this.ctx.scienceProgress.filter((p: any) => p.studentId === studentId));
  }

  getExperimentalSciencesStudentProgressByTopic(
    studentId: number,
    topicId: number,
  ): Observable<any> {
    const progress = this.ctx.scienceProgress.find(
      (p: any) => p.studentId === studentId && p.topicId === topicId,
    );
    if (!progress) throw new Error('Progress not found');
    return this.ctx.delayed(progress);
  }

  updateExperimentalSciencesStudentProgress(
    studentId: number,
    topicId: number,
    request: any,
  ): Observable<void> {
    const progress = this.ctx.scienceProgress.find(
      (p: any) => p.studentId === studentId && p.topicId === topicId,
    );
    if (progress) Object.assign(progress, request);
    return this.ctx.delayed(undefined);
  }

  getExperimentalSciencesDashboardStats(): Observable<any> {
    return this.ctx.delayed({
      totalPhases: this.ctx.sciencePhases.length,
      totalTopics: this.ctx.scienceTopics.length,
      totalLessons: this.ctx.scienceLessons.length,
      totalExperiments: this.ctx.scienceExperiments.length,
      totalQuizzes: this.ctx.scienceQuizzes.length,
      totalProgress: this.ctx.scienceProgress.length,
    });
  }
}
