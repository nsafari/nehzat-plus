import { Injectable } from '@angular/core';
import { MockDataContext } from './mock-data-context';
import { MockFacadeDataContext } from './mock-facade.data-context.service';
import { MockAuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class MockFacadeAuth {
  constructor(private ctx: MockDataContext) {}

  get authService(): MockAuthService {
    return new MockAuthService(this.ctx);
  }

  get dataContext(): MockFacadeDataContext {
    return new MockFacadeDataContext(this.ctx);
  }
}
