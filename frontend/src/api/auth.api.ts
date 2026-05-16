import api from './axios';
import { ApiResponse, AuthData, User } from '../types';

export const loginAPI = (data: any) => api.post<ApiResponse<AuthData>>('/auth/login', data);
export const getMeAPI = () => api.get<ApiResponse<User>>('/auth/me');
