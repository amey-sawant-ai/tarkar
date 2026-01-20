"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
  dishId: string;
  name: string;
  price: number; // in paise
  quantity: number;
  image: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (dishId: string) => void;
  updateQuantity: (dishId: string, quantity: number) => void;
  clearCart: () => void;
  totalPrice: number;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (error) {
        console.error("Error loading cart:", error);
      }
    }
  }, []);

  // Save to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const addItem = (newItem: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.dishId === newItem.dishId);
      if (existing) {
        return prev.map((item) =>
          item.dishId === newItem.dishId
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item,
        );
      }
      return [...prev, newItem];
    });
  };

  const removeItem = (dishId: string) => {
    setItems((prev) => prev.filter((item) => item.dishId !== dishId));
  };

  const updateQuantity = (dishId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(dishId);
    } else {
      setItems((prev) =>
        prev.map((item) =>
          item.dishId === dishId ? { ...item, quantity } : item,
        ),
      );
    }
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalPrice,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
