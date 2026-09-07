import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import type {
  SkillCertificate,
  SkillBasket,
  CreateSkillBasketPayload
} from '../../core/models/lesson-planner.models';
import { LESSON_PLANNER_API } from '../../core/services/lesson-planner-api.token';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';

type CareerView = 'certificates' | 'skills' | 'basket';

@Component({
  selector: 'app-career',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './career.component.html',
  styleUrls: ['./career.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CareerComponent implements OnInit {
  private readonly api = inject(LESSON_PLANNER_API);
  private readonly authService = inject(AuthService);
  private readonly notify = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  activeView: CareerView = 'certificates';
  loading = true;
  saving = false;

  certificates: SkillCertificate[] = [];
  baskets: SkillBasket[] = [];
  currentBasket: SkillBasket | null = null;

  showCreateBasketModal = false;
  basketTitle = '';
  basketDescription = '';

  constructor() {
    const user = this.authService.getCurrentUser();
    if (!user) {
      void this.router.navigateByUrl('/auth/login');
    }
  }

  ngOnInit(): void {
    this.loadCertificates();
    this.loadSkillBasket();
  }

  private loadCertificates(): void {
    this.loading = true;
    this.api.getSkillCertificates().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (items) => {
        this.certificates = items;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  private loadSkillBasket(): void {
    this.api.getSkillBasket().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (basket) => {
        this.currentBasket = basket;
        this.baskets = basket ? [basket] : [];
      }
    });
  }

  switchView(view: CareerView): void {
    this.activeView = view;
  }

  createBasket(): void {
    if (this.saving || !this.basketTitle.trim()) return;

    this.saving = true;
    const payload: CreateSkillBasketPayload = {
      title: this.basketTitle.trim(),
      description: this.basketDescription.trim() || null,
      skillIds: [],
      isPublic: true
    };

    this.api.createSkillBasket(payload).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (basket) => {
        this.currentBasket = basket;
        this.baskets = [basket, ...this.baskets];
        this.showCreateBasketModal = false;
        this.resetBasketForm();
        this.notify.show('سبد مهارت ایجاد شد', 'success');
      },
      error: () => this.notify.show('خطا در ایجاد سبد مهارت', 'error'),
      complete: () => { this.saving = false; }
    });
  }

  private resetBasketForm(): void {
    this.basketTitle = '';
    this.basketDescription = '';
  }

  getCompetencyLabel(percent: number): string {
    if (percent >= 90) return 'پیشرفته';
    if (percent >= 70) return 'متوسطه';
    if (percent >= 50) return 'مبتدی';
    return 'شروع‌شده';
  }

  backToDashboard(): void {
    void this.router.navigateByUrl('/dashboard');
  }
}
