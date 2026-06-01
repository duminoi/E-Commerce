import api from './axios.config';
import type { ApiResponse } from '../types/api.type';

export const orderApi = {
  create: (data: { addressId: string; note?: string }) => api.post<ApiResponse<any>>('/orders', data),
  findByUser: (page = 1, limit = 10) => api.get<ApiResponse<any>>(`/orders?page=${page}&limit=${limit}`),
  findById: (id: string) => api.get<ApiResponse<any>>(`/orders/${id}`),
  cancel: (id: string, reason?: string) => api.patch(`/orders/${id}/cancel`, { reason }),
  findAll: (page = 1, limit = 10) => api.get<ApiResponse<any>>(`/orders/all?page=${page}&limit=${limit}`),
  updateStatus: (id: string, status: string) => api.patch(`/orders/${id}/status`, { status }),
};
