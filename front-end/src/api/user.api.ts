import api from './axios.config';
import type { ApiResponse } from '../types/api.type';

export const userApi = {
  getProfile: () => api.get<ApiResponse<any>>('/users/me'),
  updateProfile: (data: any) => api.patch('/users/me', data),
  getAddresses: () => api.get<ApiResponse<any[]>>('/users/addresses'),
  createAddress: (data: any) => api.post('/users/addresses', data),
  updateAddress: (id: string, data: any) => api.patch(`/users/addresses/${id}`, data),
  deleteAddress: (id: string) => api.delete(`/users/addresses/${id}`),
};
