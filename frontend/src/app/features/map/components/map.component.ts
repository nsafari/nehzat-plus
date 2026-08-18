import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import * as L from 'leaflet';
import { MapService } from '../map.service';
import { NotificationService } from '../../../core/services/notification.service';
import type { MapOrderDto, UserLocationDto } from '../../../core/models/lesson-planner.models';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent implements OnInit, AfterViewInit {
  @ViewChild('mapEl', { static: true }) mapEl!: ElementRef<HTMLDivElement>;
  private readonly mapService = inject(MapService);
  private readonly notify = inject(NotificationService);
  private readonly destroyRef = inject(DestroyRef);
  private leafletMap?: L.Map;
  private markersLayer?: L.LayerGroup;

  orders = signal<MapOrderDto[]>([]);
  locations = signal<UserLocationDto[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.mapService.getDashboard()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (d) => { this.orders.set(d.orders); this.locations.set([]); this.loading.set(false); },
        error: () => { this.notify.show('خطا در بارگذاری داشبورد', 'error'); this.loading.set(false); },
      });
    this.mapService.getUserLocations()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({ next: (locs) => this.locations.set(locs) });
  }

  ngAfterViewInit(): void {
    this.leafletMap = L.map(this.mapEl.nativeElement).setView([35.6892, 51.389], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(this.leafletMap);
    this.markersLayer = L.layerGroup().addTo(this.leafletMap);
    queueMicrotask(() => this.refreshMarkers());
  }

  acceptOrder(id: number): void {
    this.mapService.acceptOrder(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.notify.show('سفارش پذیرفته شد', 'success'),
        error: () => this.notify.show('خطا در پذیرش سفارش', 'error'),
      });
  }

  trackById = (_: number, item: { id: number }) => item.id;

  private refreshMarkers(): void {
    if (!this.markersLayer) return;
    this.markersLayer.clearLayers();
    this.orders().forEach((o) => {
      const m = L.marker([o.pickupLat, o.pickupLng]).bindPopup(
        `<strong>${o.customerName}</strong><br/>${o.pickupAddress}<br/>وضعیت: ${o.status}`,
      );
      this.markersLayer!.addLayer(m);
      const drop = L.marker([o.dropoffLat, o.dropoffLng], { opacity: 0.5 })
        .bindPopup(`<strong>${o.customerName}</strong><br/>${o.dropoffAddress}`);
      this.markersLayer!.addLayer(drop);
    });
    this.locations().forEach((l) => {
      const icon = L.divIcon({ className: 'lp-live-dot', html: `<span>${l.fullName.charAt(0)}</span>` });
      this.markersLayer!.addLayer(L.marker([l.lat, l.lng], { icon }));
    });
  }
}
