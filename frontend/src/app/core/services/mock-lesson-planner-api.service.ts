import { Injectable } from '@angular/core';

import { LessonPlannerApi } from './lesson-planner-api.interface';
import { MockLessonPlannerApiBase } from './mock-lesson-planner-base';
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
import { MockProgressService } from './mock/progress.service';
import { MockCalendarService } from './mock/calendar.service';
import { MockNotificationService } from './mock/notification.service';
import { MockCourierReportService } from './mock/courier-report.service';
import { withAuth } from './mock-auth.delegations';
import { withAdminUsers } from './mock-admin-users.delegations';
import { withAdminCourses } from './mock-admin-courses.delegations';
import { withAdminCoaches } from './mock-admin-coaches.delegations';
import { withAdminBranches } from './mock-admin-branches.delegations';
import { withAdminCurriculum } from './mock-admin-curriculum.delegations';
import { withAdminCurriculumBooklets } from './mock-admin-curriculum-booklets.delegations';
import { withAdminParents } from './mock-admin-parents.delegations';
import { withAdminEvaluators } from './mock-admin-evaluators.delegations';
import { withAdminStatistics } from './mock-admin-statistics.delegations';
import { withAssessments } from './mock-assessments.delegations';
import { withSpiritual } from './mock-spiritual.delegations';
import { withDaily } from './mock-daily.delegations';
import { withArts } from './mock-arts.delegations';
import { withSurveys } from './mock-surveys.delegations';
import { withQuran } from './mock-quran.delegations';
import { withHadith } from './mock-hadith.delegations';
import { withLiterature } from './mock-literature.delegations';
import { withLiteratureArabic } from './mock-literature-arabic.delegations';
import { withMath } from './mock-math.delegations';
import { withSciences } from './mock-sciences.delegations';
import { withLearning } from './mock-learning.delegations';
import { withLearningDefenses } from './mock-learning-defenses.delegations';
import { withCompetitions } from './mock-competitions.delegations';
import { withCommunity } from './mock-community.delegations';
import { withHeadquarters } from './mock-headquarters.delegations';
import { withTeachers } from './mock-teachers.delegations';
import { withCourses } from './mock-courses.delegations';
import { withStudentProgress } from './mock-student-progress.delegations';
import { withProfile } from './mock-profile.delegations';
import { withMap } from './mock-map.delegations';
import { withProgress } from './mock-progress.delegations';
import { withCalendar } from './mock-calendar.delegations';
import { withNotification } from './mock-notification.delegations';
import { withCourierReport } from './mock-courier-report.delegations';
import { withEvaluation } from './mock-evaluation.delegations';
import { withMessaging } from './mock-messaging.delegations';
import { withTeacherGrading } from './mock-teacher-grading.delegations';
import { withTraining } from './mock-training.delegations';
import { MockEvaluationService } from './mock/evaluation.service';
import { MockMessagingService } from './mock/messaging.service';
import { MockTeacherGradingService } from './mock/teacher-grading.service';
import { MockTrainingService } from './mock/training.service';

/**
 * Facade service that delegates every LessonPlannerApi method to one of the 26
 * injected domain services. The concrete method bodies live in the domain mixin
 * factories composed below (mock-*.delegations.ts), one file per domain.
 * This thin class only owns DI + the delegation wiring.
 */
@Injectable({ providedIn: 'root' })
export class MockLessonPlannerApi
  extends withTraining(withTeacherGrading(withMessaging(
    withEvaluation(
    withCalendar(
      withNotification(
        withCourierReport(
          withProgress(
            withMap(
              withProfile(
                withStudentProgress(
                  withCourses(
                    withTeachers(
                      withHeadquarters(
                        withCommunity(
                          withCompetitions(
                            withLearningDefenses(
                              withLearning(
                                withSciences(
                                  withMath(
                                    withLiteratureArabic(
                                      withLiterature(
                                        withHadith(
                                          withQuran(
                                            withSurveys(
                                              withArts(
                                                withDaily(
                                                  withSpiritual(
                                                    withAssessments(
                                                      withAdminEvaluators(
                                                        withAdminParents(
                                                          withAdminCurriculumBooklets(
                                                            withAdminCurriculum(
                                                              withAdminBranches(
                                                                withAdminCoaches(
                                                                  withAdminCourses(
                                                                    withAdminUsers(
                                                                      withAdminStatistics(
                                                                        withAuth(
                                                                          MockLessonPlannerApiBase,
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
  ))
  implements LessonPlannerApi
{
  constructor(
    auth: MockAuthService,
    adminUsers: MockAdminUsersService,
    adminCourses: MockAdminCoursesService,
    adminCoaches: MockAdminCoachesService,
    adminBranches: MockAdminBranchesService,
    adminCurriculum: MockAdminCurriculumService,
    adminParents: MockAdminParentsService,
    adminEvaluators: MockAdminEvaluatorsService,
    adminStatistics: MockAdminStatisticsService,
    assessments: MockAssessmentsService,
    spiritual: MockSpiritualService,
    dailyActivities: MockDailyActivitiesService,
    arts: MockArtsService,
    surveys: MockSurveysService,
    quran: MockQuranService,
    hadith: MockHadithService,
    literature: MockLiteratureService,
    math: MockMathService,
    sciences: MockSciencesService,
    learning: MockLearningService,
    competitions: MockCompetitionsService,
    community: MockCommunityService,
    headquarters: MockHeadquartersService,
    teachers: MockTeachersService,
    courses: MockCoursesService,
    studentProgress: MockStudentProgressService,
    profile: MockProfileService,
    map: MockMapService,
    calendar: MockCalendarService,
    notification: MockNotificationService,
    courierReport: MockCourierReportService,
    progress: MockProgressService,
    evaluation: MockEvaluationService,
    messaging: MockMessagingService,
    teacherGrading: MockTeacherGradingService,
    training: MockTrainingService,
  ) {
    super(
      auth,
      adminUsers,
      adminCourses,
      adminCoaches,
      adminBranches,
      adminCurriculum,
      adminParents,
      adminEvaluators,
      adminStatistics,
      assessments,
      spiritual,
      dailyActivities,
      arts,
      surveys,
      quran,
      hadith,
      literature,
      math,
      sciences,
      learning,
      competitions,
      community,
      headquarters,
      teachers,
      courses,
      studentProgress,
      profile,
      map,
      calendar,
      notification,
      courierReport,
      progress,
      evaluation,
      messaging,
      teacherGrading,
      training,
    );
  }
}
