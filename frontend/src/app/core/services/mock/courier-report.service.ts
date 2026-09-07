import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import type {
  CourierStatsDto,
  CourierLeaderboardDto,
  CourierDailyStatDto,
  CourierLeaderboardEntryDto,
} from '../../models/lesson-planner.models';

interface MockCourier {
  userId: number;
  name: string;
  baseDeliveries: number;
  baseEarnings: number;
}

const COURIERS: MockCourier[] = [
  { userId: 101, name: 'محمد رضایی', baseDeliveries: 6, baseEarnings: 850_000 },
  { userId: 102, name: 'علی احمدی', baseDeliveries: 5, baseEarnings: 720_000 },
  { userId: 103, name: 'فاطمه محمدی', baseDeliveries: 4, baseEarnings: 610_000 },
  { userId: 104, name: 'حسین کریمی', baseDeliveries: 3, baseEarnings: 480_000 },
];

function breakdownFor(courier: MockCourier, from: Date, to: Date): CourierDailyStatDto[] {
  const rows: CourierDailyStatDto[] = [];
  const start = new Date(from);
  const end = new Date(to);
  if (start.getTime() > end.getTime()) {
    return rows;
  }
  const cursor = new Date(start);
  let idx = 0;
  while (cursor.getTime() <= end.getTime() && rows.length < 31) {
    const drift = idx % 2 === 0 ? 1 : 0;
    const deliveries = Math.max(1, courier.baseDeliveries - (idx % 3) + drift);
    rows.push({
      date: cursor.toISOString().slice(0, 10),
      deliveredCount: deliveries,
      distanceKm: Math.round(deliveries * 6.4 * 10) / 10,
      earningsAmount: deliveries * 142_000,
      averageDeliveryMinutes: 28 + (idx % 5) * 4,
    });
    idx++;
    cursor.setDate(cursor.getDate() + 1);
  }
  return rows;
}

@Injectable({ providedIn: 'root' })
export class MockCourierReportService {
  getCourierStats(courierId: number, from: Date, to: Date): Observable<CourierStatsDto> {
    const courier = COURIERS.find((c) => c.userId === courierId) ?? COURIERS[0];
    const daily = breakdownFor(courier, from, to);
    const totalDeliveries = daily.reduce((sum, d) => sum + d.deliveredCount, 0);
    const totalDistance = Math.round(daily.reduce((sum, d) => sum + d.distanceKm, 0) * 10) / 10;
    const totalEarnings = daily.reduce((sum, d) => sum + d.earningsAmount, 0);
    return of({
      courierUserId: courier.userId,
      courierName: courier.name,
      periodStart: from.toISOString(),
      periodEnd: to.toISOString(),
      totalDeliveries,
      totalDistance,
      totalEarnings,
      dailyAverage: daily.length > 0 ? Math.round(totalEarnings / daily.length) : 0,
      dailyBreakdown: daily,
    }).pipe(delay(200));
  }

  getCourierLeaderboard(from: Date, to: Date, limit = 10): Observable<CourierLeaderboardDto> {
    const entries: CourierLeaderboardEntryDto[] = COURIERS
      .map((c, i) => ({
        rank: i + 1,
        courierUserId: c.userId,
        courierName: c.name,
        totalDeliveries: c.baseDeliveries * 20,
        totalEarnings: c.baseEarnings * 20,
      }))
      .slice(0, limit);
    return of({ entries }).pipe(delay(200));
  }
}