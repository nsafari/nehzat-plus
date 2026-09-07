import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import type {
  CalendarEventDto,
  CreateCalendarEventRequest,
  UpdateCalendarEventRequest,
} from '../../core/models/lesson-planner.models';
import { LESSON_PLANNER_API } from '../../core/services/lesson-planner-api.token';

@Injectable({ providedIn: 'root' })
export class CalendarService {
  private readonly api = inject(LESSON_PLANNER_API);

  getEvents(from: Date, to: Date): Observable<CalendarEventDto[]> {
    return this.api.getEvents(from, to);
  }

  createEvent(req: CreateCalendarEventRequest): Observable<CalendarEventDto> {
    return this.api.createEvent(req);
  }

  updateEvent(id: number, req: UpdateCalendarEventRequest): Observable<CalendarEventDto> {
    return this.api.updateEvent(id, req);
  }

  deleteEvent(id: number): Observable<void> {
    return this.api.deleteEvent(id);
  }

  respondToEvent(id: number, response: 'accepted' | 'declined' | 'tentative'): Observable<void> {
    return this.api.respondToEvent(id, response);
  }
}