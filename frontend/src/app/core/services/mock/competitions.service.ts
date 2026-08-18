import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MockDataContext } from './mock-data-context';
import {
  Competition,
  CompetitionDetail,
  CompetitionParticipant,
  CompetitionResult,
  League,
  LeagueDetail,
  LeagueRanking,
  CreateCompetitionPayload,
  UpdateCompetitionPayload,
  RegisterParticipantPayload,
  UpdateParticipantScorePayload,
  CreateLeaguePayload,
  UpdateLeaguePayload,
  UpdateLeagueRankingPayload,
  ApiMessageResponse,
} from '../../models/lesson-planner.models';

@Injectable({ providedIn: 'root' })
export class MockCompetitionsService {
  constructor(private ctx: MockDataContext) {}

  getCompetitions(): Observable<Competition[]> {
    return this.ctx.delayed([...this.ctx.competitions]);
  }

  getActiveCompetitions(): Observable<Competition[]> {
    return this.ctx.delayed(this.ctx.competitions.filter((c) => c.status === 'in_progress'));
  }

  getCompetitionById(id: number): Observable<CompetitionDetail> {
    const competition = this.ctx.competitions.find((c) => c.id === id);
    if (!competition) throw new Error('Competition not found');
    return this.ctx.delayed({
      ...competition,
      participants: [...this.ctx.competitionParticipants],
    });
  }

  createCompetition(payload: CreateCompetitionPayload): Observable<Competition> {
    const competition: Competition = {
      id: this.ctx.nextId(this.ctx.competitions),
      title: payload.title,
      description: payload.description,
      type: payload.type,
      startDate: payload.startDate,
      endDate: payload.endDate,
      status: 'in_progress',
      courseId: payload.courseId,
      participantCount: 0,
      createdAt: this.ctx.now(),
    };
    this.ctx.competitions.push(competition);
    return this.ctx.delayed(competition);
  }

  updateCompetition(id: number, payload: UpdateCompetitionPayload): Observable<Competition> {
    const competition = this.ctx.competitions.find((c) => c.id === id);
    if (!competition) throw new Error('Competition not found');
    Object.assign(competition, payload, { updatedAt: this.ctx.now() });
    return this.ctx.delayed(competition);
  }

  deleteCompetition(id: number): Observable<ApiMessageResponse> {
    this.ctx.competitions = this.ctx.competitions.filter((c) => c.id !== id);
    return this.ctx.delayed({ message: 'مسابقه حذف شد' });
  }

  registerParticipant(
    competitionId: number,
    payload: RegisterParticipantPayload,
  ): Observable<CompetitionParticipant> {
    const participant: CompetitionParticipant = {
      id: this.ctx.nextId(this.ctx.competitionParticipants),
      studentId: payload.studentId,
      studentName: '',
      score: 0,
    };
    this.ctx.competitionParticipants.push(participant);
    return this.ctx.delayed(participant);
  }

  removeParticipant(competitionId: number, studentId: number): Observable<ApiMessageResponse> {
    const competition = this.ctx.competitions.find((c) => c.id === competitionId);
    if (competition) {
      this.ctx.competitionParticipants = this.ctx.competitionParticipants.filter(
        (p) => p.studentId !== studentId,
      );
    }
    return this.ctx.delayed({ message: 'شرکت‌کننده حذف شد' });
  }

  updateParticipantScore(
    competitionId: number,
    studentId: number,
    payload: UpdateParticipantScorePayload,
  ): Observable<CompetitionParticipant> {
    const competitionExists = this.ctx.competitions.some((c) => c.id === competitionId);
    const participant = this.ctx.competitionParticipants.find((p) => p.studentId === studentId);
    if (!participant || !competitionExists) throw new Error('Participant not found');
    if (payload.score !== undefined) participant.score = payload.score;
    if (payload.rank !== undefined) participant.rank = payload.rank;
    if (payload.completedAt !== undefined) participant.completedAt = payload.completedAt;
    return this.ctx.delayed(participant);
  }

  getCompetitionResults(competitionId: number): Observable<CompetitionResult> {
    const competition = this.ctx.competitions.find((c) => c.id === competitionId);
    const participants = [...this.ctx.competitionParticipants].sort(
      (a, b) => (b.score ?? 0) - (a.score ?? 0),
    );
    return this.ctx.delayed({
      competitionId,
      competitionTitle: competition?.title ?? '',
      rankings: participants.map((p, index) => ({
        ...p,
        rank: index + 1,
      })),
    });
  }

  getLeagues(): Observable<League[]> {
    return this.ctx.delayed([...this.ctx.leagues]);
  }

  getActiveLeagues(): Observable<League[]> {
    return this.ctx.delayed(this.ctx.leagues.filter((l) => l.status === 'active'));
  }

  getLeagueById(id: number): Observable<LeagueDetail> {
    const league = this.ctx.leagues.find((l) => l.id === id);
    if (!league) throw new Error('League not found');
    return this.ctx.delayed({
      ...league,
      rankings: [...this.ctx.leagueRankings],
    });
  }

  createLeague(payload: CreateLeaguePayload): Observable<League> {
    const league: League = {
      id: this.ctx.nextId(this.ctx.leagues),
      name: payload.name,
      description: payload.description,
      season: payload.season,
      startDate: payload.startDate,
      endDate: payload.endDate,
      status: 'active',
      courseId: payload.courseId,
      participantCount: 0,
      createdAt: this.ctx.now(),
    };
    this.ctx.leagues.push(league);
    return this.ctx.delayed(league);
  }

  updateLeague(id: number, payload: UpdateLeaguePayload): Observable<League> {
    const league = this.ctx.leagues.find((l) => l.id === id);
    if (!league) throw new Error('League not found');
    Object.assign(league, payload, { updatedAt: this.ctx.now() });
    return this.ctx.delayed(league);
  }

  deleteLeague(id: number): Observable<ApiMessageResponse> {
    this.ctx.leagues = this.ctx.leagues.filter((l) => l.id !== id);
    return this.ctx.delayed({ message: 'لیگ حذف شد' });
  }

  getLeagueRankings(leagueId: number): Observable<LeagueRanking[]> {
    return this.ctx.delayed([...this.ctx.leagueRankings]);
  }

  updateLeagueRanking(
    leagueId: number,
    payload: UpdateLeagueRankingPayload,
  ): Observable<LeagueRanking> {
    const existing = this.ctx.leagueRankings.find(
      (r) => this.ctx.leagues.some((l) => l.id === leagueId) && r.studentId === payload.studentId,
    );
    if (existing) {
      existing.score = payload.score;
      existing.previousRank = payload.previousRank;
      existing.trend = payload.trend ?? 'stable';
      existing.lastUpdated = this.ctx.now();
      return this.ctx.delayed(existing);
    }
    const ranking: LeagueRanking = {
      id: this.ctx.nextId(this.ctx.leagueRankings),
      studentId: payload.studentId,
      studentName: '',
      score: payload.score,
      rank: this.ctx.leagueRankings.length + 1,
      previousRank: payload.previousRank,
      trend: payload.trend ?? 'stable',
      lastUpdated: this.ctx.now(),
    };
    this.ctx.leagueRankings.push(ranking);
    return this.ctx.delayed(ranking);
  }
}
