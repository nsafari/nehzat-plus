import { Observable } from 'rxjs';

import {
  ApiMessageResponse,
  CreateRingPayload,
  CreateRingBookPayload,
  CreateRingStudentPayload,
  CreateRingTeachingMethodPayload,
  Ring,
  RingDashboardDto,
  RingStudent,
  UpdateRingPayload,
} from '../../models/lesson-planner.models';

export abstract class RingsApi {
  abstract getRings(): Observable<Ring[]>;
  abstract getRingById(id: number): Observable<Ring>;
  abstract createRing(payload: CreateRingPayload): Observable<Ring>;
  abstract updateRing(id: number, payload: UpdateRingPayload): Observable<Ring>;
  abstract deleteRing(id: number): Observable<ApiMessageResponse>;

  // Coach-specific ring endpoints
  abstract getMyRings(): Observable<Ring[]>;
  abstract getMyRingStudents(): Observable<RingStudent[]>;
  abstract getRingDashboard(ringId: number): Observable<RingDashboardDto>;

  abstract getRingStudents(ringId: number): Observable<RingStudent[]>;
  abstract addRingStudent(
    ringId: number,
    payload: CreateRingStudentPayload,
  ): Observable<RingStudent>;
  abstract removeRingStudent(ringId: number, studentId: number): Observable<ApiMessageResponse>;

  abstract addRingBook(
    ringId: number,
    payload: CreateRingBookPayload,
  ): Observable<ApiMessageResponse>;
  abstract removeRingBook(ringId: number, bookId: number): Observable<ApiMessageResponse>;

  abstract addRingTeachingMethod(
    ringId: number,
    payload: CreateRingTeachingMethodPayload,
  ): Observable<ApiMessageResponse>;
  abstract removeRingTeachingMethod(
    ringId: number,
    teachingMethodId: number,
  ): Observable<ApiMessageResponse>;
}
