import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import type { LeaderboardEntryDto } from '../../../../core/models/lesson-planner.models';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: block;
      }
      .leaderboard {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        direction: rtl;
      }
      .row {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.5rem 0.75rem;
        border-radius: 0.5rem;
        background: var(--lp-bg);
      }
      .row--top {
        background: var(--lp-gold-light);
      }
      .rank {
        min-width: 1.5rem;
        text-align: center;
        font-weight: 700;
        color: var(--lp-primary);
      }
      .rank--gold {
        color: var(--lp-gold);
      }
      .avatar {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 2.1rem;
        height: 2.1rem;
        border-radius: 999px;
        background: var(--lp-primary);
        color: #fff;
        font-size: 0.85rem;
        font-weight: 700;
        flex-shrink: 0;
      }
      .name {
        flex: 1;
        color: var(--lp-text);
        font-weight: 600;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .score-wrap {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        min-width: 5.5rem;
      }
      .mini-track {
        flex: 1;
        height: 0.4rem;
        border-radius: 999px;
        background: var(--lp-border);
        overflow: hidden;
      }
      .mini-fill {
        height: 100%;
        border-radius: 999px;
        background: linear-gradient(90deg, var(--lp-primary), var(--lp-gold));
      }
      .score {
        min-width: 2.6rem;
        text-align: left;
        font-weight: 600;
        color: var(--lp-primary);
        font-variant-numeric: tabular-nums;
      }
      .empty {
        padding: 1rem;
        text-align: center;
        color: var(--lp-muted);
        border: 1px dashed var(--lp-border);
        border-radius: 0.75rem;
        font-size: 0.85rem;
      }
    `,
  ],
  template: `
    @if (entries.length) {
      <ol class="leaderboard">
        @for (entry of entries; track entry.studentId) {
          <li class="row" [class.row--top]="entry.rank === 1">
            <span class="rank" [class.rank--gold]="entry.rank === 1">{{ fa(entry.rank) }}</span>
            <span class="avatar" aria-hidden="true">{{ initial(entry.studentName) }}</span>
            <span class="name">{{ entry.studentName }}</span>
            <span class="score-wrap">
              <span class="mini-track">
                <span class="mini-fill" [style.width.%]="clamp(entry.overallScore)"></span>
              </span>
              <span class="score">{{ percent(entry.overallScore) }}</span>
            </span>
          </li>
        }
      </ol>
    } @else {
      <div class="empty">داده‌ای برای جدول برترین‌ها وجود ندارد</div>
    }
  `,
})
export class LeaderboardComponent {
  @Input() entries: LeaderboardEntryDto[] = [];

  fa(value: number): string {
    return value.toLocaleString('fa-IR');
  }

  percent(value: number): string {
    return `${this.clamp(value).toLocaleString('fa-IR', { maximumFractionDigits: 1 })}٪`;
  }

  clamp(value: number): number {
    return Math.max(0, Math.min(100, value ?? 0));
  }

  initial(name: string): string {
    return (name ?? '').trim().charAt(0) || '؟';
  }
}