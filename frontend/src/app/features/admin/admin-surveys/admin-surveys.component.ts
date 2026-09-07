import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  OnInit,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize, switchMap } from 'rxjs';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  IssueSurvey,
  IssueSurveyQuestion,
  IssueAction,
  SurveyStatus,
  CreateIssueSurveyPayload,
  CreateIssueQuestionPayload,
  CreateIssueActionPayload,
} from '../../../core/models/lesson-planner.models';
import { LESSON_PLANNER_API } from '../../../core/services/lesson-planner-api.token';
import { NotificationService } from '../../../core/services/notification.service';
import { SurveyQuestionsTabComponent } from './components/survey-questions-tab/survey-questions-tab.component';
import { SurveyActionsTabComponent } from './components/survey-actions-tab/survey-actions-tab.component';
import { SurveyAnalyticsComponent } from './components/survey-analytics/survey-analytics.component';

@Component({
  selector: 'app-admin-surveys',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SurveyQuestionsTabComponent,
    SurveyActionsTabComponent,
    SurveyAnalyticsComponent,
  ],
  templateUrl: './admin-surveys.component.html',
  styleUrls: ['./admin-surveys.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminSurveysComponent implements OnInit {
  private readonly api = inject(LESSON_PLANNER_API);
  private readonly fb = inject(FormBuilder);
  private readonly notify = inject(NotificationService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);

  surveys: IssueSurvey[] = [];
  loadingSurveys = false;
  savingSurvey = false;
  searchQuery = '';
  selectedSurveyId: number | null = null;
  surveyEditMode = false;
  detailTab: 'info' | 'questions' | 'actions' | 'analytics' = 'info';

  loadingQuestions = false;
  savingQuestion = false;
  loadingActions = false;
  savingAction = false;
  loadingAnalytics = false;

  surveyForm = this.fb.nonNullable.group({
    title: ['', Validators.required],
    description: [''],
    surveyType: ['general'],
    targetRole: ['', Validators.required],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    isAnonymous: [false],
    scoreScaleMin: [0, Validators.required],
    scoreScaleMax: [5, Validators.required],
  });

  dashboardSummary: any = null;
  errorMessage = '';
  successMessage = '';

  private _questions: IssueSurveyQuestion[] = [];
  private _actions: IssueAction[] = [];
  private _analyticsData: any = null;

  ngOnInit(): void {
    this.loadSurveys();
    this.loadDashboardSummary();
  }

  get filteredSurveys(): IssueSurvey[] {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) return this.surveys;
    return this.surveys.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.surveyType.toLowerCase().includes(q) ||
        s.targetRole.toLowerCase().includes(q),
    );
  }

  get selectedSurvey(): IssueSurvey | null {
    if (this.selectedSurveyId === null) return null;
    return this.surveys.find((s) => s.id === this.selectedSurveyId) ?? null;
  }

  get questionsForTab(): IssueSurveyQuestion[] {
    return this._questions;
  }

  get actionsForTab(): IssueAction[] {
    return this._actions;
  }

  get analyticsData(): any {
    return this._analyticsData;
  }

  /* ─── Surveys ─── */

  loadSurveys(): void {
    this.loadingSurveys = true;
    this.api
      .getIssueSurveys()
      .pipe(finalize(() => (this.loadingSurveys = false)), takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (items) => {
          this.surveys = items;
          this.cdr.markForCheck();
        },
        error: () => {
          this.setError('دریافت نظرسنجی‌ها با خطا مواجه شد.');
          this.cdr.markForCheck();
        },
      });
  }

  startCreateSurvey(): void {
    this.surveyEditMode = false;
    this.selectedSurveyId = null;
    this.detailTab = 'info';
    this.surveyForm.reset({
      title: '', description: '', surveyType: 'general', targetRole: '',
      startDate: '', endDate: '', isAnonymous: false, scoreScaleMin: 0, scoreScaleMax: 5,
    });
  }

  selectSurvey(survey: IssueSurvey): void {
    this.selectedSurveyId = survey.id;
    this.surveyEditMode = true;
    this.detailTab = 'info';
    this.surveyForm.setValue({
      title: survey.title, description: survey.description ?? '', surveyType: survey.surveyType,
      targetRole: survey.targetRole, startDate: survey.startDate, endDate: survey.endDate,
      isAnonymous: survey.isAnonymous, scoreScaleMin: survey.scoreScaleMin, scoreScaleMax: survey.scoreScaleMax,
    });
    this.cdr.markForCheck();
  }

  saveSurvey(): void {
    if (this.surveyForm.invalid) return;
    const payload = this.surveyForm.getRawValue() as unknown as CreateIssueSurveyPayload;
    this.savingSurvey = true;
    const request$ =
      this.surveyEditMode && this.selectedSurveyId !== null
        ? this.api.updateIssueSurvey(this.selectedSurveyId, payload)
        : this.api.createIssueSurvey(payload);
    request$
      .pipe(
        switchMap((saved) => {
          this.selectedSurveyId = saved.id;
          this.surveyEditMode = true;
          return this.api.getIssueSurveys();
        }),
        finalize(() => (this.savingSurvey = false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (items) => {
          this.surveys = items;
          this.setSuccess('نظرسنجی ذخیره شد.');
          this.cdr.markForCheck();
        },
        error: () => {
          this.setError('ذخیره نظرسنجی با خطا مواجه شد.');
        },
      });
  }

  deleteSurvey(): void {
    if (this.selectedSurveyId === null || this.savingSurvey) return;
    if (!confirm('آیا از حذف این نظرسنجی اطمینان دارید؟')) return;
    this.savingSurvey = true;
    this.api
      .deleteIssueSurvey(this.selectedSurveyId)
      .pipe(
        switchMap((response) => {
          this.setSuccess(response.message);
          this.selectedSurveyId = null;
          this.surveyEditMode = false;
          return this.api.getIssueSurveys();
        }),
        finalize(() => (this.savingSurvey = false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (items) => {
          this.surveys = items;
          this.cdr.markForCheck();
        },
        error: () => {
          this.setError('حذف نظرسنجی با خطا مواجه شد.');
        },
      });
  }

  publishSurvey(): void {
    if (this.selectedSurveyId === null || this.savingSurvey) return;
    this.savingSurvey = true;
    this.api
      .publishIssueSurvey(this.selectedSurveyId)
      .pipe(
        switchMap(() => {
          this.setSuccess('نظرسنجی منتشر شد.');
          return this.api.getIssueSurveys();
        }),
        finalize(() => (this.savingSurvey = false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (items) => {
          this.surveys = items;
          this.cdr.markForCheck();
        },
        error: () => {
          this.setError('انتشار نظرسنجی با خطا مواجه شد.');
        },
      });
  }

  closeSurvey(): void {
    if (this.selectedSurveyId === null || this.savingSurvey) return;
    this.savingSurvey = true;
    this.api
      .closeIssueSurvey(this.selectedSurveyId)
      .pipe(
        switchMap(() => {
          this.setSuccess('نظرسنجی بسته شد.');
          return this.api.getIssueSurveys();
        }),
        finalize(() => (this.savingSurvey = false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (items) => {
          this.surveys = items;
          this.cdr.markForCheck();
        },
        error: () => {
          this.setError('بستن نظرسنجی با خطا مواجه شد.');
        },
      });
  }

  duplicateSurvey(): void {
    if (this.selectedSurveyId === null || this.savingSurvey) return;
    this.savingSurvey = true;
    this.api
      .duplicateIssueSurvey(this.selectedSurveyId)
      .pipe(
        switchMap(() => {
          this.setSuccess('نظرسنجی کپی شد.');
          return this.api.getIssueSurveys();
        }),
        finalize(() => (this.savingSurvey = false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (items) => {
          this.surveys = items;
          this.cdr.markForCheck();
        },
        error: () => {
          this.setError('کپی‌گیری نظرسنجی با خطا مواجه شد.');
        },
      });
  }

  exportSurveyJson(): void {
    if (this.selectedSurveyId === null) return;
    this.api
      .exportSurveyJson(this.selectedSurveyId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `survey-${this.selectedSurveyId}.json`;
          a.click();
          URL.revokeObjectURL(url);
          this.setSuccess('خروجی JSON دانلود شد.');
        },
        error: () => {
          this.setError('خروجی JSON با خطا مواجع شد.');
        },
      });
  }

  loadQuestions(): void {
    if (this.selectedSurveyId === null) return;
    this.loadingQuestions = true;
    this.api
      .getIssueSurveyQuestions(this.selectedSurveyId)
      .pipe(finalize(() => (this.loadingQuestions = false)), takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (items) => {
          this._questions = items;
          this.cdr.markForCheck();
        },
        error: () => {
          this.setError('دریافت سؤالات با خطا مواجه شد.');
          this.cdr.markForCheck();
        },
      });
  }

  onAddQuestion(payload: CreateIssueQuestionPayload): void {
    if (this.selectedSurveyId === null) return;
    this.savingQuestion = true;
    this.api
      .createIssueSurveyQuestion(this.selectedSurveyId, { ...payload, surveyId: this.selectedSurveyId })
      .pipe(
        switchMap(() => this.api.getIssueSurveyQuestions(this.selectedSurveyId!)),
        finalize(() => (this.savingQuestion = false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (items) => {
          this._questions = items;
          this.setSuccess('سوال اضافه شد.');
          this.cdr.markForCheck();
        },
        error: () => {
          this.setError('افزودن سوال با خطا مواجه شد.');
        },
      });
  }

  onDeleteQuestion(question: IssueSurveyQuestion): void {
    if (this.selectedSurveyId === null) return;
    if (!confirm('آیا از حذف این سوال اطمینان دارید؟')) return;
    this.api
      .deleteIssueSurveyQuestion(this.selectedSurveyId, question.id)
      .pipe(
        switchMap(() => this.api.getIssueSurveyQuestions(this.selectedSurveyId!)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (items) => {
          this._questions = items;
          this.setSuccess('سوال حذف شد.');
          this.cdr.markForCheck();
        },
        error: () => {
          this.setError('حذف سوال با خطا مواجه شد.');
        },
      });
  }

  /* ─── Actions ─── */

  loadActions(): void {
    if (this.selectedSurveyId === null) return;
    this.loadingActions = true;
    this.api
      .getSurveyActions(this.selectedSurveyId)
      .pipe(finalize(() => (this.loadingActions = false)), takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (items) => {
          this._actions = items;
          this.cdr.markForCheck();
        },
        error: () => {
          this.setError('دریافت اقدامات با خطا مواجه شد.');
          this.cdr.markForCheck();
        },
      });
  }

  onAddAction(payload: CreateIssueActionPayload): void {
    if (this.selectedSurveyId === null) return;
    this.savingAction = true;
    this.api
      .createSurveyAction(this.selectedSurveyId, { ...payload, surveyId: this.selectedSurveyId })
      .pipe(
        switchMap(() => this.api.getSurveyActions(this.selectedSurveyId!)),
        finalize(() => (this.savingAction = false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (items) => {
          this._actions = items;
          this.setSuccess('اقدام اضافه شد.');
          this.cdr.markForCheck();
        },
        error: () => {
          this.setError('افزودن اقدام با خطا مواجه شد.');
        },
      });
  }

  onUpdateActionStatus(event: { action: IssueAction; status: string }): void {
    this.api
      .updateIssueActionStatus(event.action.id, event.status, 1)
      .pipe(
        switchMap(() => this.api.getSurveyActions(this.selectedSurveyId!)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (items) => {
          this._actions = items;
          this.setSuccess('وضعیت اقدام به‌روز شد.');
          this.cdr.markForCheck();
        },
        error: () => {
          this.setError('به‌روزرسانی وضعیت با خطا مواجه شد.');
        },
      });
  }

  /* ─── Analytics ─── */

  loadAnalytics(): void {
    if (this.selectedSurveyId === null) return;
    this.loadingAnalytics = true;
    this.api
      .getSurveyAnalytics(this.selectedSurveyId)
      .pipe(finalize(() => (this.loadingAnalytics = false)), takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this._analyticsData = data;
          this.cdr.markForCheck();
        },
        error: () => {
          this._analyticsData = null;
          this.cdr.markForCheck();
        },
      });
  }

  loadDashboardSummary(): void {
    this.api.getIssueDashboardSummary().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data) => {
        this.dashboardSummary = data;
        this.cdr.markForCheck();
      },
      error: () => {},
    });
  }

  /* ─── Shared ─── */

  surveyStatusClass(status: SurveyStatus): string {
    switch (status) {
      case 'active':
        return 'status-chip--active';
      case 'draft':
        return 'status-chip--draft';
      case 'closed':
        return 'status-chip--closed';
      case 'archived':
        return 'status-chip--archived';
      default:
        return '';
    }
  }

  surveyStatusLabel(status: SurveyStatus): string {
    switch (status) {
      case 'active':
        return 'فعال';
      case 'draft':
        return 'پیش‌نویس';
      case 'closed':
        return 'بسته';
      case 'archived':
        return 'آرشیو';
      default:
        return status;
    }
  }

  setSuccess(message: string): void {
    this.successMessage = message;
    this.errorMessage = '';
    this.notify.show(message, 'success');
    this.cdr.markForCheck();
  }

  setError(message: string): void {
    this.errorMessage = message;
    this.successMessage = '';
    this.notify.show(message, 'error');
    this.cdr.markForCheck();
  }

  private refreshSelectedSurvey(): void {
    if (this.selectedSurveyId === null) return;
    this.api.getIssueSurveyById(this.selectedSurveyId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (survey) => {
        const idx = this.surveys.findIndex((s) => s.id === survey.id);
        if (idx !== -1) this.surveys[idx] = survey;
        this.cdr.markForCheck();
      },
      error: () => {},
    });
  }
}
