import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MapService } from '../map.service';
import { NotificationService } from '../../../core/services/notification.service';
import type { MapOrderDto } from '../../../core/models/lesson-planner.models';

@Component({
  selector: 'app-order-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order-admin.component.html',
  styleUrls: ['./order-admin.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderAdminComponent {
  private readonly mapService = inject(MapService);
  private readonly notify = inject(NotificationService);
  private readonly destroyRef = inject(DestroyRef);

  orders = signal<MapOrderDto[]>([]);
  loading = signal(true);
  pendingStats = signal({ pending: 0, inProgress: 0, completed: 0, activeCouriers: 0 });

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.loading.set(true);
    this.mapService.getDashboard()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (d) => {
          this.orders.set(d.orders);
          this.pendingStats.set({
            pending: d.pendingOrders,
            inProgress: d.inProgressOrders,
            completed: d.completedToday,
            activeCouriers: d.activeCouriers,
          });
          this.loading.set(false);
        },
        error: () => { this.loading.set(false); this.notify.show('خطا در بارگذاری', 'error'); },
      });
  }

  assign(id: number, courierId: number): void {
    if (!courierId) return;
    this.mapService.assignOrder(id, { courierId })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => { this.notify.show('سفارش تخصیص یافت', 'success'); this.refresh(); },
        error: () => this.notify.show('خطا در تخصیص', 'error'),
      });
  }

  updateStatus(id: number, status: string): void {
    this.mapService.updateOrderStatus(id, { status })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => { this.notify.show('وضعیت به‌روزرسانی شد', 'success'); this.refresh(); },
        error: () => this.notify.show('خطا در به‌روزرسانی', 'error'),
      });
  }

  trackById = (_: number, item: { id: number }) => item.id;
}
