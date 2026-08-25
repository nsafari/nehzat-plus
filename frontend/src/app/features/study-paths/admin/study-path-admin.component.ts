import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import type { StudyPath, StudyPathStep, Accommodation, AgeGroup, SubjectArea, CreateStudyPathRequest, CreateStudyPathStepRequest, CreateAccommodationRequest } from '../../../core/models/lesson-planner.models';
import { LESSON_PLANNER_API } from '../../../core/services/lesson-planner-api.token';
import { NotificationService } from '../../../core/services/notification.service';

type AdminView = 'paths' | 'accommodations';

@Component({
  selector: 'app-study-path-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './study-path-admin.component.html',
  styleUrls: ['./study-path-admin.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudyPathAdminComponent implements OnInit {
  private readonly api = inject(LESSON_PLANNER_API);
  readonly notify = inject(NotificationService);

  view: AdminView = 'paths';
  loading = true;
  error: string | null = null;

  studyPaths: StudyPath[] = [];
  accommodations: Accommodation[] = [];
  ageGroups: AgeGroup[] = [];
  subjectAreas: SubjectArea[] = [];

  // Form state
  showCreateModal = false;
  creating = false;
  newPath: CreateStudyPathRequest = {
    key: '',
    title: '',
    description: '',
    ageGroupId: 0,
    subjectAreaId: 0,
    cognitiveLevel: 'understanding',
    isActive: true,
    sortOrder: 0,
    steps: [],
    accommodationIds: [],
  };

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.loading = true;
    let pending = 3;
    const done = () => { if (--pending <= 0) this.loading = false; };

    this.api.getStudyPaths().subscribe({
      next: (paths) => { this.studyPaths = paths; done(); },
      error: () => { this.error = 'خطا در بارگذاری مسیرها'; this.loading = false; },
    });

    this.api.getAccommodations().subscribe({
      next: (accs) => { this.accommodations = accs; done(); },
      error: () => { done(); },
    });

    this.api.getStudyPathAgeGroups().subscribe({
      next: (groups) => { this.ageGroups = groups; done(); },
      error: () => { done(); },
    });

    this.api.getStudyPathSubjectAreas().subscribe({
      next: (areas) => { this.subjectAreas = areas; done(); },
      error: () => { done(); },
    });
  }

  retry(): void {
    this.error = null;
    this.loadData();
  }

  openCreateModal(): void {
    this.newPath = {
      key: '',
      title: '',
      description: '',
      ageGroupId: 0,
      subjectAreaId: 0,
      cognitiveLevel: 'understanding',
      isActive: true,
      sortOrder: 0,
      steps: [],
      accommodationIds: [],
    };
    this.showCreateModal = true;
  }

  addStepField(): void {
    if (!this.newPath.steps) this.newPath.steps = [];
    this.newPath.steps.push({
      stepOrder: this.newPath.steps.length,
      title: '',
      description: '',
      cognitiveLevel: 'understanding',
      estimatedDurationMinutes: 30,
    });
  }

  removeStep(index: number): void {
    if (this.newPath.steps) {
      this.newPath.steps.splice(index, 1);
      this.newPath.steps.forEach((s, i) => (s.stepOrder = i));
    }
  }

  createPath(): void {
    this.creating = true;
    this.api.createStudyPath(this.newPath).subscribe({
      next: () => {
        this.notify.show('مسیر مطالعاتی ایجاد شد', 'success');
        this.showCreateModal = false;
        this.creating = false;
        this.loadData();
      },
      error: () => {
        this.notify.show('خطا در ساخت مسیر', 'error');
        this.creating = false;
      },
    });
  }

  deletePath(id: number): void {
    if (!confirm('آیا مطمئنید؟ حذف غیرقابل بازگشت است.')) return;
    this.api.deleteStudyPath(id).subscribe({
      next: () => {
        this.notify.show('مسیر حذف شد', 'success');
        this.loadData();
      },
      error: () => {
        this.notify.show('خطا در حذف مسیر', 'error');
      },
    });
  }
}
