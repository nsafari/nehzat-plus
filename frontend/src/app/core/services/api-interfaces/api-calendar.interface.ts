import { Observable } from 'rxjs';
import type {
  CalendarEventDto,
  CreateCalendarEventRequest,
  UpdateCalendarEventRequest,
} from '../../models/lesson-planner.models';

export abstract class CalendarApi {
  abstract getEvents(from: Date, to: Date): Observable<CalendarEventDto[]>;
  abstract createEvent(req: CreateCalendarEventRequest): Observable<CalendarEventDto>;
  abstract updateEvent(id: number, req: UpdateCalendarEventRequest): Observable<CalendarEventDto>;
  abstract deleteEvent(id: number): Observable<void>;
  abstract respondToEvent(
    id: number,
    response: 'accepted' | 'declined' | 'tentative',
  ): Observable<void>;
}
