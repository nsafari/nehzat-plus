import { Observable } from 'rxjs';
import { MockDataContext } from './mock-data-context';
import { MockAdminCurriculumBaseService } from './admin-curriculum-base.service';
import {
  Ring,
  RingStudent,
  RingBook,
  RingTeachingMethod,
  RingDashboardDto,
  CreateRingPayload,
  UpdateRingPayload,
  CreateRingStudentPayload,
  CreateRingBookPayload,
  CreateRingTeachingMethodPayload,
  ApiMessageResponse,
} from '../../models/lesson-planner.models';

/**
 * Rings sub-domain (ring CRUD, ring students, ring books, ring teaching
 * methods, coach-facing ring endpoints). Split from the former monolithic
 * MockAdminCurriculumService.
 */
export abstract class MockAdminCurriculumRingsBaseService extends MockAdminCurriculumBaseService {
  constructor(ctx: MockDataContext) {
    super(ctx);
  }

  getRings(): Observable<Ring[]> {
    return this.ctx.delayed([...this.ctx.rings]);
  }

  getRingById(id: number): Observable<Ring> {
    const ring = this.ctx.rings.find((r) => r.id === id);
    if (!ring) throw new Error('Ring not found');
    return this.ctx.delayed(ring);
  }

  createRing(payload: CreateRingPayload): Observable<Ring> {
    const ring: Ring = {
      id: this.ctx.nextId(this.ctx.rings),
      key: payload.key,
      name: payload.name,
      description: payload.description,
      madrasahId: payload.madrasahId,
      coachId: payload.coachId,
      courseId: payload.courseId,
      gender: payload.gender,
      status: payload.status ?? 'active',
      createdAt: this.ctx.now(),
    };
    this.ctx.rings.push(ring);
    return this.ctx.delayed(ring);
  }

  updateRing(id: number, payload: UpdateRingPayload): Observable<Ring> {
    const ring = this.ctx.rings.find((r) => r.id === id);
    if (!ring) throw new Error('Ring not found');
    Object.assign(ring, payload);
    return this.ctx.delayed(ring);
  }

  deleteRing(id: number): Observable<ApiMessageResponse> {
    this.ctx.rings = this.ctx.rings.filter((r) => r.id !== id);
    return this.ctx.delayed({ message: 'حلقه حذف شد' });
  }

  getMyRings(): Observable<Ring[]> {
    return this.ctx.delayed([...this.ctx.rings]);
  }

  getMyRingStudents(): Observable<RingStudent[]> {
    return this.ctx.delayed([...this.ctx.ringStudents]);
  }

  getRingDashboard(ringId: number): Observable<RingDashboardDto> {
    const ring = this.ctx.rings.find((r) => r.id === ringId);
    const students = this.ctx.ringStudents.filter((s) => s.ringId === ringId);
    return this.ctx.delayed({
      ringId,
      ringName: ring?.name ?? '',
      studentCount: students.length,
      averageScore: 0,
      masteredCount: 0,
      achievedCount: 0,
      inProgressCount: students.length,
      notStartedCount: 0,
      students: students.map((s) => ({
        studentId: s.studentId,
        studentName: `دانش‌آموز ${s.studentId}`,
        score: 0,
        proficiencyLevel: 'مبتدی',
        lastAssessedAt: undefined,
      })),
    });
  }

  getRingStudents(ringId: number): Observable<RingStudent[]> {
    return this.ctx.delayed(this.ctx.ringStudents.filter((s) => s.ringId === ringId));
  }

  addRingStudent(ringId: number, payload: CreateRingStudentPayload): Observable<RingStudent> {
    const student: RingStudent = {
      id: this.ctx.nextId(this.ctx.ringStudents),
      ringId,
      studentId: payload.studentId,
      status: payload.status ?? 'active',
      joinedAt: this.ctx.now(),
    };
    this.ctx.ringStudents.push(student);
    return this.ctx.delayed(student);
  }

  removeRingStudent(ringId: number, studentId: number): Observable<ApiMessageResponse> {
    this.ctx.ringStudents = this.ctx.ringStudents.filter(
      (s) => !(s.ringId === ringId && s.studentId === studentId),
    );
    return this.ctx.delayed({ message: 'دانش‌آموز از حله حذف شد' });
  }

  addRingBook(ringId: number, payload: CreateRingBookPayload): Observable<ApiMessageResponse> {
    const ringBook: RingBook = {
      id: this.ctx.nextId(this.ctx.ringBooks),
      ringId,
      bookId: payload.bookId,
      sortOrder: payload.sortOrder ?? this.ctx.ringBooks.filter((r) => r.ringId === ringId).length,
    };
    this.ctx.ringBooks.push(ringBook);
    return this.ctx.delayed({ message: 'کتاب به حله اضافه شد' });
  }

  removeRingBook(ringId: number, bookId: number): Observable<ApiMessageResponse> {
    this.ctx.ringBooks = this.ctx.ringBooks.filter(
      (r) => !(r.ringId === ringId && r.bookId === bookId),
    );
    return this.ctx.delayed({ message: 'کتاب از حله حذف شد' });
  }

  addRingTeachingMethod(
    ringId: number,
    payload: CreateRingTeachingMethodPayload,
  ): Observable<ApiMessageResponse> {
    const ringMethod: RingTeachingMethod = {
      id: this.ctx.nextId(this.ctx.ringTeachingMethods),
      ringId,
      teachingMethodId: payload.teachingMethodId,
    };
    this.ctx.ringTeachingMethods.push(ringMethod);
    return this.ctx.delayed({ message: 'روش تدریس به حله اضافه شد' });
  }

  removeRingTeachingMethod(
    ringId: number,
    teachingMethodId: number,
  ): Observable<ApiMessageResponse> {
    this.ctx.ringTeachingMethods = this.ctx.ringTeachingMethods.filter(
      (r) => !(r.ringId === ringId && r.teachingMethodId === teachingMethodId),
    );
    return this.ctx.delayed({ message: 'روش تدریس از حله حذف شد' });
  }
}
