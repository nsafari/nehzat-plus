import { Observable } from 'rxjs';

import { MockLessonPlannerApiBase, type MockApiCtor } from './mock-lesson-planner-base';
import {
  ApiMessageResponse,
  Competition,
  CompetitionDetail,
  CompetitionParticipant,
  CompetitionResult,
  CreateCompetitionPayload,
  CreateLeaguePayload,
  League,
  LeagueDetail,
  LeagueRanking,
  RegisterParticipantPayload,
  UpdateCompetitionPayload,
  UpdateLeaguePayload,
  UpdateLeagueRankingPayload,
  UpdateParticipantScorePayload,
} from './mock-lesson-planner-models';

/**
 * competitions delegation mixin: every method forwards to the injected
 * MockCompetitionsService instance (see MockLessonPlannerApiBase.competitions).
 */
export function withCompetitions<T extends MockApiCtor>(Base: T) {
  return class extends Base {
    // ===== Competitions =====
    getCompetitions(): Observable<Competition[]> {
      return this.competitions.getCompetitions();
    }

    getActiveCompetitions(): Observable<Competition[]> {
      return this.competitions.getActiveCompetitions();
    }

    getCompetitionById(id: number): Observable<CompetitionDetail> {
      return this.competitions.getCompetitionById(id);
    }

    createCompetition(payload: CreateCompetitionPayload): Observable<Competition> {
      return this.competitions.createCompetition(payload);
    }

    updateCompetition(id: number, payload: UpdateCompetitionPayload): Observable<Competition> {
      return this.competitions.updateCompetition(id, payload);
    }

    deleteCompetition(id: number): Observable<ApiMessageResponse> {
      return this.competitions.deleteCompetition(id);
    }

    registerParticipant(
      competitionId: number,
      payload: RegisterParticipantPayload,
    ): Observable<CompetitionParticipant> {
      return this.competitions.registerParticipant(competitionId, payload);
    }

    removeParticipant(competitionId: number, studentId: number): Observable<ApiMessageResponse> {
      return this.competitions.removeParticipant(competitionId, studentId);
    }

    updateParticipantScore(
      competitionId: number,
      studentId: number,
      payload: UpdateParticipantScorePayload,
    ): Observable<CompetitionParticipant> {
      return this.competitions.updateParticipantScore(competitionId, studentId, payload);
    }

    getCompetitionResults(competitionId: number): Observable<CompetitionResult> {
      return this.competitions.getCompetitionResults(competitionId);
    }

    // ===== Leagues =====
    getLeagues(): Observable<League[]> {
      return this.competitions.getLeagues();
    }

    getActiveLeagues(): Observable<League[]> {
      return this.competitions.getActiveLeagues();
    }

    getLeagueById(id: number): Observable<LeagueDetail> {
      return this.competitions.getLeagueById(id);
    }

    createLeague(payload: CreateLeaguePayload): Observable<League> {
      return this.competitions.createLeague(payload);
    }

    updateLeague(id: number, payload: UpdateLeaguePayload): Observable<League> {
      return this.competitions.updateLeague(id, payload);
    }

    deleteLeague(id: number): Observable<ApiMessageResponse> {
      return this.competitions.deleteLeague(id);
    }

    getLeagueRankings(leagueId: number): Observable<LeagueRanking[]> {
      return this.competitions.getLeagueRankings(leagueId);
    }

    updateLeagueRanking(
      leagueId: number,
      payload: UpdateLeagueRankingPayload,
    ): Observable<LeagueRanking> {
      return this.competitions.updateLeagueRanking(leagueId, payload);
    }
  };
}
