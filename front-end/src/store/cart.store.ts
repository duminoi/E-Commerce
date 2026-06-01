import { create } from 'zustand';
import { cartApi } from '../api/cart.api';

interface CartState {
  items: any[];
  total: number;
  itemCount: number;
  isLoading: boolean;

  fetchCart: () => Promise<void>;
  addItem: (productId: string, quantity: number, variantId?: string) => Promise<void>;
  updateItem: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  total: 0,
  itemCount: 0,
  isLoading: false,

  fetchCart: async () => {
    try {
      const { data } = await cartApi.getCart();
      if (data.success && data.data) {
        set({
          items: data.data.cart?.items || [],
          total: data.data.total || 0,
          itemCount: (data.data.cart?.items || []).reduce((sum: number, item: any) => sum + item.quantity, 0),
        });
      }
    } catch { /* ignore */ }
  },

  addItem: async (productId, quantity, variantId) => {
    set({ isLoading: true });
    try {
      await cartApi.addItem({ productId, quantity, variantId: variantId || undefined });
      await get().fetchCart();
    } finally {
      set({ isLoading: false });
    }
  },

  updateItem: async (itemId, quantity) => {
    await cartApi.updateItem(itemId, { quantity });
    await get().fetchCart();
  },

  removeItem: async (itemId) => {
    await cartApi.removeItem(itemId);
    await get().fetchCart();
  },

  clearCart: async () => {
    await cartApi.clearCart();
    set({ items: [], total: 0, itemCount: 0 });
  },
}));
