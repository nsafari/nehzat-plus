import {
  Student, Branch, Course, Assignment, AssignmentAttachment,
  AssignmentSubmission, Coach, BranchManager, Parent, Evaluator,
  Madrasah, MaktabBranch, SubjectArea, TeachingMethod, Ring,
  RingStudent, CurriculumObjective, Book, RingBook,
  RingTeachingMethod, EvaluationRecord, Assessment, MonthlyBooklet,
  CurriculumVersion, StudentPathHistory, Teacher, TeacherCourse,
  AssignmentGrading, Competition, CompetitionParticipant, League,
  LeagueRanking, IssueSurvey, IssueSurveyQuestion, IssueItemPool,
  IssueSurveyResponse, IssueSurveyComment, IssueAction, IssueActionUpdate,
  StudentSkillProgress, AgeGroup, SpiritualPracticeItem, SpiritualOccasion,
  SpiritualPath, DailySpiritualEntry, UserOccasionProgress,
  StudentPathSelection, ServiceSurvey, ServiceSurveyQuestion,
  ServiceSurveyResponse, ServiceDashboardSummary, XpBadge
} from '../models/lesson-planner.models';
import { UserType } from '../models/lesson-planner.models';

interface MockUser {
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

export const mockUsers: MockUser[] = [
  { id: 1, username: 'test', password: 'password', userType: 'manager' as UserType, approvalStatus: 'approved' as const, firstName: 'مدیر', lastName: 'سیستم', email: 'admin@example.com', phoneNumber: '09120000000' },
  { id: 2, username: 'ali.ahmadi', password: 'password123', userType: 'trainee' as UserType, approvalStatus: 'approved' as const, firstName: 'علی', lastName: 'احمدی', email: 'ali@example.com', phoneNumber: '09121111111', studentId: 1 },
  { id: 3, username: 'fateme.mohammadi', password: 'password123', userType: 'trainee' as UserType, approvalStatus: 'approved' as const, firstName: 'فاطمه', lastName: 'محمدی', email: 'fateme@example.com', phoneNumber: '09122222222', studentId: 2 },
  { id: 4, username: 'mohammad.rezaei', password: 'password123', userType: 'trainee' as UserType, approvalStatus: 'approved' as const, firstName: 'محمد', lastName: 'رضایی', email: 'mohammad@example.com', phoneNumber: '09123333333', studentId: 3 },
];

export const mockStudents: Student[] = [
  { id: 1, username: 'ali.ahmadi', studentId: 'STD-001', firstName: 'علی', lastName: 'احمدی', email: 'ali@example.com', phoneNumber: '09121111111', status: 'active', createdAt: '2026-01-01T00:00:00.000Z' },
  { id: 2, username: 'fateme.mohammadi', studentId: 'STD-002', firstName: 'فاطمه', lastName: 'محمدی', email: 'fateme@example.com', phoneNumber: '09122222222', status: 'active', createdAt: '2026-01-01T00:00:00.000Z' },
  { id: 3, username: 'mohammad.rezaei', studentId: 'STD-003', firstName: 'محمد', lastName: 'رضایی', email: 'mohammad@example.com', phoneNumber: '09123333333', status: 'active', createdAt: '2026-01-01T00:00:00.000Z' },
];

export const mockBranches: Branch[] = [
  { id: 1, name: 'شعبه مرکزی', province: 'تهران', description: 'شعبه اصلی و مرکزی', createdAt: '2026-01-01T00:00:00.000Z' },
  { id: 2, name: 'شعبه شرق تهران', province: 'تهران', description: 'شعبه منطقه شرق تهران', createdAt: '2026-01-15T00:00:00.000Z' },
  { id: 3, name: 'شعبه غرب تهران', province: 'تهران', description: 'شعبه منطقه غرب تهران', createdAt: '2026-02-01T00:00:00.000Z' },
  { id: 4, name: 'شعبه اصفهان', province: 'اصفهان', description: 'شعبه استان اصفهان', createdAt: '2026-03-01T00:00:00.000Z' },
  { id: 5, name: 'شعبه مشهد', province: 'خراسان رضوی', description: 'شعبه استان خراسان رضوی', createdAt: '2026-03-15T00:00:00.000Z' },
];

export const mockCourses: Course[] = [
  { id: 1, title: 'قرآن و معارف اسلامی', description: 'دوره آموزش قرآن کریم و معارف اسلامی', courseCode: 'QUR-101', credits: 3, instructor: 'استاد محمدی', status: 'active', startDate: '2026-01-01', endDate: '2026-06-01', maxStudents: 30, createdAt: '2026-01-01T00:00:00.000Z' },
  { id: 2, title: 'آموزش تجوید', description: 'دوره تخصصی تجوید قرآن کریم', courseCode: 'TJT-201', credits: 2, instructor: 'استاد رضایی', status: 'active', startDate: '2026-01-01', endDate: '2026-06-01', maxStudents: 20, createdAt: '2026-01-01T00:00:00.000Z' },
];

export const mockCourseEnrollments = new Map<number, number[]>([[1, [1, 2, 3]], [2, [1, 2]]]);
export const mockInviteCodes = new Map<number, any>();

export const mockXpBadges: XpBadge[] = [
  { id: 1, code: 'progress.sprout', name: 'آغاز راه', description: 'اولین قدم‌ها در مسیر رشد', icon: '🌱', xpMilestone: 100, category: 'progress', isEarned: true },
  { id: 2, code: 'progress.learner', name: 'متربیِ کوشا', description: 'گردآوری ۵۰۰ امتیاز تجربه', icon: '📖', xpMilestone: 500, category: 'progress', isEarned: false },
  { id: 3, code: 'progress.active', name: 'نشانِ پیشرفت', description: 'گردآوری ۱۰۰۰ امتیاز تجربه', icon: '⭐', xpMilestone: 1000, category: 'progress', isEarned: false },
  { id: 4, code: 'progress.skilled', name: 'کارآزموده', description: 'گردآوری ۲۵۰۰ امتیاز تجربه', icon: '💪', xpMilestone: 2500, category: 'progress', isEarned: false },
  { id: 5, code: 'quran.reciter', name: 'قهرمان قرآن', description: 'تداوم در برنامه‌های قرآنی', icon: '🎧', xpMilestone: 2500, category: 'quran', isEarned: false },
  { id: 6, code: 'math.master', name: 'استاد ریاضی', description: 'استادی در تمرین‌های ریاضی', icon: '🧮', xpMilestone: 2500, category: 'math', isEarned: false },
  { id: 7, code: 'progress.master', name: 'استادِ نشان‌ها', description: 'گردآوری ۵۰۰۰ امتیاز تجربه', icon: '🏆', xpMilestone: 5000, category: 'progress', isEarned: false },
  { id: 8, code: 'behavior.persistent', name: 'بااراده', description: 'پایداری و استمرار در مسیر تربیت', icon: '🎯', xpMilestone: 5000, category: 'behavior', isEarned: false },
  { id: 9, code: 'progress.legend', name: 'اسطوره‌ی متربیان', description: 'گردآوری ۱۰۰۰۰ امتیاز تجربه', icon: '👑', xpMilestone: 10000, category: 'progress', isEarned: false },
  { id: 10, code: 'creativity.star', name: 'خلاقِ کوچک', description: 'کشف استعدادهای هنری و خلاقانه', icon: '🎨', xpMilestone: 10000, category: 'creativity', isEarned: false }
];
