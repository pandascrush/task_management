import api from './axios';
import { ApiResponse, Task } from '../types';

export const createTaskAPI = (data: any) => api.post<ApiResponse<Task>>('/tasks', data);
export const getTasksAPI = (params?: any) => api.get<ApiResponse<Task[]>>('/tasks', { params });
export const assignTaskAPI = (id: string, data: any) => api.patch<ApiResponse<Task>>(`/tasks/${id}/assign`, data);
export const updateTaskStatusAPI = (id: string, data: any) => api.patch<ApiResponse<Task>>(`/tasks/${id}/status`, data);
