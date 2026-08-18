import { Constructor, HttpServiceContext } from './base';
import { Observable } from 'rxjs';
import {
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

export function WithArtsActivities<TBase extends Constructor<HttpServiceContext>>(Base: TBase) {
  return class extends Base {
    getArtworks(): Observable<Artwork[]> {
      return this.http.get<Artwork[]>(this.url('/api/arts'));
    }

    uploadArtwork(payload: CreateArtworkPayload): Observable<Artwork> {
      return this.http.post<Artwork>(this.url('/api/arts'), payload);
    }

    getMusicRecords(): Observable<MusicRecord[]> {
      return this.http.get<MusicRecord[]>(this.url('/api/arts/music'));
    }

    uploadMusicRecord(payload: CreateMusicRecordPayload): Observable<MusicRecord> {
      return this.http.post<MusicRecord>(this.url('/api/arts/music'), payload);
    }

    getCalligraphySamples(): Observable<CalligraphySample[]> {
      return this.http.get<CalligraphySample[]>(this.url('/api/arts/calligraphy'));
    }

    uploadCalligraphySample(
      payload: CreateCalligraphySamplePayload,
    ): Observable<CalligraphySample> {
      return this.http.post<CalligraphySample>(this.url('/api/arts/calligraphy'), payload);
    }

    likeArtwork(id: number): Observable<{ id: number; likeCount: number }> {
      return this.http.post<{ id: number; likeCount: number }>(
        this.url(`/api/arts/${id}/like`),
        {},
      );
    }

    likeMusicRecord(id: number): Observable<{ id: number; likeCount: number }> {
      return this.http.post<{ id: number; likeCount: number }>(
        this.url(`/api/arts/music/${id}/like`),
        {},
      );
    }

    likeCalligraphySample(id: number): Observable<{ id: number; likeCount: number }> {
      return this.http.post<{ id: number; likeCount: number }>(
        this.url(`/api/arts/calligraphy/${id}/like`),
        {},
      );
    }

    getCompetitions(): Observable<Competition[]> {
      return this.http.get<Competition[]>(this.url('/competitions'));
    }

    getActiveCompetitions(): Observable<Competition[]> {
      return this.http.get<Competition[]>(this.url('/competitions/active'));
    }

    getCompetitionById(id: number): Observable<CompetitionDetail> {
      return this.http.get<CompetitionDetail>(this.url(`/competitions/${id}`));
    }

    createCompetition(payload: CreateCompetitionPayload): Observable<Competition> {
      return this.http.post<Competition>(this.url('/competitions'), payload);
    }

    updateCompetition(id: number, payload: UpdateCompetitionPayload): Observable<Competition> {
      return this.http.put<Competition>(this.url(`/competitions/${id}`), payload);
    }

    deleteCompetition(id: number): Observable<void> {
      return this.http.delete<void>(this.url(`/competitions/${id}`));
    }

    registerParticipant(
      competitionId: number,
      payload: RegisterParticipantPayload,
    ): Observable<CompetitionParticipant> {
      return this.http.post<CompetitionParticipant>(
        this.url(`/competitions/${competitionId}/participants`),
        payload,
      );
    }

    removeParticipant(competitionId: number, studentId: number): Observable<void> {
      return this.http.delete<void>(
        this.url(`/competitions/${competitionId}/participants/${studentId}`),
      );
    }

    updateParticipantScore(
      competitionId: number,
      studentId: number,
      payload: UpdateParticipantScorePayload,
    ): Observable<CompetitionParticipant> {
      return this.http.put<CompetitionParticipant>(
        this.url(`/competitions/${competitionId}/participants/${studentId}/score`),
        payload,
      );
    }

    getCompetitionResults(competitionId: number): Observable<CompetitionResult> {
      return this.http.get<CompetitionResult>(this.url(`/competitions/${competitionId}/results`));
    }

    getLeagues(): Observable<League[]> {
      return this.http.get<League[]>(this.url('/leagues'));
    }

    getActiveLeagues(): Observable<League[]> {
      return this.http.get<League[]>(this.url('/leagues/active'));
    }

    getLeagueById(id: number): Observable<LeagueDetail> {
      return this.http.get<LeagueDetail>(this.url(`/leagues/${id}`));
    }

    createLeague(payload: CreateLeaguePayload): Observable<League> {
      return this.http.post<League>(this.url('/leagues'), payload);
    }

    updateLeague(id: number, payload: UpdateLeaguePayload): Observable<League> {
      return this.http.put<League>(this.url(`/leagues/${id}`), payload);
    }

    deleteLeague(id: number): Observable<void> {
      return this.http.delete<void>(this.url(`/leagues/${id}`));
    }

    getLeagueRankings(leagueId: number): Observable<LeagueRanking[]> {
      return this.http.get<LeagueRanking[]>(this.url(`/leagues/${leagueId}/rankings`));
    }

    updateLeagueRanking(
      leagueId: number,
      payload: UpdateLeagueRankingPayload,
    ): Observable<LeagueRanking> {
      return this.http.put<LeagueRanking>(this.url(`/leagues/${leagueId}/rankings`), payload);
    }
  };
}
