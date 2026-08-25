import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

import { StudyPathDetailComponent } from './study-path-detail.component';
import { LESSON_PLANNER_API } from '../../../core/services/lesson-planner-api.token';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ActivatedRoute } from '@angular/router';
import { createMockAuthService, createMockNotificationService, createMockActivatedRoute } from '../../shared/testing-utils';
import type { LessonPlannerApi } from '../../../core/services/lesson-planner-api.interface';
import type { StudentStudyPath, StudyPathStep } from '../../../core/models/lesson-planner.models';

describe('StudyPathDetailComponent (Integration with real seed data)', () => {
  let fixture: any;
  let component: StudyPathDetailComponent;
  let mockApi: Record<string, ReturnType<typeof vi.fn>>;
  let notify: { show: ReturnType<typeof vi.fn> };

  const mockSteps: StudyPathStep[] = [
    { id: 1, studyPathId: 1, stepOrder: 1, title: 'الجبرا', description: 'آشنایی با مفاهیم پایه الجبرا', cognitiveLevel: 'awareness', estimatedDurationMinutes: 600, createdAt: '2025-01-15T08:00:00Z', updatedAt: '2025-01-15T08:00:00Z' },
    { id: 2, studyPathId: 1, stepOrder: 2, title: 'هندسه', description: 'مفاهیم هندسه مدرن', cognitiveLevel: 'understanding', estimatedDurationMinutes: 900, createdAt: '2025-01-15T08:00:00Z', updatedAt: '2025-01-15T08:00:00Z' },
    { id: 3, studyPathId: 1, stepOrder: 3, title: 'توابع', description: 'مطالعه توابع مختلط', cognitiveLevel: 'analysis', estimatedDurationMinutes: 1200, createdAt: '2025-01-15T08:00:00Z', updatedAt: '2025-01-15T08:00:00Z' },
  ];

  const mockEnrollment: StudentStudyPath = {
    id: 100,
    studyPathId: 1,
    enrollmentDate: new Date().toISOString(),
    studentId: 101,
    currentStepId: 2, // step 2 is current
    status: 'active',
    startedAt: new Date().toISOString(),
      completedAt: undefined,
    progressPercentage: 25,
    steps: mockSteps,
  };

  function setupMockApi(): void {
    mockApi['getMyStudyPath'] = vi.fn().mockReturnValue(of(mockEnrollment));
  }

  beforeEach(() => {
    mockApi = {};
    const api = new Proxy({} as LessonPlannerApi, {
      get(_target, prop: string | symbol) {
        if (prop === 'then') return undefined;
        if (!mockApi[prop as string]) {
          mockApi[prop as string] = vi.fn().mockReturnValue(of(null));
        }
        return mockApi[prop as string];
      },
    });

    TestBed.configureTestingModule({
      imports: [StudyPathDetailComponent],
      providers: [
        { provide: LESSON_PLANNER_API, useValue: api },
        { provide: AuthService, useFactory: createMockAuthService },
        { provide: NotificationService, useFactory: createMockNotificationService },
        { provide: ActivatedRoute, useFactory: createMockActivatedRoute },
      ],
    });

    notify = TestBed.inject(NotificationService) as any;
    fixture = TestBed.createComponent(StudyPathDetailComponent);
    component = fixture.componentInstance;
  });

  // Helper: set up activated route to return a specific ID
  function setRouteId(id: string): void {
    const route = TestBed.inject(ActivatedRoute);
    (route.snapshot.paramMap.get as any).mockReturnValue(id);
  }

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('Enrollment loading', () => {
    beforeEach(() => {
      setupMockApi();
      setRouteId('1');
      fixture.detectChanges(); // triggers ngOnInit
    });

    it('should load enrollment for the student', () => {
      expect(component.enrollment).toBeTruthy();
      expect(component.enrollment?.studyPathId).toBe(1);
    });

    it('should set loading=false after data loads', () => {
      expect(component.loading).toBe(false);
    });

    it('should have multiple steps in the enrollment', () => {
      expect(component.enrollment?.steps?.length).toBe(3);
    });

    it('should track currentStepIndex correctly', () => {
      expect(component.currentStepIndex).toBe(1); // currentStepId is 2, which is index 1
    });

    it('should determine current step via isStepCurrent', () => {
      expect(component.isStepCurrent(2)).toBe(true);
      expect(component.isStepCurrent(1)).toBe(false);
    });

    it('should determine completed steps via isStepCompleted', () => {
      // currentStepId is 2 (index 1), so step with id 1 (index 0) is completed
      expect(component.isStepCompleted(1)).toBe(true);
      expect(component.isStepCompleted(2)).toBe(false); // current step is not "completed"
    });

    it('should call getMyStudyPath with the route ID', () => {
      expect(mockApi['getMyStudyPath']).toHaveBeenCalledWith(1);
    });
  });

  describe('Step completion flow', () => {
    const completedEnrollment: StudentStudyPath = {
      ...mockEnrollment,
      currentStepId: 3, // move to step 3
      progressPercentage: 50,
    };

    beforeEach(() => {
      mockApi['getMyStudyPath'] = vi.fn().mockReturnValue(of(mockEnrollment));
      mockApi['completeStep'] = vi.fn().mockReturnValue(of(completedEnrollment));
      setRouteId('1');
      fixture.detectChanges();
    });

    it('should complete the current step', () => {
      component.completeStep();

      expect(mockApi['completeStep']).toHaveBeenCalledWith({
        studyPathId: 1,
        stepId: 2,
      });
      expect(component.enrollment).toEqual(completedEnrollment);
      expect(notify.show).toHaveBeenCalledWith('مرحله با موفقیت تکمیل شد!', 'success');
    });

    it('should update enrollment after complete', () => {
      component.completeStep();
      expect(component.enrollment?.currentStepId).toBe(3);
      expect(component.enrollment?.progressPercentage).toBe(50);
    });

    it('should show error on complete failure', () => {
      mockApi['completeStep'] = vi.fn().mockReturnValue(throwError(() => new Error('fail')));

      component.completeStep();

      expect(mockApi['completeStep']).toHaveBeenCalled();
      expect(notify.show).toHaveBeenCalledWith('خطا در ثبت تکمیل مرحله', 'error');
    });
  });

  describe('Step skipping flow', () => {
    const skippedEnrollment: StudentStudyPath = {
      ...mockEnrollment,
      currentStepId: 3,
      progressPercentage: 35,
    };

    beforeEach(() => {
      mockApi['getMyStudyPath'] = vi.fn().mockReturnValue(of(mockEnrollment));
      mockApi['skipStep'] = vi.fn().mockReturnValue(of(skippedEnrollment));
      setRouteId('1');
      fixture.detectChanges();
    });

    it('should skip the current step', () => {
      component.skipStep();

      expect(mockApi['skipStep']).toHaveBeenCalledWith({
        studyPathId: 1,
        stepId: 2,
      });
      expect(component.enrollment).toEqual(skippedEnrollment);
      expect(notify.show).toHaveBeenCalledWith('مرحله نادیده گرفته شد', 'success');
    });

    it('should update enrollment after skip', () => {
      component.skipStep();
      expect(component.enrollment?.currentStepId).toBe(3);
    });

    it('should show error on skip failure', () => {
      mockApi['skipStep'] = vi.fn().mockReturnValue(throwError(() => new Error('fail')));

      component.skipStep();

      expect(mockApi['skipStep']).toHaveBeenCalled();
      expect(notify.show).toHaveBeenCalledWith('خطا در نادیده‌گرفتن مرحله', 'error');
    });
  });

  describe('Error cases', () => {
    it('should show error when user is not authenticated', () => {
      vi.spyOn(TestBed.inject(AuthService), 'getCurrentUser').mockReturnValue(null);
      setRouteId('1');

      component.ngOnInit();

      expect(component.error).toBe('کاربر یافت نشد');
      expect(component.enrollment).toBeNull();
      expect(component.loading).toBe(false);
    });

    it('should show error when route ID is missing', () => {
      const route = TestBed.inject(ActivatedRoute);
      (route.snapshot.paramMap.get as any).mockReturnValue(null);
      setupMockApi();

      component.ngOnInit();

      expect(component.error).toBe('شناسه مسیر یافت نشد');
      expect(component.enrollment).toBeNull();
    });

    it('should show error when getMyStudyPath fails', () => {
      mockApi['getMyStudyPath'] = vi.fn().mockReturnValue(throwError(() => new Error('API error')));
      setRouteId('1');

      component.ngOnInit();

      expect(component.error).toBe('خطا در بارگذاری جزئیات مسیر');
      expect(component.loading).toBe(false);
    });
  });
});
