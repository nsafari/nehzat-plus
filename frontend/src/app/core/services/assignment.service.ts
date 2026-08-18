import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginatedResult } from '../models/paginated-result.model';
import {
  AssignmentDto, AssignmentSubmissionDto,
  CreateAssignmentPayload, UpdateAssignmentPayload,
  SubmitAssignmentPayload, ReviewSubmissionPayload
} from '../models/assignment.models';

@Injectable({ providedIn: 'root' })
export class AssignmentService {
  private http = inject(HttpClient);
  private base = '/api';

  // ---------- Assignment ----------

  getByHalgheh(halghehId: number, page = 1, pageSize = 20): Observable<PaginatedResult<AssignmentDto>> {
    const params = new HttpParams().set('page', page).set('pageSize', pageSize);
    return this.http.get<PaginatedResult<AssignmentDto>>(
      `${this.base}/halghehs/${halghehId}/assignments`, { params }
    );
  }

  getById(halghehId: number, id: number): Observable<AssignmentDto> {
    return this.http.get<AssignmentDto>(`${this.base}/halghehs/${halghehId}/assignments/${id}`);
  }

  create(halghehId: number, payload: CreateAssignmentPayload): Observable<AssignmentDto> {
    return this.http.post<AssignmentDto>(`${this.base}/halghehs/${halghehId}/assignments`, payload);
  }

  update(halghehId: number, id: number, payload: UpdateAssignmentPayload): Observable<AssignmentDto> {
    return this.http.put<AssignmentDto>(`${this.base}/halghehs/${halghehId}/assignments/${id}`, payload);
  }

  delete(halghehId: number, id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/halghehs/${halghehId}/assignments/${id}`);
  }

  // ---------- Submission ----------

  getSubmissions(halghehId: number, assignmentId: number): Observable<AssignmentSubmissionDto[]> {
    return this.http.get<AssignmentSubmissionDto[]>(
      `${this.base}/halghehs/${halghehId}/assignments/${assignmentId}/submissions`
    );
  }

  submit(halghehId: number, assignmentId: number, payload: SubmitAssignmentPayload): Observable<AssignmentSubmissionDto> {
    return this.http.post<AssignmentSubmissionDto>(
      `${this.base}/halghehs/${halghehId}/assignments/${assignmentId}/submit`, payload
    );
  }

  review(submissionId: number, payload: ReviewSubmissionPayload): Observable<AssignmentSubmissionDto> {
    return this.http.put<AssignmentSubmissionDto>(`${this.base}/submissions/${submissionId}/review`, payload);
  }
}
