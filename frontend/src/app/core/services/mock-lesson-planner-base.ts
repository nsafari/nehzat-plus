import { MockAuthService } from './mock/auth.service';
import { MockAdminUsersService } from './mock/admin-users.service';
import { MockAdminCoursesService } from './mock/admin-courses.service';
import { MockAdminCoachesService } from './mock/admin-coaches.service';
import { MockAdminBranchesService } from './mock/admin-branches.service';
import { MockAdminCurriculumService } from './mock/admin-curriculum.service';
import { MockAdminParentsService } from './mock/admin-parents.service';
import { MockAdminEvaluatorsService } from './mock/admin-evaluators.service';
import { MockAdminStatisticsService } from './mock/admin-statistics.service';
import { MockAssessmentsService } from './mock/assessments.service';
import { MockSpiritualService } from './mock/spiritual.service';
import { MockDailyActivitiesService } from './mock/daily-activities.service';
import { MockArtsService } from './mock/arts.service';
import { MockSurveysService } from './mock/surveys.service';
import { MockQuranService } from './mock/quran.service';
import { MockHadithService } from './mock/hadith.service';
import { MockLiteratureService } from './mock/literature.service';
import { MockMathService } from './mock/math.service';
import { MockSciencesService } from './mock/sciences.service';
import { MockLearningService } from './mock/learning.service';
import { MockCompetitionsService } from './mock/competitions.service';
import { MockCommunityService } from './mock/community.service';
import { MockHeadquartersService } from './mock/headquarters.service';
import { MockTeachersService } from './mock/teachers.service';
import { MockCoursesService } from './mock/courses.service';
import { MockStudentProgressService } from './mock/student-progress.service';
import { MockProfileService } from './mock/profile.service';
import { MockMapService } from './mock/map.service';
import { MockCalendarService } from './mock/calendar.service';
import { MockProgressService } from './mock/progress.service';
import { MockNotificationService } from './mock/notification.service';
import { MockCourierReportService } from './mock/courier-report.service';
import { MockEvaluationService } from './mock/evaluation.service';
import { MockMessagingService } from './mock/messaging.service';
import { MockTeacherGradingService } from './mock/teacher-grading.service';
import { MockTrainingService } from './mock/training.service';
import { MockEducationalProcessService } from './mock/educational-process.service';
import { MockStudyPathService } from './mock/study-path.service';

export type MockApiCtor<T = MockLessonPlannerApiBase> = new (...args: any[]) => T;

/**
 * Base class for the MockLessonPlannerApi delegation mixins.
 *
 * Holds the domain services injected by Angular into MockLessonPlannerApi as
 * public fields so the mixin factories (mock-*.delegations.ts) can reach the
 * shared service instances. This class is never provided to DI itself — DI runs
 * on MockLessonPlannerApi, whose constructor forwards every service to this one.
 */
export class MockLessonPlannerApiBase {
  constructor(
    public auth: MockAuthService,
    public adminUsers: MockAdminUsersService,
    public adminCourses: MockAdminCoursesService,
    public adminCoaches: MockAdminCoachesService,
    public adminBranches: MockAdminBranchesService,
    public adminCurriculum: MockAdminCurriculumService,
    public adminParents: MockAdminParentsService,
    public adminEvaluators: MockAdminEvaluatorsService,
    public adminStatistics: MockAdminStatisticsService,
    public assessments: MockAssessmentsService,
    public spiritual: MockSpiritualService,
    public dailyActivities: MockDailyActivitiesService,
    public arts: MockArtsService,
    public surveys: MockSurveysService,
    public quran: MockQuranService,
    public hadith: MockHadithService,
    public literature: MockLiteratureService,
    public math: MockMathService,
    public sciences: MockSciencesService,
    public learning: MockLearningService,
    public competitions: MockCompetitionsService,
    public community: MockCommunityService,
    public headquarters: MockHeadquartersService,
    public teachers: MockTeachersService,
    public courses: MockCoursesService,
    public studentProgress: MockStudentProgressService,
    public profile: MockProfileService,
    public map: MockMapService,
    public calendar: MockCalendarService,
    public notification: MockNotificationService,
    public courierReport: MockCourierReportService,
    public progress: MockProgressService,
    public evaluation: MockEvaluationService,
     public messaging: MockMessagingService,
     public teacherGrading: MockTeacherGradingService,
  public training: MockTrainingService,
  public educationalProcess: MockEducationalProcessService,
  public studyPath: MockStudyPathService,
) {}
}
