'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { api } from '@/lib/api';
import { useAuth } from './AuthContext';
import type { CartItem } from '@/types';

interface CartContextValue {
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  count: number;
  loading: boolean;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user, token } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!user || !token) {
      setItems([]);
      setSubtotal(0);
      setDeliveryFee(0);
      setTotal(0);
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.get('/cart');
      setItems(data.data.items);
      setSubtotal(data.data.subtotal);
      setDeliveryFee(data.data.deliveryFee);
      setTotal(data.data.total);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [user, token]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const count = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      subtotal,
      deliveryFee,
      total,
      count,
      loading,
      drawerOpen,
      setDrawerOpen,
      refreshCart,
    }),
    [items, subtotal, deliveryFee, total, count, loading, drawerOpen, refreshCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
