import api from './axios.config';
import type { ApiResponse } from '../types/api.type';

export const cartApi = {
  getCart: () => api.get<ApiResponse<{ cart: any; total: number }>>('/cart'),
  addItem: (data: { productId: string; variantId?: string; quantity: number }) => api.post('/cart/items', data),
  updateItem: (id: string, data: { quantity: number }) => api.patch(`/cart/items/${id}`, data),
  removeItem: (id: string) => api.delete(`/cart/items/${id}`),
  clearCart: () => api.delete('/cart'),
};
