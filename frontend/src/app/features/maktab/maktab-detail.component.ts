import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MaktabService } from '../../core/services/maktab.service';
import { MaktabDto } from '../../core/models/maktab.models';
import { MaktabMembersComponent } from './maktab-members.component';
import { MaktabSettingsComponent } from './maktab-settings.component';
import { HalghehListComponent } from '../halgheh/halgheh-list.component';

@Component({
  selector: 'app-maktab-detail',
  standalone: true,
  imports: [CommonModule, MaktabMembersComponent, MaktabSettingsComponent, HalghehListComponent],
  template: `
    <div class="lp-card" *ngIf="maktab()">
      <h2>{{ maktab()?.name }}</h2>
      <p>{{ maktab()?.description }}</p>
      <nav class="lp-tabs">
        <a (click)="tab.set('overview')" [class.active]="tab() === 'overview'">خلاصه</a>
        <a (click)="tab.set('members')" [class.active]="tab() === 'members'">اعضا</a>
        <a (click)="tab.set('halghehs')" [class.active]="tab() === 'halghehs'">حلقه‌ها</a>
        <a (click)="tab.set('settings')" [class.active]="tab() === 'settings'">تنظیمات</a>
      </nav>
      <app-maktab-members *ngIf="tab() === 'members'" />
      <lp-halgheh-list *ngIf="tab() === 'halghehs'" [maktabId]="maktab()?.id ?? 0" />
      <app-maktab-settings *ngIf="tab() === 'settings'" />
    </div>
  `,
  styles: [`
    .lp-tabs { display: flex; gap: 1rem; border-bottom: 1px solid var(--lp-border); margin: 1rem 0; }
    .lp-tabs a { cursor: pointer; padding: 0.5rem 1rem; }
    .lp-tabs a.active { border-bottom: 2px solid var(--lp-accent); }
  `]
})
export class MaktabDetailComponent implements OnInit {
  private svc = inject(MaktabService);
  private route = inject(ActivatedRoute);
  tab = signal<'overview' | 'members' | 'halghehs' | 'settings'>('overview');
  maktab = signal<MaktabDto | null>(null);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.svc.getById(+id).subscribe((d: MaktabDto) => this.maktab.set(d));
    }
  }
}
