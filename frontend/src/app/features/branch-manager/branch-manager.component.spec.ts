import { mountStandalone } from '../shared/testing-utils';

import { BranchManagerComponent } from './branch-manager.component';
import type { CoachPerformance, Student } from '../../core/models/lesson-planner.models';

describe('BranchManagerComponent', () => {
  it('should be defined', () => {
    expect(BranchManagerComponent).toBeDefined();
  });

  it('should create with mocked dependencies', () => {
    const instance = mountStandalone(BranchManagerComponent);
    expect(instance).toBeTruthy();
  });

  describe('drill-down', () => {
    it('should start with no drill-down active', () => {
      const instance = mountStandalone(BranchManagerComponent);
      expect(instance.drillDownCoach()).toBeNull();
      expect(instance.drillDownStudent()).toBeNull();
    });

    it('should open coach drill-down on openCoachDrillDown', () => {
      const instance = mountStandalone(BranchManagerComponent);
      const cp: CoachPerformance = {
        coachId: 1,
        coachName: 'مربی تست',
        specialization: 'تست',
        assignedCourseCount: 2,
        studentCount: 10,
        averageStudentScore: 85,
        evaluationCount: 5,
        averageEvaluationScore: 90,
        status: 'active',
      };
      instance.openCoachDrillDown(cp);
      expect(instance.drillDownCoach()?.coachId).toBe(1);
      expect(instance.drillDownStudent()).toBeNull();
    });

    it('should toggle coach drill-down when clicking same coach', () => {
      const instance = mountStandalone(BranchManagerComponent);
      const cp: CoachPerformance = {
        coachId: 1,
        coachName: 'مربی تست',
        specialization: 'تست',
        assignedCourseCount: 2,
        studentCount: 10,
        averageStudentScore: 85,
        evaluationCount: 5,
        averageEvaluationScore: 90,
        status: 'active',
      };
      instance.openCoachDrillDown(cp);
      expect(instance.drillDownCoach()).not.toBeNull();
      instance.openCoachDrillDown(cp);
      expect(instance.drillDownCoach()).toBeNull();
    });

    it('should open student drill-down on openStudentDrillDown', () => {
      const instance = mountStandalone(BranchManagerComponent);
      const s: Student = {
        id: 1,
        studentId: 'S001',
        firstName: 'علی',
        lastName: 'احمدی',
        email: 'ali@test.com',
        phoneNumber: '09120000000',
        gender: 'male',
        username: 'ali.ahmadi',
        branchId: 1,
        status: 'active',
      };
      instance.openStudentDrillDown(s);
      expect(instance.drillDownStudent()?.id).toBe(1);
      expect(instance.drillDownCoach()).toBeNull();
    });

    it('should close drill-down on closeDrillDown', () => {
      const instance = mountStandalone(BranchManagerComponent);
      const cp: CoachPerformance = {
        coachId: 1,
        coachName: 'مربی تست',
        specialization: 'تست',
        assignedCourseCount: 2,
        studentCount: 10,
        averageStudentScore: 85,
        evaluationCount: 5,
        averageEvaluationScore: 90,
        status: 'active',
      };
      instance.openCoachDrillDown(cp);
      expect(instance.drillDownCoach()).not.toBeNull();
      instance.closeDrillDown();
      expect(instance.drillDownCoach()).toBeNull();
      expect(instance.drillDownStudent()).toBeNull();
    });

    it('should clear coach drill-down when opening student drill-down', () => {
      const instance = mountStandalone(BranchManagerComponent);
      const cp: CoachPerformance = {
        coachId: 1,
        coachName: 'مربی تست',
        specialization: 'تست',
        assignedCourseCount: 2,
        studentCount: 10,
        averageStudentScore: 85,
        evaluationCount: 5,
        averageEvaluationScore: 90,
        status: 'active',
      };
      instance.openCoachDrillDown(cp);
      expect(instance.drillDownCoach()).not.toBeNull();

      const s: Student = {
        id: 2,
        studentId: 'S002',
        firstName: 'فاطمه',
        lastName: 'محمدی',
        email: 'fateme@test.com',
        phoneNumber: '09130000000',
        gender: 'female',
        username: 'fateme.mohammadi',
        branchId: 1,
        status: 'active',
      };
      instance.openStudentDrillDown(s);
      expect(instance.drillDownCoach()).toBeNull();
      expect(instance.drillDownStudent()?.id).toBe(2);
    });
  });
});
