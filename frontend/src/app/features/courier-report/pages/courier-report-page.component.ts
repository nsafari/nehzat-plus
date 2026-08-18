import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CourierReportService } from '../courier-report.service';
import { NotificationService } from '../../../core/services/notification.service';
import type {
  CourierStatsDto,
  CourierLeaderboardDto,
} from '../../../core/models/lesson-planner.models';

interface RangeOption {
  label: string;
  from: () => Date;
  to: () => Date;
  limited: boolean;
}

function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

const RANGE_OPTIONS: RangeOption[] = [
  {
    label: 'این هفته',
    from: () => {
      const d = new Date();
      const day = d.getDay();
      const offset = day === 6 ? 0 : day + 1;
      return new Date(d.getFullYear(), d.getMonth(), d.getDate() - offset);
    },
    to: () => new Date(),
    limited: true,
  },
  {
    label: 'این ماه',
    from: () => startOfMonth(new Date()),
    to: () => new Date(),
    limited: false,
  },
  {
    label: 'ماه قبل',
    from: () => startOfMonth(new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)),
    to: () => new Date(new Date().getFullYear(), new Date().getMonth(), 1, 23, 59, 59, 999),
    limited: false,
  },
];

@Component({
  selector: 'app-courier-report-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './courier-report-page.component.html',
  styleUrls: ['./courier-report-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourierReportPageComponent implements OnInit {
  private readonly courierReport = inject(CourierReportService);
  private readonly notify = inject(NotificationService);
  private readonly destroyRef = inject(DestroyRef);

  readonly ranges = RANGE_OPTIONS;

  courierId = signal(101);
  selectedRange = signal<RangeOption>(RANGE_OPTIONS[1]);
  stats = signal<CourierStatsDto | null>(null);
  leaderboard = signal<CourierLeaderboardDto | null>(null);
  loading = signal(true);

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    const range = this.selectedRange();
    const from = range.from();
    const to = range.to();
    this.loading.set(true);

    this.courierReport
      .getCourierStats(this.courierId(), from, to)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (s) => {
          this.stats.set(s);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
          this.notify.show('خطا در بارگذاری گزارش پیک', 'error');
        },
      });
  }

  loadLeaderboard(): void {
    const range = this.selectedRange();
    this.courierReport
      .getLeaderboard(range.from(), range.to(), 10)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (l) => this.leaderboard.set(l),
        error: () => this.notify.show('خطا در بارگذاری رتبه‌بندی', 'error'),
      });
  }

  selectRange(option: RangeOption): void {
    if (option.limited) {
      return;
    }
    this.selectedRange.set(option);
    this.refresh();
    this.loadLeaderboard();
  }

  selectCourier(value: string): void {
    this.courierId.set(Number(value));
    this.refresh();
  }

  formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('fa-IR', { day: 'numeric', month: 'short' });
  }

  currency(value: number): string {
    return value.toLocaleString('fa-IR');
  }

  percent(value: number): string {
    return `${Math.round(value)}٪`;
  }
}
