import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { Product } from '../types';
import { LOCAL_STORAGE_KEYS, getFromLocalStorage, setToLocalStorage } from '../utils/localStorage';

export interface WishlistItem {
  productId: string;
  product: Product;
}

interface WishlistContextType {
  items: WishlistItem[];
  toggle: (product: Product) => void;
  remove: (productId: string) => void;
  clear: () => void;
  isWishlisted: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    const saved = getFromLocalStorage<WishlistItem[]>(LOCAL_STORAGE_KEYS.WISHLIST, []);
    setItems(saved);
  }, []);

  useEffect(() => {
    setToLocalStorage(LOCAL_STORAGE_KEYS.WISHLIST, items);
  }, [items]);

  const toggle = (product: Product) => {
    setItems(prev => {
      const exists = prev.some(i => i.productId === product.id);
      if (exists) {
        return prev.filter(i => i.productId !== product.id);
      }
      return [...prev, { productId: product.id, product }];
    });
  };

  const remove = (productId: string) => {
    setItems(prev => prev.filter(i => i.productId !== productId));
  };

  const clear = () => setItems([]);

  const isWishlisted = (productId: string) => items.some(i => i.productId === productId);

  const value = useMemo(() => ({ items, toggle, remove, clear, isWishlisted }), [items]);

  return React.createElement(WishlistContext.Provider, { value }, children);
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
};


