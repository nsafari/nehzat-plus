import { Observable } from 'rxjs';

import { MockLessonPlannerApiBase, type MockApiCtor } from './mock-lesson-planner-base';
import {
  ApiMessageResponse,
  BiweeklyProgressResponse,
  CreateCurriculumVersionPayload,
  CreateMonthlyBookletPayload,
  CurriculumVersion,
  MonthlyBooklet,
  ProgressionResult,
  UpdateCurriculumVersionPayload,
  UpdateMonthlyBookletPayload,
} from './mock-lesson-planner-models';

/**
 * adminCurriculumBooklets delegation mixin
 * Monthly booklets, curriculum versions, progression and biweekly progress.: every method forwards to the injected
 * MockAdminCurriculumService instance (see MockLessonPlannerApiBase.adminCurriculumBooklets).
 */
export function withAdminCurriculumBooklets<T extends MockApiCtor>(Base: T) {
  return class extends Base {
    // ===== Monthly Booklets =====
    getMonthlyBooklets(studentId?: number): Observable<MonthlyBooklet[]> {
      return this.adminCurriculum.getMonthlyBooklets(studentId);
    }

    getMonthlyBookletById(id: number): Observable<MonthlyBooklet> {
      return this.adminCurriculum.getMonthlyBookletById(id);
    }

    getMonthlyBookletsByStudent(studentId: number): Observable<MonthlyBooklet[]> {
      return this.adminCurriculum.getMonthlyBookletsByStudent(studentId);
    }

    getMonthlyBookletByPeriod(
      studentId: number,
      year: number,
      month: number,
    ): Observable<MonthlyBooklet> {
      return this.adminCurriculum.getMonthlyBookletByPeriod(studentId, year, month);
    }

    createMonthlyBooklet(payload: CreateMonthlyBookletPayload): Observable<MonthlyBooklet> {
      return this.adminCurriculum.createMonthlyBooklet(payload);
    }

    updateMonthlyBooklet(
      id: number,
      payload: UpdateMonthlyBookletPayload,
    ): Observable<MonthlyBooklet> {
      return this.adminCurriculum.updateMonthlyBooklet(id, payload);
    }

    deleteMonthlyBooklet(id: number): Observable<ApiMessageResponse> {
      return this.adminCurriculum.deleteMonthlyBooklet(id);
    }

    // ===== Curriculum Versions =====
    getCurriculumVersions(): Observable<CurriculumVersion[]> {
      return this.adminCurriculum.getCurriculumVersions();
    }

    getCurriculumVersionById(id: number): Observable<CurriculumVersion> {
      return this.adminCurriculum.getCurriculumVersionById(id);
    }

    getActiveCurriculumVersion(): Observable<CurriculumVersion> {
      return this.adminCurriculum.getActiveCurriculumVersion();
    }

    createCurriculumVersion(
      payload: CreateCurriculumVersionPayload,
    ): Observable<CurriculumVersion> {
      return this.adminCurriculum.createCurriculumVersion(payload);
    }

    updateCurriculumVersion(
      id: number,
      payload: UpdateCurriculumVersionPayload,
    ): Observable<CurriculumVersion> {
      return this.adminCurriculum.updateCurriculumVersion(id, payload);
    }

    deleteCurriculumVersion(id: number): Observable<ApiMessageResponse> {
      return this.adminCurriculum.deleteCurriculumVersion(id);
    }

    // ===== Progression =====
    checkProgression(studentId: number): Observable<ProgressionResult> {
      return this.adminCurriculum.checkProgression(studentId);
    }

    checkRingProgression(ringId: number): Observable<ProgressionResult[]> {
      return this.adminCurriculum.checkRingProgression(ringId);
    }

    recordProgression(payload: {
      studentId: number;
      fromLevel: string;
      toLevel: string;
    }): Observable<any> {
      return this.adminCurriculum.recordProgression(payload);
    }

    // ===== Biweekly Progress =====
    getBiweeklyProgress(studentId: number): Observable<BiweeklyProgressResponse> {
      return this.adminCurriculum.getBiweeklyProgress(studentId);
    }
  };
}
