import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotificationComponent } from './core/components/notification/notification.component';
import { NavbarComponent } from './core/components/navbar/navbar.component';
import { NotificationBellComponent } from './features/notifications/notification-bell/notification-bell.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NotificationComponent, NavbarComponent, NotificationBellComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
