import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaktabService } from '../../../core/services/maktab.service';
import { HalghehListComponent } from '../halgheh-list.component';
import { HalghehDetailComponent } from '../halgheh-detail.component';
import { HalghehFullDto } from '../../../core/models/halgheh.models';

@Component({
  selector: 'lp-halghehs-page',
  standalone: true,
  imports: [CommonModule, FormsModule, HalghehListComponent, HalghehDetailComponent],
  template: `
    <div class="page">
      <div class="page-head">
        <h2>حلقه‌ها</h2>
      </div>

      <div class="maktab-select">
        <select [(ngModel)]="selectedMaktabId" (ngModelChange)="onMaktabChange()">
          <option [ngValue]="null" disabled>انتخاب مکتب...</option>
          <option *ngFor="let m of maktabs()" [ngValue]="m.id">{{ m.name }}</option>
        </select>
      </div>

      <div *ngIf="selectedMaktabId">
        <lp-halgheh-list
          *ngIf="!selectedHalgheh()"
          [maktabId]="selectedMaktabId!"
          (onOpen)="openHalgheh($event)" />

        <lp-halgheh-detail
          *ngIf="selectedHalgheh()"
          [halgheh]="selectedHalgheh()!"
          (close)="selectedHalgheh.set(null)" />
      </div>

      <div class="empty" *ngIf="!selectedMaktabId">
        <span>مکتبی انتخاب نشده</span>
        <p>برای مشاهده حلقه‌ها، ابتدا یک مکتب انتخاب کنید.</p>
      </div>
    </div>
  `,
  styles: [`
    .page { padding: 20px; }
    .page-head h2 { margin: 0 0 14px 0; font-size: 20px; }
    .maktab-select { margin-bottom: 16px; }
    .maktab-select select {
      width: 100%; max-width: 360px; padding: 10px 14px;
      border: 1px solid var(--lp-color-border, #e0e0e0); border-radius: 8px;
      font-size: 14px;
    }
    .empty { text-align: center; padding: 40px 0; color: var(--lp-color-text-secondary, #999); }
    .empty span { font-size: 24px; display: block; margin-bottom: 8px; }
  `]
})
export class HalghehsPageComponent implements OnInit {
  private maktabService = inject(MaktabService);

  maktabs = signal<{ id: number; name: string }[]>([]);
  selectedMaktabId: number | null = null;
  selectedHalgheh = signal<HalghehFullDto | null>(null);

  ngOnInit(): void {
    this.loadMaktabs();
  }

  loadMaktabs(): void {
    this.maktabService.getAll().subscribe({
      next: (list) => this.maktabs.set(list.map((m) => ({ id: m.id, name: m.name }))),
      error: () => {},
    });
  }

  onMaktabChange(): void {
    this.selectedHalgheh.set(null);
  }

  openHalgheh(h: HalghehFullDto): void {
    this.selectedHalgheh.set(h);
  }
}
