import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import { MapService } from '../map.service';
import { NotificationService } from '../../../core/services/notification.service';
import { DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-order-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order-create.component.html',
  styleUrls: ['./order-create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderCreateComponent implements AfterViewInit {
  @ViewChild('mapEl', { static: true }) mapEl!: ElementRef<HTMLDivElement>;
  private readonly mapService = inject(MapService);
  private readonly notify = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  model = {
    customerName: '',
    customerPhone: '',
    pickupAddress: '',
    pickupLat: 35.6892,
    pickupLng: 51.389,
    dropoffAddress: '',
    dropoffLat: 35.7589,
    dropoffLng: 51.4083,
    notes: '',
    totalAmount: 0,
  };

  pickupPick = signal(false);
  loading = signal(false);

  ngAfterViewInit(): void {
    const map = L.map(this.mapEl.nativeElement).setView([35.72, 51.4], 11);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);
    map.on('click', (e: L.LeafletMouseEvent) => this.onMapClick(e, map));
  }

  onMapClick(e: L.LeafletMouseEvent, _map: L.Map): void {
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;
    if (this.pickupPick()) {
      this.model = { ...this.model, pickupLat: lat, pickupLng: lng };
    } else {
      this.model = { ...this.model, dropoffLat: lat, dropoffLng: lng };
    }
  }

  togglePickupPick(): void {
    this.pickupPick.set(!this.pickupPick());
  }

  submit(): void {
    this.loading.set(true);
    this.mapService.createOrder(this.model)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.notify.show('سفارش ثبت شد', 'success');
          this.router.navigate(['/map']);
        },
        error: () => { this.loading.set(false); this.notify.show('خطا در ثبت سفارش', 'error'); },
      });
  }
}
