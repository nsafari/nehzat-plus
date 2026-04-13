import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

import {
  AuthSigninPayload,
  AuthSigninResponse,
  AuthSignupPayload,
  AuthSignupResponse,
  CurrentUser
} from '../models/lesson-planner.models';
import { LESSON_PLANNER_API } from './lesson-planner-api.token';

const TOKEN_KEY = 'token';
const USER_KEY = 'current-user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(LESSON_PLANNER_API);
  readonly useMockApi = environment.useMockApi;

  signin(payload: AuthSigninPayload): Observable<AuthSigninResponse> {
    return this.api.signin(payload).pipe(
      tap((response) => {
        localStorage.setItem(TOKEN_KEY, 'dummy-token');
        const user: CurrentUser = {
          username: response.username,
          userType: response.userType,
          studentId: response.studentId,
          imageUrl: response.imageUrl,
          studentInfo: response.studentInfo
        };
        localStorage.setItem(USER_KEY, JSON.stringify(user));
      })
    );
  }

  signup(payload: AuthSignupPayload): Observable<AuthSignupResponse> {
    return this.api.signup(payload);
  }

  register(payload: AuthSignupPayload): Observable<AuthSignupResponse> {
    return this.signup(payload);
  }

  isAuthenticated(): boolean {
    return Boolean(localStorage.getItem(TOKEN_KEY));
  }

  getCurrentUser(): CurrentUser | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw) as CurrentUser;
    } catch {
      return null;
    }
  }

  isAdmin(): boolean {
    return this.getCurrentUser()?.userType === 'admin';
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
}
