import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <main style="max-width: 420px; margin: 2rem auto; padding: 1rem; direction: rtl;">
      <h1 style="margin-bottom: 0.5rem;">ورود</h1>
      <p style="margin-bottom: 1rem; color: #666;">برای نسخه نمایشی از حساب‌های زیر استفاده کنید:</p>
      <ul style="margin-top: 0; margin-bottom: 1rem; color: #555;">
        <li>دانش‌آموز: <code>student / student123</code></li>
        <li>مدیر: <code>admin / admin123</code></li>
      </ul>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" style="display: grid; gap: 0.75rem;">
        <label>
          نام کاربری
          <input formControlName="username" type="text" style="width: 100%; padding: 0.5rem;" />
        </label>
        <label>
          رمز عبور
          <input formControlName="password" type="password" style="width: 100%; padding: 0.5rem;" />
        </label>
        @if (errorMessage) {
          <p style="margin: 0; color: #b00020;">{{ errorMessage }}</p>
        }
        <button type="submit" [disabled]="form.invalid || isSubmitting" style="padding: 0.6rem;">
          {{ isSubmitting ? 'در حال ورود...' : 'ورود' }}
        </button>
      </form>

      <p style="margin-top: 1rem;">
        حساب ندارید؟
        <a routerLink="/auth/register">ثبت‌نام</a>
      </p>
    </main>
  `
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly form = this.fb.nonNullable.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });
  protected isSubmitting = false;
  protected errorMessage = '';
  protected onSubmit(): void {
    if (this.form.invalid || this.isSubmitting) {
      return;
    }

    this.errorMessage = '';
    this.isSubmitting = true;
    const payload = this.form.getRawValue();

    this.authService
      .signin(payload)
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: (response) => {
          const target = response.userType === 'admin' ? '/admin' : '/dashboard';
          void this.router.navigateByUrl(target);
        },
        error: (error) => {
          this.errorMessage = error?.error?.message ?? 'خطا در ورود. دوباره تلاش کنید.';
        }
      });
  }
}
