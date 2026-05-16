export type UserRole = 'ADMIN' | 'USER';

export interface User {
  identity: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';

export interface Task {
  identity: string;
  title: string;
  description?: string;
  status: TaskStatus;
  assigneeId?: string;
  assignee?: User;
  createdAt: string;
}

export interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface AuthData {
  user: User;
  token: string;
}
