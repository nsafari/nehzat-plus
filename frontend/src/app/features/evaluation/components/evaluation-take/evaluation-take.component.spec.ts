import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { EvaluationTakeComponent } from './evaluation-take.component';
import {
  LESSON_PLANNER_API,
} from '../../../../core/services/lesson-planner-api.token';
import { DEFAULT_MOCK_PROVIDERS } from '../../../shared/testing-utils';
import type { LessonPlannerApi } from '../../../../core/services/lesson-planner-api.interface';
import type { RandomEvaluationDto } from '../../../../core/models/lesson-planner.models';

const MOCK_EXAM: RandomEvaluationDto = {
  id: 1,
  studentId: 1,
  studentName: 'علی احمدی',
  title: 'آزمون معارف',
  category: 'معارف',
  startedAt: new Date().toISOString(),
  totalQuestions: 1,
  correctAnswers: 0,
  totalScore: 0,
  status: 'in_progress',
  questions: [{ questionId: 4, text: 'نهج‌البلاغه مجموعه سخنان چه کسی است؟', options: ['امام علی (ع)', 'امام صادق (ع)'], points: 10 }],
  answers: [],
};

describe('EvaluationTakeComponent', () => {
  function mount(apiOverrides: Partial<LessonPlannerApi> = {}): EvaluationTakeComponent {
    const api = new Proxy({} as Record<string, unknown>, {
      get(_target, prop: string | symbol) {
        if (prop === 'then') return undefined;
        const resolved = (apiOverrides as Record<string, unknown>)[prop as string];
        if (resolved !== undefined) {
          return resolved;
        }
        return () => of(null);
      },
    }) as LessonPlannerApi;

    TestBed.configureTestingModule({
      imports: [EvaluationTakeComponent],
      providers: [
        ...DEFAULT_MOCK_PROVIDERS,
        { provide: LESSON_PLANNER_API, useValue: api },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: (key: string) => (key === 'id' ? '1' : null) } },
          },
        },
      ],
    });
    return TestBed.createComponent(EvaluationTakeComponent).componentInstance;
  }

  it('should be defined', () => {
    const component = mount();
    expect(component).toBeTruthy();
  });

  it('should load the exam and start answering flow', () => {
    const component = mount({
      getEvaluation: () => of(MOCK_EXAM),
    });
    component.ngOnInit();
    expect(component.exam()?.id).toBe(1);
    expect(component.currentQuestion()?.questionId).toBe(4);
  });

  it('should record an answer and mark it as answered', () => {
    const component = mount({
      getEvaluation: () => of(MOCK_EXAM),
    });
    component.ngOnInit();
    component.selectOption(4, 'امام علی (ع)');
    expect(component.isAnswered(4)).toBe(true);
    expect(component.isSelected(4, 'امام علی (ع)')).toBe(true);
  });
});