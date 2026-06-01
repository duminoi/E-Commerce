import api from './axios.config';
import type { ApiResponse } from '../types/api.type';
import type { Category } from '../types/product.type';

export const categoryApi = {
  getAll: () =>
    api.get<ApiResponse<Category[]>>('/categories'),

  getBySlug: (slug: string) =>
    api.get<ApiResponse<Category>>(`/categories/${slug}`),

  create: (data: { name: string; description?: string; parentId?: string }) =>
    api.post<ApiResponse<Category>>('/categories', data),

  update: (id: string, data: any) =>
    api.patch<ApiResponse<Category>>(`/categories/${id}`, data),

  remove: (id: string) =>
    api.delete(`/categories/${id}`),
};
