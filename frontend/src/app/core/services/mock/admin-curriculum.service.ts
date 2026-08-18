import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MockDataContext } from './mock-data-context';
import { MockAdminCurriculumRingsBaseService } from './admin-curriculum-rings.service';
import {
  MonthlyBooklet,
  CurriculumVersion,
  StudentPathHistory,
  ProgressionResult,
  BiweeklyProgressResponse,
  CreateMonthlyBookletPayload,
  UpdateMonthlyBookletPayload,
  CreateCurriculumVersionPayload,
  UpdateCurriculumVersionPayload,
  ApiMessageResponse,
} from '../../models/lesson-planner.models';

/**
 * Monthly booklets, curriculum versions, progression and biweekly progress
 * sub-domains. Catalog + rings methods live in the extended bases.
 */
@Injectable({ providedIn: 'root' })
export class MockAdminCurriculumService extends MockAdminCurriculumRingsBaseService {
  constructor(ctx: MockDataContext) {
    super(ctx);
  }

  getMonthlyBooklets(studentId?: number): Observable<MonthlyBooklet[]> {
    let booklets = [...this.ctx.monthlyBooklets];
    if (studentId !== undefined) {
      booklets = booklets.filter((b) => b.studentId === studentId);
    }
    return this.ctx.delayed(booklets);
  }

  getMonthlyBookletById(id: number): Observable<MonthlyBooklet> {
    const booklet = this.ctx.monthlyBooklets.find((b) => b.id === id);
    if (!booklet) throw new Error('Booklet not found');
    return this.ctx.delayed(booklet);
  }

  getMonthlyBookletsByStudent(studentId: number): Observable<MonthlyBooklet[]> {
    return this.ctx.delayed(this.ctx.monthlyBooklets.filter((b) => b.studentId === studentId));
  }

  getMonthlyBookletByPeriod(
    studentId: number,
    year: number,
    month: number,
  ): Observable<MonthlyBooklet> {
    const booklet = this.ctx.monthlyBooklets.find(
      (b) => b.studentId === studentId && b.year === year && b.month === month,
    );
    if (!booklet) throw new Error('Booklet not found');
    return this.ctx.delayed(booklet);
  }

  createMonthlyBooklet(payload: CreateMonthlyBookletPayload): Observable<MonthlyBooklet> {
    const booklet: MonthlyBooklet = {
      id: this.ctx.nextId(this.ctx.monthlyBooklets),
      studentId: payload.studentId,
      year: payload.year,
      month: payload.month,
      title: payload.title,
      content: payload.content,
      status: 'draft',
      createdByUserId: payload.createdByUserId,
      createdAt: this.ctx.now(),
      updatedAt: this.ctx.now(),
    };
    this.ctx.monthlyBooklets.push(booklet);
    return this.ctx.delayed(booklet);
  }

  updateMonthlyBooklet(
    id: number,
    payload: UpdateMonthlyBookletPayload,
  ): Observable<MonthlyBooklet> {
    const booklet = this.ctx.monthlyBooklets.find((b) => b.id === id);
    if (!booklet) throw new Error('Booklet not found');
    Object.assign(booklet, payload, { updatedAt: this.ctx.now() });
    return this.ctx.delayed(booklet);
  }

  deleteMonthlyBooklet(id: number): Observable<ApiMessageResponse> {
    this.ctx.monthlyBooklets = this.ctx.monthlyBooklets.filter((b) => b.id !== id);
    return this.ctx.delayed({ message: 'برنامه ماهانه حذف شد' });
  }

  getCurriculumVersions(): Observable<CurriculumVersion[]> {
    return this.ctx.delayed([...this.ctx.curriculumVersions]);
  }

  getCurriculumVersionById(id: number): Observable<CurriculumVersion> {
    const version = this.ctx.curriculumVersions.find((v) => v.id === id);
    if (!version) throw new Error('Curriculum version not found');
    return this.ctx.delayed(version);
  }

  getActiveCurriculumVersion(): Observable<CurriculumVersion> {
    const version = this.ctx.curriculumVersions.find((v) => v.status === 'published');
    if (!version) throw new Error('No active curriculum version');
    return this.ctx.delayed(version);
  }

  createCurriculumVersion(payload: CreateCurriculumVersionPayload): Observable<CurriculumVersion> {
    const version: CurriculumVersion = {
      id: this.ctx.nextId(this.ctx.curriculumVersions),
      key: payload.key,
      versionNumber: payload.versionNumber,
      description: payload.description,
      status: payload.status ?? 'draft',
      validFrom: payload.validFrom,
      validTo: payload.validTo,
      createdAt: this.ctx.now(),
      updatedAt: this.ctx.now(),
    };
    this.ctx.curriculumVersions.push(version);
    return this.ctx.delayed(version);
  }

  updateCurriculumVersion(
    id: number,
    payload: UpdateCurriculumVersionPayload,
  ): Observable<CurriculumVersion> {
    const version = this.ctx.curriculumVersions.find((v) => v.id === id);
    if (!version) throw new Error('Curriculum version not found');
    Object.assign(version, payload, { updatedAt: this.ctx.now() });
    return this.ctx.delayed(version);
  }

  deleteCurriculumVersion(id: number): Observable<ApiMessageResponse> {
    this.ctx.curriculumVersions = this.ctx.curriculumVersions.filter((v) => v.id !== id);
    return this.ctx.delayed({ message: 'نسخه برنامه درسی حذف شد' });
  }

  checkProgression(studentId: number): Observable<ProgressionResult> {
    return this.ctx.delayed({
      studentId,
      studentName: `دانش‌آموز ${studentId}`,
      currentLevel: 'مبتدی',
      currentRing: 'حلقه اول',
      canProgress: false,
      blockingReasons: ['هنوز به سطح بعدی نرسیده‌اید'],
      skillMasteryRates: {},
      checkedAt: this.ctx.now(),
    });
  }

  checkRingProgression(ringId: number): Observable<ProgressionResult[]> {
    return this.ctx.delayed([]);
  }

  recordProgression(payload: {
    studentId: number;
    fromLevel: string;
    toLevel: string;
  }): Observable<StudentPathHistory> {
    const record: StudentPathHistory = {
      id: this.ctx.nextId(this.ctx.progressionRecords),
      studentId: payload.studentId,
      changedByUserId: 1,
      previousStage: payload.fromLevel,
      newStage: payload.toLevel,
      changedAt: this.ctx.now(),
    };
    this.ctx.progressionRecords.push(record);
    return this.ctx.delayed(record);
  }

  getBiweeklyProgress(studentId: number): Observable<BiweeklyProgressResponse> {
    return this.ctx.delayed({
      studentId,
      studentName: `دانش‌آموز ${studentId}`,
      periodStart: this.ctx.yesterday(),
      periodEnd: this.ctx.now().split('T')[0],
      totalAssignments: 0,
      completedAssignments: 0,
      pendingAssignments: 0,
      completionPercentage: 0,
      averageScore: 0,
      totalSubmissions: 0,
      assignments: [],
    });
  }
}
