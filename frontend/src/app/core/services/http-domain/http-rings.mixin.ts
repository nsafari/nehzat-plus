import { Constructor, HttpServiceContext } from './base';
import { Observable } from 'rxjs';
import {
  ApiMessageResponse,
  CreateRingBookPayload,
  CreateRingPayload,
  CreateRingStudentPayload,
  CreateRingTeachingMethodPayload,
  Ring,
  RingDashboardDto,
  RingStudent,
  UpdateRingPayload,
} from '../../models/lesson-planner.models';

export function WithRings<TBase extends Constructor<HttpServiceContext>>(Base: TBase) {
  return class extends Base {
    getRings(): Observable<Ring[]> {
      return this.http.get<Ring[]>(this.url('/rings'));
    }

    getRingById(id: number): Observable<Ring> {
      return this.http.get<Ring>(this.url(`/rings/${id}`));
    }

    createRing(payload: CreateRingPayload): Observable<Ring> {
      return this.http.post<Ring>(this.url('/rings'), payload);
    }

    updateRing(id: number, payload: UpdateRingPayload): Observable<Ring> {
      return this.http.put<Ring>(this.url(`/rings/${id}`), payload);
    }

    deleteRing(id: number): Observable<ApiMessageResponse> {
      return this.http.delete<ApiMessageResponse>(this.url(`/rings/${id}`));
    }

    getRingStudents(ringId: number): Observable<RingStudent[]> {
      return this.http.get<RingStudent[]>(this.url(`/rings/${ringId}/students`));
    }

    addRingStudent(ringId: number, payload: CreateRingStudentPayload): Observable<RingStudent> {
      return this.http.post<RingStudent>(this.url(`/rings/${ringId}/students`), payload);
    }

    removeRingStudent(ringId: number, studentId: number): Observable<ApiMessageResponse> {
      return this.http.delete<ApiMessageResponse>(
        this.url(`/rings/${ringId}/students/${studentId}`),
      );
    }

    addRingBook(ringId: number, payload: CreateRingBookPayload): Observable<ApiMessageResponse> {
      return this.http.post<ApiMessageResponse>(this.url(`/rings/${ringId}/books`), payload);
    }

    removeRingBook(ringId: number, bookId: number): Observable<ApiMessageResponse> {
      return this.http.delete<ApiMessageResponse>(this.url(`/rings/${ringId}/books/${bookId}`));
    }

    addRingTeachingMethod(
      ringId: number,
      payload: CreateRingTeachingMethodPayload,
    ): Observable<ApiMessageResponse> {
      return this.http.post<ApiMessageResponse>(
        this.url(`/rings/${ringId}/teaching-methods`),
        payload,
      );
    }

    removeRingTeachingMethod(
      ringId: number,
      teachingMethodId: number,
    ): Observable<ApiMessageResponse> {
      return this.http.delete<ApiMessageResponse>(
        this.url(`/rings/${ringId}/teaching-methods/${teachingMethodId}`),
      );
    }

    getMyRings(): Observable<Ring[]> {
      return this.http.get<Ring[]>(this.url('/rings/my'));
    }

    getMyRingStudents(): Observable<RingStudent[]> {
      return this.http.get<RingStudent[]>(this.url('/rings/my/students'));
    }

    getRingDashboard(ringId: number): Observable<RingDashboardDto> {
      return this.http.get<RingDashboardDto>(this.url(`/rings/${ringId}/dashboard`));
    }
  };
}
