import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  HalghehFullDto,
  CreateHalghehFullDto,
  UpdateHalghehFullDto,
  HalghehMemberDto,
  HalghehMemberFilterDto,
  TransferModeratorDto,
  PaginatedResult,
} from '../models/halgheh.models';

@Injectable({ providedIn: 'root' })
export class HalghehService {
  private http = inject(HttpClient);
  private api = '/api/halghehs';

  getAllByMaktab(maktabId: number): Observable<HalghehFullDto[]> {
    return this.http.get<HalghehFullDto[]>(`${this.api}/maktab/${maktabId}`);
  }

  getById(id: number): Observable<HalghehFullDto> {
    return this.http.get<HalghehFullDto>(`${this.api}/${id}`);
  }

  create(dto: CreateHalghehFullDto): Observable<HalghehFullDto> {
    return this.http.post<HalghehFullDto>(`${this.api}/full`, dto);
  }

  update(id: number, dto: UpdateHalghehFullDto): Observable<HalghehFullDto> {
    return this.http.put<HalghehFullDto>(`${this.api}/${id}/full`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}/full`);
  }

  getMembers(id: number, filter: HalghehMemberFilterDto): Observable<PaginatedResult<HalghehMemberDto>> {
    let params = new HttpParams()
      .set('page', filter.page)
      .set('pageSize', filter.pageSize);
    if (filter.search) params = params.set('search', filter.search);
    if (filter.role) params = params.set('role', filter.role);
    if (filter.status) params = params.set('status', filter.status);
    return this.http.get<PaginatedResult<HalghehMemberDto>>(`${this.api}/${id}/members`, { params });
  }

  join(id: number): Observable<HalghehFullDto> {
    return this.http.post<HalghehFullDto>(`${this.api}/${id}/join`, {});
  }

  leave(id: number): Observable<void> {
    return this.http.post<void>(`${this.api}/${id}/leave`, {});
  }

  removeMember(id: number, targetUserId: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}/members/${targetUserId}`);
  }

  changeMemberRole(id: number, targetUserId: number, role: string): Observable<void> {
    return this.http.put<void>(`${this.api}/${id}/members/${targetUserId}/role`, { role });
  }

  transferModerator(id: number, dto: TransferModeratorDto): Observable<void> {
    return this.http.post<void>(`${this.api}/${id}/transfer`, dto);
  }

  changeStatus(id: number, status: string): Observable<void> {
    return this.http.patch<void>(`${this.api}/${id}/status`, { status });
  }
}
