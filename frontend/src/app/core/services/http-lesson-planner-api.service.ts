import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  AuthSignupPayload,
  AuthSignupResponse,
} from '../models/lesson-planner.models';

import { HttpServiceContextBase } from './http-domain/base';
import { WithAuth } from './http-domain/http-auth.mixin';
import { WithStudents } from './http-domain/http-students.mixin';
import { WithAdminUsers } from './http-domain/http-admin-users.mixin';
import { WithAdminResources } from './http-domain/http-admin-resources.mixin';
import { WithAdminAssignments } from './http-domain/http-admin-assignments.mixin';
import { WithRings } from './http-domain/http-rings.mixin';
import { WithAssessments } from './http-domain/http-assessments.mixin';
import { WithSpiritualDaily } from './http-domain/http-spiritual-daily.mixin';
import { WithArtsActivities } from './http-domain/http-arts-activities.mixin';
import { WithSurveys } from './http-domain/http-surveys.mixin';
import { WithQuranHadith } from './http-domain/http-quran-hadith.mixin';
import { WithLiterature } from './http-domain/http-literature.mixin';
import { WithMathSciences } from './http-domain/http-math-sciences.mixin';
import { WithLearningCommunity } from './http-domain/http-learning-community.mixin';
import { WithProfile } from './http-domain/http-profile.mixin';
import { WithMap } from './http-domain/http-map.mixin';
import { WithProgress } from './http-domain/http-progress.mixin';
import { WithNotification } from './http-domain/http-notification.mixin';
import { WithCourierReport } from './http-domain/http-courier-report.mixin';
import { WithEvaluation } from './http-domain/http-evaluation.mixin';
import { WithCalendar } from './http-domain/http-calendar.mixin';
import { WithMessaging } from './http-domain/http-messaging.mixin';
import { WithTeacherGrading } from './http-domain/http-teacher-grading.mixin';
import { WithTraining } from './http-domain/http-training.mixin';
import { WithStudyPath } from './http-domain/http-study-path.mixin';
import { WithVocabulary } from './http-domain/http-vocabulary.mixin';

const HttpMixed = WithVocabulary(
  WithStudyPath(WithTraining(WithTeacherGrading(WithCalendar(
    WithEvaluation(
      WithCourierReport(
        WithNotification(
          WithAuth(
            WithStudents(
              WithAdminUsers(
                WithAdminResources(
                  WithAdminAssignments(
                    WithRings(
                      WithAssessments(
                        WithSpiritualDaily(
                          WithArtsActivities(
                            WithSurveys(
                              WithQuranHadith(
                                WithLiterature(
                                  WithMathSciences(
                                    WithLearningCommunity(
                                      WithMessaging(
                                        WithProgress(
                                          WithMap(
                                            WithProfile(HttpServiceContextBase),
                                          ),
                                        ),
                                      ),
                                    ),
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    ),
  ),
))));

// Helper function to build API URLs
function buildApiUrl(base: string, path: string): string {
  return `${base}${path}`;
}

@Injectable()
export class HttpLessonPlannerApi extends HttpMixed {
  constructor(http: HttpClient) {
    super(http);
  }

  private toSignupBody(payload: AuthSignupPayload | FormData): FormData | Omit<AuthSignupPayload, 'userImage'> {
    if (payload instanceof FormData) {
      return payload;
    }

    if (!payload.userImage) {
      const { userImage: _unused, ...withoutImage } = payload;
      return withoutImage;
    }

    const formData = new FormData();
    formData.set('firstName', payload.firstName);
    formData.set('lastName', payload.lastName);
    formData.set('username', payload.username);
    formData.set('email', payload.email);
    formData.set('phoneNumber', payload.phoneNumber);
    formData.set('password', payload.password);
    formData.set('userImage', payload.userImage);
    return formData;
  }
}