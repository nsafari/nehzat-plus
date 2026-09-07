import { Injectable } from '@angular/core';
import { MockDataContext } from './mock-data-context';

@Injectable({ providedIn: 'root' })
export class MockDataContextService {
  constructor(private ctx: MockDataContext) {}
}
