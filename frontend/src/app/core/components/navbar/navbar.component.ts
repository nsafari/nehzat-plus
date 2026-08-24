import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface NavItem {
  label: string;
  route: string;
  icon: string;
  exact?: boolean;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (visible()) {
      <nav class="lp-navbar" dir="rtl" aria-label="منوی اصلی">
        <div class="lp-navbar__brand">
          <a routerLink="/dashboard" class="lp-navbar__logo">نشاط پلاس</a>
        </div>

        <button
          type="button"
          class="lp-navbar__toggle"
          [class.lp-navbar__toggle--open]="menuOpen()"
          (click)="toggleMenu()"
          [attr.aria-expanded]="menuOpen()"
          aria-controls="lp-navbar-menu"
          aria-label="منو">
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul id="lp-navbar-menu" class="lp-navbar__menu" [class.lp-navbar__menu--open]="menuOpen()">
          @for (item of items; track item.route) {
            <li class="lp-navbar__item">
              <a
                [routerLink]="item.route"
                routerLinkActive="lp-navbar__link--active"
                [routerLinkActiveOptions]="{ exact: item.exact ?? false }"
                class="lp-navbar__link"
                (click)="closeMenu()">
                <span class="lp-navbar__icon" aria-hidden="true">{{ item.icon }}</span>
                <span class="lp-navbar__label">{{ item.label }}</span>
              </a>
            </li>
          }

          <li class="lp-navbar__item lp-navbar__item--user">
            @if (currentUserName(); as name) {
              <span class="lp-navbar__user">
                <span class="lp-navbar__user-avatar" aria-hidden="true">{{ initial() }}</span>
                <span class="lp-navbar__user-name">{{ name }}</span>
              </span>
            }
            <button type="button" class="lp-navbar__logout" (click)="logout()">خروج</button>
          </li>
        </ul>
      </nav>
    }
  `,
  styles: `
    :host { display: block; }

    .lp-navbar {
      position: sticky;
      top: 0;
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: 0.75rem 1.5rem;
      background: var(--lp-surface, #fff);
      border-bottom: 1px solid var(--lp-border, #e5e7eb);
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
      font-family: inherit;
    }

    .lp-navbar__brand { display: flex; align-items: center; gap: 0.5rem; }

    .lp-navbar__logo {
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--lp-primary, #1a6b3c);
      text-decoration: none;
      letter-spacing: 0.02em;
    }

    .lp-navbar__toggle {
      display: none;
      flex-direction: column;
      gap: 4px;
      background: none;
      border: 1px solid var(--lp-border, #e5e7eb);
      border-radius: 8px;
      padding: 6px 8px;
      cursor: pointer;
    }

    .lp-navbar__toggle span {
      display: block;
      width: 22px;
      height: 2px;
      background: var(--lp-text, #1e1b14);
      border-radius: 2px;
      transition: transform 0.2s ease, opacity 0.2s ease;
    }

    .lp-navbar__toggle--open span:nth-child(1) { transform: translateY(6px) rotate(45deg); }
    .lp-navbar__toggle--open span:nth-child(2) { opacity: 0; }
    .lp-navbar__toggle--open span:nth-child(3) { transform: translateY(-6px) rotate(-45deg); }

    .lp-navbar__menu {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .lp-navbar__item { display: flex; align-items: center; }

    .lp-navbar__link {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.5rem 0.85rem;
      border-radius: 10px;
      color: var(--lp-text, #1e1b14);
      text-decoration: none;
      font-weight: 600;
      font-size: 0.92rem;
      transition: background 0.15s ease, color 0.15s ease;
    }

    .lp-navbar__link:hover {
      background: rgba(26, 107, 60, 0.08);
      color: var(--lp-primary, #1a6b3c);
    }

    .lp-navbar__link--active {
      background: var(--lp-primary, #1a6b3c);
      color: #fff;
    }

    .lp-navbar__link--active:hover {
      background: #145530;
      color: #fff;
    }

    .lp-navbar__icon { font-size: 1rem; }

    .lp-navbar__item--user {
      margin-inline-start: 0.5rem;
      gap: 0.5rem;
      padding-inline-start: 0.5rem;
      border-inline-start: 1px solid var(--lp-border, #e5e7eb);
    }

    .lp-navbar__user {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0 0.5rem;
      color: var(--lp-text, #1e1b14);
      font-size: 0.9rem;
      font-weight: 600;
    }

    .lp-navbar__user-avatar {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: var(--lp-gold, #c9a043);
      color: #fff;
      font-weight: 700;
      font-size: 0.85rem;
    }

    .lp-navbar__logout {
      background: transparent;
      border: 1px solid var(--lp-danger, #dc2626);
      color: var(--lp-danger, #dc2626);
      padding: 0.4rem 0.85rem;
      border-radius: 10px;
      cursor: pointer;
      font-weight: 600;
      font-size: 0.85rem;
      transition: background 0.15s ease, color 0.15s ease;
    }

    .lp-navbar__logout:hover {
      background: var(--lp-danger, #dc2626);
      color: #fff;
    }

    @media (max-width: 768px) {
      .lp-navbar { flex-wrap: wrap; padding: 0.75rem 1rem; }
      .lp-navbar__toggle { display: flex; }

      .lp-navbar__menu {
        display: none;
        flex-basis: 100%;
        flex-direction: column;
        align-items: stretch;
        gap: 0.25rem;
        padding-block-start: 0.5rem;
      }

      .lp-navbar__menu--open { display: flex; }
      .lp-navbar__link { padding: 0.6rem 0.75rem; }

      .lp-navbar__item--user {
        border-inline-start: none;
        border-block-start: 1px solid var(--lp-border, #e5e7eb);
        padding-block-start: 0.5rem;
        margin-block-start: 0.5rem;
        justify-content: space-between;
        padding-inline-start: 0;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .lp-navbar__toggle span,
      .lp-navbar__link,
      .lp-navbar__logout { transition: none; }
    }
  `
})
export class NavbarComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly visible = signal<boolean>(this.auth.isAuthenticated());
  readonly currentUserName = signal<string | null>(this.auth.getCurrentUser()?.username ?? null);
  readonly initial = signal<string>(this.computeInitial());
  readonly menuOpen = signal<boolean>(false);

  protected readonly items: NavItem[] = [
    { label: 'داشبورد', route: '/dashboard', icon: '⌂' },
    { label: 'پروفایل', route: '/profile', icon: '☉' },
    { label: 'تقویم', route: '/calendar', icon: '▦' },
    { label: 'پیام‌ها', route: '/messages', icon: '✉' },
    { label: 'نقشه', route: '/map', icon: '◎' },
    { label: 'نشاننامه کتاب', route: '/vocabulary/book-marker', icon: '📖' },
  ];

  constructor() {
    // Re-read auth state on every router navigation. AuthService.isAuthenticated()
    // and getCurrentUser() read directly from sessionStorage JWT claims — no
    // reactive stream in the service yet, so we recompute at navigation time.
    this.router.events.subscribe(() => {
      this.refreshFromAuth();
      this.menuOpen.set(false);
    });
  }

  private refreshFromAuth(): void {
    this.visible.set(this.auth.isAuthenticated());
    const u = this.auth.getCurrentUser();
    this.currentUserName.set(u?.username ?? null);
    this.initial.set(this.computeInitial());
  }

  private computeInitial(): string {
    const u = this.auth.getCurrentUser();
    const name = u?.username ?? '';
    return name ? name.charAt(0).toUpperCase() : '?';
  }

  toggleMenu(): void {
    this.menuOpen.update(v => !v);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  logout(): void {
    try {
      sessionStorage.removeItem('otuh2_access_token');
      sessionStorage.removeItem('otuh2_id_token');
    } catch { /* noop for SSR safety */ }
    try {
      localStorage.removeItem('otuh2_refresh_token');
    } catch { /* noop */ }
    this.visible.set(false);
    this.router.navigateByUrl('/auth/login');
  }
}
