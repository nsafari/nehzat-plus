import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `
    <main style="padding: 1.5rem; direction: rtl; max-width: 720px; margin: 0 auto;">
      <header style="display: flex; justify-content: space-between; align-items: center; gap: 1rem;">
        <div>
          <h1 style="margin-bottom: 0.25rem;">داشبورد دانش‌آموز</h1>
          <p style="margin: 0; color: #666;">خوش آمدید {{ username }}</p>
        </div>
        <button
          type="button"
          (click)="logout()"
          style="padding: 0.5rem 1rem; border: 1px solid #ccc; background: #fff; border-radius: 0.5rem; cursor: pointer;"
        >
          خروج
        </button>
      </header>
      <section style="margin-top: 1.5rem; border: 1px solid #e2e8f0; border-radius: 0.75rem; padding: 1rem;">
        <h2 style="margin-top: 0;">حالت دمو با Mock API فعال است</h2>
        <p style="margin-bottom: 0;">
          برای تست سریع می‌توانید با حساب <strong>student / student123</strong> یا
          <strong>admin / admin123</strong> وارد شوید.
        </p>
      </section>
    </main>
  `
})
export class DashboardComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly username = this.authService.getCurrentUser()?.username ?? 'دانش‌آموز';

  logout(): void {
    this.authService.logout();
    void this.router.navigate(['/auth/login']);
  }
}
