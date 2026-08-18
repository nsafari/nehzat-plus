import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  signal
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import type { Signal } from '@angular/core';
import type { CurrentUser } from '../../../../core/models/lesson-planner.models';

@Component({
  selector: 'app-dashboard-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header class="site-header">
      <div class="brand-wrap">
        @if (!logoHidden()) {
          <img
            src="assets/nehzat.png"
            alt="لوگو سایت"
            class="site-logo"
            (error)="logoHidden.set(true)"
          />
        }
        <div>
          <h1>داشبورد متربی</h1>
          <p class="muted">خوش آمدید {{ displayName }}</p>
        </div>
      </div>

      <div class="header-nav">
        <a class="nav-link" routerLink="/dashboard/spiritual" routerLinkActive="nav-link-active">مسیر معنوی</a>
        <a class="nav-link" routerLink="/math/topics" routerLinkActive="nav-link-active">📐 ریاضیات</a>
        <a class="nav-link" routerLink="/activity" routerLinkActive="nav-link-active">🏃 فعالیت بدنی</a>
        <a class="nav-link" routerLink="/arts" routerLinkActive="nav-link-active">🎨 هنری</a>
        <a class="nav-link" routerLink="/training-courses" routerLinkActive="nav-link-active">📚 تربیت مربی</a>
      </div>

      <div class="user-menu">
        <button
          type="button"
          class="nudge-toggle"
          [class.active]="nudgesEnabled()"
          (click)="toggleNudge.emit()"
          [title]="nudgesEnabled() ? 'غیرفعال کردن یادآورهای روزانه' : 'فعال کردن یادآورهای روزانه'"
          aria-label="یادآورهای روزانه"
        >
          <i class="bi" [class.bi-bell]="!nudgesEnabled()" [class.bi-bell-fill]="nudgesEnabled()"></i>
        </button>
        <button type="button" class="menu-trigger" (click)="toggleUserMenu.emit()">
          <i class="bi bi-person-circle"></i>
          <span>{{ currentUser?.username }}</span>
        </button>
        @if (isUserMenuOpen()) {
          <div class="menu-dropdown">
            <button type="button" (click)="showUserModal.emit()">نمایش جزئیات کاربر</button>
            <button type="button" (click)="logout.emit()">خروج</button>
          </div>
        }
      </div>
    </header>
  `,
  styleUrls: ['./dashboard-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardHeaderComponent {
  @Input({ required: true }) currentUser: CurrentUser | null = null;
  @Input({ required: true }) nudgesEnabled!: Signal<boolean>;

  @Output() toggleUserMenu = new EventEmitter<void>();
  @Output() showUserModal = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();
  @Output() toggleNudge = new EventEmitter<void>();

  logoHidden = signal(false);
  isUserMenuOpen = signal(false);

  get displayName(): string {
    const student = this.currentUser?.studentInfo;
    if (!student) {
      return this.currentUser?.username ?? 'متربی';
    }
    return `${student.firstName} ${student.lastName}`;
  }
}
