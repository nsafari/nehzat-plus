import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  inject,
  input,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { MapService } from '../map.service';
import { DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import type { OrderTrackingPointDto } from '../../../core/models/lesson-planner.models';

@Component({
  selector: 'app-delivery-tracking',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delivery-tracking.component.html',
  styleUrls: ['./delivery-tracking.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeliveryTrackingComponent implements AfterViewInit {
  orderId = input<number>(0);
  @ViewChild('mapEl', { static: true }) mapEl!: ElementRef<HTMLDivElement>;
  private readonly mapService = inject(MapService);
  private readonly destroyRef = inject(DestroyRef);

  points = signal<OrderTrackingPointDto[]>([]);

  ngAfterViewInit(): void {
    const map = L.map(this.mapEl.nativeElement).setView([35.72, 51.4], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);
    this.mapService.getOrderTracking(this.orderId())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((pts) => {
        this.points.set(pts);
        const group: L.LatLngExpression[] = pts.map((p) => [p.lat, p.lng]);
        pts.forEach((p) =>
          L.marker([p.lat, p.lng])
            .addTo(map)
            .bindPopup(`<strong>${p.status}</strong><br/>${p.note ?? ''}<br/>${new Date(p.timestamp).toLocaleString('fa-IR')}`),
        );
        if (group.length > 0) {
          map.fitBounds(group as L.LatLngBoundsLiteral, { padding: [40, 40] });
        }
      });
  }
}
