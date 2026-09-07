import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FeedbackDto } from '../models/feedback.models';

@Injectable({ providedIn: 'root' })
export class FeedbackService {
  private http = inject(HttpClient);
  private base = '/api/feedback';

  getLatest(courseId?: number): Observable<FeedbackDto | null> {
    const params = courseId ? `?courseId=${courseId}` : '';
    return this.http.get<FeedbackDto | null>(`${this.base}/latest${params}`);
  }

  getRecent(count = 5): Observable<FeedbackDto[]> {
    return this.http.get<FeedbackDto[]>(`${this.base}/recent?count=${count}`);
  }

  getBySubmission(submissionId: number): Observable<FeedbackDto | null> {
    return this.http.get<FeedbackDto | null>(`${this.base}/submission/${submissionId}`);
  }
}
