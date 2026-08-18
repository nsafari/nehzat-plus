export interface TrainingCourse {
  id: number;
  title: string;
  slug?: string;
  description?: string;
  academicYear: string;
  status: string;
  maxEnrollment?: number;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  stagesCount: number;
  enrollmentsCount: number;
}

export interface TrainingStage {
  id: number;
  courseId: number;
  title: string;
  slug?: string;
  stageOrder: number;
  required: boolean;
  description?: string;
  sessionsCount: number;
  prerequisiteStageId?: number;
}

export interface TrainingSession {
  id: number;
  stageId: number;
  title: string;
  sessionNumber: number;
  durationMinutes: number;
  sessionType: string;
  description?: string;
  contentsCount: number;
  assignmentsCount: number;
}

export interface TrainingContent {
  id: number;
  sessionId: number;
  contentType: string;
  sourceFile?: string;
  rawText?: string;
  structuredData?: string;
  importedAt: string;
}

export interface TrainingEnrollment {
  id: number;
  userId: number;
  courseId: number;
  enrolledAt: string;
  status: string;
  userName?: string;
  courseTitle?: string;
}

export interface TrainingProgress {
  id: number;
  enrollmentId: number;
  sessionId: number;
  status: string;
  score?: number;
  completedAt?: string;
  notes?: string;
  sessionTitle?: string;
}

export interface TrainingAssignment {
  id: number;
  sessionId: number;
  title: string;
  description?: string;
  deadline?: string;
  submissionType: string;
  submissionsCount: number;
}

export interface TrainingSubmission {
  id: number;
  assignmentId: number;
  userId: number;
  content?: string;
  fileUrl?: string;
  submittedAt: string;
  grade?: number;
  feedback?: string;
  userName?: string;
}

export interface TrainingStatistics {
  totalCourses: number;
  activeCourses: number;
  totalEnrollments: number;
  totalSessions: number;
  totalContent: number;
  courseStats: CourseStatItem[];
}

export interface CourseStatItem {
  courseId: number;
  courseTitle: string;
  enrollmentCount: number;
  completionRate: number;
}