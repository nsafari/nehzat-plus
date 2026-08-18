import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MockDataContext } from './mock-data-context';
import {
  Student,
  PendingUser,
  ApproveUserPayload,
  CreateUserPayload,
  CreatedUser,
  ApiMessageResponse,
} from '../../models/lesson-planner.models';

@Injectable({ providedIn: 'root' })
export class MockAdminUsersService {
  constructor(private ctx: MockDataContext) {}

  getAllStudents(): Observable<Student[]> {
    return this.ctx.delayed([...this.ctx.students]);
  }

  getPendingUsers(): Observable<PendingUser[]> {
    return this.ctx.delayed(
      this.ctx.users
        .filter((u) => u.approvalStatus === 'pending')
        .map((u) => ({
          id: u.id,
          username: u.username,
          firstName: u.firstName ?? '',
          lastName: u.lastName ?? '',
          email: u.email ?? '',
          phoneNumber: u.phoneNumber ?? '',
          status: 'pending' as const,
        })),
    );
  }

  approveUser(userId: number, payload: ApproveUserPayload): Observable<ApiMessageResponse> {
    const user = this.ctx.users.find((u) => u.id === userId);
    if (!user) {
      return this.ctx.delayed({ message: 'کاربر یافت نشد' });
    }
    user.approvalStatus = 'approved';
    return this.ctx.delayed({ message: 'کاربر با موفقیت تایید شد' });
  }

  rejectUser(userId: number): Observable<ApiMessageResponse> {
    const user = this.ctx.users.find((u) => u.id === userId);
    if (!user) {
      return this.ctx.delayed({ message: 'کاربر یافت نشد' });
    }
    user.approvalStatus = 'rejected';
    return this.ctx.delayed({ message: 'کاربر رد شد' });
  }

  createUser(payload: CreateUserPayload): Observable<CreatedUser> {
    const user = {
      id: this.ctx.nextId(this.ctx.users),
      username: payload.username,
      password: payload.password,
      userType: payload.userType,
      approvalStatus: 'approved' as const,
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      phoneNumber: payload.phoneNumber,
    };
    this.ctx.users.push(user);
    return this.ctx.delayed({ id: user.id, username: user.username, userType: user.userType });
  }
}
