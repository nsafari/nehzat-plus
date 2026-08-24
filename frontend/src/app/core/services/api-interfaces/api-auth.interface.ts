import { Observable } from 'rxjs';

import {
  ApiMessageResponse,
  AuthSigninPayload,
  AuthSigninResponse,
  AuthSignupPayload,
  AuthSignupResponse,
  Course,
  CreateAssignmentPayload,
  CreateCoursePayload,
  Assignment,
  QrCodeResponse,
  QrPollResponse,
  QrScanConfirm,
} from '../../models/lesson-planner.models';

export abstract class AuthApi {
  abstract signin(payload: AuthSigninPayload): Observable<AuthSigninResponse>;
  abstract signup(payload: AuthSignupPayload | FormData): Observable<AuthSignupResponse>;
  abstract seedDatabase(): Observable<ApiMessageResponse>;
  abstract requestQrCode(payload?: { deviceInfo?: string }): Observable<QrCodeResponse>;
  abstract pollQrStatus(sessionId: string): Observable<QrPollResponse>;
  abstract confirmQrLogin(payload: { sessionId: string; username: string }): Observable<QrScanConfirm>;

  abstract getActiveCourses(): Observable<Course[]>;
  abstract getCourses(): Observable<Course[]>;
  abstract getCourseById(id: number): Observable<Course>;
  abstract createCourse(payload: CreateCoursePayload): Observable<Course>;
  abstract updateCourse(id: number, payload: Partial<CreateCoursePayload>): Observable<Course>;
  abstract deleteCourse(id: number): Observable<ApiMessageResponse>;
  abstract getCourseAssignments(courseId: number): Observable<Assignment[]>;
  abstract createCourseAssignment(
    courseId: number,
    payload: Partial<CreateAssignmentPayload>,
  ): Observable<Assignment>;
}
