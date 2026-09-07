import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, finalize } from 'rxjs';

import type {
  CareerPath,
  CreateCareerPathPayload,
  CareerPathMilestone,
  CareerPathProgress,
  PathwayRecommendation,
  SaveProgressPayload,
  SelectPathwayPayload,
} from '../../core/models/lesson-planner.models';
import { LESSON_PLANNER_API } from '../../core/services/lesson-planner-api.token';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';

type CareerView = 'paths' | 'recommendations' | 'progress';

const CAREER_CATEGORIES = ['فناوری', 'تکنولوژی', 'تحلیل', 'بازاریابی'];

@Component({
  selector: 'app-career-pathways',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './career-pathways.component.html',
  styleUrls: ['./career-pathways.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CareerPathwaysComponent implements OnInit {
  private readonly api = inject(LESSON_PLANNER_API);
  private readonly authService = inject(AuthService);
  private readonly notify = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly CAREER_CATEGORIES = CAREER_CATEGORIES;
  view: CareerView = 'paths';
  careerPaths: CareerPath[] = [];
  recommendations: PathwayRecommendation[] = [];
  progress: CareerPathProgress | null = null;
  selectedPath: CareerPath | null = null;
  loading = true;
  selectedPathIndex = -1;

  // Create modal
  showCreateModal = false;
  creating = false;
  newPathTitle = '';
  newPathCategory = '';
  newPathDescription = '';
  newPathTargetLevel = 1;
  newPathTargetXp = 1000;
  newPathDifficulty: 'beginner' | 'intermediate' | 'advanced' = 'beginner';

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (!user) {
      void this.router.navigateByUrl('/auth/login');
      return;
    }
    this.loadData();
  }

  private loadData(): void {
    this.loading = true;
    let pending = 2;

    const done = () => {
      pending--;
      if (pending <= 0) {
        this.loading = false;
      }
    };

    this.api.getCareerPaths().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (paths) => {
        this.careerPaths = paths;
        done();
      },
      error: () => done()
    });

    this.api.getPathwayRecommendations().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (recs) => {
        this.recommendations = recs;
        done();
      },
      error: () => done()
    });
  }

  switchView(view: CareerView): void {
    this.view = view;
  }

  getViewIcon(): string {
    if (this.view === 'paths') return '📊';
    if (this.view === 'recommendations') return '💡';
    return '📈';
  }

  getCategoryLabel(category: string): string {
    const label = CAREER_CATEGORIES.find(c => c.includes(category)) || category;
    return label;
  }

  getPathPathname(path: CareerPath): string {
    return `career-pathways/${path.id}`;
  }

  selectPath(path: CareerPath): void {
    this.selectedPath = path;
    this.loadProgress(path.id);
  }

  loadProgress(pathId: number): void {
    this.progress = null;
    this.api.getCareerPathProgress(pathId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (prog) => {
        this.progress = prog;
      },
      error: () => {}
    });
  }

  getProgressPercent(): number {
    if (!this.progress || this.progress.totalMilestones === 0) return 0;
    return Math.round((this.progress.completedMilestoneCount / this.progress.totalMilestones) * 100);
  }

  getCurrentMilestoneTitle(): string | null {
    if (!this.selectedPath || !this.progress || !this.progress.currentMilestoneId) return null;
    const milestone = this.selectedPath.milestones?.find(m => m.id === this.progress!.currentMilestoneId);
    return milestone?.title || null;
  }

  saveProgress(payload: SaveProgressPayload): Observable<CareerPathProgress> {
    return this.api.saveProgress(payload);
  }

  onSaveProgress(): void {
    if (!this.selectedPath || !this.progress) return;
    this.saveProgress({
      pathId: this.selectedPath.id,
      currentMilestoneId: this.progress.currentMilestoneId,
      completedMilestoneCount: this.progress.completedMilestoneCount,
      totalMilestones: this.progress.totalMilestones,
      xpEarned: this.progress.xpEarned,
      xpNeeded: this.progress.xpNeeded,
      pathTitle: this.selectedPath.title
    }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.notify.show('پیشرفت ذخیره شد', 'success');
      },
      error: (err) => {
        this.notify.show(err?.error?.message ?? 'خطا در ذخیره پیشرفت', 'error');
      }
    });
  }

  openCreateModal(): void {
    this.resetCreateForm();
    this.showCreateModal = true;
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
    this.resetCreateForm();
  }

  private resetCreateForm(): void {
    this.newPathTitle = '';
    this.newPathCategory = '';
    this.newPathDescription = '';
    this.newPathTargetLevel = 1;
    this.newPathTargetXp = 1000;
    this.newPathDifficulty = 'beginner';
  }

  onCreatePath(): void {
    if (this.creating || !this.newPathTitle.trim() || !this.newPathCategory) {
      this.notify.show('لطفاً تمام فیلدهای الزامی را پر کنید', 'error');
      return;
    }

    this.creating = true;
    const payload: CreateCareerPathPayload = {
      title: this.newPathTitle.trim(),
      description: this.newPathDescription.trim() || null,
      category: this.newPathCategory,
      targetLevel: this.newPathTargetLevel,
      targetXp: this.newPathTargetXp,
      difficulty: this.newPathDifficulty,
      prerequisites: []
    };

    this.api.createCareerPath(payload).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (newPath) => {
        this.notify.show('مسیر شغلی با موفقیت ایجاد شد', 'success');
        this.careerPaths = [newPath, ...this.careerPaths];
        this.closeCreateModal();
        this.creating = false;
      },
      error: (err) => {
        this.notify.show(err?.error?.message ?? 'خطا در ایجاد مسیر', 'error');
        this.creating = false;
      }
    });
  }

  onApplyRecommendation(rec: PathwayRecommendation): void {
    this.api.selectPathway({ pathId: rec.careerPathId }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.notify.show('درخواست ثبت نام ارسال شد', 'success');
        this.loadData();
      },
      error: (err) => {
        this.notify.show(err?.error?.message ?? 'خطا در ثبت نام', 'error');
      }
    });
  }
}