import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, finalize } from 'rxjs';

import type {
  CollaborationProject,
  CreateCollaborationProjectPayload,
  DiscussionThread,
  CreateDiscussionThreadPayload,
  DiscussionPost,
  CreateDiscussionPostPayload,
  PeerReview,
  SubmitPeerReviewPayload
} from '../../core/models/lesson-planner.models';
import { LESSON_PLANNER_API } from '../../core/services/lesson-planner-api.token';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';

type SocialView = 'projects' | 'discussions' | 'reviews';

@Component({
  selector: 'app-social',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './social.component.html',
  styleUrls: ['./social.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SocialComponent implements OnInit {
  private readonly api = inject(LESSON_PLANNER_API);
  private readonly authService = inject(AuthService);
  private readonly notify = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  activeView: SocialView = 'projects';
  loading = true;
  saving = false;

  projects: CollaborationProject[] = [];
  discussions: DiscussionThread[] = [];
  reviewItems: PeerReview[] = [];
  posts: DiscussionPost[] = [];

  selectedProject: CollaborationProject | null = null;
  showProjectModal = false;
  showDiscussionModal = false;
  showPostModal = false;
  showReviewModal = false;

  projectTitle = '';
  projectDescription = '';
  projectSubject = '';

  discussionTitle = '';
  discussionBody = '';

  postBody = '';
  postParentId: number | null = null;

  reviewScore = 3;
  reviewFeedback = '';

  constructor() {
    const user = this.authService.getCurrentUser();
    if (!user) {
      void this.router.navigateByUrl('/auth/login');
    }
  }

  ngOnInit(): void {
    this.loadProjects();
    this.loadReviews();
  }

  private loadProjects(): void {
    this.loading = true;
    this.api.getCollaborationProjects().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (items) => {
        this.projects = items;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  private loadReviews(): void {
    this.api.getPeerReviews().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (items) => {
        this.reviewItems = items;
      },
      error: () => {}
    });
  }

  switchView(view: SocialView): void {
    this.activeView = view;
    if (view === 'discussions' && this.selectedProject) {
      this.loadDiscussions(this.selectedProject.id);
    }
  }

  selectProject(project: CollaborationProject): void {
    this.selectedProject = project;
    this.showProjectModal = false;
    this.activeView = 'discussions';
    this.loadDiscussions(project.id);
  }

  private loadDiscussions(projectId: number): void {
    this.loading = true;
    this.api.getDiscussions(projectId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (items) => {
        this.discussions = items;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  openDiscussion(thread: DiscussionThread): void {
    this.posts = [];
    this.api.getDiscussionPosts(thread.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (items) => {
        this.posts = items;
      }
    });
  }

  submitDiscussionThread(): void {
    if (this.saving || !this.selectedProject || !this.discussionTitle.trim()) return;

    this.saving = true;
    const payload: CreateDiscussionThreadPayload = {
      projectId: this.selectedProject.id,
      title: this.discussionTitle.trim(),
      body: this.discussionBody.trim()
    };

    this.api.createDiscussionThread(payload).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (thread) => {
        this.discussions = [thread, ...this.discussions];
        this.showDiscussionModal = false;
        this.discussionTitle = '';
        this.discussionBody = '';
        this.notify.show('موضوع بحث ایجاد شد', 'success');
      },
      error: () => this.notify.show('خطا در ایجاد بحث', 'error'),
      complete: () => { this.saving = false; }
    });
  }

  submitDiscussionPost(): void {
    if (this.saving || !this.selectedProject || !this.postBody.trim()) return;

    const threadId = this.discussions.length > 0 ? this.discussions[0].id : this.selectedProject.id;
    this.saving = true;
    const payload: CreateDiscussionPostPayload = {
      threadId,
      body: this.postBody.trim(),
      parentId: this.postParentId
    };

    this.api.createDiscussionPost(payload).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (post) => {
        this.posts = [post, ...this.posts];
        this.showPostModal = false;
        this.postBody = '';
        this.postParentId = null;
        this.notify.show('پیام شما ارسال شد', 'success');
      },
      error: () => this.notify.show('خطا در ارسال پیام', 'error'),
      complete: () => { this.saving = false; }
    });
  }

  submitPeerReview(): void {
    if (this.saving || !this.selectedProject || this.reviewScore < 1 || this.reviewScore > 5) return;

    this.saving = true;
    const payload: SubmitPeerReviewPayload = {
      projectId: this.selectedProject.id,
      score: this.reviewScore,
      feedback: this.reviewFeedback.trim()
    };

    this.api.submitPeerReview(payload).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (review) => {
        this.reviewItems = [review, ...this.reviewItems];
        this.showReviewModal = false;
        this.reviewScore = 3;
        this.reviewFeedback = '';
        this.notify.show('نظرسنجی شما ثبت شد', 'success');
      },
      error: () => this.notify.show('خطا در ثبت نظرسنجی', 'error'),
      complete: () => { this.saving = false; }
    });
  }

  createProject(): void {
    if (this.saving || !this.projectTitle.trim()) return;

    this.saving = true;
    const payload: CreateCollaborationProjectPayload = {
      title: this.projectTitle.trim(),
      description: this.projectDescription.trim() || null,
      subject: this.projectSubject.trim() || null,
      memberIds: []
    };

    this.api.createCollaborationProject(payload).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (project) => {
        this.projects = [project, ...this.projects];
        this.showProjectModal = false;
        this.resetProjectForm();
        this.notify.show('پروژه همکاری‌ای ایجاد شد', 'success');
      },
      error: () => this.notify.show('خطا در ایجاد پروژه', 'error'),
      complete: () => { this.saving = false; }
    });
  }

  private resetProjectForm(): void {
    this.projectTitle = '';
    this.projectDescription = '';
    this.projectSubject = '';
  }

  backToDashboard(): void {
    void this.router.navigateByUrl('/dashboard');
  }
}
