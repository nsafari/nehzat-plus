import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MockDataContext } from './mock-data-context';
import {
  Parent,
  ParentStudentInfo,
  CreateParentPayload,
  ApiMessageResponse,
} from '../../models/lesson-planner.models';

@Injectable({ providedIn: 'root' })
export class MockAdminParentsService {
  constructor(private ctx: MockDataContext) {}

  getParents(): Observable<Parent[]> {
    return this.ctx.delayed([...this.ctx.parents]);
  }

  createParent(payload: CreateParentPayload): Observable<Parent> {
    const parent: Parent = {
      id: this.ctx.nextId(this.ctx.parents),
      username: payload.username,
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      phoneNumber: payload.phoneNumber,
      address: payload.address ?? '',
      nationalCode: payload.nationalCode ?? '',
      studentIds: payload.studentIds ?? [],
      status: 'active',
      createdAt: this.ctx.now(),
    };
    this.ctx.parents.push(parent);
    return this.ctx.delayed(parent);
  }

  updateParent(id: number, payload: Partial<CreateParentPayload>): Observable<Parent> {
    const parent = this.ctx.parents.find((p) => p.id === id);
    if (!parent) throw new Error('Parent not found');
    Object.assign(parent, payload);
    return this.ctx.delayed(parent);
  }

  deleteParent(id: number): Observable<ApiMessageResponse> {
    this.ctx.parents = this.ctx.parents.filter((p) => p.id !== id);
    return this.ctx.delayed({ message: 'والدین حذف شد' });
  }

  getParentStudents(parentId: number): Observable<ParentStudentInfo[]> {
    return this.ctx.delayed([]);
  }
}
