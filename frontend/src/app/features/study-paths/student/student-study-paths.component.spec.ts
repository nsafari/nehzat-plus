import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

import { StudentStudyPathsComponent } from './student-study-paths.component';
import { LESSON_PLANNER_API } from '../../../core/services/lesson-planner-api.token';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Router } from '@angular/router';
import { createMockAuthService, createMockNotificationService, createMockRouter } from '../../shared/testing-utils';
import type { LessonPlannerApi } from '../../../core/services/lesson-planner-api.interface';
import type { StudyPath, StudentStudyPath } from '../../../core/models/lesson-planner.models';

import { initialStudyPaths } from '../../../core/services/mock/mock-data-context.data';

describe('StudentStudyPathsComponent (Integration with real seed data)', () => {
  let component: StudentStudyPathsComponent;
  let mockApi: Record<string, ReturnType<typeof vi.fn>>;
  let router: Router;
  let notify: { show: ReturnType<typeof vi.fn> };
  let authService: AuthService;

  function createComponent(): StudentStudyPathsComponent {
    const fixture = TestBed.createComponent(StudentStudyPathsComponent);
    return fixture.componentInstance;
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
      imports: [StudentStudyPathsComponent],
      providers: [
        { provide: LESSON_PLANNER_API, useValue: api },
        { provide: AuthService, useFactory: createMockAuthService },
        { provide: NotificationService, useFactory: createMockNotificationService },
        { provide: Router, useFactory: createMockRouter },
      ],
    });

    router = TestBed.inject(Router);
    notify = TestBed.inject(NotificationService) as any;
    authService = TestBed.inject(AuthService);
    component = createComponent();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('Loading available paths', () => {
    beforeEach(() => {
      mockApi['getAvailableStudyPaths'] = vi.fn().mockReturnValue(of(initialStudyPaths));
      mockApi['getMyStudyPaths'] = vi.fn().mockReturnValue(of([]));
      component.ngOnInit();
    });

    it('should load 3 available study paths for the student', () => {
      expect(component.availablePaths.length).toBe(3);
      expect(component.availablePaths[0].key).toBe('math-advanced');
      expect(component.availablePaths[1].key).toBe('biology-cellular');
      expect(component.availablePaths[2].key).toBe('persian-literature');
    });

    it('should load enrollment status (empty when not enrolled)', () => {
      expect(component.myEnrollments.length).toBe(0);
    });

    it('should set loading=false after data loads', () => {
      expect(component.loading).toBe(false);
    });

    it('should call correct API methods on init', () => {
      expect(mockApi['getAvailableStudyPaths']).toHaveBeenCalledTimes(1);
      expect(mockApi['getMyStudyPaths']).toHaveBeenCalledTimes(1);
    });

    it('should set error when getAvailableStudyPaths fails', () => {
      mockApi['getAvailableStudyPaths'] = vi.fn().mockReturnValue(throwError(() => new Error('Network error')));
      mockApi['getMyStudyPaths'] = vi.fn().mockReturnValue(of([]));

      component.ngOnInit();

      expect(component.error).toBe('خطا در بارگذاری مسیرهای مطالعاتی');
      expect(component.loading).toBe(false);
    });
  });

  describe('Enrollment flow', () => {
    beforeEach(() => {
      mockApi['getAvailableStudyPaths'] = vi.fn().mockReturnValue(of(initialStudyPaths));
      mockApi['getMyStudyPaths'] = vi.fn().mockReturnValue(of([]));
      component.ngOnInit();
    });

    it('should enroll in a study path', () => {
      const pathId = component.availablePaths[0].id;
      const mockEnrollment: StudentStudyPath = {
        id: 100,
      studyPathId: pathId,
      enrollmentDate: new Date().toISOString(),
      studentId: 101,
        currentStepId: 1,
        status: 'active',
        startedAt: new Date().toISOString(),
        completedAt: undefined,
        progressPercentage: 0,
        steps: [],
      };
      mockApi['enroll'] = vi.fn().mockReturnValue(of(mockEnrollment));
      mockApi['getMyStudyPaths'] = vi.fn().mockReturnValue(of([mockEnrollment]));

      component.enroll(pathId!);

      expect(mockApi['enroll']).toHaveBeenCalledWith({ studyPathId: pathId });
      expect(notify.show).toHaveBeenCalledWith('با موفقیت ثبت‌نام شدید!', 'success');
    });

    it('should navigate to detail page after enrollment', () => {
      const pathId = component.availablePaths[0].id;
      const mockEnrollment: StudentStudyPath = {
        id: 100,
      studyPathId: pathId,
      enrollmentDate: new Date().toISOString(),
      studentId: 101,
        currentStepId: 1,
        status: 'active',
        startedAt: new Date().toISOString(),
        completedAt: undefined,
        progressPercentage: 0,
        steps: [],
      };
      mockApi['enroll'] = vi.fn().mockReturnValue(of(mockEnrollment));
      mockApi['getMyStudyPaths'] = vi.fn().mockReturnValue(of([mockEnrollment]));

      component.enroll(pathId!);

      expect(router.navigateByUrl).toHaveBeenCalledWith('/study-paths/student/100');
    });

    it('should show error on enroll failure', () => {
      const pathId = component.availablePaths[0].id;
      mockApi['enroll'] = vi.fn().mockReturnValue(throwError(() => new Error('Server error')));

      component.enroll(pathId!);

      expect(mockApi['enroll']).toHaveBeenCalledWith({ studyPathId: pathId });
      expect(notify.show).toHaveBeenCalledWith('ثبت‌نام ناموفق', 'error');
    });
  });

  describe('Enrollment display', () => {
    const mockEnrollment: StudentStudyPath = {
      id: 100,
      studyPathId: 1,
      enrollmentDate: new Date().toISOString(),
      studentId: 101,
      currentStepId: 1,
      status: 'active',
      startedAt: new Date().toISOString(),
      completedAt: undefined,
      progressPercentage: 0,
      steps: [],
    };

    beforeEach(() => {
      mockApi['getAvailableStudyPaths'] = vi.fn().mockReturnValue(of(initialStudyPaths));
      mockApi['getMyStudyPaths'] = vi.fn().mockReturnValue(of([mockEnrollment]));
      component.ngOnInit();
    });

    it('should check isEnrolled correctly when enrolled', () => {
      const result = component.isEnrolled(1);
      expect(result).toBeTruthy();
      expect(result?.id).toBe(100);
    });

    it('should check isEnrolled returns undefined when not enrolled', () => {
      const result = component.isEnrolled(2);
      expect(result).toBeUndefined();
    });
  });

  describe('Navigation helpers', () => {
    beforeEach(() => {
      mockApi['getAvailableStudyPaths'] = vi.fn().mockReturnValue(of(initialStudyPaths));
      mockApi['getMyStudyPaths'] = vi.fn().mockReturnValue(of([]));
      component.ngOnInit();
    });

    it('should navigate to detail via viewEnrollment', () => {
      component.viewEnrollment(42);
      expect(router.navigateByUrl).toHaveBeenCalledWith('/study-paths/student/42');
    });

    it('should navigate to login when not authenticated', () => {
      vi.spyOn(authService, 'getCurrentUser').mockReturnValue(null);
      component.ngOnInit();
      expect(router.navigateByUrl).toHaveBeenCalledWith('/auth/login');
    });
  });

  describe('Error handling', () => {
    it('should retry loading data', () => {
      mockApi['getAvailableStudyPaths'] = vi.fn().mockReturnValue(of(initialStudyPaths));
      mockApi['getMyStudyPaths'] = vi.fn().mockReturnValue(of([]));
      component.error = 'some error';
      component.retry();
      expect(component.error).toBeNull();
      expect(component.availablePaths.length).toBe(3);
      expect(component.loading).toBe(false);
    });
  });
});
