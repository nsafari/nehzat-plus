import {
  Student,
  Branch,
  Course,
  Assignment,
  AssignmentAttachment,
  AssignmentSubmission,
  SubjectArea,
  TeachingMethod,
  Ring,
  RingStudent,
  CurriculumObjective,
  Book,
  RingBook,
  RingTeachingMethod,
  EvaluationRecord,
  Assessment,
} from '../../models/lesson-planner.models';
import { UserType } from '../../models/lesson-planner.models';
import {
  mockUsers,
  mockStudents,
  mockBranches,
  mockCourses,
  mockCourseEnrollments,
  mockInviteCodes,
} from '../mock-lesson-planner-data';

export interface MockUser {
  id: number;
  username: string;
  password: string;
  userType: UserType;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  imageUrl?: string;
  studentId?: number;
  branchId?: number;
}

export interface HasId {
  id: number;
}

// ── Core data arrays ──
export const initialUsers: MockUser[] = [...mockUsers];
export const initialStudents: Student[] = [...mockStudents];
export const initialBranches: Branch[] = [...mockBranches];
export const initialCourses: Course[] = [...mockCourses];

export const initialAssignments: Assignment[] = [];
export const initialAttachments: AssignmentAttachment[] = [];
export const initialSubmissions: AssignmentSubmission[] = [];
export const initialSubjectAreas: SubjectArea[] = [];
export const initialTeachingMethods: TeachingMethod[] = [];
export const initialRings: Ring[] = [];
export const initialRingStudents: RingStudent[] = [];
export const initialObjectives: CurriculumObjective[] = [];
export const initialBooks: Book[] = [];
export const initialRingBooks: RingBook[] = [];
export const initialRingTeachingMethods: RingTeachingMethod[] = [];
export const initialEvaluations: EvaluationRecord[] = [];
export const initialAssessments: Assessment[] = [];
export const initialCourseEnrollments = new Map(mockCourseEnrollments);
export const initialInviteCodes = new Map(mockInviteCodes);