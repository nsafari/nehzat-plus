import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MockDataContext } from './mock-data-context';
import { createDummyToken } from '../mock-lesson-planner-helpers';
import {
  UserType,
  AuthSigninPayload,
  AuthSigninResponse,
  AuthSignupPayload,
  AuthSignupResponse,
  ApiMessageResponse,
  Student,
} from '../../models/lesson-planner.models';

@Injectable({ providedIn: 'root' })
export class MockAuthService {
  constructor(private ctx: MockDataContext) {}

  signin(payload: AuthSigninPayload): Observable<AuthSigninResponse> {
    const user = this.ctx.findUserByUsername(payload.username);
    if (!user || user.password !== payload.password) {
      return this.ctx.delayed({
        message: 'نام کاربری یا رمز عبور اشتباه است',
        token: '',
        username: '',
        userType: 'trainee' as UserType,
      });
    }

    if (user.approvalStatus === 'pending') {
      return this.ctx.delayed({
        message: 'حساب کاربری شما در انتظار تایید مدیر سیستم است',
        token: '',
        username: user.username,
        userType: user.userType,
      });
    }

    if (user.approvalStatus === 'rejected') {
      return this.ctx.delayed({
        message: 'حساب کاربری شما رد شده است. لطفاً با مدیر سیستم تماس بگیرید',
        token: '',
        username: user.username,
        userType: user.userType,
      });
    }

    const student = user.studentId
      ? this.ctx.students.find((s) => s.id === user.studentId)
      : undefined;
    const token = createDummyToken(user.username, user.userType, user.studentId, user.branchId);
    this.ctx.setCurrentUser(user.username);

    return this.ctx.delayed({
      message: 'ورود با موفقیت انجام شد',
      token,
      username: user.username,
      imageUrl: user.imageUrl,
      userType: user.userType,
      studentId: user.studentId,
      studentInfo: student
        ? {
            id: student.id,
            studentId: student.studentId,
            firstName: student.firstName,
            lastName: student.lastName,
            email: student.email,
            phoneNumber: student.phoneNumber,
          }
        : undefined,
      branchId: user.branchId,
    });
  }

  signup(payload: AuthSignupPayload): Observable<AuthSignupResponse> {
    if (this.ctx.findUserByUsername(payload.username)) {
      return this.ctx.delayed({
        message: 'نام کاربری قبلاً ثبت شده است',
        status: 'pending',
      });
    }

    this.ctx.users.push({
      id: this.ctx.nextId(this.ctx.users),
      username: payload.username,
      password: payload.password,
      userType: 'trainee',
      approvalStatus: 'pending',
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      phoneNumber: payload.phoneNumber,
    });

    return this.ctx.delayed({
      message: 'ثبت نام با موفقیت انجام شد. در انتظار تایید مدیر سیستم هستید.',
      status: 'pending',
    });
  }

  seedDatabase(): Observable<ApiMessageResponse> {
    this.ctx.reset();
    return this.ctx.delayed({ message: 'پایگاه داده با موفقیت بازنشانی شد' });
  }
}
