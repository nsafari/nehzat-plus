import { Observable } from 'rxjs';

import { MockLessonPlannerApiBase, type MockApiCtor } from './mock-lesson-planner-base';
import {
  ApiMessageResponse,
  CreateParentPayload,
  Parent,
  ParentStudentInfo,
} from './mock-lesson-planner-models';

/**
 * adminParents delegation mixin: every method forwards to the injected
 * MockAdminParentsService instance (see MockLessonPlannerApiBase.adminParents).
 */
export function withAdminParents<T extends MockApiCtor>(Base: T) {
  return class extends Base {
    // ===== Parents =====
    getParents(): Observable<Parent[]> {
      return this.adminParents.getParents();
    }

    createParent(payload: CreateParentPayload): Observable<Parent> {
      return this.adminParents.createParent(payload);
    }

    updateParent(id: number, payload: Partial<CreateParentPayload>): Observable<Parent> {
      return this.adminParents.updateParent(id, payload);
    }

    deleteParent(id: number): Observable<ApiMessageResponse> {
      return this.adminParents.deleteParent(id);
    }

    getParentStudents(parentId: number): Observable<ParentStudentInfo[]> {
      return this.adminParents.getParentStudents(parentId);
    }
  };
}
