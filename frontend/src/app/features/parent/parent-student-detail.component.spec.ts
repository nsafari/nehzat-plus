import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { ParentStudentDetailComponent } from './parent-student-detail.component';
import { LESSON_PLANNER_API } from '../../core/services/lesson-planner-api.token';
import { AuthService } from '../../core/services/auth.service';
import { createMockAuthService, createMockRouter } from '../shared/testing-utils';
import type { LessonPlannerApi } from '../../core/services/lesson-planner-api.interface';
import type {
  StudentProgressResponse,
  StudentProgressSummary,
  BiweeklyProgressResponse,
  StudentSkillProgress,
} from '../../core/models/lesson-planner.models';

describe('ParentStudentDetailComponent', () => {
  let component: ParentStudentDetailComponent;
  let mockApi: Record<string, ReturnType<typeof vi.fn>>;
  let mockRouter: Router;

  const mockProgress: StudentProgressResponse = {
    student: { id: 10, studentId: 'S001', firstName: 'علی', lastName: 'احمدی', email: '', phoneNumber: '' },
    courses: [],
    submissions: [
      { id: 1, assignmentId: 100, studentId: 10, submissionDate: '2026-07-01', status: 'submitted', dailyScore: 85, feedback: 'خوب بود' },
      { id: 2, assignmentId: 101, studentId: 10, submissionDate: '2026-07-02', status: 'graded', dailyScore: 90 },
      { id: 3, assignmentId: 102, studentId: 10, submissionDate: '2026-07-03', status: 'pending' },
    ],
  };

  const mockSummary: StudentProgressSummary = {
    studentId: 10,
    summary: { totalObjectives: 20, masteredCount: 12, achievedCount: 5, inProgressCount: 2, notStartedCount: 1, averageScore: 78.5 },
    subjectAreas: [
      { subjectAreaId: 1, subjectAreaTitle: 'قرآن', subjectAreaKey: 'quran', averageScore: 82, masteredCount: 8, totalObjectives: 10 },
    ],
  };

  const mockBiweekly: BiweeklyProgressResponse = {
    studentId: 10,
    studentName: 'علی احمدی',
    periodStart: '2026-07-01',
    periodEnd: '2026-07-14',
    totalAssignments: 10,
    completedAssignments: 7,
    pendingAssignments: 3,
    completionPercentage: 70,
    averageScore: 80,
    totalSubmissions: 7,
    assignments: [],
  };

  const mockSkills: StudentSkillProgress[] = [
    { id: 1, studentId: 10, objectiveId: 5, objectiveTitle: 'حفظ جزء ۳۰', proficiencyLevel: 'achieved', score: 85 },
  ];

  function createComponent(): ParentStudentDetailComponent {
    const fixture = TestBed.createComponent(ParentStudentDetailComponent);
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

    mockRouter = createMockRouter();

    // Mock ActivatedRoute with paramMap that returns '10'
    const mockActivatedRoute = {
      snapshot: { params: { id: '10' } },
      paramMap: of({
        get: (key: string) => key === 'id' ? '10' : null,
        has: (key: string) => key === 'id',
        getAll: () => [],
        keys: ['id'],
      }),
    } as unknown as ActivatedRoute;

    TestBed.configureTestingModule({
      imports: [ParentStudentDetailComponent],
      providers: [
        { provide: LESSON_PLANNER_API, useValue: api },
        { provide: AuthService, useFactory: createMockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    });
  });

  it('should be defined', () => {
    component = createComponent();
    expect(component).toBeTruthy();
  });

  describe('when user is a parent', () => {
    beforeEach(() => {
      const authService = TestBed.inject(AuthService);
      (authService.getCurrentUser as ReturnType<typeof vi.fn>).mockReturnValue({
        id: '1',
        username: 'parent1',
        roles: ['parent'],
        userType: 'parent',
      });

      mockApi['getStudentProgress'] = vi.fn().mockReturnValue(of(mockProgress));
      mockApi['getProgressSummary'] = vi.fn().mockReturnValue(of(mockSummary));
      mockApi['getBiweeklyProgress'] = vi.fn().mockReturnValue(of(mockBiweekly));
      mockApi['getSkillProgressByStudent'] = vi.fn().mockReturnValue(of(mockSkills));

      component = createComponent();
    });

    it('should load all dashboard data on init', () => {
      component.ngOnInit();
      expect(mockApi['getStudentProgress']).toHaveBeenCalledWith(10);
      expect(mockApi['getProgressSummary']).toHaveBeenCalledWith(10);
      expect(mockApi['getBiweeklyProgress']).toHaveBeenCalledWith(10);
      expect(mockApi['getSkillProgressByStudent']).toHaveBeenCalledWith(10);
    });

    it('should set student name from progress response', () => {
      component.ngOnInit();
      expect(component.studentName()).toBe('علی احمدی');
    });

    it('should populate submissions', () => {
      component.ngOnInit();
      expect(component.submissions().length).toBe(3);
    });

    it('should populate progress summary', () => {
      component.ngOnInit();
      expect(component.progressSummary()).toBeTruthy();
      expect(component.progressSummary()!.summary.averageScore).toBe(78.5);
    });

    it('should populate biweekly progress', () => {
      component.ngOnInit();
      expect(component.biweeklyProgress()).toBeTruthy();
      expect(component.biweeklyProgress()!.completedAssignments).toBe(7);
    });

    it('should populate skill progress', () => {
      component.ngOnInit();
      expect(component.skillProgress().length).toBe(1);
      expect(component.skillProgress()[0].objectiveTitle).toBe('حفظ جزء ۳۰');
    });

    it('should compute coachFeedbacks from submissions with feedback', () => {
      component.ngOnInit();
      const feedbacks = component.coachFeedbacks();
      expect(feedbacks.length).toBe(1);
      expect(feedbacks[0].feedback).toBe('خوب بود');
    });

    it('should filter submissions by date', () => {
      component.ngOnInit();
      component.onDateFromChange('2026-07-02');
      expect(component.filteredSubmissions().length).toBe(2);
      component.onDateToChange('2026-07-02');
      expect(component.filteredSubmissions().length).toBe(1);
    });

    it('should clear date filter', () => {
      component.ngOnInit();
      component.onDateFromChange('2026-07-02');
      component.clearFilter();
      expect(component._dateFrom()).toBeNull();
      expect(component._dateTo()).toBeNull();
      expect(component.filteredSubmissions().length).toBe(3);
    });

    it('should go back to parent panel', () => {
      component.goBack();
      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/parent');
    });
  });

  describe('when user is NOT a parent', () => {
    beforeEach(() => {
      const authService = TestBed.inject(AuthService);
      (authService.getCurrentUser as ReturnType<typeof vi.fn>).mockReturnValue({
        id: '2',
        username: 'admin',
        roles: ['manager'],
        userType: 'manager',
      });
      component = createComponent();
    });

    it('should redirect on init', () => {
      component.ngOnInit();
      expect(mockRouter.navigateByUrl).toHaveBeenCalled();
    });
  });
});
