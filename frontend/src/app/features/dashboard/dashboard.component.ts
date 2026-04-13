import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `
    <main class="lp-shell lp-page">
      <header class="lp-topbar">
        <div>
          <h1>داشبورد دانش‌آموز</h1>
          <p class="muted">خوش آمدید {{ username }}</p>
        </div>
        <button type="button" class="lp-link-btn" (click)="logout()">
          خروج
        </button>
      </header>

      <section class="lp-card">
        <h2>کلاس‌های فعال شما</h2>
        <div class="course-grid">
          <article class="course-card">
            <h3>ریاضی پایه</h3>
            <p class="muted">تمرین روزانه مفاهیم ریاضی</p>
          </article>
          <article class="course-card">
            <h3>علوم تجربی</h3>
            <p class="muted">فعالیت‌های آزمایشگاهی ساده</p>
          </article>
        </div>
      </section>

      <section class="lp-card">
        <h2>اطلاعات نسخه نمایشی</h2>
        <p class="muted">این نسخه با Mock API کار می‌کند و بدون اتصال به بک‌اند قابل استفاده است.</p>
      </section>
    </main>
  `,
  styles: [
    `
      .lp-page {
        display: grid;
        gap: 1rem;
      }
      .lp-topbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      h1 {
        margin: 0 0 0.25rem;
      }
      h2 {
        margin: 0 0 0.75rem;
      }
      .muted {
        color: var(--lp-muted);
        margin: 0;
      }
      .course-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 0.75rem;
      }
      .course-card {
        border: 1px solid var(--lp-border);
        border-radius: 12px;
        padding: 0.75rem;
        background: #fff;
      }
      .course-card h3 {
        margin: 0 0 0.25rem;
      }
    `
  ]
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
