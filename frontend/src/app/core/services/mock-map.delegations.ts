import { Observable } from 'rxjs';
import { MockLessonPlannerApiBase, type MockApiCtor } from './mock-lesson-planner-base';
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
} from './mock-lesson-planner-models';

export function withMap<T extends MockApiCtor>(Base: T) {
  return class extends Base {
    updateMyLocation(payload: UpdateLocationRequest): Observable<void> {
      return this.map.updateMyLocation(payload);
    }
    getMyLocation(): Observable<UserLocationDto> {
      return this.map.getMyLocation();
    }
    getUserLocations(): Observable<UserLocationDto[]> {
      return this.map.getUserLocations();
    }
    createOrder(payload: CreateMapOrderRequest): Observable<MapOrderDto> {
      return this.map.createOrder(payload);
    }
    getOrders(): Observable<MapOrderDto[]> {
      return this.map.getOrders();
    }
    getOrder(id: number): Observable<MapOrderDto> {
      return this.map.getOrder(id);
    }
    acceptOrder(id: number): Observable<MapOrderDto> {
      return this.map.acceptOrder(id);
    }
    assignOrder(id: number, payload: AssignOrderRequest): Observable<MapOrderDto> {
      return this.map.assignOrder(id, payload);
    }
    updateOrderStatus(id: number, payload: UpdateOrderStatusRequest): Observable<MapOrderDto> {
      return this.map.updateOrderStatus(id, payload);
    }
    getOrderTracking(id: number): Observable<OrderTrackingPointDto[]> {
      return this.map.getOrderTracking(id);
    }
    planRoute(payload: PlanRouteRequest): Observable<DeliveryRouteDto> {
      return this.map.planRoute(payload);
    }
    getRouteByOrder(orderId: number): Observable<DeliveryRouteDto> {
      return this.map.getRouteByOrder(orderId);
    }
    getDashboard(): Observable<MapDashboardDto> {
      return this.map.getDashboard();
    }
  };
}
