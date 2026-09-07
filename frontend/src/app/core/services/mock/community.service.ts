import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MockDataContext } from './mock-data-context';
import {
  CareerPath,
  CareerPathMilestone,
  CareerPathProgress,
  PathwayRecommendation,
  CommunityMetrics,
  PeerActivity,
  SkillSharingMetrics,
  CollaborationMetrics,
  PublicShowcase,
  CreateCareerPathPayload,
  SaveProgressPayload,
  SelectPathwayPayload,
} from '../../models/lesson-planner.models';

@Injectable({ providedIn: 'root' })
export class MockCommunityService {
  constructor(private ctx: MockDataContext) {}

  getCommunityMetrics(): Observable<CommunityMetrics> {
    return this.ctx.delayed({
      totalTrainees: this.ctx.users.filter((u) => u.userType === 'trainee').length,
      activeThisWeek: this.ctx.users.filter((u) => u.approvalStatus === 'approved').length,
      totalCollaborations: this.ctx.collaborationProjects.length,
      totalPortfolioItems: this.ctx.portfolioItems.length,
      avgSkillLevel: 0,
      topDomains: [],
    });
  }

  getPeerActivity(limit?: number): Observable<PeerActivity[]> {
    const activities: PeerActivity[] = [
      {
        id: 1,
        traineeId: 42,
        traineeName: 'test',
        activityType: 'level_up',
        description: 'تکمیل تمرین ریاضی',
        timestamp: this.ctx.now(),
      },
      {
        id: 2,
        traineeId: 43,
        traineeName: 'ali.ahmadi',
        activityType: 'badge_earned',
        description: 'ارسال تکلیف قرآن',
        timestamp: this.ctx.now(),
      },
    ];
    return this.ctx.delayed(limit ? activities.slice(0, limit) : activities);
  }

  getSkillSharingMetrics(): Observable<SkillSharingMetrics> {
    return this.ctx.delayed({
      totalShared: 0,
      topSharedSkills: [],
      recentShares: [],
    });
  }

  getCollaborationMetrics(): Observable<CollaborationMetrics> {
    return this.ctx.delayed({
      totalProjects: this.ctx.collaborationProjects.length,
      activeProjects: this.ctx.collaborationProjects.filter(
        (p) => p.completedTaskCount < p.taskCount,
      ).length,
      completedProjects: this.ctx.collaborationProjects.filter(
        (p) => p.completedTaskCount >= p.taskCount,
      ).length,
      avgTeamSize: 0,
      topCollaborators: [],
    });
  }

  getPublicShowcases(limit?: number): Observable<PublicShowcase[]> {
    const showcases: PublicShowcase[] = [
      ...this.ctx.artworks
        .filter((a) => a.isPublic)
        .map((a) => ({
          id: a.id,
          traineeId: a.userId,
          traineeName: '',
          title: a.title,
          type: 'artwork' as const,
          thumbnailUrl: a.fileUrl,
          viewCount: 0,
          likeCount: a.likeCount,
          createdAt: a.createdAt ?? '',
        })),
      ...this.ctx.musicRecords
        .filter((m) => m.isPublic)
        .map((m) => ({
          id: m.id,
          traineeId: m.userId,
          traineeName: '',
          title: m.title,
          type: 'music' as const,
          thumbnailUrl: m.audioUrl,
          viewCount: 0,
          likeCount: m.likeCount,
          createdAt: m.createdAt ?? '',
        })),
    ];
    return this.ctx.delayed(limit ? showcases.slice(0, limit) : showcases);
  }

  getCareerPaths(): Observable<CareerPath[]> {
    return this.ctx.delayed([...this.ctx.careerPaths]);
  }

  getCareerPathById(id: number): Observable<CareerPath> {
    const path = this.ctx.careerPaths.find((p) => p.id === id);
    if (!path) throw new Error('Career path not found');
    return this.ctx.delayed(path);
  }

  createCareerPath(payload: CreateCareerPathPayload): Observable<CareerPath> {
    const path: CareerPath = {
      id: this.ctx.nextId(this.ctx.careerPaths),
      title: payload.title,
      description: payload.description,
      category: payload.category,
      targetLevel: payload.targetLevel,
      targetXp: payload.targetXp,
      difficulty: payload.difficulty,
      isActive: true,
      createdAt: this.ctx.now(),
      updatedAt: this.ctx.now(),
      milestones: [],
      prerequisites: payload.prerequisites,
    };
    this.ctx.careerPaths.push(path);
    return this.ctx.delayed(path);
  }

  getCareerPathMilestones(pathId: number): Observable<CareerPathMilestone[]> {
    const path = this.ctx.careerPaths.find((p) => p.id === pathId);
    return this.ctx.delayed(path?.milestones ?? []);
  }

  getCareerPathProgress(pathId: number): Observable<CareerPathProgress> {
    const path = this.ctx.careerPaths.find((p: { id: number }) => p.id === pathId);
    return this.ctx.delayed({
      pathId,
      currentMilestoneId: null,
      completedMilestoneCount: 0,
      totalMilestones: path?.milestones?.length ?? 0,
      xpEarned: 0,
      xpNeeded: path?.targetXp ?? 0,
      pathTitle: path?.title ?? '',
    });
  }

  saveProgress(payload: SaveProgressPayload): Observable<CareerPathProgress> {
    return this.ctx.delayed({
      pathId: payload.pathId,
      currentMilestoneId: payload.currentMilestoneId,
      completedMilestoneCount: payload.completedMilestoneCount,
      totalMilestones: payload.totalMilestones,
      xpEarned: payload.xpEarned,
      xpNeeded: payload.xpNeeded,
      pathTitle: payload.pathTitle,
    });
  }

  getPathwayRecommendations(): Observable<PathwayRecommendation[]> {
    return this.ctx.delayed([...this.ctx.pathwayRecommendations]);
  }

  selectPathway(payload: SelectPathwayPayload): Observable<void> {
    return this.ctx.delayed(undefined);
  }
}
