import { Observable } from 'rxjs';
import { MockLessonPlannerApiBase, type MockApiCtor } from './mock-lesson-planner-base';
import type {
  CalendarEventDto,
  CreateCalendarEventRequest,
  UpdateCalendarEventRequest,
} from './mock-lesson-planner-models';

export function withCalendar<T extends MockApiCtor>(Base: T) {
  return class extends Base {
    getEvents(from: Date, to: Date): Observable<CalendarEventDto[]> {
      return this.calendar.getEvents(from, to);
    }
    createEvent(req: CreateCalendarEventRequest): Observable<CalendarEventDto> {
      return this.calendar.createEvent(req);
    }
    updateEvent(id: number, req: UpdateCalendarEventRequest): Observable<CalendarEventDto> {
      return this.calendar.updateEvent(id, req);
    }
    deleteEvent(id: number): Observable<void> {
      return this.calendar.deleteEvent(id);
    }
    respondToEvent(id: number, response: 'accepted' | 'declined' | 'tentative'): Observable<void> {
      return this.calendar.respondToEvent(id, response);
    }
  };
}
