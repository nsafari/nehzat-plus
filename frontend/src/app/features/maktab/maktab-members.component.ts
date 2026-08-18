import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MaktabService } from '../../core/services/maktab.service';
import { MaktabMemberDto, PaginatedResult } from '../../core/models/maktab.models';

@Component({
  selector: 'app-maktab-members',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="lp-section">
      <h3>اعضا</h3>
      <div *ngFor="let m of (members()?.items || [])">
        <span>{{ m.firstName }} {{ m.lastName }}</span>
        <span class="lp-badge">{{ roleLabel(m.role) }}</span>
      </div>
    </div>
  `,
  styles: ['.lp-section { margin: 1rem 0; } .lp-badge { padding: 0.125rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem; background: var(--lp-surface-accent); color: var(--lp-text-accent); }']
})
export class MaktabMembersComponent {
  private svc = inject(MaktabService);
  private route = inject(ActivatedRoute);
  members = signal<PaginatedResult<MaktabMemberDto> | null>(null);

  constructor() {
    const maktabId = this.route.parent?.snapshot.paramMap.get('id');
    if (maktabId) {
      this.svc.getMembers(+maktabId, { page: 1, pageSize: 20 }).subscribe((d: PaginatedResult<MaktabMemberDto>) => this.members.set(d));
    }
  }

  roleLabel(r: string): string {
    const map: Record<string, string> = { owner: 'مالک', manager: 'مدیر', member: 'عضو', banned: 'مسدود' };
    return map[r] || r;
  }
}
