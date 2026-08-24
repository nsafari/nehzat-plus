import { Constructor, HttpServiceContext } from './base';
import { Observable } from 'rxjs';
import {
  ApiMessageResponse,
  Assignment,
  AuthSigninPayload,
  AuthSigninResponse,
  AuthSignupPayload,
  AuthSignupResponse,
  Course,
  CreateAssignmentPayload,
  CreateCoursePayload,
  QrCodeResponse,
  QrPollResponse,
  QrScanConfirm,
} from '../../models/lesson-planner.models';

export function WithAuth<TBase extends Constructor<HttpServiceContext>>(Base: TBase) {
  return class extends Base {
    signin(payload: AuthSigninPayload): Observable<AuthSigninResponse> {
      return this.http.post<AuthSigninResponse>(this.url('/auth/signin'), payload);
    }

    signup(payload: AuthSignupPayload | FormData): Observable<AuthSignupResponse> {
      return this.http.post<AuthSignupResponse>(
        this.url('/auth/signup'),
        (this as any).toSignupBody(payload),
      );
    }

    seedDatabase(): Observable<ApiMessageResponse> {
      return this.http.post<ApiMessageResponse>(this.url('/seeder/seed'), {});
    }

    getActiveCourses(): Observable<Course[]> {
      return this.http.get<Course[]>(this.url('/courses/active'));
    }

    getCourses(): Observable<Course[]> {
      return this.http.get<Course[]>(this.url('/courses'));
    }

    getCourseById(id: number): Observable<Course> {
      return this.http.get<Course>(this.url(`/courses/${id}`));
    }

    createCourse(payload: CreateCoursePayload): Observable<Course> {
      return this.http.post<Course>(this.url('/courses'), payload);
    }

    updateCourse(id: number, payload: Partial<CreateCoursePayload>): Observable<Course> {
      return this.http.put<Course>(this.url(`/courses/${id}`), payload);
    }

    deleteCourse(id: number): Observable<ApiMessageResponse> {
      return this.http.delete<ApiMessageResponse>(this.url(`/courses/${id}`));
    }

    getCourseAssignments(courseId: number): Observable<Assignment[]> {
      return this.http.get<Assignment[]>(this.url(`/courses/${courseId}/assignments`));
    }

    createCourseAssignment(
      courseId: number,
      payload: Partial<CreateAssignmentPayload>,
    ): Observable<Assignment> {
      return this.http.post<Assignment>(this.url(`/courses/${courseId}/assignments`), payload);
    }

    requestQrCode(payload?: { deviceInfo?: string }): Observable<QrCodeResponse> {
      return this.http.post<QrCodeResponse>(this.url('/auth/qr/generate'), payload);
    }

    pollQrStatus(sessionId: string): Observable<QrPollResponse> {
      return this.http.get<QrPollResponse>(this.url(`/auth/qr/poll?sessionId=${sessionId}`));
    }

    confirmQrScan(payload: { sessionId: string; username: string }): Observable<QrScanConfirm> {
      return this.http.post<QrScanConfirm>(this.url('/auth/qr/scan'), payload);
    }
  };
}
