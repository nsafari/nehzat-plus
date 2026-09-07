import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  MaktabDto,
  MaktabMemberDto,
  PaginatedResult,
  MaktabMemberFilter,
  CreateMaktabPayload,
  UpdateMaktabPayload,
  InviteByNationalCodePayload,
  TransferOwnershipPayload,
  InviteCodeResponse,
} from '../models/maktab.models';

@Injectable({ providedIn: 'root' })
export class MaktabService {
  private http = inject(HttpClient);
  private api = '/api/maktabs';

  // ============ CRUD ============
  getAll(): Observable<MaktabDto[]> {
    return this.http.get<MaktabDto[]>(this.api);
  }

  getById(id: number): Observable<MaktabDto> {
    return this.http.get<MaktabDto>(`${this.api}/${id}`);
  }

  create(payload: CreateMaktabPayload): Observable<MaktabDto> {
    return this.http.post<MaktabDto>(this.api, payload);
  }

  update(id: number, payload: UpdateMaktabPayload): Observable<MaktabDto> {
    return this.http.put<MaktabDto>(`${this.api}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }

  // ============ دعوت و عضویت ============
  getInviteCode(id: number): Observable<InviteCodeResponse> {
    return this.http.get<InviteCodeResponse>(`${this.api}/${id}/invite-code`);
  }

  regenerateInviteCode(id: number): Observable<InviteCodeResponse> {
    return this.http.post<InviteCodeResponse>(`${this.api}/${id}/invite-code/regenerate`, {});
  }

  joinByInviteCode(code: string): Observable<MaktabDto> {
    return this.http.post<MaktabDto>(`${this.api}/join`, { inviteCode: code });
  }

  inviteByNationalCode(maktabId: number, payload: InviteByNationalCodePayload): Observable<MaktabMemberDto> {
    return this.http.post<MaktabMemberDto>(`${this.api}/${maktabId}/invite`, payload);
  }

  // ============ مدیریت اعضا ============
  getMembers(maktabId: number, filter: MaktabMemberFilter): Observable<PaginatedResult<MaktabMemberDto>> {
    let params = new HttpParams()
      .set('page', filter.page)
      .set('pageSize', filter.pageSize);
    if (filter.search) params = params.set('search', filter.search);
    if (filter.role) params = params.set('role', filter.role);
    if (filter.status) params = params.set('status', filter.status);
    return this.http.get<PaginatedResult<MaktabMemberDto>>(`${this.api}/${maktabId}/members`, { params });
  }

  changeMemberRole(maktabId: number, targetUserId: number, role: string): Observable<void> {
    return this.http.put<void>(`${this.api}/${maktabId}/members/${targetUserId}/role`, { role });
  }

  removeMember(maktabId: number, targetUserId: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${maktabId}/members/${targetUserId}`);
  }

  leaveMaktab(maktabId: number): Observable<void> {
    return this.http.post<void>(`${this.api}/${maktabId}/leave`, {});
  }

  // ============ مالکیت ============
  transferOwnership(maktabId: number, payload: TransferOwnershipPayload): Observable<void> {
    return this.http.post<void>(`${this.api}/${maktabId}/transfer-ownership`, payload);
  }

  // ============ وضعیت ============
  changeStatus(maktabId: number, status: string): Observable<void> {
    return this.http.patch<void>(`${this.api}/${maktabId}/status`, { status });
  }
}
