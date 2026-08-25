import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  QuranRingDto,
  CreateQuranRingRequest,
  UpdateQuranRingRequest,
  QuranRingFilterDto,
  QuranRingSessionDto,
  CreateQuranRingSessionRequest,
  UpdateQuranRingSessionRequest,
  SessionFilterDto,
  QuranSessionStepDto,
  CreateQuranSessionStepRequest,
  StudentQuranSessionProgressDto,
  StudentProgressFilterDto,
  StartSessionRequest,
  UpdateSessionProgressRequest,
  StudentStepProgressDto,
  UpdateStepProgressRequest,
  StudentSpeedCategoryDto,
  UpdateSpeedCategoryRequest,
  TadabborEntryDto,
  TadabborFilterDto,
  CreateTadabborEntryRequest,
  UpdateTadabborEntryRequest,
  QuranAssetEvaluationDto,
  EvaluationFilterDto,
  CreateAssetEvaluationRequest,
  CoachInterviewDto,
  InterviewFilterDto,
  CreateCoachInterviewRequest,
  StudentInterviewDto,
  CreateStudentInterviewRequest,
  QuranRingSurahDto,
  CreateQuranRingSurahRequest,
  QuranRingResourceDto,
  CreateQuranRingResourceRequest,
  QuranRingDashboardDto,
} from '../models/quran-ring.models';
import { ApiMessageResponse } from '../models/lesson-planner.models';

@Injectable({ providedIn: 'root' })
export class QuranRingService {
  constructor(private http: HttpClient) {}

  // ==================== Rings ====================

  getAllRings(filter?: QuranRingFilterDto): Observable<QuranRingDto[]> {
    const params = new URLSearchParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.set(key, String(value));
        }
      });
    }
    return this.http.get<QuranRingDto[]>(`/api/quran-rings?${params.toString()}`);
  }

  getRingById(id: number): Observable<QuranRingDto | null> {
    return this.http.get<QuranRingDto>(`/api/quran-rings/${id}`);
  }

  getRingByCode(code: string): Observable<QuranRingDto | null> {
    return this.http.get<QuranRingDto>(`/api/quran-rings/by-code/${code}`);
  }

  createRing(request: CreateQuranRingRequest): Observable<QuranRingDto> {
    return this.http.post<QuranRingDto>('/api/quran-rings', request);
  }

  updateRing(id: number, request: UpdateQuranRingRequest): Observable<QuranRingDto> {
    return this.http.put<QuranRingDto>(`/api/quran-rings/${id}`, request);
  }

  deleteRing(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`/api/quran-rings/${id}`);
  }

  // ==================== Sessions ====================

  getSessions(filter?: SessionFilterDto): Observable<QuranRingSessionDto[]> {
    const params = new URLSearchParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.set(key, String(value));
        }
      });
    }
    return this.http.get<QuranRingSessionDto[]>(`/api/quran-rings/sessions?${params.toString()}`);
  }

  getSessionById(id: number): Observable<QuranRingSessionDto | null> {
    return this.http.get<QuranRingSessionDto>(`/api/quran-rings/sessions/${id}`);
  }

  createSession(request: CreateQuranRingSessionRequest): Observable<QuranRingSessionDto> {
    return this.http.post<QuranRingSessionDto>('/api/quran-rings/sessions', request);
  }

  updateSession(id: number, request: UpdateQuranRingSessionRequest): Observable<QuranRingSessionDto> {
    return this.http.put<QuranRingSessionDto>(`/api/quran-rings/sessions/${id}`, request);
  }

  deleteSession(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`/api/quran-rings/sessions/${id}`);
  }

  getSessionsByRing(ringId: number): Observable<QuranRingSessionDto[]> {
    return this.http.get<QuranRingSessionDto[]>(`/api/quran-rings/${ringId}/sessions`);
  }

  // ==================== Session Steps ====================

  createStep(request: CreateQuranSessionStepRequest): Observable<QuranSessionStepDto> {
    return this.http.post<QuranSessionStepDto>('/api/quran-rings/steps', request);
  }

  updateStep(id: number, request: CreateQuranSessionStepRequest): Observable<QuranSessionStepDto> {
    return this.http.put<QuranSessionStepDto>(`/api/quran-rings/steps/${id}`, request);
  }

  deleteStep(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`/api/quran-rings/steps/${id}`);
  }

  // ==================== Student Progress ====================

  getStudentProgress(filter?: StudentProgressFilterDto): Observable<StudentQuranSessionProgressDto[]> {
    const params = new URLSearchParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.set(key, String(value));
        }
      });
    }
    return this.http.get<StudentQuranSessionProgressDto[]>(`/api/quran-rings/progress?${params.toString()}`);
  }

  getStudentProgressById(id: number): Observable<StudentQuranSessionProgressDto | null> {
    return this.http.get<StudentQuranSessionProgressDto>(`/api/quran-rings/progress/${id}`);
  }

  startSession(request: StartSessionRequest): Observable<StudentQuranSessionProgressDto> {
    return this.http.post<StudentQuranSessionProgressDto>('/api/quran-rings/progress/start', request);
  }

  updateSessionProgress(id: number, request: UpdateSessionProgressRequest): Observable<StudentQuranSessionProgressDto> {
    return this.http.put<StudentQuranSessionProgressDto>(`/api/quran-rings/progress/${id}`, request);
  }

  updateStepProgress(id: number, request: UpdateStepProgressRequest): Observable<StudentStepProgressDto> {
    return this.http.put<StudentStepProgressDto>(`/api/quran-rings/progress/steps/${id}`, request);
  }

  completeSession(id: number, assessmentScore?: number): Observable<StudentQuranSessionProgressDto> {
    return this.http.put<StudentQuranSessionProgressDto>(`/api/quran-rings/progress/${id}/complete`, { assessmentScore });
  }

  // ==================== Speed Categories ====================

  getStudentSpeedCategory(studentId: number, ringId: number): Observable<StudentSpeedCategoryDto | null> {
    return this.http.get<StudentSpeedCategoryDto>(`/api/quran-rings/students/${studentId}/speed-category?ringId=${ringId}`);
  }

  updateSpeedCategory(studentId: number, ringId: number, request: UpdateSpeedCategoryRequest): Observable<StudentSpeedCategoryDto> {
    return this.http.put<StudentSpeedCategoryDto>(`/api/quran-rings/students/${studentId}/speed-category?ringId=${ringId}`, request);
  }

  calculateSpeedCategory(studentId: number, ringId: number): Observable<StudentSpeedCategoryDto> {
    return this.http.post<StudentSpeedCategoryDto>(`/api/quran-rings/students/${studentId}/speed-category/calculate?ringId=${ringId}`, {});
  }

  getStudentsBySpeedCategory(category: string, ringId?: number): Observable<StudentSpeedCategoryDto[]> {
    const params = new URLSearchParams();
    if (ringId) params.set('ringId', String(ringId));
    return this.http.get<StudentSpeedCategoryDto[]>(`/api/quran-rings/speed-category/${category}?${params.toString()}`);
  }

  // ==================== Tadabbor ====================

  getTadabborEntries(filter?: TadabborFilterDto): Observable<TadabborEntryDto[]> {
    const params = new URLSearchParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.set(key, String(value));
        }
      });
    }
    return this.http.get<TadabborEntryDto[]>(`/api/quran-rings/tadabbor?${params.toString()}`);
  }

  getTadabborEntryById(id: number): Observable<TadabborEntryDto | null> {
    return this.http.get<TadabborEntryDto>(`/api/quran-rings/tadabbor/${id}`);
  }

  createTadabborEntry(request: CreateTadabborEntryRequest): Observable<TadabborEntryDto> {
    return this.http.post<TadabborEntryDto>('/api/quran-rings/tadabbor', request);
  }

  updateTadabborEntry(id: number, request: UpdateTadabborEntryRequest): Observable<TadabborEntryDto> {
    return this.http.put<TadabborEntryDto>(`/api/quran-rings/tadabbor/${id}`, request);
  }

  deleteTadabborEntry(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`/api/quran-rings/tadabbor/${id}`);
  }

  // ==================== Asset Evaluation ====================

  getAssetEvaluations(filter?: EvaluationFilterDto): Observable<QuranAssetEvaluationDto[]> {
    const params = new URLSearchParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.set(key, String(value));
        }
      });
    }
    return this.http.get<QuranAssetEvaluationDto[]>(`/api/quran-rings/evaluations?${params.toString()}`);
  }

  getAssetEvaluationById(id: number): Observable<QuranAssetEvaluationDto | null> {
    return this.http.get<QuranAssetEvaluationDto>(`/api/quran-rings/evaluations/${id}`);
  }

  createAssetEvaluation(request: CreateAssetEvaluationRequest): Observable<QuranAssetEvaluationDto> {
    return this.http.post<QuranAssetEvaluationDto>('/api/quran-rings/evaluations', request);
  }

  getLatestEvaluation(studentId: number, ringId: number): Observable<QuranAssetEvaluationDto | null> {
    return this.http.get<QuranAssetEvaluationDto>(`/api/quran-rings/evaluations/latest?studentId=${studentId}&ringId=${ringId}`);
  }

  // ==================== Coach Interview ====================

  getCoachInterviews(filter?: InterviewFilterDto): Observable<CoachInterviewDto[]> {
    const params = new URLSearchParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.set(key, String(value));
        }
      });
    }
    return this.http.get<CoachInterviewDto[]>(`/api/quran-rings/coach-interviews?${params.toString()}`);
  }

  getCoachInterviewById(id: number): Observable<CoachInterviewDto | null> {
    return this.http.get<CoachInterviewDto>(`/api/quran-rings/coach-interviews/${id}`);
  }

  createCoachInterview(request: CreateCoachInterviewRequest): Observable<CoachInterviewDto> {
    return this.http.post<CoachInterviewDto>('/api/quran-rings/coach-interviews', request);
  }

  // ==================== Student Interview ====================

  getStudentInterviews(filter?: InterviewFilterDto): Observable<StudentInterviewDto[]> {
    const params = new URLSearchParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.set(key, String(value));
        }
      });
    }
    return this.http.get<StudentInterviewDto[]>(`/api/quran-rings/student-interviews?${params.toString()}`);
  }

  getStudentInterviewById(id: number): Observable<StudentInterviewDto | null> {
    return this.http.get<StudentInterviewDto>(`/api/quran-rings/student-interviews/${id}`);
  }

  createStudentInterview(request: CreateStudentInterviewRequest): Observable<StudentInterviewDto> {
    return this.http.post<StudentInterviewDto>('/api/quran-rings/student-interviews', request);
  }

  // ==================== Ring Surahs ====================

  getRingSurahs(ringId: number): Observable<QuranRingSurahDto[]> {
    return this.http.get<QuranRingSurahDto[]>(`/api/quran-rings/${ringId}/surahs`);
  }

  createRingSurah(request: CreateQuranRingSurahRequest): Observable<QuranRingSurahDto> {
    return this.http.post<QuranRingSurahDto>('/api/quran-rings/surahs', request);
  }

  deleteRingSurah(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`/api/quran-rings/surahs/${id}`);
  }

  // ==================== Ring Resources ====================

  getRingResources(ringId: number): Observable<QuranRingResourceDto[]> {
    return this.http.get<QuranRingResourceDto[]>(`/api/quran-rings/${ringId}/resources`);
  }

  createRingResource(request: CreateQuranRingResourceRequest): Observable<QuranRingResourceDto> {
    return this.http.post<QuranRingResourceDto>('/api/quran-rings/resources', request);
  }

  deleteRingResource(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`/api/quran-rings/resources/${id}`);
  }

  // ==================== Dashboard ====================

  getDashboard(ringId?: number): Observable<QuranRingDashboardDto> {
    const params = ringId ? `?ringId=${ringId}` : '';
    return this.http.get<QuranRingDashboardDto>(`/api/quran-rings/dashboard${params}`);
  }
}