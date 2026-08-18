import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MockDataContext } from './mock-data-context';

@Injectable({ providedIn: 'root' })
export class MockMathService {
  constructor(private ctx: MockDataContext) {}

  getMathTopics(): Observable<any[]> {
    return this.ctx.delayed([...this.ctx.mathTopics]);
  }

  getMathTopicById(id: number): Observable<any> {
    const topic = this.ctx.mathTopics.find((t: any) => t.id === id);
    if (!topic) throw new Error('Topic not found');
    return this.ctx.delayed(topic);
  }

  createMathTopic(payload: any): Observable<any> {
    const topic = { id: this.ctx.nextId(this.ctx.mathTopics), ...payload };
    this.ctx.mathTopics.push(topic);
    return this.ctx.delayed(topic);
  }

  updateMathTopic(id: number, payload: any): Observable<any> {
    const topic = this.ctx.mathTopics.find((t: any) => t.id === id);
    if (!topic) throw new Error('Topic not found');
    Object.assign(topic, payload);
    return this.ctx.delayed(topic);
  }

  deleteMathTopic(id: number): Observable<void> {
    this.ctx.mathTopics = this.ctx.mathTopics.filter((t: any) => t.id !== id);
    return this.ctx.delayed(undefined);
  }

  searchMathTopics(query: string, maxResults?: number): Observable<any[]> {
    const results = this.ctx.mathTopics.filter((t: any) => t.name?.includes(query));
    return this.ctx.delayed(maxResults ? results.slice(0, maxResults) : results);
  }

  getMathLessons(topicId?: number): Observable<any[]> {
    let lessons = [...this.ctx.mathLessons];
    if (topicId !== undefined) lessons = lessons.filter((l: any) => l.topicId === topicId);
    return this.ctx.delayed(lessons);
  }

  getMathLessonById(id: number): Observable<any> {
    const lesson = this.ctx.mathLessons.find((l: any) => l.id === id);
    if (!lesson) throw new Error('Lesson not found');
    return this.ctx.delayed(lesson);
  }

  createMathLesson(payload: any): Observable<any> {
    const lesson = { id: this.ctx.nextId(this.ctx.mathLessons), ...payload };
    this.ctx.mathLessons.push(lesson);
    return this.ctx.delayed(lesson);
  }

  updateMathLesson(id: number, payload: any): Observable<any> {
    const lesson = this.ctx.mathLessons.find((l: any) => l.id === id);
    if (!lesson) throw new Error('Lesson not found');
    Object.assign(lesson, payload);
    return this.ctx.delayed(lesson);
  }

  deleteMathLesson(id: number): Observable<void> {
    this.ctx.mathLessons = this.ctx.mathLessons.filter((l: any) => l.id !== id);
    return this.ctx.delayed(undefined);
  }

  searchMathLessons(query: string, maxResults?: number): Observable<any[]> {
    const results = this.ctx.mathLessons.filter((l: any) => l.title?.includes(query));
    return this.ctx.delayed(maxResults ? results.slice(0, maxResults) : results);
  }

  getMathQuestions(lessonId?: number): Observable<any[]> {
    let questions = [...this.ctx.mathQuestions];
    if (lessonId !== undefined) questions = questions.filter((q: any) => q.lessonId === lessonId);
    return this.ctx.delayed(questions);
  }

  getMathQuestionById(id: number): Observable<any> {
    const question = this.ctx.mathQuestions.find((q: any) => q.id === id);
    if (!question) throw new Error('Question not found');
    return this.ctx.delayed(question);
  }

  createMathQuestion(payload: any): Observable<any> {
    const question = { id: this.ctx.nextId(this.ctx.mathQuestions), ...payload };
    this.ctx.mathQuestions.push(question);
    return this.ctx.delayed(question);
  }

  updateMathQuestion(id: number, payload: any): Observable<any> {
    const question = this.ctx.mathQuestions.find((q: any) => q.id === id);
    if (!question) throw new Error('Question not found');
    Object.assign(question, payload);
    return this.ctx.delayed(question);
  }

  deleteMathQuestion(id: number): Observable<void> {
    this.ctx.mathQuestions = this.ctx.mathQuestions.filter((q: any) => q.id !== id);
    return this.ctx.delayed(undefined);
  }

  getMathStudentProgress(studentId: number): Observable<any[]> {
    return this.ctx.delayed(this.ctx.mathProgress.filter((p: any) => p.studentId === studentId));
  }

  getMathStudentLessonProgress(studentId: number, lessonId: number): Observable<any> {
    const progress = this.ctx.mathProgress.find(
      (p: any) => p.studentId === studentId && p.lessonId === lessonId,
    );
    if (!progress) throw new Error('Progress not found');
    return this.ctx.delayed(progress);
  }

  recordMathProgress(payload: any): Observable<any> {
    const progress = { id: this.ctx.nextId(this.ctx.mathProgress), ...payload };
    this.ctx.mathProgress.push(progress);
    return this.ctx.delayed(progress);
  }

  updateMathProgress(id: number, payload: any): Observable<any> {
    const progress = this.ctx.mathProgress.find((p: any) => p.id === id);
    if (!progress) throw new Error('Progress not found');
    Object.assign(progress, payload);
    return this.ctx.delayed(progress);
  }

  getMathDashboardStats(): Observable<Record<string, unknown>> {
    return this.ctx.delayed({
      totalTopics: this.ctx.mathTopics.length,
      totalLessons: this.ctx.mathLessons.length,
      totalQuestions: this.ctx.mathQuestions.length,
      totalProgress: this.ctx.mathProgress.length,
    });
  }

  getMathScholars(): Observable<any[]> {
    return this.ctx.delayed([...this.ctx.mathScholars]);
  }

  getMathScholarById(id: number): Observable<any> {
    const scholar = this.ctx.mathScholars.find((s: any) => s.id === id);
    if (!scholar) throw new Error('Scholar not found');
    return this.ctx.delayed(scholar);
  }

  createMathScholar(payload: any): Observable<any> {
    const scholar = { id: this.ctx.nextId(this.ctx.mathScholars), ...payload };
    this.ctx.mathScholars.push(scholar);
    return this.ctx.delayed(scholar);
  }

  updateMathScholar(id: number, payload: any): Observable<any> {
    const scholar = this.ctx.mathScholars.find((s: any) => s.id === id);
    if (!scholar) throw new Error('Scholar not found');
    Object.assign(scholar, payload);
    return this.ctx.delayed(scholar);
  }

  deleteMathScholar(id: number): Observable<void> {
    this.ctx.mathScholars = this.ctx.mathScholars.filter((s: any) => s.id !== id);
    return this.ctx.delayed(undefined);
  }

  searchMathScholars(query: string, maxResults?: number): Observable<any[]> {
    const results = this.ctx.mathScholars.filter((s: any) => s.name?.includes(query));
    return this.ctx.delayed(maxResults ? results.slice(0, maxResults) : results);
  }

  getMathContributions(scholarId?: number, topicId?: number): Observable<any[]> {
    let contributions = [...this.ctx.mathContributions];
    if (scholarId !== undefined)
      contributions = contributions.filter((c: any) => c.scholarId === scholarId);
    if (topicId !== undefined)
      contributions = contributions.filter((c: any) => c.topicId === topicId);
    return this.ctx.delayed(contributions);
  }

  getMathContributionById(id: number): Observable<any> {
    const contribution = this.ctx.mathContributions.find((c: any) => c.id === id);
    if (!contribution) throw new Error('Contribution not found');
    return this.ctx.delayed(contribution);
  }

  createMathContribution(payload: any): Observable<any> {
    const contribution = { id: this.ctx.nextId(this.ctx.mathContributions), ...payload };
    this.ctx.mathContributions.push(contribution);
    return this.ctx.delayed(contribution);
  }

  updateMathContribution(id: number, payload: any): Observable<any> {
    const contribution = this.ctx.mathContributions.find((c: any) => c.id === id);
    if (!contribution) throw new Error('Contribution not found');
    Object.assign(contribution, payload);
    return this.ctx.delayed(contribution);
  }

  deleteMathContribution(id: number): Observable<void> {
    this.ctx.mathContributions = this.ctx.mathContributions.filter((c: any) => c.id !== id);
    return this.ctx.delayed(undefined);
  }
}
