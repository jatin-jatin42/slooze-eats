'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useMutation, useQuery, gql } from '@apollo/client';

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`;

const ME_QUERY = gql`
  query Me {
    me
  }
`;

const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout
  }
`;

interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'MANAGER' | 'MEMBER';
  country: 'INDIA' | 'AMERICA';
}

interface CartItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  restaurantId: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (menuItemId: string) => void;
  clearCart: () => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  cartTotal: number;
  cartRestaurantId: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);

  const [loginMutation] = useMutation(LOGIN_MUTATION);
  const [logoutMutation] = useMutation(LOGOUT_MUTATION);

  const { refetch: refetchMe, data: meData, error: meError } = useQuery(ME_QUERY, {
    skip: true,
  });

  useEffect(() => {
    if (meData?.me) {
      setUser(JSON.parse(meData.me));
      setLoading(false);
    } else if (meError) {
      setUser(null);
      setLoading(false);
    }
  }, [meData, meError]);

  useEffect(() => {
    refetchMe()
      .then((result) => {
        if (result.data?.me) setUser(JSON.parse(result.data.me));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [refetchMe]);

  const login = useCallback(async (email: string, password: string) => {
    const result = await loginMutation({ variables: { email, password } });
    const parsed = JSON.parse(result.data.login);
    setUser(parsed.user);
  }, [loginMutation]);

  const logout = useCallback(async () => {
    await logoutMutation();
    setUser(null);
    setCart([]);
  }, [logoutMutation]);

  const addToCart = useCallback((item: CartItem) => {
    setCart((prev) => {
      // Can only cart from one restaurant at a time
      if (prev.length > 0 && prev[0].restaurantId !== item.restaurantId) {
        return [item];
      }
      const existing = prev.find((i) => i.menuItemId === item.menuItemId);
      if (existing) {
        return prev.map((i) =>
          i.menuItemId === item.menuItemId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i,
        );
      }
      return [...prev, item];
    });
  }, []);

  const removeFromCart = useCallback((menuItemId: string) => {
    setCart((prev) => prev.filter((i) => i.menuItemId !== menuItemId));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const updateQuantity = useCallback((menuItemId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((i) => i.menuItemId !== menuItemId));
    } else {
      setCart((prev) =>
        prev.map((i) => (i.menuItemId === menuItemId ? { ...i, quantity } : i)),
      );
    }
  }, []);

  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const cartRestaurantId = cart[0]?.restaurantId || null;

  return (
    <AuthContext.Provider
      value={{
        user, loading, login, logout,
        cart, addToCart, removeFromCart, clearCart, updateQuantity,
        cartTotal, cartRestaurantId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function useCanCheckout() {
  const { user } = useAuth();
  return user?.role === 'ADMIN' || user?.role === 'MANAGER';
}

export function useCanManagePayments() {
  const { user } = useAuth();
  return user?.role === 'ADMIN';
}
