import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../../../../core/services/auth.service';
import { LESSON_PLANNER_API } from '../../../../core/services/lesson-planner-api.token';
import { isSafeRedirectPath } from '../../../../core/services/api-url.util';

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  template: `<p>در حال ورود...</p>`
})
export class AuthCallbackComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly api = inject(LESSON_PLANNER_API);

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const accessToken = params['access_token'];
      const idToken = params['id_token'];
      const refreshToken = params['refresh_token'];
      const returnTo = params['returnTo'];

      console.log('[AuthCallback] received params — has accessToken:', !!accessToken, 'has idToken:', !!idToken, 'returnTo:', returnTo);

      if (accessToken) {
        try {
          sessionStorage.setItem('otuh2_access_token', accessToken);
          if (idToken) sessionStorage.setItem('otuh2_id_token', idToken);
          if (refreshToken) localStorage.setItem('otuh2_refresh_token', refreshToken);
        } catch (storageError) {
          console.error('[AuthCallback] failed to persist tokens:', storageError);
          void this.router.navigateByUrl('/auth/login');
          return;
        }

        console.log('[AuthCallback] tokens stored in sessionStorage');

        const navigateToTarget = (targetPath: string) => {
          void this.router.navigateByUrl(targetPath);
        };

        const resolveTarget = (): string => {
          let decodedReturnTo: string | null = null;
          if (returnTo) {
            try {
              decodedReturnTo = decodeURIComponent(returnTo);
            } catch {
              decodedReturnTo = null;
            }
          }
          console.log('[AuthCallback] decodedReturnTo:', decodedReturnTo);

          if (decodedReturnTo && isSafeRedirectPath(decodedReturnTo) && decodedReturnTo !== '/' && decodedReturnTo !== '/auth/login') {
            return decodedReturnTo;
          }
          const user = this.authService.getCurrentUser();
          return user
            ? this.authService.getDashboardPathForRole(user.userType)
            : '/dashboard';
        };

        const target = resolveTarget();
        console.log('[AuthCallback] target:', target);

        this.api.getProfile().subscribe({
          next: (profile) => {
            this.authService.enrichCurrentUser(profile);
            console.log('[AuthCallback] profile enriched — phase:', profile.phase);
            navigateToTarget(target);
          },
          error: (err) => {
            console.warn('[AuthCallback] getProfile failed, continuing without enrichment:', err);
            navigateToTarget(target);
          },
        });
      } else {
        console.warn('[AuthCallback] NO access_token in URL — redirecting to login');
        // No token - redirect to login
        void this.router.navigateByUrl('/auth/login');
      }
    });
  }
}
