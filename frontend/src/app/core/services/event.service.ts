import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface EventDetailDto {
  id: number;
  title: string;
  description?: string;
  eventType: string;
  location?: string;
  isOnline: boolean;
  onlineLink?: string;
  startAt: string;
  endAt?: string;
  capacity?: number | null;
  requiresRegistration: boolean;
  createdAt?: string;
}

export interface UpsertEventPayload {
  title: string;
  description?: string;
  eventType: string;
  location?: string;
  isOnline: boolean;
  onlineLink?: string;
  startAt: string;
  endAt?: string;
  capacity?: number | null;
  requiresRegistration: boolean;
  submitForApproval?: boolean;
}

@Injectable({ providedIn: 'root' })
export class EventService {
  private http = inject(HttpClient);
  private baseUrl = '/api/events';

  getEvent(id: number): Observable<EventDetailDto> {
    return this.http.get<EventDetailDto>(`${this.baseUrl}/${id}`);
  }

  createEvent(payload: UpsertEventPayload): Observable<EventDetailDto> {
    return this.http.post<EventDetailDto>(this.baseUrl, payload);
  }

  updateEvent(id: number, payload: UpsertEventPayload): Observable<EventDetailDto> {
    return this.http.put<EventDetailDto>(`${this.baseUrl}/${id}`, payload);
  }
}