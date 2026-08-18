export interface MaktabDto {
  id: number;
  name: string;
  description?: string;
  city?: string;
  address?: string;
  phone?: string;
  ownerUserId: number;
  ownerName: string;
  inviteCode: string;
  status: 'active' | 'inactive' | 'archived';
  isPublic: boolean;
  memberCount: number;
  myRole: 'owner' | 'manager' | 'member' | '';
  createdAt: string;
}

export interface MaktabMemberDto {
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
  nationalCode?: string;
  phone?: string;
  role: 'owner' | 'manager' | 'member';
  status: 'active' | 'inactive' | 'banned';
  joinedAt: string;
}

import { PaginatedResult } from './paginated-result.model';
export type { PaginatedResult } from './paginated-result.model';

export interface MaktabMemberFilter {
  search?: string;
  role?: string;
  status?: string;
  page: number;
  pageSize: number;
}

export interface CreateMaktabPayload {
  name: string;
  description?: string;
  city?: string;
  address?: string;
  phone?: string;
  isPublic: boolean;
}

export interface UpdateMaktabPayload {
  name?: string;
  description?: string;
  city?: string;
  address?: string;
  phone?: string;
  status?: string;
  isPublic?: boolean;
}

export interface InviteByNationalCodePayload {
  nationalCode: string;
  role: 'manager' | 'member';
}

export interface TransferOwnershipPayload {
  newOwnerUserId: number;
}

export interface JoinByInviteCodePayload {
  inviteCode: string;
}

export interface InviteCodeResponse {
  inviteCode: string;
}
