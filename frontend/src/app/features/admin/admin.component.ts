import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  template: `
    <main style="padding: 1.5rem; direction: rtl; max-width: 720px; margin: 0 auto;">
      <header style="display: flex; justify-content: space-between; align-items: center; gap: 1rem;">
        <div>
          <h1 style="margin-bottom: 0.25rem;">پنل مدیریت</h1>
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
        <h2 style="margin-top: 0;">نسخه نمایشی مدیریت</h2>
        <p style="margin-bottom: 0;">این بیلد با Mock API منتشر می‌شود و برای بررسی مسیرهای ورود و پنل مناسب است.</p>
      </section>
    </main>
  `
})
export class AdminComponent {
  username = '';

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {
    this.username = this.authService.getCurrentUser()?.username ?? 'admin';
  }

  logout(): void {
    this.authService.logout();
    void this.router.navigateByUrl('/auth/login');
  }
}
