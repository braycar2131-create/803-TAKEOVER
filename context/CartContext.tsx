"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
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
  cartCount: number;
  subtotal: number;

  openCart: () => void;
  closeCart: () => void;

  addItem: (item: CartItem) => void;

  removeItem: (
    slug: string,
    size: string
  ) => void;

  updateQuantity: (
    slug: string,
    size: string,
    quantity: number
  ) => void;

  clearCart: () => void;
};

const STORAGE_KEY = "803-cart";

const CartContext =
  createContext<CartContextType | null>(null);

function isCartItem(
  value: unknown
): value is CartItem {
  if (
    typeof value !== "object" ||
    value === null
  ) {
    return false;
  }

  const item = value as Partial<CartItem>;

  return (
    typeof item.slug === "string" &&
    typeof item.name === "string" &&
    typeof item.price === "number" &&
    typeof item.displayPrice === "string" &&
    typeof item.image === "string" &&
    typeof item.size === "string" &&
    typeof item.quantity === "number"
  );
}

function readSavedCart(): CartItem[] {
  try {
    const saved =
      window.localStorage.getItem(
        STORAGE_KEY
      );

    if (!saved) {
      return [];
    }

    const parsed: unknown =
      JSON.parse(saved);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isCartItem);
  } catch (error) {
    console.error(
      "Unable to load saved cart:",
      error
    );

    return [];
  }
}

export function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [items, setItems] =
    useState<CartItem[]>([]);

  const [isOpen, setIsOpen] =
    useState(false);

  const [hydrated, setHydrated] =
    useState(false);

  useEffect(() => {
    const timer =
      window.setTimeout(() => {
        setItems(readSavedCart());
        setHydrated(true);
      }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(items)
      );
    } catch (error) {
      console.error(
        "Unable to save cart:",
        error
      );
    }
  }, [items, hydrated]);

  const cartCount = useMemo(
    () =>
      items.reduce(
        (total, item) =>
          total + item.quantity,
        0
      ),
    [items]
  );

  const subtotal = useMemo(
    () =>
      items.reduce(
        (total, item) =>
          total +
          item.price * item.quantity,
        0
      ),
    [items]
  );

  const openCart =
    useCallback(() => {
      setIsOpen(true);
    }, []);

  const closeCart =
    useCallback(() => {
      setIsOpen(false);
    }, []);

  const addItem = useCallback(
    (item: CartItem) => {
      setItems((current) => {
        const existing =
          current.find(
            (cartItem) =>
              cartItem.slug ===
                item.slug &&
              cartItem.size ===
                item.size
          );

        if (!existing) {
          return [
            ...current,
            item,
          ];
        }

        return current.map(
          (cartItem) =>
            cartItem.slug ===
                item.slug &&
            cartItem.size ===
                item.size
              ? {
                  ...cartItem,

                  quantity:
                    cartItem.quantity +
                    item.quantity,
                }
              : cartItem
        );
      });

      setIsOpen(true);
    },
    []
  );

  const removeItem =
    useCallback(
      (
        slug: string,
        size: string
      ) => {
        setItems((current) =>
          current.filter(
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

  const updateQuantity =
    useCallback(
      (
        slug: string,
        size: string,
        quantity: number
      ) => {
        if (quantity < 1) {
          setItems((current) =>
            current.filter(
              (item) =>
                !(
                  item.slug === slug &&
                  item.size === size
                )
            )
          );

          return;
        }

        setItems((current) =>
          current.map((item) =>
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

  const clearCart =
    useCallback(() => {
      setItems([]);

      window.localStorage.removeItem(
        STORAGE_KEY
      );
    }, []);

  const value =
    useMemo<CartContextType>(
      () => ({
        items,
        isOpen,
        cartCount,
        subtotal,
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
        cartCount,
        subtotal,
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
  const context =
    useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider."
    );
  }

  return context;
}