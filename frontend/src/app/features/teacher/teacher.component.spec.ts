import { mountStandalone } from '../shared/testing-utils';

import { TeacherComponent } from './teacher.component';
import { TeacherDashboardSectionComponent } from './teacher-dashboard-section/teacher-dashboard-section.component';
import { TeacherCoursesSectionComponent } from './teacher-courses-section/teacher-courses-section.component';
import { TeacherGradingsSectionComponent } from './teacher-gradings-section/teacher-gradings-section.component';
import { TeacherPendingSectionComponent } from './teacher-pending-section/teacher-pending-section.component';

describe('TeacherComponent', () => {
  it('should be defined', () => {
    expect(TeacherComponent).toBeDefined();
  });

  it('should create with mocked dependencies', () => {
    const instance = mountStandalone(TeacherComponent);
    expect(instance).toBeTruthy();
  });

  it('should have activeTab signal defaulting to dashboard', () => {
    const instance = mountStandalone(TeacherComponent);
    expect(instance.activeTab()).toBe('dashboard');
  });

  it('should switch tabs via switchTab()', () => {
    const instance = mountStandalone(TeacherComponent);
    instance.switchTab('courses');
    expect(instance.activeTab()).toBe('courses');
    instance.switchTab('gradings');
    expect(instance.activeTab()).toBe('gradings');
    instance.switchTab('pending');
    expect(instance.activeTab()).toBe('pending');
  });
});

describe('TeacherDashboardSectionComponent', () => {
  it('should be defined', () => {
    expect(TeacherDashboardSectionComponent).toBeDefined();
  });

  it('should create with mocked dependencies', () => {
    const instance = mountStandalone(TeacherDashboardSectionComponent, [
      { provide: TeacherDashboardSectionComponent, useValue: { teacherId: 1 } }
    ]);
    expect(instance).toBeTruthy();
  });
});

describe('TeacherCoursesSectionComponent', () => {
  it('should be defined', () => {
    expect(TeacherCoursesSectionComponent).toBeDefined();
  });
});

describe('TeacherGradingsSectionComponent', () => {
  it('should be defined', () => {
    expect(TeacherGradingsSectionComponent).toBeDefined();
  });

  it('should create with mocked dependencies', () => {
    const instance = mountStandalone(TeacherGradingsSectionComponent);
    expect(instance).toBeTruthy();
  });

  it('should return correct status label', () => {
    const instance = mountStandalone(TeacherGradingsSectionComponent);
    expect(instance.getStatusLabel('graded')).toBe('نمره‌دهی شده');
    expect(instance.getStatusLabel('pending')).toBe('در انتظار');
    expect(instance.getStatusLabel('late')).toBe('دیرکرد');
    expect(instance.getStatusLabel('unknown')).toBe('unknown');
    expect(instance.getStatusLabel()).toBe('نامشخص');
  });
});

describe('TeacherPendingSectionComponent', () => {
  it('should be defined', () => {
    expect(TeacherPendingSectionComponent).toBeDefined();
  });
});
