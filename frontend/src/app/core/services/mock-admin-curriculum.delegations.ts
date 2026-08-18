import { Observable } from 'rxjs';

import { MockLessonPlannerApiBase, type MockApiCtor } from './mock-lesson-planner-base';
import {
  AgeGroup,
  ApiMessageResponse,
  Book,
  CreateBookPayload,
  CreateCurriculumObjectivePayload,
  CreateRingBookPayload,
  CreateRingPayload,
  CreateRingStudentPayload,
  CreateRingTeachingMethodPayload,
  CreateSubjectAreaPayload,
  CreateTeachingMethodPayload,
  CurriculumObjective,
  Ring,
  RingDashboardDto,
  RingStudent,
  StudentSkillProgress,
  SubjectArea,
  TeachingMethod,
  UpdateBookPayload,
  UpdateCurriculumObjectivePayload,
  UpdateRingPayload,
  UpdateSkillProgressPayload,
  UpdateSubjectAreaPayload,
  UpdateTeachingMethodPayload,
} from './mock-lesson-planner-models';

/**
 * adminCurriculum delegation mixin: every method forwards to the injected
 * MockAdminCurriculumService instance (see MockLessonPlannerApiBase.adminCurriculum).
 */
export function withAdminCurriculum<T extends MockApiCtor>(Base: T) {
  return class extends Base {
    // ===== Subject Areas =====
    getSubjectAreas(): Observable<SubjectArea[]> {
      return this.adminCurriculum.getSubjectAreas();
    }

    createSubjectArea(payload: CreateSubjectAreaPayload): Observable<SubjectArea> {
      return this.adminCurriculum.createSubjectArea(payload);
    }

    updateSubjectArea(id: number, payload: UpdateSubjectAreaPayload): Observable<SubjectArea> {
      return this.adminCurriculum.updateSubjectArea(id, payload);
    }

    deleteSubjectArea(id: number): Observable<ApiMessageResponse> {
      return this.adminCurriculum.deleteSubjectArea(id);
    }

    // ===== Teaching Methods =====
    getTeachingMethods(): Observable<TeachingMethod[]> {
      return this.adminCurriculum.getTeachingMethods();
    }

    createTeachingMethod(payload: CreateTeachingMethodPayload): Observable<TeachingMethod> {
      return this.adminCurriculum.createTeachingMethod(payload);
    }

    updateTeachingMethod(
      id: number,
      payload: UpdateTeachingMethodPayload,
    ): Observable<TeachingMethod> {
      return this.adminCurriculum.updateTeachingMethod(id, payload);
    }

    deleteTeachingMethod(id: number): Observable<ApiMessageResponse> {
      return this.adminCurriculum.deleteTeachingMethod(id);
    }

    // ===== Rings =====
    getRings(): Observable<Ring[]> {
      return this.adminCurriculum.getRings();
    }

    getRingById(id: number): Observable<Ring> {
      return this.adminCurriculum.getRingById(id);
    }

    createRing(payload: CreateRingPayload): Observable<Ring> {
      return this.adminCurriculum.createRing(payload);
    }

    updateRing(id: number, payload: UpdateRingPayload): Observable<Ring> {
      return this.adminCurriculum.updateRing(id, payload);
    }

    deleteRing(id: number): Observable<ApiMessageResponse> {
      return this.adminCurriculum.deleteRing(id);
    }

    // Coach-specific ring endpoints
    getMyRings(): Observable<Ring[]> {
      return this.adminCurriculum.getMyRings();
    }

    getMyRingStudents(): Observable<RingStudent[]> {
      return this.adminCurriculum.getMyRingStudents();
    }

    getRingDashboard(ringId: number): Observable<RingDashboardDto> {
      return this.adminCurriculum.getRingDashboard(ringId);
    }

    // ===== Ring Students =====
    getRingStudents(ringId: number): Observable<RingStudent[]> {
      return this.adminCurriculum.getRingStudents(ringId);
    }

    addRingStudent(ringId: number, payload: CreateRingStudentPayload): Observable<RingStudent> {
      return this.adminCurriculum.addRingStudent(ringId, payload);
    }

    removeRingStudent(ringId: number, studentId: number): Observable<ApiMessageResponse> {
      return this.adminCurriculum.removeRingStudent(ringId, studentId);
    }

    // ===== Ring Books =====
    addRingBook(ringId: number, payload: CreateRingBookPayload): Observable<ApiMessageResponse> {
      return this.adminCurriculum.addRingBook(ringId, payload);
    }

    removeRingBook(ringId: number, bookId: number): Observable<ApiMessageResponse> {
      return this.adminCurriculum.removeRingBook(ringId, bookId);
    }

    // ===== Ring Teaching Methods =====
    addRingTeachingMethod(
      ringId: number,
      payload: CreateRingTeachingMethodPayload,
    ): Observable<ApiMessageResponse> {
      return this.adminCurriculum.addRingTeachingMethod(ringId, payload);
    }

    removeRingTeachingMethod(
      ringId: number,
      teachingMethodId: number,
    ): Observable<ApiMessageResponse> {
      return this.adminCurriculum.removeRingTeachingMethod(ringId, teachingMethodId);
    }

    // ===== Objectives =====
    getObjectives(): Observable<CurriculumObjective[]> {
      return this.adminCurriculum.getObjectives();
    }

    createObjective(payload: CreateCurriculumObjectivePayload): Observable<CurriculumObjective> {
      return this.adminCurriculum.createObjective(payload);
    }

    updateObjective(
      id: number,
      payload: UpdateCurriculumObjectivePayload,
    ): Observable<CurriculumObjective> {
      return this.adminCurriculum.updateObjective(id, payload);
    }

    deleteObjective(id: number): Observable<ApiMessageResponse> {
      return this.adminCurriculum.deleteObjective(id);
    }

    // ===== Books =====
    getBooks(): Observable<Book[]> {
      return this.adminCurriculum.getBooks();
    }

    createBook(payload: CreateBookPayload): Observable<Book> {
      return this.adminCurriculum.createBook(payload);
    }

    updateBook(id: number, payload: UpdateBookPayload): Observable<Book> {
      return this.adminCurriculum.updateBook(id, payload);
    }

    deleteBook(id: number): Observable<ApiMessageResponse> {
      return this.adminCurriculum.deleteBook(id);
    }

    getAgeGroups(): Observable<AgeGroup[]> {
      return this.adminCurriculum.getAgeGroups();
    }

    // ===== Skill Progress =====
    getSkillProgressByStudent(studentId: number): Observable<StudentSkillProgress[]> {
      return this.adminCurriculum.getSkillProgressByStudent(studentId);
    }

    getSkillProgressByRing(ringId: number): Observable<StudentSkillProgress[]> {
      return this.adminCurriculum.getSkillProgressByRing(ringId);
    }

    updateSkillProgress(
      id: number,
      payload: UpdateSkillProgressPayload,
    ): Observable<StudentSkillProgress> {
      return this.adminCurriculum.updateSkillProgress(id, payload);
    }
  };
}
