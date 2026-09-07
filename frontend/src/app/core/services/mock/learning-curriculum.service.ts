import { Observable } from 'rxjs';
import { MockDataContext } from './mock-data-context';

/**
 * Learning-curriculum structure sub-domain (paths, levels, modules, lessons,
 * content blocks). Split from the former monolithic MockLearningService.
 */
export abstract class MockLearningCurriculumBaseService {
  constructor(protected ctx: MockDataContext) {}

  getLearningPaths(): Observable<any[]> {
    return this.ctx.delayed([...this.ctx.learningPaths]);
  }

  getLearningPath(id: number): Observable<any> {
    const path = this.ctx.learningPaths.find((p: any) => p.id === id);
    if (!path) throw new Error('Learning path not found');
    return this.ctx.delayed(path);
  }

  getLearningPathTree(id: number): Observable<any> {
    const path = this.ctx.learningPaths.find((p: any) => p.id === id);
    if (!path) throw new Error('Learning path not found');
    return this.ctx.delayed({ ...path, levels: [] });
  }

  createLearningPath(payload: any): Observable<any> {
    const path = { id: this.ctx.nextId(this.ctx.learningPaths), ...payload };
    this.ctx.learningPaths.push(path);
    return this.ctx.delayed(path);
  }

  updateLearningPath(id: number, payload: any): Observable<any> {
    const path = this.ctx.learningPaths.find((p: any) => p.id === id);
    if (!path) throw new Error('Learning path not found');
    Object.assign(path, payload);
    return this.ctx.delayed(path);
  }

  deleteLearningPath(id: number): Observable<void> {
    this.ctx.learningPaths = this.ctx.learningPaths.filter((p: any) => p.id !== id);
    return this.ctx.delayed(undefined);
  }

  getLearningLevels(pathId: number): Observable<any[]> {
    return this.ctx.delayed(this.ctx.learningLevels.filter((l: any) => l.pathId === pathId));
  }

  getLearningLevel(id: number): Observable<any> {
    const level = this.ctx.learningLevels.find((l: any) => l.id === id);
    if (!level) throw new Error('Level not found');
    return this.ctx.delayed(level);
  }

  createLearningLevel(payload: any): Observable<any> {
    const level = { id: this.ctx.nextId(this.ctx.learningLevels), ...payload };
    this.ctx.learningLevels.push(level);
    return this.ctx.delayed(level);
  }

  updateLearningLevel(id: number, payload: any): Observable<any> {
    const level = this.ctx.learningLevels.find((l: any) => l.id === id);
    if (!level) throw new Error('Level not found');
    Object.assign(level, payload);
    return this.ctx.delayed(level);
  }

  deleteLearningLevel(id: number): Observable<void> {
    this.ctx.learningLevels = this.ctx.learningLevels.filter((l: any) => l.id !== id);
    return this.ctx.delayed(undefined);
  }

  getStudyModules(levelId: number): Observable<any[]> {
    return this.ctx.delayed(this.ctx.studyModules.filter((m: any) => m.levelId === levelId));
  }

  getStudyModule(id: number): Observable<any> {
    const module = this.ctx.studyModules.find((m: any) => m.id === id);
    if (!module) throw new Error('Module not found');
    return this.ctx.delayed(module);
  }

  createStudyModule(payload: any): Observable<any> {
    const module = { id: this.ctx.nextId(this.ctx.studyModules), ...payload };
    this.ctx.studyModules.push(module);
    return this.ctx.delayed(module);
  }

  updateStudyModule(id: number, payload: any): Observable<any> {
    const module = this.ctx.studyModules.find((m: any) => m.id === id);
    if (!module) throw new Error('Module not found');
    Object.assign(module, payload);
    return this.ctx.delayed(module);
  }

  deleteStudyModule(id: number): Observable<void> {
    this.ctx.studyModules = this.ctx.studyModules.filter((m: any) => m.id !== id);
    return this.ctx.delayed(undefined);
  }

  getStudyLessons(moduleId: number): Observable<any[]> {
    return this.ctx.delayed(this.ctx.studyLessons.filter((l: any) => l.moduleId === moduleId));
  }

  getStudyLesson(id: number): Observable<any> {
    const lesson = this.ctx.studyLessons.find((l: any) => l.id === id);
    if (!lesson) throw new Error('Lesson not found');
    return this.ctx.delayed(lesson);
  }

  getLessonById(id: number): Observable<any> {
    return this.getStudyLesson(id);
  }

  createStudyLesson(payload: any): Observable<any> {
    const lesson = { id: this.ctx.nextId(this.ctx.studyLessons), ...payload };
    this.ctx.studyLessons.push(lesson);
    return this.ctx.delayed(lesson);
  }

  updateStudyLesson(id: number, payload: any): Observable<any> {
    const lesson = this.ctx.studyLessons.find((l: any) => l.id === id);
    if (!lesson) throw new Error('Lesson not found');
    Object.assign(lesson, payload);
    return this.ctx.delayed(lesson);
  }

  deleteStudyLesson(id: number): Observable<void> {
    this.ctx.studyLessons = this.ctx.studyLessons.filter((l: any) => l.id !== id);
    return this.ctx.delayed(undefined);
  }

  getContentBlocks(lessonId: number): Observable<any[]> {
    return this.ctx.delayed(this.ctx.contentBlocks.filter((b: any) => b.lessonId === lessonId));
  }

  createContentBlock(payload: any): Observable<any> {
    const block = { id: this.ctx.nextId(this.ctx.contentBlocks), ...payload };
    this.ctx.contentBlocks.push(block);
    return this.ctx.delayed(block);
  }

  updateContentBlock(id: number, payload: any): Observable<any> {
    const block = this.ctx.contentBlocks.find((b: any) => b.id === id);
    if (!block) throw new Error('Content block not found');
    Object.assign(block, payload);
    return this.ctx.delayed(block);
  }

  deleteContentBlock(id: number): Observable<void> {
    this.ctx.contentBlocks = this.ctx.contentBlocks.filter((b: any) => b.id !== id);
    return this.ctx.delayed(undefined);
  }
}
