import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal, viewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import type { CurrentUser } from '../../core/models/lesson-planner.models';
import { AuthService } from '../../core/services/auth.service';
import { TeacherDashboardSectionComponent } from './teacher-dashboard-section/teacher-dashboard-section.component';
import { TeacherCoursesSectionComponent } from './teacher-courses-section/teacher-courses-section.component';
import { TeacherGradingsSectionComponent } from './teacher-gradings-section/teacher-gradings-section.component';
import { TeacherPendingSectionComponent } from './teacher-pending-section/teacher-pending-section.component';

type TabKey = 'dashboard' | 'courses' | 'gradings' | 'pending';

@Component({
  selector: 'app-teacher',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TeacherDashboardSectionComponent,
    TeacherCoursesSectionComponent,
    TeacherGradingsSectionComponent,
    TeacherPendingSectionComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.scss']
})
export class TeacherComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  currentUser: CurrentUser | null = null;
  logoHidden = false;

  readonly activeTab = signal<TabKey>('dashboard');

  readonly dashboardSection = viewChild(TeacherDashboardSectionComponent);
  readonly coursesSection = viewChild(TeacherCoursesSectionComponent);
  readonly gradingsSection = viewChild(TeacherGradingsSectionComponent);
  readonly pendingSection = viewChild(TeacherPendingSectionComponent);

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      void this.router.navigateByUrl('/auth/login');
      return;
    }
    if (!this.authService.hasRole('teacher')) {
      void this.router.navigateByUrl(
        this.authService.getDashboardPathForRole(this.currentUser.userType ?? 'trainee')
      );
      return;
    }
  }

  switchTab(tab: TabKey): void {
    this.activeTab.set(tab);
  }

  get teacherId(): number {
    return this.currentUser?.studentId ?? 0;
  }

  get currentUserId(): number {
    return this.currentUser?.studentId ?? 0;
  }

  onGradeSubmitted(): void {
    this.gradingsSection()?.load();
    this.pendingSection()?.load();
  }

  logout(): void {
    this.authService.logout();
    void this.router.navigateByUrl('/auth/login');
  }
}
