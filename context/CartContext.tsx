"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CartItem = {
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
  subtotal: number;
  cartCount: number;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: CartItem) => void;
  removeItem: (slug: string, size: string) => void;
  updateQuantity: (
    slug: string,
    size: string,
    quantity: number
  ) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(
  undefined
);

const STORAGE_KEY = "803-takeover-cart";

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedCart = window.localStorage.getItem(STORAGE_KEY);

      if (savedCart) {
        const parsedCart = JSON.parse(savedCart) as CartItem[];

        if (Array.isArray(parsedCart)) {
          setItems(parsedCart);
        }
      }
    } catch (error) {
      console.error("Failed to load cart:", error);
    } finally {
      setHasLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!hasLoaded) return;

    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(items)
      );
    } catch (error) {
      console.error("Failed to save cart:", error);
    }
  }, [items, hasLoaded]);

  const subtotal = useMemo(() => {
    return items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }, [items]);

  const cartCount = useMemo(() => {
    return items.reduce(
      (total, item) => total + item.quantity,
      0
    );
  }, [items]);

  const openCart = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeCart = useCallback(() => {
    setIsOpen(false);
  }, []);

  const addItem = useCallback((newItem: CartItem) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) =>
          item.slug === newItem.slug &&
          item.size === newItem.size
      );

      if (existingItem) {
        return currentItems.map((item) =>
          item.slug === newItem.slug &&
          item.size === newItem.size
            ? {
                ...item,
                quantity:
                  item.quantity + newItem.quantity,
              }
            : item
        );
      }

      return [...currentItems, newItem];
    });

    setIsOpen(true);
  }, []);

  const removeItem = useCallback(
    (slug: string, size: string) => {
      setItems((currentItems) =>
        currentItems.filter(
          (item) =>
            !(
              item.slug === slug &&
              item.size === size
            )
        )
      );
    },
    []
  );

  const updateQuantity = useCallback(
    (
      slug: string,
      size: string,
      quantity: number
    ) => {
      if (quantity <= 0) {
        setItems((currentItems) =>
          currentItems.filter(
            (item) =>
              !(
                item.slug === slug &&
                item.size === size
              )
          )
        );

        return;
      }

      setItems((currentItems) =>
        currentItems.map((item) =>
          item.slug === slug &&
          item.size === size
            ? {
                ...item,
                quantity,
              }
            : item
        )
      );
    },
    []
  );

  const clearCart = useCallback(() => {
    setItems([]);
    setIsOpen(false);
  }, []);

  const value = useMemo<CartContextType>(
    () => ({
      items,
      isOpen,
      subtotal,
      cartCount,
      openCart,
      closeCart,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    }),
    [
      items,
      isOpen,
      subtotal,
      cartCount,
      openCart,
      closeCart,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    ]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}