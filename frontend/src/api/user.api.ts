import api from './axios';
import { ApiResponse, User } from '../types';

export const createUserAPI = (data: any) => api.post<ApiResponse<User>>('/users', data);
export const getUsersAPI = (params?: any) => api.get<ApiResponse<User[]>>('/users', { params });
