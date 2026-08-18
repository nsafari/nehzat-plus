import { Observable } from 'rxjs';

import { MockLessonPlannerApiBase, type MockApiCtor } from './mock-lesson-planner-base';
import {
  Artwork,
  CalligraphySample,
  CollaborationProject,
  CreateArtworkPayload,
  CreateCalligraphySamplePayload,
  CreateCollaborationProjectPayload,
  CreateDiscussionPostPayload,
  CreateDiscussionThreadPayload,
  CreateMusicRecordPayload,
  CreateSkillBasketPayload,
  DiscussionPost,
  DiscussionThread,
  MusicRecord,
  PeerReview,
  PortfolioItem,
  SkillBasket,
  SkillCertificate,
  SubmitPeerReviewPayload,
  UploadPortfolioItemPayload,
} from './mock-lesson-planner-models';

/**
 * arts delegation mixin: every method forwards to the injected
 * MockArtsService instance (see MockLessonPlannerApiBase.arts).
 */
export function withArts<T extends MockApiCtor>(Base: T) {
  return class extends Base {
    // ===== Arts =====
    getArtworks(): Observable<Artwork[]> {
      return this.arts.getArtworks();
    }

    uploadArtwork(payload: CreateArtworkPayload): Observable<Artwork> {
      return this.arts.uploadArtwork(payload);
    }

    getMusicRecords(): Observable<MusicRecord[]> {
      return this.arts.getMusicRecords();
    }

    uploadMusicRecord(payload: CreateMusicRecordPayload): Observable<MusicRecord> {
      return this.arts.uploadMusicRecord(payload);
    }

    getCalligraphySamples(): Observable<CalligraphySample[]> {
      return this.arts.getCalligraphySamples();
    }

    uploadCalligraphySample(
      payload: CreateCalligraphySamplePayload,
    ): Observable<CalligraphySample> {
      return this.arts.uploadCalligraphySample(payload);
    }

    likeArtwork(id: number): Observable<{ id: number; likeCount: number }> {
      return this.arts.likeArtwork(id);
    }

    likeMusicRecord(id: number): Observable<{ id: number; likeCount: number }> {
      return this.arts.likeMusicRecord(id);
    }

    likeCalligraphySample(id: number): Observable<{ id: number; likeCount: number }> {
      return this.arts.likeCalligraphySample(id);
    }

    // ===== Social/Collaboration =====
    getCollaborationProjects(): Observable<CollaborationProject[]> {
      return this.arts.getCollaborationProjects();
    }

    createCollaborationProject(
      payload: CreateCollaborationProjectPayload,
    ): Observable<CollaborationProject> {
      return this.arts.createCollaborationProject(payload);
    }

    getDiscussions(projectId: number): Observable<DiscussionThread[]> {
      return this.arts.getDiscussions(projectId);
    }

    createDiscussionThread(payload: CreateDiscussionThreadPayload): Observable<DiscussionThread> {
      return this.arts.createDiscussionThread(payload);
    }

    getDiscussionPosts(threadId: number): Observable<DiscussionPost[]> {
      return this.arts.getDiscussionPosts(threadId);
    }

    createDiscussionPost(payload: CreateDiscussionPostPayload): Observable<DiscussionPost> {
      return this.arts.createDiscussionPost(payload);
    }

    getPeerReviews(): Observable<PeerReview[]> {
      return this.arts.getPeerReviews();
    }

    submitPeerReview(payload: SubmitPeerReviewPayload): Observable<PeerReview> {
      return this.arts.submitPeerReview(payload);
    }

    // ===== Career & Portfolio =====
    getPortfolioItems(): Observable<PortfolioItem[]> {
      return this.arts.getPortfolioItems();
    }

    uploadPortfolioItem(payload: UploadPortfolioItemPayload): Observable<PortfolioItem> {
      return this.arts.uploadPortfolioItem(payload);
    }

    getSkillCertificates(): Observable<SkillCertificate[]> {
      return this.arts.getSkillCertificates();
    }

    getSkillBasket(): Observable<SkillBasket | null> {
      return this.arts.getSkillBasket();
    }

    createSkillBasket(payload: CreateSkillBasketPayload): Observable<SkillBasket> {
      return this.arts.createSkillBasket(payload);
    }
  };
}
