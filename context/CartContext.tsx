"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type CartItem = {
  slug: string;
  name: string;
  price: number;
  displayPrice: string;
  image: string;
  size: string;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  isOpen: boolean;
  cartCount: number;
  subtotal: number;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: CartItem) => void;
  removeItem: (slug: string, size: string) => void;
  updateQuantity: (slug: string, size: string, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("803-cart");
    if (saved) setItems(JSON.parse(saved));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem("803-cart", JSON.stringify(items));
  }, [items, hydrated]);

  const cartCount = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((total, item) => total + item.price * item.quantity, 0),
    [items]
  );

  function addItem(item: CartItem) {
    setItems((current) => {
      const exists = current.find(
        (cartItem) => cartItem.slug === item.slug && cartItem.size === item.size
      );

      if (!exists) return [...current, item];

      return current.map((cartItem) =>
        cartItem.slug === item.slug && cartItem.size === item.size
          ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
          : cartItem
      );
    });

    setIsOpen(true);
  }

  function removeItem(slug: string, size: string) {
    setItems((current) => current.filter((item) => !(item.slug === slug && item.size === size)));
  }

  function updateQuantity(slug: string, size: string, quantity: number) {
    if (quantity < 1) {
      removeItem(slug, size);
      return;
    }

    setItems((current) =>
      current.map((item) =>
        item.slug === slug && item.size === size ? { ...item, quantity } : item
      )
    );
  }

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        cartCount,
        subtotal,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        addItem,
        removeItem,
        updateQuantity,
        clearCart: () => setItems([]),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
