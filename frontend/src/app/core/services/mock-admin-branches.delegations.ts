import { Observable } from 'rxjs';

import { MockLessonPlannerApiBase, type MockApiCtor } from './mock-lesson-planner-base';
import {
  ApiMessageResponse,
  Branch,
  BranchManager,
  CreateBranchManagerPayload,
  CreateBranchPayload,
  CreateMadrasahPayload,
  CreateMaktabBranchPayload,
  Madrasah,
  MaktabBranch,
  UpdateBranchPayload,
  UpdateMadrasahPayload,
} from './mock-lesson-planner-models';

/**
 * adminBranches delegation mixin: every method forwards to the injected
 * MockAdminBranchesService instance (see MockLessonPlannerApiBase.adminBranches).
 */
export function withAdminBranches<T extends MockApiCtor>(Base: T) {
  return class extends Base {
    // ===== Branch Managers =====
    getBranchManagers(): Observable<BranchManager[]> {
      return this.adminBranches.getBranchManagers();
    }

    createBranchManager(payload: CreateBranchManagerPayload): Observable<BranchManager> {
      return this.adminBranches.createBranchManager(payload);
    }

    updateBranchManager(
      id: number,
      payload: Partial<CreateBranchManagerPayload>,
    ): Observable<BranchManager> {
      return this.adminBranches.updateBranchManager(id, payload);
    }

    deleteBranchManager(id: number): Observable<ApiMessageResponse> {
      return this.adminBranches.deleteBranchManager(id);
    }

    // ===== Branches =====
    getBranches(): Observable<Branch[]> {
      return this.adminBranches.getBranches();
    }

    createBranch(payload: CreateBranchPayload): Observable<Branch> {
      return this.adminBranches.createBranch(payload);
    }

    updateBranch(id: number, payload: UpdateBranchPayload): Observable<Branch> {
      return this.adminBranches.updateBranch(id, payload);
    }

    deleteBranch(id: number): Observable<ApiMessageResponse> {
      return this.adminBranches.deleteBranch(id);
    }

    // ===== Madrasahs =====
    getMadrasahs(): Observable<Madrasah[]> {
      return this.adminBranches.getMadrasahs();
    }

    createMadrasah(payload: CreateMadrasahPayload): Observable<Madrasah> {
      return this.adminBranches.createMadrasah(payload);
    }

    updateMadrasah(id: number, payload: UpdateMadrasahPayload): Observable<Madrasah> {
      return this.adminBranches.updateMadrasah(id, payload);
    }

    deleteMadrasah(id: number): Observable<ApiMessageResponse> {
      return this.adminBranches.deleteMadrasah(id);
    }

    // ===== Maktab Branches =====
    getMaktabBranches(madrasahId: number): Observable<MaktabBranch[]> {
      return this.adminBranches.getMaktabBranches(madrasahId);
    }

    createMaktabBranch(
      madrasahId: number,
      payload: CreateMaktabBranchPayload,
    ): Observable<MaktabBranch> {
      return this.adminBranches.createMaktabBranch(madrasahId, payload);
    }

    deleteMaktabBranch(madrasahId: number, branchId: number): Observable<ApiMessageResponse> {
      return this.adminBranches.deleteMaktabBranch(madrasahId, branchId);
    }
  };
}
