import { Observable } from 'rxjs';

import {
  ApiMessageResponse,
  Artwork,
  CalligraphySample,
  Competition,
  CompetitionDetail,
  CompetitionParticipant,
  CompetitionResult,
  CreateArtworkPayload,
  CreateCalligraphySamplePayload,
  CreateCompetitionPayload,
  CreateLeaguePayload,
  CreateMusicRecordPayload,
  League,
  LeagueDetail,
  LeagueRanking,
  MusicRecord,
  RegisterParticipantPayload,
  UpdateCompetitionPayload,
  UpdateLeaguePayload,
  UpdateLeagueRankingPayload,
  UpdateParticipantScorePayload,
} from '../../models/lesson-planner.models';

export abstract class ArtsActivitiesApi {
    // Arts (Aesthetic-Artistic Sahan — Phase 4)
    abstract getArtworks(): Observable<Artwork[]>;
    abstract uploadArtwork(payload: CreateArtworkPayload): Observable<Artwork>;
    abstract getMusicRecords(): Observable<MusicRecord[]>;
    abstract uploadMusicRecord(payload: CreateMusicRecordPayload): Observable<MusicRecord>;
    abstract getCalligraphySamples(): Observable<CalligraphySample[]>;
    abstract uploadCalligraphySample(payload: CreateCalligraphySamplePayload): Observable<CalligraphySample>;
    abstract likeArtwork(id: number): Observable<{ id: number; likeCount: number }>;
    abstract likeMusicRecord(id: number): Observable<{ id: number; likeCount: number }>;
    abstract likeCalligraphySample(id: number): Observable<{ id: number; likeCount: number }>;

    abstract getCompetitions(): Observable<Competition[]>;
    abstract getActiveCompetitions(): Observable<Competition[]>;
    abstract getCompetitionById(id: number): Observable<CompetitionDetail>;
    abstract createCompetition(payload: CreateCompetitionPayload): Observable<Competition>;
    abstract updateCompetition(id: number, payload: UpdateCompetitionPayload): Observable<Competition>;
    abstract deleteCompetition(id: number): Observable<ApiMessageResponse>;
    abstract registerParticipant(competitionId: number, payload: RegisterParticipantPayload): Observable<CompetitionParticipant>;
    abstract removeParticipant(competitionId: number, studentId: number): Observable<ApiMessageResponse>;
    abstract updateParticipantScore(competitionId: number, studentId: number, payload: UpdateParticipantScorePayload): Observable<CompetitionParticipant>;
    abstract getCompetitionResults(competitionId: number): Observable<CompetitionResult>;

    abstract getLeagues(): Observable<League[]>;
    abstract getActiveLeagues(): Observable<League[]>;
    abstract getLeagueById(id: number): Observable<LeagueDetail>;
    abstract createLeague(payload: CreateLeaguePayload): Observable<League>;
    abstract updateLeague(id: number, payload: UpdateLeaguePayload): Observable<League>;
    abstract deleteLeague(id: number): Observable<ApiMessageResponse>;
    abstract getLeagueRankings(leagueId: number): Observable<LeagueRanking[]>;
    abstract updateLeagueRanking(leagueId: number, payload: UpdateLeagueRankingPayload): Observable<LeagueRanking>;
}