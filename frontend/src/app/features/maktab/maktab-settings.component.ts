import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MaktabService } from '../../core/services/maktab.service';
import { MaktabDto } from '../../core/models/maktab.models';

@Component({
  selector: 'app-maktab-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="lp-section" *ngIf="maktab()">
      <h3>تنظیمات مکتب</h3>
      <label>نام
        <input class="lp-input" [(ngModel)]="name" />
      </label>
      <label>وضعیت
        <select class="lp-input" [(ngModel)]="status">
          <option value="active">فعال</option>
          <option value="inactive">غیرفعال</option>
          <option value="archived">بایگانی شده</option>
        </select>
      </label>
      <button class="lp-btn" (click)="save()">ذخیره</button>
    </div>
  `,
  styles: ['.lp-section { margin: 1rem 0; } .lp-input { display: block; width: 100%; padding: 0.5rem; border: 1px solid var(--lp-border); border-radius: 0.25rem; margin-top: 0.25rem; }']
})
export class MaktabSettingsComponent {
  private svc = inject(MaktabService);
  private route = inject(ActivatedRoute);
  maktab = signal<MaktabDto | null>(null);
  name = '';
  status = '';

  constructor() {
    const id = this.route.parent?.snapshot.paramMap.get('id');
    if (id) {
      this.svc.getById(+id).subscribe((d) => {
        this.maktab.set(d);
        this.name = d.name;
        this.status = d.status;
      });
    }
  }

  save() {
    const id = this.route.parent?.snapshot.paramMap.get('id');
    if (id) {
      this.svc.update(+id, { name: this.name, status: this.status }).subscribe();
    }
  }
}
