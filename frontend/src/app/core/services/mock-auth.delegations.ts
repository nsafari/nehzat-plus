import { Observable } from 'rxjs';

import { MockLessonPlannerApiBase, type MockApiCtor } from './mock-lesson-planner-base';
import {
  ApiMessageResponse,
  AuthSigninPayload,
  AuthSigninResponse,
  AuthSignupPayload,
  AuthSignupResponse,
} from './mock-lesson-planner-models';

/**
 * auth delegation mixin: every method forwards to the injected
 * MockAuthService instance (see MockLessonPlannerApiBase.auth).
 */
export function withAuth<T extends MockApiCtor>(Base: T) {
  return class extends Base {
    // ===== Auth =====
    signin(payload: AuthSigninPayload): Observable<AuthSigninResponse> {
      return this.auth.signin(payload);
    }

    signup(payload: AuthSignupPayload | FormData): Observable<AuthSignupResponse> {
      return this.auth.signup(payload as AuthSignupPayload);
    }

    seedDatabase(): Observable<ApiMessageResponse> {
      return this.auth.seedDatabase();
    }
  };
}
