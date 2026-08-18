import { PaginatedResult } from './paginated-result.model';
export type { PaginatedResult } from './paginated-result.model';

export interface HalghehFullDto {
  id: number;
  maktabId: number;
  maktabName: string;
  name: string;
  description?: string;
  maxMembers?: number;
  moderatorUserId: number;
  moderatorName: string;
  status: string;
  memberCount: number;
  myRole: string;
  createdAt: string;
}

export interface CreateHalghehFullDto {
  maktabId: number;
  name: string;
  description?: string;
  maxMembers?: number;
}

export interface UpdateHalghehFullDto {
  name?: string;
  description?: string;
  maxMembers?: number;
  status?: string;
}

export interface HalghehMemberDto {
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
  phone?: string;
  role: string;
  status: string;
  joinedAt: string;
}

export interface HalghehMemberFilterDto {
  search?: string;
  role?: string;
  status?: string;
  page: number;
  pageSize: number;
}

export interface TransferModeratorDto {
  newModeratorUserId: number;
}

