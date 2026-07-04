import { create } from 'zustand';
import { OrderFormData } from '../types';

interface CartState {
  items: OrderFormData[];
  couponCode: string | null;
  couponDiscount: number; // in percentage or flat cents
  couponType: 'PERCENTAGE' | 'FIXED' | null;
  addItem: (item: OrderFormData) => void;
  removeItem: (serviceId: string) => void;
  updateItem: (serviceId: string, item: Partial<OrderFormData>) => void;
  applyCoupon: (code: string, value: number, type: 'PERCENTAGE' | 'FIXED') => void;
  removeCoupon: () => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  couponCode: null,
  couponDiscount: 0,
  couponType: null,
  addItem: (item) =>
    set((state) => {
      const exists = state.items.find((i) => i.serviceId === item.serviceId);
      if (exists) {
        return {
          items: state.items.map((i) => (i.serviceId === item.serviceId ? item : i)),
        };
      }
      return { items: [...state.items, item] };
    }),
  removeItem: (serviceId) =>
    set((state) => ({
      items: state.items.filter((i) => i.serviceId !== serviceId),
    })),
  updateItem: (serviceId, itemUpdate) =>
    set((state) => ({
      items: state.items.map((i) => (i.serviceId === serviceId ? { ...i, ...itemUpdate } : i)),
    })),
  applyCoupon: (code, value, type) =>
    set({
      couponCode: code,
      couponDiscount: value,
      couponType: type,
    }),
  removeCoupon: () =>
    set({
      couponCode: null,
      couponDiscount: 0,
      couponType: null,
    }),
  clearCart: () => set({ items: [], couponCode: null, couponDiscount: 0, couponType: null }),
}));
