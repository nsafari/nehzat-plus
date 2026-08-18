import type { Routes } from '@angular/router';

export const MAP_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/map.component').then((m) => m.MapComponent),
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./components/order-create.component').then((m) => m.OrderCreateComponent),
  },
  {
    path: 'track/:orderId',
    loadComponent: () =>
      import('./components/delivery-tracking.component').then((m) => m.DeliveryTrackingComponent),
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./components/order-admin.component').then((m) => m.OrderAdminComponent),
  },
];
