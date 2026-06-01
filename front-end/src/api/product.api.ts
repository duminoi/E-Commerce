import api from './axios.config';
import type { ApiResponse } from '../types/api.type';
import type { Product } from '../types/product.type';

export const productApi = {
  getAll: (params?: { search?: string; category?: string; minPrice?: number; maxPrice?: number; sort?: string; page?: number; limit?: number }) =>
    api.get<ApiResponse<{ items: Product[]; meta: any }>>('/products', { params }),

  getBySlug: (slug: string) =>
    api.get<ApiResponse<Product>>(`/products/${slug}`),

  getRelated: (id: string) =>
    api.get<ApiResponse<Product[]>>(`/products/related/${id}`),

  create: (data: any) =>
    api.post<ApiResponse<Product>>('/products', data),

  update: (id: string, data: any) =>
    api.patch<ApiResponse<Product>>(`/products/${id}`, data),

  remove: (id: string) =>
    api.delete(`/products/${id}`),
};
