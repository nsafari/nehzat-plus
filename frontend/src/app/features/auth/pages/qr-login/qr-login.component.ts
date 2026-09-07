import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';

import { environment } from '../../../../../environments/environment';
import { AuthService } from '../../../../core/services/auth.service';
import { resolveOtuh2BaseUrl } from '../../../../core/services/api-url.util';

@Component({
  selector: 'app-qr-login',
  standalone: true,
  imports: [],
  templateUrl: './qr-login.component.html'
})
export class QrLoginComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly useMockAuth = environment.useMockAuth;
  protected isLoading = signal(false);
  protected qrCodeShown = signal(false);
  protected confirmed = signal(false);
  protected resendDisabled = signal(false);

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      const user = this.authService.getCurrentUser();
      const target = user
        ? this.authService.getDashboardPathForRole(user.userType)
        : '/dashboard';
      void this.router.navigateByUrl(target);
      return;
    }
  }

  /** Request a new QR code from the backend.
   *  Shows the QR code area and starts polling for confirmation. */
  requestQrCode(): void {
    this.isLoading.set(true);
    this.resendDisabled.set(true);
    this.authService.requestQrCode().subscribe({
      next: () => {
        this.qrCodeShown.set(true);
        this.isLoading.set(false);
        this.startPolling();
      },
      error: () => {
        this.isLoading.set(false);
        this.resendDisabled.set(false);
      }
    });
  }

  /** Start polling the QR status every 2 seconds. */
  private startPolling(): void {
    const interval = setInterval(() => {
      this.authService.pollQrStatus().subscribe({
        next: (response) => {
          if (response.status === 'confirmed') {
            clearInterval(interval);
            this.confirmed.set(true);
            // Auto-login: navigate to dashboard
            const username = response.username ?? 'user';
            void this.authService.confirmQrScan(username).subscribe({
              next: () => {
                void this.router.navigateByUrl('/dashboard');
              }
            });
          } else if (response.status === 'expired') {
            clearInterval(interval);
            this.qrCodeShown.set(false);
            this.resendDisabled.set(false);
          }
        }
      });
    }, 2000);
  }

  /** Resend/regenerate a new QR code. */
  resendQrCode(): void {
    this.qrCodeShown.set(false);
    this.confirmed.set(false);
    this.requestQrCode();
  }
}