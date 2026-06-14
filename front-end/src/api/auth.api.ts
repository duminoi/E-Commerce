import api from './axios.config';
import type { ApiResponse, User } from '../types/api.type';

export const authApi = {
  register: (data: { email: string; password: string; fullName: string }) =>
    api.post<ApiResponse<{ accessToken: string; refreshToken: string; user: User }>>('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post<ApiResponse<{ accessToken: string; refreshToken: string; user: User }>>('/auth/login', data),

  googleLogin: (idToken: string) =>
    api.post<ApiResponse<{ accessToken: string; refreshToken: string; user: User; isNewUser: boolean }>>('/auth/google', { idToken }),

  refreshToken: (refreshToken: string) =>
    api.post<ApiResponse<{ accessToken: string; refreshToken: string }>>('/auth/refresh-token', { refreshToken }),

  logout: () => api.post('/auth/logout'),

  getProfile: () =>
    api.get<ApiResponse<User>>('/users/me'),
};
