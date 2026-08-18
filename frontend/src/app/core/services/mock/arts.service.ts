import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MockDataContext } from './mock-data-context';
import {
  Artwork,
  MusicRecord,
  CalligraphySample,
  CollaborationProject,
  DiscussionThread,
  DiscussionPost,
  PeerReview,
  PortfolioItem,
  SkillCertificate,
  SkillBasket,
  CreateArtworkPayload,
  CreateMusicRecordPayload,
  CreateCalligraphySamplePayload,
  CreateCollaborationProjectPayload,
  CreateDiscussionThreadPayload,
  CreateDiscussionPostPayload,
  SubmitPeerReviewPayload,
  UploadPortfolioItemPayload,
  CreateSkillBasketPayload,
} from '../../models/lesson-planner.models';

@Injectable({ providedIn: 'root' })
export class MockArtsService {
  constructor(private ctx: MockDataContext) {}

  getArtworks(): Observable<Artwork[]> {
    return this.ctx.delayed([...this.ctx.artworks]);
  }

  uploadArtwork(payload: CreateArtworkPayload): Observable<Artwork> {
    const artwork: Artwork = {
      id: this.ctx.nextId(this.ctx.artworks),
      userId: 42,
      title: payload.title,
      type: payload.type,
      fileUrl: payload.fileUrl,
      description: payload.description,
      tags: payload.tags,
      isPublic: payload.isPublic ?? true,
      likeCount: 0,
      createdAt: this.ctx.now(),
      updatedAt: this.ctx.now(),
    };
    this.ctx.artworks.push(artwork);
    return this.ctx.delayed(artwork);
  }

  getMusicRecords(): Observable<MusicRecord[]> {
    return this.ctx.delayed([...this.ctx.musicRecords]);
  }

  uploadMusicRecord(payload: CreateMusicRecordPayload): Observable<MusicRecord> {
    const record: MusicRecord = {
      id: this.ctx.nextId(this.ctx.musicRecords),
      userId: 42,
      title: payload.title,
      audioUrl: payload.audioUrl,
      artistName: payload.artistName,
      durationSeconds: payload.durationSeconds,
      genre: payload.genre,
      description: payload.description,
      tags: payload.tags,
      isPublic: payload.isPublic ?? true,
      likeCount: 0,
      createdAt: this.ctx.now(),
      updatedAt: this.ctx.now(),
    };
    this.ctx.musicRecords.push(record);
    return this.ctx.delayed(record);
  }

  getCalligraphySamples(): Observable<CalligraphySample[]> {
    return this.ctx.delayed([...this.ctx.calligraphySamples]);
  }

  uploadCalligraphySample(payload: CreateCalligraphySamplePayload): Observable<CalligraphySample> {
    const sample: CalligraphySample = {
      id: this.ctx.nextId(this.ctx.calligraphySamples),
      userId: 42,
      title: payload.title,
      imageUrl: payload.imageUrl,
      style: payload.style,
      description: payload.description,
      tags: payload.tags,
      isPublic: payload.isPublic ?? true,
      likeCount: 0,
      createdAt: this.ctx.now(),
      updatedAt: this.ctx.now(),
    };
    this.ctx.calligraphySamples.push(sample);
    return this.ctx.delayed(sample);
  }

  likeArtwork(id: number): Observable<{ id: number; likeCount: number }> {
    const artwork = this.ctx.artworks.find((a) => a.id === id);
    if (artwork) artwork.likeCount++;
    return this.ctx.delayed({ id, likeCount: artwork?.likeCount ?? 0 });
  }

  likeMusicRecord(id: number): Observable<{ id: number; likeCount: number }> {
    const record = this.ctx.musicRecords.find((r) => r.id === id);
    if (record) record.likeCount++;
    return this.ctx.delayed({ id, likeCount: record?.likeCount ?? 0 });
  }

  likeCalligraphySample(id: number): Observable<{ id: number; likeCount: number }> {
    const sample = this.ctx.calligraphySamples.find((s) => s.id === id);
    if (sample) sample.likeCount++;
    return this.ctx.delayed({ id, likeCount: sample?.likeCount ?? 0 });
  }

  getCollaborationProjects(): Observable<CollaborationProject[]> {
    return this.ctx.delayed([...this.ctx.collaborationProjects]);
  }

  createCollaborationProject(
    payload: CreateCollaborationProjectPayload,
  ): Observable<CollaborationProject> {
    const project: CollaborationProject = {
      id: this.ctx.nextId(this.ctx.collaborationProjects),
      title: payload.title,
      description: payload.description,
      memberIds: payload.memberIds,
      createdAt: this.ctx.now(),
      updatedAt: this.ctx.now(),
      progressPercent: 0,
      taskCount: 0,
      completedTaskCount: 0,
    };
    this.ctx.collaborationProjects.push(project);
    return this.ctx.delayed(project);
  }

  getDiscussions(projectId: number): Observable<DiscussionThread[]> {
    return this.ctx.delayed(this.ctx.discussionThreads.filter((t) => t.projectId === projectId));
  }

  createDiscussionThread(payload: CreateDiscussionThreadPayload): Observable<DiscussionThread> {
    const thread: DiscussionThread = {
      id: this.ctx.nextId(this.ctx.discussionThreads),
      projectId: payload.projectId,
      title: payload.title,
      body: payload.body,
      authorId: 42,
      createdAt: this.ctx.now(),
      updatedAt: this.ctx.now(),
      postCount: 0,
      isPinned: false,
    };
    this.ctx.discussionThreads.push(thread);
    return this.ctx.delayed(thread);
  }

  getDiscussionPosts(threadId: number): Observable<DiscussionPost[]> {
    return this.ctx.delayed(this.ctx.discussionPosts.filter((p) => p.threadId === threadId));
  }

  createDiscussionPost(payload: CreateDiscussionPostPayload): Observable<DiscussionPost> {
    const post: DiscussionPost = {
      id: this.ctx.nextId(this.ctx.discussionPosts),
      threadId: payload.threadId,
      body: payload.body,
      parentId: payload.parentId ?? null,
      authorId: 42,
      createdAt: this.ctx.now(),
      updatedAt: this.ctx.now(),
      likeCount: 0,
      isLiked: false,
    };
    this.ctx.discussionPosts.push(post);
    return this.ctx.delayed(post);
  }

  getPeerReviews(): Observable<PeerReview[]> {
    return this.ctx.delayed([...this.ctx.peerReviews]);
  }

  submitPeerReview(payload: SubmitPeerReviewPayload): Observable<PeerReview> {
    const review: PeerReview = {
      id: this.ctx.nextId(this.ctx.peerReviews),
      projectId: payload.projectId,
      reviewerId: 42,
      authorId: 0,
      score: payload.score,
      feedback: payload.feedback,
      submittedAt: this.ctx.now(),
      status: 'submitted',
    };
    this.ctx.peerReviews.push(review);
    return this.ctx.delayed(review);
  }

  getPortfolioItems(): Observable<PortfolioItem[]> {
    return this.ctx.delayed([...this.ctx.portfolioItems]);
  }

  uploadPortfolioItem(payload: UploadPortfolioItemPayload): Observable<PortfolioItem> {
    const item: PortfolioItem = {
      id: this.ctx.nextId(this.ctx.portfolioItems),
      userId: 42,
      title: payload.title,
      type: payload.type,
      typeLabel: payload.type,
      description: payload.description,
      fileUrl: payload.fileUrl,
      tags: payload.tags,
      isPublic: payload.isPublic ?? true,
      likeCount: 0,
      createdAt: this.ctx.now(),
      updatedAt: this.ctx.now(),
    };
    this.ctx.portfolioItems.push(item);
    return this.ctx.delayed(item);
  }

  getSkillCertificates(): Observable<SkillCertificate[]> {
    return this.ctx.delayed([...this.ctx.skillCertificates]);
  }

  getSkillBasket(): Observable<SkillBasket | null> {
    const basket = this.ctx.skillBaskets.find((b) => b.userId === 42);
    return this.ctx.delayed(basket ?? null);
  }

  createSkillBasket(payload: CreateSkillBasketPayload): Observable<SkillBasket> {
    const basket: SkillBasket = {
      id: this.ctx.nextId(this.ctx.skillBaskets),
      userId: 42,
      title: payload.title,
      description: payload.description,
      skillIds: payload.skillIds,
      isPublic: payload.isPublic ?? true,
      createdAt: this.ctx.now(),
      updatedAt: this.ctx.now(),
      competencyPercent: 0,
    };
    this.ctx.skillBaskets.push(basket);
    return this.ctx.delayed(basket);
  }
}
