import { Injectable } from '@angular/core';
import { MockDataContext } from './mock-data-context';
import { MockAdminUsersService } from './admin-users.service';
import { MockAdminCoursesService } from './admin-courses.service';
import { MockAdminCoachesService } from './admin-coaches.service';
import { MockAdminBranchesService } from './admin-branches.service';
import { MockAdminCurriculumService } from './admin-curriculum.service';
import { MockAdminParentsService } from './admin-parents.service';
import { MockAdminEvaluatorsService } from './admin-evaluators.service';
import { MockAdminStatisticsService } from './admin-statistics.service';

@Injectable({ providedIn: 'root' })
export class MockFacadeAdmin {
  constructor(private ctx: MockDataContext) {}

  get adminUsersService(): MockAdminUsersService {
    return new MockAdminUsersService(this.ctx);
  }

  get adminCoursesService(): MockAdminCoursesService {
    return new MockAdminCoursesService(this.ctx);
  }

  get adminCoachesService(): MockAdminCoachesService {
    return new MockAdminCoachesService(this.ctx);
  }

  get adminBranchesService(): MockAdminBranchesService {
    return new MockAdminBranchesService(this.ctx);
  }

  get adminCurriculumService(): MockAdminCurriculumService {
    return new MockAdminCurriculumService(this.ctx);
  }

  get adminParentsService(): MockAdminParentsService {
    return new MockAdminParentsService(this.ctx);
  }

  get adminEvaluatorsService(): MockAdminEvaluatorsService {
    return new MockAdminEvaluatorsService(this.ctx);
  }

  get adminStatisticsService(): MockAdminStatisticsService {
    return new MockAdminStatisticsService(this.ctx);
  }
}
