import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, combineLatest } from 'rxjs';

import type {
  CommunityMetrics,
  PeerActivity,
  SkillSharingMetrics,
  CollaborationMetrics,
  PublicShowcase
} from '../../core/models/lesson-planner.models';
import { LESSON_PLANNER_API } from '../../core/services/lesson-planner-api.token';
import { NotificationService } from '../../core/services/notification.service';

type MetricsView = 'overview' | 'activity' | 'skills' | 'collaboration' | 'showcase';

@Component({
  selector: 'app-community-metrics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './community-metrics.component.html',
  styleUrls: ['./community-metrics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommunityMetricsComponent implements OnInit {
  private readonly api = inject(LESSON_PLANNER_API);
  private readonly notify = inject(NotificationService);
  private readonly destroyRef = inject(DestroyRef);

  activeView: MetricsView = 'overview';
  loading = true;

  metrics$!: Observable<CommunityMetrics>;
  activity$!: Observable<PeerActivity[]>;
  skills$!: Observable<SkillSharingMetrics>;
  collaboration$!: Observable<CollaborationMetrics>;
  showcase$!: Observable<PublicShowcase[]>;

  VIEW_LABELS: Record<MetricsView, string> = {
    overview: 'نمای کلی',
    activity: 'فعالیت همتاها',
    skills: 'اشتراک مهارت',
    collaboration: 'همکاری‌ها',
    showcase: 'نمایشگاه عمومی'
  };

  VIEW_ICONS: Record<MetricsView, string> = {
    overview: '📊',
    activity: '🔔',
    skills: '💡',
    collaboration: '🤝',
    showcase: '🏆'
  };

  views: MetricsView[] = ['overview', 'activity', 'skills', 'collaboration', 'showcase'];

  ngOnInit(): void {
    this.loadAll();
  }

  private loadAll(): void {
    this.loading = true;

    this.metrics$ = this.api.getCommunityMetrics();
    this.activity$ = this.api.getPeerActivity(10);
    this.skills$ = this.api.getSkillSharingMetrics();
    this.collaboration$ = this.api.getCollaborationMetrics();
    this.showcase$ = this.api.getPublicShowcases(6);

    // Wait for first metrics to stop loading
    this.metrics$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => this.loading = false,
      error: () => this.loading = false
    });
  }

  switchView(view: MetricsView): void {
    this.activeView = view;
  }

  getViewIcon(): string {
    return this.VIEW_ICONS[this.activeView];
  }

  formatNumber(num: number): string {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  }

  formatDate(iso: string): string {
    const date = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'چند لحظه پیش';
    if (diffHours < 24) return `${diffHours} ساعت پیش`;
    if (diffDays < 7) return `${diffDays} روز پیش`;
    return date.toLocaleDateString('fa-IR');
  }

  getActivityIcon(type: string): string {
    const icons: Record<string, string> = {
      project_created: '📁',
      discussion_posted: '💬',
      portfolio_uploaded: '📎',
      badge_earned: '🏅',
      level_up: '⬆️',
      collaboration_joined: '🤝'
    };
    return icons[type] ?? '📌';
  }

  getShowcaseIcon(type: string): string {
    const icons: Record<string, string> = {
      portfolio: '📁',
      artwork: '🎨',
      music: '🎵',
      calligraphy: '✒️',
      project: '📁',
      achievement: '🏅'
    };
    return icons[type] ?? '📌';
  }
}