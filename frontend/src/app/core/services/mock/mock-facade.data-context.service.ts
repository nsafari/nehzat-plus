import { Injectable } from '@angular/core';
import { MockDataContext } from './mock-data-context';

@Injectable({ providedIn: 'root' })
export class MockFacadeDataContext {
  constructor(private ctx: MockDataContext) {}
}
