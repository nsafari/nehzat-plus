export interface AssignmentDto {
  id: number;
  halghehId: number;
  title: string;
  description?: string;
  dueDate?: string;
  status: 'draft' | 'active' | 'closed';
  mySubmissionStatus: 'submitted' | 'approved' | 'rejected' | '';
  submissionCount: number;
  creatorName: string;
  createdAt: string;
}

export interface AssignmentSubmissionDto {
  id: number;
  assignmentId: number;
  userId: number;
  userName: string;
  content: string;
  status: 'submitted' | 'approved' | 'rejected';
  feedback?: string;
  grade?: number;
  submittedAt: string;
  reviewedAt?: string;
}

export interface CreateAssignmentPayload {
  title: string;
  description?: string;
  dueDate?: string;
}

export interface UpdateAssignmentPayload {
  title: string;
  description?: string;
  dueDate?: string;
  status: 'draft' | 'active' | 'closed';
}

export interface SubmitAssignmentPayload {
  content: string;
}

export interface ReviewSubmissionPayload {
  status: 'approved' | 'rejected';
  feedback?: string;
  grade?: number;
}
