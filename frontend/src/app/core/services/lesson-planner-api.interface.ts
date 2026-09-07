// Domain interface re-exports — each file contains abstract methods for a feature area.
// The LessonPlannerApi abstract class below composes all of them as a mixin chain,
// providing both a runtime base class value and a type with all abstract method signatures.

export { AuthApi } from './api-interfaces/api-auth.interface';
export { StudentsApi } from './api-interfaces/api-students.interface';
export { AdminUsersApi } from './api-interfaces/api-admin-users.interface';
export { AdminResourcesApi } from './api-interfaces/api-admin-resources.interface';
export { AdminAssignmentsApi } from './api-interfaces/api-admin-assignments.interface';
export { RingsApi } from './api-interfaces/api-rings.interface';
export { AssessmentsApi } from './api-interfaces/api-assessments.interface';
export { SpiritualDailyApi } from './api-interfaces/api-spiritual-daily.interface';
export { ArtsActivitiesApi } from './api-interfaces/api-arts-activities.interface';
export { SurveysApi } from './api-interfaces/api-surveys.interface';
export { QuranHadithApi } from './api-interfaces/api-quran-hadith.interface';
export { LiteratureApi } from './api-interfaces/api-literature.interface';
export { MathSciencesApi } from './api-interfaces/api-math-sciences.interface';
export { LearningCommunityApi } from './api-interfaces/api-learning-community.interface';
export { TeacherGradingApi } from './api-interfaces/api-teacher-grading.interface';
export { ProfileApi } from './api-interfaces/api-profile.interface';
export { MapApi } from './api-interfaces/api-map.interface';
export { EvaluationApi } from './api-interfaces/api-evaluation.interface';
export { ProgressApi } from './api-interfaces/api-progress.interface';
export { NotificationApi } from './api-interfaces/api-notification.interface';
export { MessagingApi } from './api-interfaces/api-messaging.interface';
export { CalendarApi } from './api-interfaces/api-calendar.interface';
export { CourierReportApi } from './api-interfaces/api-courier-report.interface';
export { TrainingApi } from './api-interfaces/api-training.interface';
export { EducationalProcessApi } from './api-interfaces/api-educational-process.interface';
export { StudyPathApi } from './api-interfaces/api-study-path.interface';
export type { VocabularyApi } from './api-interfaces/api-vocabulary.interface';

// Mixin composition: the abstract class is the runtime base value passed to the
// HTTP mixin chain (WithLearningCommunity(LessonPlannerApi) etc.).  It declares
// abstract http/url so the mixin constraint Constructor<HttpServiceContext> is satisfied.
// The interface composes every domain's abstract method signatures via interface extends.
import { Observable } from 'rxjs';
import type { AssignmentGrading, GradeSubmissionRequest } from '../models/lesson-planner.models';
import type { AuthApi } from './api-interfaces/api-auth.interface';
import type { StudentsApi } from './api-interfaces/api-students.interface';
import type { AdminUsersApi } from './api-interfaces/api-admin-users.interface';
import type { AdminResourcesApi } from './api-interfaces/api-admin-resources.interface';
import type { AdminAssignmentsApi } from './api-interfaces/api-admin-assignments.interface';
import type { RingsApi } from './api-interfaces/api-rings.interface';
import type { AssessmentsApi } from './api-interfaces/api-assessments.interface';
import type { SpiritualDailyApi } from './api-interfaces/api-spiritual-daily.interface';
import type { ArtsActivitiesApi } from './api-interfaces/api-arts-activities.interface';
import type { SurveysApi } from './api-interfaces/api-surveys.interface';
import type { QuranHadithApi } from './api-interfaces/api-quran-hadith.interface';
import type { LiteratureApi } from './api-interfaces/api-literature.interface';
import type { MathSciencesApi } from './api-interfaces/api-math-sciences.interface';
import type { LearningCommunityApi } from './api-interfaces/api-learning-community.interface';
import type { TeacherGradingApi } from './api-interfaces/api-teacher-grading.interface';
import type { ProfileApi } from './api-interfaces/api-profile.interface';
import type { MapApi } from './api-interfaces/api-map.interface';
import type { EvaluationApi } from './api-interfaces/api-evaluation.interface';
import type { ProgressApi } from './api-interfaces/api-progress.interface';
import type { NotificationApi } from './api-interfaces/api-notification.interface';
import type { MessagingApi } from './api-interfaces/api-messaging.interface';
import type { CalendarApi } from './api-interfaces/api-calendar.interface';
import type { CourierReportApi } from './api-interfaces/api-courier-report.interface';
import type { TrainingApi } from './api-interfaces/api-training.interface';
import type { EducationalProcessApi } from './api-interfaces/api-educational-process.interface';
import type { StudyPathApi } from './api-interfaces/api-study-path.interface';
import type { VocabularyApi } from './api-interfaces/api-vocabulary.interface';

export abstract class LessonPlannerApi {
  abstract getTeacherGradings(teacherId: number): Observable<AssignmentGrading[]>;
  abstract getPendingGradings(teacherId: number): Observable<AssignmentGrading[]>;
  abstract gradeSubmission(payload: GradeSubmissionRequest): Observable<AssignmentGrading>;
  // Allow dynamic method access for sub-API methods not yet declared here.
  // Each sub-API's methods are implemented by the HTTP/Mock mixins at runtime.
  [key: string]: any;
}

export interface LessonPlannerApi
  extends
    AuthApi,
    StudentsApi,
    AdminUsersApi,
    AdminResourcesApi,
    AdminAssignmentsApi,
    RingsApi,
    AssessmentsApi,
    SpiritualDailyApi,
    ArtsActivitiesApi,
    SurveysApi,
    QuranHadithApi,
    LiteratureApi,
    MathSciencesApi,
    LearningCommunityApi,
    TeacherGradingApi,
    ProfileApi,
    MapApi,
    EvaluationApi,
    ProgressApi,
    NotificationApi,
    MessagingApi,
    CalendarApi,
    CourierReportApi,
     TrainingApi,
     EducationalProcessApi,
     StudyPathApi,
     VocabularyApi {}
