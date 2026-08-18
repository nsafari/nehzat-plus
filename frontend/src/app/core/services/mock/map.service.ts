import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import type {
  UserLocationDto,
  UpdateLocationRequest,
  MapOrderDto,
  CreateMapOrderRequest,
  OrderTrackingPointDto,
  UpdateOrderStatusRequest,
  AssignOrderRequest,
  PlanRouteRequest,
  DeliveryRouteDto,
  MapDashboardDto,
} from '../../models/lesson-planner.models';

@Injectable({ providedIn: 'root' })
export class MockMapService {
  private orders: MapOrderDto[] = [];
  private nextId = 1;

  updateMyLocation(payload: UpdateLocationRequest): Observable<void> {
    return of(void 0);
  }

  getMyLocation(): Observable<UserLocationDto> {
    return of({
      userId: 1,
      fullName: 'پیک نمونه',
      avatarUrl: undefined,
      role: 'courier',
      lat: 35.6892,
      lng: 51.389,
      accuracy: 10,
      lastUpdated: new Date().toISOString(),
    });
  }

  getUserLocations(): Observable<UserLocationDto[]> {
    return of([]);
  }

  createOrder(payload: CreateMapOrderRequest): Observable<MapOrderDto> {
    const newOrder: MapOrderDto = {
      id: this.nextId++,
      ...payload,
      status: 'pending',
      trackingPoints: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.orders = [...this.orders, newOrder];
    return of(newOrder);
  }

  getOrders(): Observable<MapOrderDto[]> {
    return of(this.orders);
  }

  getOrder(id: number): Observable<MapOrderDto> {
    return of(this.orders.find(o => o.id === id) ?? this.orders[0]);
  }

  acceptOrder(id: number): Observable<MapOrderDto> {
    return of(this.updateInList(id, { status: 'accepted' }));
  }

  assignOrder(id: number, payload: AssignOrderRequest): Observable<MapOrderDto> {
    return of(this.updateInList(id, { status: 'assigned', courierId: payload.courierId }));
  }

  updateOrderStatus(id: number, payload: UpdateOrderStatusRequest): Observable<MapOrderDto> {
    return of(this.updateInList(id, { status: payload.status as MapOrderDto['status'] }));
  }

  getOrderTracking(id: number): Observable<OrderTrackingPointDto[]> {
    const order = this.orders.find(o => o.id === id);
    return of(order?.trackingPoints ?? []);
  }

  planRoute(payload: PlanRouteRequest): Observable<DeliveryRouteDto> {
    return of({
      id: this.nextId++,
      orderId: payload.orderId,
      totalDistanceKm: 5.5,
      totalDurationMin: 12,
      geometry: '',
      steps: [],
      createdAt: new Date().toISOString(),
    });
  }

  getRouteByOrder(orderId: number): Observable<DeliveryRouteDto> {
    return of({
      id: orderId,
      orderId,
      totalDistanceKm: 5.5,
      totalDurationMin: 12,
      geometry: '',
      steps: [],
      createdAt: new Date().toISOString(),
    });
  }

  getDashboard(): Observable<MapDashboardDto> {
    return of({
      pendingOrders: this.orders.filter(o => o.status === 'pending').length,
      inProgressOrders: this.orders.filter(o => o.status === 'in_progress' || o.status === 'accepted').length,
      completedToday: 0,
      activeCouriers: 1,
      orders: this.orders,
    });
  }

  private updateInList(id: number, patch: Partial<MapOrderDto>): MapOrderDto {
    this.orders = this.orders.map(o =>
      o.id === id ? { ...o, ...patch, updatedAt: new Date().toISOString() } : o,
    );
    return this.orders.find(o => o.id === id) ?? this.orders[0];
  }
}
