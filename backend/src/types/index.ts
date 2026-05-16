import { Request } from 'express';

export interface AuthPayload {
  identity: string;
  role: 'ADMIN' | 'USER';
}

export interface AuthRequest extends Request {
  user?: AuthPayload;
}

export type TaskStatusType = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
export type RoleType = 'ADMIN' | 'USER';
