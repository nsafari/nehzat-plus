import { Observable } from 'rxjs';

import { MockLessonPlannerApiBase, type MockApiCtor } from './mock-lesson-planner-base';
import {
  ApiMessageResponse,
  ApproveUserPayload,
  CreateUserPayload,
  CreatedUser,
  PendingUser,
  StudentInfo,
} from './mock-lesson-planner-models';

/**
 * adminUsers delegation mixin: every method forwards to the injected
 * MockAdminUsersService instance (see MockLessonPlannerApiBase.adminUsers).
 */
export function withAdminUsers<T extends MockApiCtor>(Base: T) {
  return class extends Base {
    getAllStudents(): Observable<StudentInfo[]> {
      return this.adminUsers.getAllStudents();
    }

    // ===== Admin Users =====
    getPendingUsers(): Observable<PendingUser[]> {
      return this.adminUsers.getPendingUsers();
    }

    approveUser(userId: number, payload: ApproveUserPayload): Observable<ApiMessageResponse> {
      return this.adminUsers.approveUser(userId, payload);
    }

    rejectUser(userId: number): Observable<ApiMessageResponse> {
      return this.adminUsers.rejectUser(userId);
    }

    createUser(payload: CreateUserPayload): Observable<CreatedUser> {
      return this.adminUsers.createUser(payload);
    }
  };
}
