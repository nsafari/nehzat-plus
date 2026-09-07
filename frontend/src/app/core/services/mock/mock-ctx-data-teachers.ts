import { Teacher, TeacherCourse, AssignmentGrading } from '../../models/lesson-planner.models';

// ── Teachers (inline seed) ──
export const initialTeachers: Teacher[] = [
  {
    id: 1,
    username: 'teacher.ahmadi',
    firstName: 'احمد',
    lastName: 'احمدی',
    email: 'ahmadi@example.com',
    phoneNumber: '09123333333',
    specialization: 'قرآن و تجوید',
    nationalCode: '1234567890',
    branchId: 1,
    status: 'active',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    teacherCourses: [],
    gradedSubmissions: [],
  },
];
export const initialTeacherCourses: TeacherCourse[] = [
  { id: 1, teacherId: 1, courseId: 1, createdAt: '2026-01-01T00:00:00.000Z' },
];
export const initialAssignmentGradings: AssignmentGrading[] = [];