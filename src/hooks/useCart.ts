import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { CartItem, Product, ProductVariant } from '../types';
import { LOCAL_STORAGE_KEYS, getFromLocalStorage, setToLocalStorage } from '../utils/localStorage';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, variant: ProductVariant, quantity?: number) => void;
  removeFromCart: (productId: string, variant: ProductVariant) => void;
  updateQuantity: (productId: string, variant: ProductVariant, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalAmount: () => number;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = getFromLocalStorage<CartItem[]>(LOCAL_STORAGE_KEYS.CART, []);
    setItems(savedCart);
  }, []);

  useEffect(() => {
    setToLocalStorage(LOCAL_STORAGE_KEYS.CART, items);
  }, [items]);

  const addToCart = (product: Product, variant: ProductVariant, quantity = 1) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(
        item => item.productId === product.id && item.variant.weight === variant.weight
      );

      if (existingItem) {
        return prevItems.map(item =>
          item.productId === product.id && item.variant.weight === variant.weight
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...prevItems, { productId: product.id, product, variant, quantity }];
    });
  };

  const removeFromCart = (productId: string, variant: ProductVariant) => {
    setItems(prevItems =>
      prevItems.filter(
        item => !(item.productId === productId && item.variant.weight === variant.weight)
      )
    );
  };

  const updateQuantity = (productId: string, variant: ProductVariant, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, variant);
      return;
    }

    setItems(prevItems =>
      prevItems.map(item =>
        item.productId === productId && item.variant.weight === variant.weight
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalAmount = () => {
    return items.reduce((total, item) => total + (item.variant.price * item.quantity), 0);
  };

  return React.createElement(
    CartContext.Provider,
    { value: {
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalItems,
      getTotalAmount
    }},
    children
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};