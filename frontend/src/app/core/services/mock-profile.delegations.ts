import { Observable } from 'rxjs';
import { MockLessonPlannerApiBase, type MockApiCtor } from './mock-lesson-planner-base';
import type {
  ProfileDto,
  UpdateProfileRequest,
  NotificationSettingsDto,
  UpdateNotificationSettingsRequest,
} from './mock-lesson-planner-models';

export function withProfile<T extends MockApiCtor>(Base: T) {
  return class extends Base {
    getProfile(): Observable<ProfileDto> {
      return this.profile.getProfile();
    }

    updateProfile(payload: UpdateProfileRequest): Observable<ProfileDto> {
      return this.profile.updateProfile(payload);
    }

    getNotificationSettings(): Observable<NotificationSettingsDto> {
      return this.profile.getNotificationSettings();
    }

    updateNotificationSettings(
      payload: UpdateNotificationSettingsRequest,
    ): Observable<NotificationSettingsDto> {
      return this.profile.updateNotificationSettings(payload);
    }
  };
}
