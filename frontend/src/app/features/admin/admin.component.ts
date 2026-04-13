import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  template: `
    <main class="app-shell app-shell--narrow">
      <header class="shell-header">
        <div>
          <h1>پنل مدیریت</h1>
          <p>خوش آمدید {{ username }}</p>
        </div>
        <button type="button" class="btn btn-secondary" (click)="logout()">خروج</button>
      </header>
      <section class="card" style="margin-top: 1rem;">
        <h2 style="margin-top: 0;">نسخه نمایشی مدیریت</h2>
        <p>این بیلد با Mock API منتشر می‌شود و برای بررسی مسیرهای ورود و پنل مناسب است.</p>
      </section>
      <section class="card-grid" style="margin-top: 1rem;">
        <article class="card">
          <h3>مدیریت کاربران</h3>
          <p>بررسی دانش‌آموزان در انتظار تایید و مدیریت وضعیت ثبت‌نام.</p>
        </article>
        <article class="card">
          <h3>مدیریت دوره‌ها</h3>
          <p>ایجاد، ویرایش و دسته‌بندی دوره‌های آموزشی فعال و غیرفعال.</p>
        </article>
        <article class="card">
          <h3>مدیریت تکالیف</h3>
          <p>تعریف تکلیف روزانه، سری زمانی و مدیریت فایل‌های پیوست.</p>
        </article>
      </section>
      <section class="helper-banner" style="margin-top: 1rem;">
        <strong>حساب دمو مدیر:</strong>
        <code>admin / admin123</code>
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
