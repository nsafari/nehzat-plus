import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { mountStandalone } from '../shared/testing-utils';
import { LESSON_PLANNER_API } from '../../core/services/lesson-planner-api.token';
import { AuthService } from '../../core/services/auth.service';
import { createMockAuthService } from '../shared/testing-utils';

import { EvaluatorComponent } from './evaluator.component';
import { EvaluatorQueuePageComponent } from './evaluator-queue-page.component';
import { EvaluatorFormPageComponent } from './evaluator-form-page.component';
import type { LessonPlannerApi } from '../../core/services/lesson-planner-api.interface';

describe('EvaluatorComponent', () => {
  it('should be defined', () => {
    expect(EvaluatorComponent).toBeDefined();
  });

  it('should create shell with mocked dependencies', () => {
    const instance = mountStandalone(EvaluatorComponent);
    expect(instance).toBeTruthy();
  });

  it('should have currentUser after init when role is evaluator', () => {
    const mockAuth = {
      ...createMockAuthService(),
      getCurrentUser: vi.fn().mockReturnValue({ username: 'test', userType: 'evaluator' }),
      hasRole: vi.fn().mockReturnValue(true),
    };

    TestBed.configureTestingModule({
      imports: [EvaluatorComponent],
      providers: [{ provide: AuthService, useValue: mockAuth }, provideRouter([])],
    });

    const fixture = TestBed.createComponent(EvaluatorComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance.currentUser?.username).toBe('test');
  });
});

describe('EvaluatorQueuePageComponent', () => {
  let mockApi: Record<string, ReturnType<typeof vi.fn>>;

  const mockRecords = [
    { id: 1, evaluatorId: 1, evaluatorName: 'علی', targetName: 'مربی رضا', targetType: 'coach', targetId: 1, score: 85, feedback: 'خوب', evaluationDate: '2026-01-01' },
    { id: 2, evaluatorId: 2, evaluatorName: 'فاطمه', targetName: 'متربی علی', targetType: 'student', targetId: 2, score: 72, feedback: '', evaluationDate: '2026-01-02' },
  ];

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
      imports: [EvaluatorQueuePageComponent],
      providers: [
        { provide: LESSON_PLANNER_API, useValue: api },
        { provide: AuthService, useFactory: createMockAuthService },
        provideRouter([]),
      ],
    });
  });

  it('should be defined', () => {
    const fixture = TestBed.createComponent(EvaluatorQueuePageComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should load records on init', () => {
    mockApi['getEvaluationRecords'] = vi.fn().mockReturnValue(of(mockRecords));
    const fixture = TestBed.createComponent(EvaluatorQueuePageComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance.records.length).toBe(2);
    expect(fixture.componentInstance.filteredRecords.length).toBe(2);
  });

  it('should filter records by search query', () => {
    mockApi['getEvaluationRecords'] = vi.fn().mockReturnValue(of(mockRecords));
    const fixture = TestBed.createComponent(EvaluatorQueuePageComponent);
    fixture.detectChanges();
    fixture.componentInstance.searchQuery = 'رضا';
    fixture.componentInstance.filterRecords();
    expect(fixture.componentInstance.filteredRecords.length).toBe(1);
    expect(fixture.componentInstance.filteredRecords[0].targetName).toBe('مربی رضا');
  });

  it('should compute correct CSV export', () => {
    mockApi['getEvaluationRecords'] = vi.fn().mockReturnValue(of(mockRecords));
    const fixture = TestBed.createComponent(EvaluatorQueuePageComponent);
    fixture.detectChanges();
    const spy = vi.spyOn(document, 'createElement');
    fixture.componentInstance.exportCsv();
    expect(spy).toHaveBeenCalledWith('a');
    spy.mockRestore();
  });
});

describe('EvaluatorFormPageComponent', () => {
  let mockApi: Record<string, ReturnType<typeof vi.fn>>;

  const mockAssessments = [
    {
      id: 1, title: 'ارزیابی هفتگی', description: 'تست', type: 'weekly', maxScore: 100,
      durationMinutes: 45, assessmentDate: '2026-01-01', status: 'published', courseId: 1,
      questions: [
        { id: 1, type: 'multiple_choice', questionText: 'سوال ۱', points: 25, order: 1, difficulty: 'easy', assessmentId: 1 },
        { id: 2, type: 'essay', questionText: 'سوال ۲', points: 75, order: 2, difficulty: 'hard', assessmentId: 1 },
      ],
    },
  ];

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
      imports: [EvaluatorFormPageComponent],
      providers: [
        { provide: LESSON_PLANNER_API, useValue: api },
        { provide: AuthService, useFactory: createMockAuthService },
        provideRouter([]),
      ],
    });
  });

  it('should be defined', () => {
    const fixture = TestBed.createComponent(EvaluatorFormPageComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should build criteria from assessment questions', () => {
    mockApi['getAssessments'] = vi.fn().mockReturnValue(of(mockAssessments));
    mockApi['getEvaluators'] = vi.fn().mockReturnValue(of([]));
    const fixture = TestBed.createComponent(EvaluatorFormPageComponent);
    fixture.detectChanges();
    fixture.componentInstance.onAssessmentSelect(1);
    expect(fixture.componentInstance.criteria.length).toBe(2);
    expect(fixture.componentInstance.criteria[0].label).toBe('سوال ۱');
    expect(fixture.componentInstance.criteria[0].maxPoints).toBe(25);
  });

  it('should compute total score from rubric selections', () => {
    mockApi['getAssessments'] = vi.fn().mockReturnValue(of(mockAssessments));
    mockApi['getEvaluators'] = vi.fn().mockReturnValue(of([]));
    const fixture = TestBed.createComponent(EvaluatorFormPageComponent);
    fixture.detectChanges();
    fixture.componentInstance.onAssessmentSelect(1);
    fixture.componentInstance.selectScore(0, 0.5);
    fixture.componentInstance.selectScore(1, 1.0);
    expect(fixture.componentInstance.totalScore).toBe(88);
  });

  it('should compute max possible score', () => {
    mockApi['getAssessments'] = vi.fn().mockReturnValue(of(mockAssessments));
    mockApi['getEvaluators'] = vi.fn().mockReturnValue(of([]));
    const fixture = TestBed.createComponent(EvaluatorFormPageComponent);
    fixture.detectChanges();
    fixture.componentInstance.onAssessmentSelect(1);
    expect(fixture.componentInstance.maxPossibleScore).toBe(100);
  });
});
