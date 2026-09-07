import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';

import { environment } from '../../../environments/environment';
import { AuthService } from '../services/auth.service';
import { isSafeRedirectPath, resolveOtuh2BaseUrl } from '../services/api-url.util';

const CALLBACK_PATH = '/auth/callback';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (environment.useMockAuth) {
    if (!authService.isAuthenticated()) {
      authService.mockLogin();
    }
    return true;
  }

  const isAuth = authService.isAuthenticated();
  if (isAuth) {
    return true;
  }
  // Redirect-based login: send the browser to EhrazHoviat's hosted login page.
  // OTUH2 authenticates, then redirects back to our /auth/callback with tokens.
  // Only a verified relative returnUrl may be honored; anything absolute (http/https,
  // protocol-relative, backslash) is rejected to prevent open redirects.
  const requestedReturnPath = route.queryParamMap.get('returnUrl') ?? '';
  const fallbackPath = window.location.pathname;
  const returnTo = isSafeRedirectPath(requestedReturnPath) ? requestedReturnPath : fallbackPath;
  const encodedReturnTo = encodeURIComponent(returnTo);
  const callbackUrl = `${window.location.origin}${CALLBACK_PATH}?returnTo=${encodedReturnTo}`;
  const otuh2LoginUrl = `${resolveOtuh2BaseUrl()}/auth/login`;
  const state = crypto.randomUUID();
  sessionStorage.setItem('otuh2_auth_state', state);
  const redirectUrl = `${otuh2LoginUrl}?state=${encodeURIComponent(state)}&returnUrl=${encodeURIComponent(callbackUrl)}`;
  console.log('[authGuard] redirecting to EhrazHoviat:', redirectUrl);
  window.location.href = redirectUrl;
  return false;
};
