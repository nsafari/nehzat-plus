import { Pipe, PipeTransform } from '@angular/core';
import { toTripleDate, TripleDate } from '../../core/utils/calendar.utils';

@Pipe({
  name: 'tripleDate',
  standalone: true,
  pure: true
})
export class TripleDatePipe implements PipeTransform {
  transform(value: string | Date | null | undefined): TripleDate | null {
    if (!value) return null;
    return toTripleDate(value);
  }
}

@Pipe({
  name: 'jalaliDate',
  standalone: true,
  pure: true
})
export class JalaliDatePipe implements PipeTransform {
  transform(value: string | Date | null | undefined): string | null {
    if (!value) return null;
    return toTripleDate(value).jalali;
  }
}

@Pipe({
  name: 'hijriDate',
  standalone: true,
  pure: true
})
export class HijriDatePipe implements PipeTransform {
  transform(value: string | Date | null | undefined): string | null {
    if (!value) return null;
    return toTripleDate(value).hijri;
  }
}
