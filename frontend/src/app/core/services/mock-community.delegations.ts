import { Observable } from 'rxjs';

import { MockLessonPlannerApiBase, type MockApiCtor } from './mock-lesson-planner-base';
import {
  CareerPath,
  CareerPathMilestone,
  CareerPathProgress,
  CollaborationMetrics,
  CommunityMetrics,
  CreateCareerPathPayload,
  PathwayRecommendation,
  PeerActivity,
  PublicShowcase,
  SaveProgressPayload,
  SelectPathwayPayload,
  SkillSharingMetrics,
} from './mock-lesson-planner-models';

/**
 * community delegation mixin: every method forwards to the injected
 * MockCommunityService instance (see MockLessonPlannerApiBase.community).
 */
export function withCommunity<T extends MockApiCtor>(Base: T) {
  return class extends Base {
    // ===== Career Pathways =====
    getCareerPaths(): Observable<CareerPath[]> {
      return this.community.getCareerPaths();
    }

    getCareerPathById(id: number): Observable<CareerPath> {
      return this.community.getCareerPathById(id);
    }

    createCareerPath(payload: CreateCareerPathPayload): Observable<CareerPath> {
      return this.community.createCareerPath(payload);
    }

    getCareerPathMilestones(pathId: number): Observable<CareerPathMilestone[]> {
      return this.community.getCareerPathMilestones(pathId);
    }

    getCareerPathProgress(pathId: number): Observable<CareerPathProgress> {
      return this.community.getCareerPathProgress(pathId);
    }

    saveProgress(payload: SaveProgressPayload): Observable<CareerPathProgress> {
      return this.community.saveProgress(payload);
    }

    getPathwayRecommendations(): Observable<PathwayRecommendation[]> {
      return this.community.getPathwayRecommendations();
    }

    selectPathway(payload: SelectPathwayPayload): Observable<void> {
      return this.community.selectPathway(payload);
    }

    // ===== Community Metrics =====
    getCommunityMetrics(): Observable<CommunityMetrics> {
      return this.community.getCommunityMetrics();
    }

    getPeerActivity(limit?: number): Observable<PeerActivity[]> {
      return this.community.getPeerActivity(limit);
    }

    getSkillSharingMetrics(): Observable<SkillSharingMetrics> {
      return this.community.getSkillSharingMetrics();
    }

    getCollaborationMetrics(): Observable<CollaborationMetrics> {
      return this.community.getCollaborationMetrics();
    }

    getPublicShowcases(limit?: number): Observable<PublicShowcase[]> {
      return this.community.getPublicShowcases(limit);
    }
  };
}
