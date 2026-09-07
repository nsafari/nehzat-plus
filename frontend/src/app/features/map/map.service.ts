import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
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
} from '../../core/models/lesson-planner.models';
import { LESSON_PLANNER_API } from '../../core/services/lesson-planner-api.token';

@Injectable({ providedIn: 'root' })
export class MapService {
  private readonly api = inject(LESSON_PLANNER_API);

  updateMyLocation(payload: UpdateLocationRequest): Observable<void> {
    return this.api.updateMyLocation(payload);
  }

  getMyLocation(): Observable<UserLocationDto> {
    return this.api.getMyLocation();
  }

  getUserLocations(): Observable<UserLocationDto[]> {
    return this.api.getUserLocations();
  }

  createOrder(payload: CreateMapOrderRequest): Observable<MapOrderDto> {
    return this.api.createOrder(payload);
  }

  getOrders(): Observable<MapOrderDto[]> {
    return this.api.getOrders();
  }

  getOrder(id: number): Observable<MapOrderDto> {
    return this.api.getOrder(id);
  }

  acceptOrder(id: number): Observable<MapOrderDto> {
    return this.api.acceptOrder(id);
  }

  assignOrder(id: number, payload: AssignOrderRequest): Observable<MapOrderDto> {
    return this.api.assignOrder(id, payload);
  }

  updateOrderStatus(id: number, payload: UpdateOrderStatusRequest): Observable<MapOrderDto> {
    return this.api.updateOrderStatus(id, payload);
  }

  getOrderTracking(id: number): Observable<OrderTrackingPointDto[]> {
    return this.api.getOrderTracking(id);
  }

  planRoute(payload: PlanRouteRequest): Observable<DeliveryRouteDto> {
    return this.api.planRoute(payload);
  }

  getRouteByOrder(orderId: number): Observable<DeliveryRouteDto> {
    return this.api.getRouteByOrder(orderId);
  }

  getDashboard(): Observable<MapDashboardDto> {
    return this.api.getDashboard();
  }
}
