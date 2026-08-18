import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { LESSON_PLANNER_API } from '../../core/services/lesson-planner-api.token';
import type {
  ProfileDto,
  UpdateProfileRequest,
  NotificationSettingsDto,
  UpdateNotificationSettingsRequest,
} from '../../core/models/lesson-planner.models';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private readonly api = inject(LESSON_PLANNER_API);

  getProfile(): Observable<ProfileDto> {
    return this.api.getProfile();
  }

  updateProfile(payload: UpdateProfileRequest): Observable<ProfileDto> {
    return this.api.updateProfile(payload);
  }

  getNotificationSettings(): Observable<NotificationSettingsDto> {
    return this.api.getNotificationSettings();
  }

  updateNotificationSettings(payload: UpdateNotificationSettingsRequest): Observable<NotificationSettingsDto> {
    return this.api.updateNotificationSettings(payload);
  }
}
