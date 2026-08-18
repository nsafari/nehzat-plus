import { Observable } from 'rxjs';
import type { HttpClient } from '@angular/common/http';
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

export interface HttpServiceContext {
  http: HttpClient;
  url(path: string): string;
}

export type Constructor<T = {}> = new (...args: any[]) => T;

export function WithMap<TBase extends Constructor<HttpServiceContext>>(Base: TBase) {
  return class extends Base {
    updateMyLocation(payload: UpdateLocationRequest): Observable<void> {
      return this.http.put<void>(this.url('/api/map/location'), payload);
    }

    getMyLocation(): Observable<UserLocationDto> {
      return this.http.get<UserLocationDto>(this.url('/api/map/location/me'));
    }

    getUserLocations(): Observable<UserLocationDto[]> {
      return this.http.get<UserLocationDto[]>(this.url('/api/map/location/users'));
    }

    createOrder(payload: CreateMapOrderRequest): Observable<MapOrderDto> {
      return this.http.post<MapOrderDto>(this.url('/api/map/orders'), payload);
    }

    getOrders(): Observable<MapOrderDto[]> {
      return this.http.get<MapOrderDto[]>(this.url('/api/map/orders'));
    }

    getOrder(id: number): Observable<MapOrderDto> {
      return this.http.get<MapOrderDto>(this.url(`/api/map/orders/${id}`));
    }

    acceptOrder(id: number): Observable<MapOrderDto> {
      return this.http.post<MapOrderDto>(this.url(`/api/map/orders/${id}/accept`), {});
    }

    assignOrder(id: number, payload: AssignOrderRequest): Observable<MapOrderDto> {
      return this.http.post<MapOrderDto>(this.url(`/api/map/orders/${id}/assign`), payload);
    }

    updateOrderStatus(id: number, payload: UpdateOrderStatusRequest): Observable<MapOrderDto> {
      return this.http.put<MapOrderDto>(this.url(`/api/map/orders/${id}/status`), payload);
    }

    getOrderTracking(id: number): Observable<OrderTrackingPointDto[]> {
      return this.http.get<OrderTrackingPointDto[]>(this.url(`/api/map/orders/${id}/tracking`));
    }

    planRoute(payload: PlanRouteRequest): Observable<DeliveryRouteDto> {
      return this.http.post<DeliveryRouteDto>(this.url('/api/map/routes/plan'), payload);
    }

    getRouteByOrder(orderId: number): Observable<DeliveryRouteDto> {
      return this.http.get<DeliveryRouteDto>(this.url(`/api/map/routes/order/${orderId}`));
    }

    getDashboard(): Observable<MapDashboardDto> {
      return this.http.get<MapDashboardDto>(this.url('/api/map/dashboard'));
    }
  };
}
