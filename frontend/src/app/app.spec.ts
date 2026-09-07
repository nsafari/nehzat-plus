import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { App } from './app';
import { DEFAULT_MOCK_PROVIDERS } from './features/shared/testing-utils';
import { OTUH2_API } from './core/services/otuh2-api.token';
import { LESSON_PLANNER_API } from './core/services/lesson-planner-api.token';
import type { LessonPlannerApi } from './core/services/lesson-planner-api.interface';
import { NotificationService } from './core/services/notification.service';

describe('App', () => {
  beforeEach(async () => {
    const mockApi = {
      getNotifications: (_limit?: number) => of({ recent: [], unreadCount: 0 }),
    } as unknown as LessonPlannerApi;
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        ...DEFAULT_MOCK_PROVIDERS,
        { provide: NotificationService, useClass: NotificationService },
        { provide: LESSON_PLANNER_API, useValue: mockApi },
        { provide: OTUH2_API, useValue: {} },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render router outlet host', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
  });
});
