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
} from '../../models/lesson-planner.models';

export abstract class MapApi {
  abstract updateMyLocation(payload: UpdateLocationRequest): Observable<void>;
  abstract getMyLocation(): Observable<UserLocationDto>;
  abstract getUserLocations(): Observable<UserLocationDto[]>;
  abstract createOrder(payload: CreateMapOrderRequest): Observable<MapOrderDto>;
  abstract getOrders(): Observable<MapOrderDto[]>;
  abstract getOrder(id: number): Observable<MapOrderDto>;
  abstract acceptOrder(id: number): Observable<MapOrderDto>;
  abstract assignOrder(id: number, payload: AssignOrderRequest): Observable<MapOrderDto>;
  abstract updateOrderStatus(
    id: number,
    payload: UpdateOrderStatusRequest,
  ): Observable<MapOrderDto>;
  abstract getOrderTracking(id: number): Observable<OrderTrackingPointDto[]>;
  abstract planRoute(payload: PlanRouteRequest): Observable<DeliveryRouteDto>;
  abstract getRouteByOrder(orderId: number): Observable<DeliveryRouteDto>;
  abstract getDashboard(): Observable<MapDashboardDto>;
}
