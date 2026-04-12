import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink],
  template: `
    <main style="padding: 1.5rem; direction: rtl;">
      <h1>ورود</h1>
      <p>صفحه ورود در مرحله بعدی پیاده‌سازی می‌شود.</p>
      <a routerLink="/auth/register">ثبت‌نام</a>
    </main>
  `
})
export class LoginComponent {}
