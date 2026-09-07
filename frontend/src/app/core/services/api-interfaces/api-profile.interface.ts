import { Observable } from 'rxjs';
import {
  ProfileDto,
  UpdateProfileRequest,
  NotificationSettingsDto,
  UpdateNotificationSettingsRequest,
} from '../../models/lesson-planner.models';

export abstract class ProfileApi {
  abstract getProfile(): Observable<ProfileDto>;
  abstract updateProfile(payload: UpdateProfileRequest): Observable<ProfileDto>;
  abstract getNotificationSettings(): Observable<NotificationSettingsDto>;
  abstract updateNotificationSettings(
    payload: UpdateNotificationSettingsRequest,
  ): Observable<NotificationSettingsDto>;
}
