import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toTripleDate, toTripleDateDetail, TripleDate, TripleDateDetail } from '../../../core/utils/calendar.utils';
import { TripleDatePipe } from '../../pipes/triple-date.pipe';

@Component({
  selector: 'lp-triple-date',
  standalone: true,
  imports: [CommonModule, TripleDatePipe],
  template: `
    <div class="triple-date" [class.inline]="displayMode === 'inline'" [class.vertical]="displayMode === 'vertical'">
      <span class="date-item hijri">
        <span class="label" *ngIf="showLabels">قمری: </span>
        <span class="value">{{ dates?.hijri }}</span>
      </span>

      <span class="separator" *ngIf="displayMode === 'inline'"> | </span>

      <span class="date-item jalali">
        <span class="label" *ngIf="showLabels">شمسی: </span>
        <span class="value">{{ dates?.jalali }}</span>
      </span>

      <span class="separator" *ngIf="displayMode === 'inline'"> | </span>

      <span class="date-item gregorian">
        <span class="label" *ngIf="showLabels">میلادی: </span>
        <span class="value">{{ dates?.gregorian }}</span>
      </span>
    </div>

    <div class="triple-date-detail" *ngIf="showDetail && detail">
      <span class="day-of-week">{{ detail.dayOfWeekPersian }}</span>
      <span class="comma">، </span>
      <span class="month-name">{{ detail.monthNameJalali }}</span>
    </div>
  `,
  styles: [`
    .triple-date {
      direction: ltr;
      font-family: 'Vazirmatn', sans-serif;
    }
    .triple-date.inline {
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
    .triple-date.vertical {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .date-item {
      white-space: nowrap;
    }
    .hijri .value {
      color: var(--lp-color-primary, #1a73e8);
      font-weight: 600;
    }
    .jalali .value {
      color: var(--lp-color-text, #333);
    }
    .gregorian .value {
      color: var(--lp-color-text-secondary, #666);
    }
    .separator {
      color: var(--lp-color-border, #ccc);
      margin: 0 2px;
    }
    .label {
      font-size: 0.8em;
      color: var(--lp-color-text-secondary, #666);
    }
    .triple-date-detail {
      font-size: 0.9em;
      color: var(--lp-color-text-secondary, #666);
      margin-top: 2px;
    }
    .day-of-week {
      font-weight: 500;
    }
  `]
})
export class LpTripleDateComponent implements OnInit {
  @Input() date!: string | Date;
  @Input() displayMode: 'inline' | 'vertical' = 'inline';
  @Input() showLabels: boolean = false;
  @Input() showDetail: boolean = false;

  dates: TripleDate | null = null;
  detail: TripleDateDetail | null = null;

  ngOnInit(): void {
    if (this.date) {
      this.dates = toTripleDate(this.date);
      if (this.showDetail) {
        this.detail = toTripleDateDetail(this.date);
      }
    }
  }
}
