import { Observable } from 'rxjs';
import type {
  CalendarEventDto,
  CreateCalendarEventRequest,
  UpdateCalendarEventRequest,
} from '../../models/lesson-planner.models';
import type { Constructor, HttpServiceContext } from './base';

export function WithCalendar<TBase extends Constructor<HttpServiceContext>>(Base: TBase) {
  return class extends Base {
    getEvents(from: Date, to: Date): Observable<CalendarEventDto[]> {
      const params = new URLSearchParams({ from: from.toISOString(), to: to.toISOString() });
      return this.http.get<CalendarEventDto[]>(
        this.url(`/api/calendar/events?${params.toString()}`),
      );
    }

    createEvent(req: CreateCalendarEventRequest): Observable<CalendarEventDto> {
      return this.http.post<CalendarEventDto>(this.url('/api/calendar/events'), req);
    }

    updateEvent(id: number, req: UpdateCalendarEventRequest): Observable<CalendarEventDto> {
      return this.http.put<CalendarEventDto>(this.url(`/api/calendar/events/${id}`), req);
    }

    deleteEvent(id: number): Observable<void> {
      return this.http.delete<void>(this.url(`/api/calendar/events/${id}`));
    }

    respondToEvent(id: number, response: 'accepted' | 'declined' | 'tentative'): Observable<void> {
      return this.http.post<void>(this.url(`/api/calendar/events/${id}/respond`), response);
    }
  };
}
