import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CalendarService } from '../calendar.service';
import { NotificationService } from '../../../core/services/notification.service';
import type {
  CalendarAttendeeDto,
  CalendarEventDto,
  CalendarEventType,
  CreateCalendarEventRequest,
} from '../../../core/models/lesson-planner.models';

const WEEKDAY_LABELS = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'];

const TYPE_LABELS: Record<CalendarEventType, string> = {
  personal: 'شخصی',
  work: 'اداری',
  holiday: 'تعطیل',
  session: 'جلسه',
  exam: 'امتحان',
};

const RESPONSE_LABELS: Record<CalendarAttendeeDto['responseStatus'], string> = {
  accepted: 'پذیرفته',
  declined: 'رد شده',
  tentative: 'نامطمئن',
  pending: 'در انتظار',
};

interface FormState {
  title: string;
  description: string;
  type: CalendarEventType;
  color: string;
  allDay: boolean;
  location: string;
  isPublic: boolean;
  start: string;
  end: string;
}

const emptyForm = (): FormState => ({
  title: '',
  description: '',
  type: 'personal',
  color: '#4f46e5',
  allDay: false,
  location: '',
  isPublic: true,
  start: '',
  end: '',
});

@Component({
  selector: 'app-calendar-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './calendar-page.component.html',
  styleUrls: ['./calendar-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarPageComponent implements OnInit {
  private readonly calendar = inject(CalendarService);
  private readonly notify = inject(NotificationService);
  private readonly destroyRef = inject(DestroyRef);

  readonly typeLabels = TYPE_LABELS;
  readonly responseLabels = RESPONSE_LABELS;
  readonly weekdayLabels = WEEKDAY_LABELS;
  readonly types: Array<CalendarEventType | 'all'> = ['all', 'personal', 'work', 'holiday', 'session', 'exam'];

  month = signal<Date>(this.firstOfMonth(new Date()));
  events = signal<CalendarEventDto[]>([]);
  loading = signal(true);
  typeFilter = signal<CalendarEventType | 'all'>('all');
  selectedDay = signal<Date | null>(null);
  formOpen = signal(false);
  editingId = signal<number | null>(null);
  form = signal<FormState>(emptyForm());

  readonly monthLabel = computed(() =>
    this.month().toLocaleDateString('fa-IR', { year: 'numeric', month: 'long' }),
  );

  readonly gridCells = computed<Array<{ day: Date | null; events: CalendarEventDto[] }>>(() => {
    const m = this.month();
    const first = new Date(m.getFullYear(), m.getMonth(), 1);
    const daysInMonth = new Date(m.getFullYear(), m.getMonth() + 1, 0).getDate();
    const cells: Array<{ day: Date | null; events: CalendarEventDto[] }> = [];
    for (let i = 0; i < first.getDay(); i++) {
      cells.push({ day: null, events: [] });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const day = new Date(m.getFullYear(), m.getMonth(), d);
      cells.push({ day, events: this.eventsFor(day) });
    }
    return cells;
  });

  readonly selectedDayEvents = computed<CalendarEventDto[]>(() => {
    const day = this.selectedDay();
    return day ? this.eventsFor(day) : [];
  });

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    const m = this.month();
    const from = new Date(m.getFullYear(), m.getMonth(), 1);
    const to = new Date(m.getFullYear(), m.getMonth() + 1, 0, 23, 59, 59);
    this.loading.set(true);
    this.calendar
      .getEvents(from, to)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (evs) => {
          this.events.set(evs);
          this.loading.set(false);
        },
        error: () => {
          this.notify.show('خطا در بارگذاری رویدادها', 'error');
          this.loading.set(false);
        },
      });
  }

  prevMonth(): void {
    this.month.update((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1));
    this.selectedDay.set(null);
    this.loadEvents();
  }

  nextMonth(): void {
    this.month.update((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1));
    this.selectedDay.set(null);
    this.loadEvents();
  }

  today(): void {
    this.month.set(this.firstOfMonth(new Date()));
    this.selectedDay.set(null);
    this.loadEvents();
  }

  selectDay(day: Date): void {
    this.selectedDay.set(day);
  }

  openCreate(day: Date): void {
    const start = this.toLocalInput(day);
    const end = this.toLocalInput(day);
    this.form.set({ ...emptyForm(), start, end });
    this.editingId.set(null);
    this.formOpen.set(true);
  }

  openEdit(ev: CalendarEventDto): void {
    this.form.set({
      title: ev.title,
      description: ev.description ?? '',
      type: ev.type,
      color: ev.color,
      allDay: ev.allDay,
      location: ev.location ?? '',
      isPublic: ev.isPublic,
      start: this.toLocalInput(new Date(ev.start)),
      end: this.toLocalInput(new Date(ev.end)),
    });
    this.editingId.set(ev.id);
    this.formOpen.set(true);
  }

  closeForm(): void {
    this.formOpen.set(false);
    this.editingId.set(null);
  }

  saveForm(): void {
    const f = this.form();
    if (!f.title.trim()) {
      this.notify.show('عنوان رویداد را وارد کنید', 'error');
      return;
    }
    const start = new Date(f.start);
    const end = f.allDay ? new Date(start) : new Date(f.end);
    if (!f.allDay && end.getTime() <= start.getTime()) {
      this.notify.show('زمان پایان باید بعد از شروع باشد', 'error');
      return;
    }
    const req: CreateCalendarEventRequest = {
      title: f.title.trim(),
      description: f.description.trim() || undefined,
      start: start.toISOString(),
      end: end.toISOString(),
      allDay: f.allDay,
      type: f.type,
      color: f.color,
      location: f.location.trim() || undefined,
      isPublic: f.isPublic,
    };
    const editingId = this.editingId();
    const op = editingId === null
      ? this.calendar.createEvent(req)
      : this.calendar.updateEvent(editingId, req);
    op.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.notify.show('رویداد ذخیره شد', 'success');
        this.closeForm();
        this.loadEvents();
      },
      error: () => this.notify.show('خطا در ذخیره رویداد', 'error'),
    });
  }

  deleteEvent(ev: CalendarEventDto): void {
    this.calendar
      .deleteEvent(ev.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.notify.show('رویداد حذف شد', 'success');
          this.loadEvents();
        },
        error: () => this.notify.show('خطا در حذف رویداد', 'error'),
      });
  }

  respond(ev: CalendarEventDto, status: 'accepted' | 'declined' | 'tentative'): void {
    this.calendar
      .respondToEvent(ev.id, status)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.notify.show('پاسخ شما ثبت شد', 'success');
          this.loadEvents();
        },
        error: () => this.notify.show('خطا در ثبت پاسخ', 'error'),
      });
  }

  hasPendingAttendees(ev: CalendarEventDto): boolean {
    return ev.attendees.some((a) => a.responseStatus === 'pending');
  }

  formatTime(iso: string): string {
    return new Date(iso).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
  }

  trackByEventId = (_: number, ev: CalendarEventDto): number => ev.id;

  trackByDay = (_: number, cell: { day: Date | null }): number => (cell.day ? cell.day.getTime() : -1);

  isSameDay(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  }

  isToday(day: Date): boolean {
    return this.isSameDay(day, new Date());
  }

  dayLabel(date: Date): string {
    return date.toLocaleDateString('fa-IR', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  onAllDayChange(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.form.update((f) => ({ ...f, allDay: checked }));
  }

  onPublicChange(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.form.update((f) => ({ ...f, isPublic: checked }));
  }

  private eventsFor(day: Date): CalendarEventDto[] {
    const filter = this.typeFilter();
    return this.events().filter((ev) => {
      const d = new Date(ev.start);
      const sameDay = d.getFullYear() === day.getFullYear() && d.getMonth() === day.getMonth() && d.getDate() === day.getDate();
      return sameDay && (filter === 'all' || ev.type === filter);
    });
  }

  private firstOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  private toLocalInput(date: Date): string {
    const pad = (n: number): string => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }
}