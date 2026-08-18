import { Observable } from 'rxjs';
import { MockDataContext } from './mock-data-context';
import {
  SubjectArea,
  TeachingMethod,
  CurriculumObjective,
  Book,
  AgeGroup,
  StudentSkillProgress,
  CreateSubjectAreaPayload,
  UpdateSubjectAreaPayload,
  CreateTeachingMethodPayload,
  UpdateTeachingMethodPayload,
  CreateCurriculumObjectivePayload,
  UpdateCurriculumObjectivePayload,
  CreateBookPayload,
  UpdateBookPayload,
  UpdateSkillProgressPayload,
  ApiMessageResponse,
} from '../../models/lesson-planner.models';

/**
 * Curriculum catalog sub-domain (subject areas, teaching methods, objectives,
 * books, age groups, skill progress). Split from the former monolithic
 * MockAdminCurriculumService.
 */
export abstract class MockAdminCurriculumBaseService {
  constructor(protected ctx: MockDataContext) {}

  getSubjectAreas(): Observable<SubjectArea[]> {
    return this.ctx.delayed([...this.ctx.subjectAreas]);
  }

  createSubjectArea(payload: CreateSubjectAreaPayload): Observable<SubjectArea> {
    const area: SubjectArea = {
      id: this.ctx.nextId(this.ctx.subjectAreas),
      key: payload.key,
      name: payload.name,
      description: payload.description,
      sortOrder: payload.sortOrder ?? this.ctx.subjectAreas.length,
      createdAt: this.ctx.now(),
    };
    this.ctx.subjectAreas.push(area);
    return this.ctx.delayed(area);
  }

  updateSubjectArea(id: number, payload: UpdateSubjectAreaPayload): Observable<SubjectArea> {
    const area = this.ctx.subjectAreas.find((a) => a.id === id);
    if (!area) throw new Error('Subject area not found');
    Object.assign(area, payload);
    return this.ctx.delayed(area);
  }

  deleteSubjectArea(id: number): Observable<ApiMessageResponse> {
    this.ctx.subjectAreas = this.ctx.subjectAreas.filter((a) => a.id !== id);
    return this.ctx.delayed({ message: 'حوزه موضوعی حذف شد' });
  }

  getTeachingMethods(): Observable<TeachingMethod[]> {
    return this.ctx.delayed([...this.ctx.teachingMethods]);
  }

  createTeachingMethod(payload: CreateTeachingMethodPayload): Observable<TeachingMethod> {
    const method: TeachingMethod = {
      id: this.ctx.nextId(this.ctx.teachingMethods),
      key: payload.key,
      name: payload.name,
      description: payload.description,
      sortOrder: payload.sortOrder ?? this.ctx.teachingMethods.length,
      createdAt: this.ctx.now(),
    };
    this.ctx.teachingMethods.push(method);
    return this.ctx.delayed(method);
  }

  updateTeachingMethod(
    id: number,
    payload: UpdateTeachingMethodPayload,
  ): Observable<TeachingMethod> {
    const method = this.ctx.teachingMethods.find((m) => m.id === id);
    if (!method) throw new Error('Teaching method not found');
    Object.assign(method, payload);
    return this.ctx.delayed(method);
  }

  deleteTeachingMethod(id: number): Observable<ApiMessageResponse> {
    this.ctx.teachingMethods = this.ctx.teachingMethods.filter((m) => m.id !== id);
    return this.ctx.delayed({ message: 'روش تدریس حذف شد' });
  }

  getObjectives(): Observable<CurriculumObjective[]> {
    return this.ctx.delayed([...this.ctx.objectives]);
  }

  createObjective(payload: CreateCurriculumObjectivePayload): Observable<CurriculumObjective> {
    const objective: CurriculumObjective = {
      id: this.ctx.nextId(this.ctx.objectives),
      key: payload.key,
      title: payload.title,
      description: payload.description,
      subjectAreaId: payload.subjectAreaId,
      parentObjectiveId: payload.parentObjectiveId,
      sortOrder: payload.sortOrder ?? this.ctx.objectives.length,
      level: payload.level ?? 'مبتدی',
      createdAt: this.ctx.now(),
    };
    this.ctx.objectives.push(objective);
    return this.ctx.delayed(objective);
  }

  updateObjective(
    id: number,
    payload: UpdateCurriculumObjectivePayload,
  ): Observable<CurriculumObjective> {
    const objective = this.ctx.objectives.find((o) => o.id === id);
    if (!objective) throw new Error('Objective not found');
    Object.assign(objective, payload);
    return this.ctx.delayed(objective);
  }

  deleteObjective(id: number): Observable<ApiMessageResponse> {
    this.ctx.objectives = this.ctx.objectives.filter((o) => o.id !== id);
    return this.ctx.delayed({ message: 'هدف حذف شد' });
  }

  getBooks(): Observable<Book[]> {
    return this.ctx.delayed([...this.ctx.books]);
  }

  createBook(payload: CreateBookPayload): Observable<Book> {
    const book: Book = {
      id: this.ctx.nextId(this.ctx.books),
      key: payload.key,
      title: payload.title,
      author: payload.author,
      subjectAreaId: payload.subjectAreaId,
      level: payload.level,
      publisher: payload.publisher,
      pages: payload.pages,
      createdAt: this.ctx.now(),
    };
    this.ctx.books.push(book);
    return this.ctx.delayed(book);
  }

  updateBook(id: number, payload: UpdateBookPayload): Observable<Book> {
    const book = this.ctx.books.find((b) => b.id === id);
    if (!book) throw new Error('Book not found');
    Object.assign(book, payload);
    return this.ctx.delayed(book);
  }

  deleteBook(id: number): Observable<ApiMessageResponse> {
    this.ctx.books = this.ctx.books.filter((b) => b.id !== id);
    return this.ctx.delayed({ message: 'کتاب حذف شد' });
  }

  getAgeGroups(): Observable<AgeGroup[]> {
    return this.ctx.delayed([
      { id: 1, key: '6-9', name: '۶-۹ سال', minAge: 6, maxAge: 9, sortOrder: 1 },
      { id: 2, key: '10-14', name: '۱۰-۱۴ سال', minAge: 10, maxAge: 14, sortOrder: 2 },
      { id: 3, key: '15+', name: '۱۵+ سال', minAge: 15, maxAge: 100, sortOrder: 3 },
    ]);
  }

  getSkillProgressByStudent(studentId: number): Observable<StudentSkillProgress[]> {
    return this.ctx.delayed([]);
  }

  getSkillProgressByRing(ringId: number): Observable<StudentSkillProgress[]> {
    return this.ctx.delayed([]);
  }

  updateSkillProgress(
    id: number,
    payload: UpdateSkillProgressPayload,
  ): Observable<StudentSkillProgress> {
    return this.ctx.delayed({
      id,
      studentId: 0,
      objectiveId: 0,
      objectiveTitle: '',
      proficiencyLevel: payload.proficiencyLevel ?? '',
      score: payload.score ?? 0,
      lastAssessedAt: payload.lastAssessedAt,
    });
  }
}
