"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  ReactNode,
} from "react";

// ============================================================
// Types
// ============================================================

export type CartItem = {
  productId: string;
  name: string;
  pricePerKg: number;
  quantity: number; // số kg
  subtotal: number;
  imageUrl: string | null;
};

export type CustomerInfo = {
  name: string;
  phone: string;
  address: string;
};

type CartState = {
  items: CartItem[];
  hydrated: boolean;
};

type CartAction =
  | { type: "HYDRATE"; payload: CartItem[] }
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "UPDATE_QUANTITY"; payload: { product: { id: string; name: string; price_per_kg: number; image_url: string | null }; quantity: number } }
  | { type: "REMOVE_ITEM"; payload: { productId: string } }
  | { type: "CLEAR_CART" };

type CartContextType = {
  items: CartItem[];
  hydrated: boolean;
  totalAmount: number;
  totalItems: number;
  addItem: (product: { id: string; name: string; price_per_kg: number; image_url: string | null }, quantity: number) => void;
  updateQuantity: (product: { id: string; name: string; price_per_kg: number; image_url: string | null }, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
};

// ============================================================
// localStorage keys
// ============================================================

const CART_KEY = "hqt_cart";
export const CUSTOMER_KEY = "hqt_customer";

// ============================================================
// Reducer
// ============================================================

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "HYDRATE":
      return { ...state, items: action.payload, hydrated: true };

    case "ADD_ITEM": {
      const existing = state.items.find(
        (i) => i.productId === action.payload.productId
      );
      if (existing) {
        const newQty = existing.quantity + action.payload.quantity;
        return {
          ...state,
          items: state.items.map((i) =>
            i.productId === action.payload.productId
              ? { ...i, quantity: newQty, subtotal: newQty * i.pricePerKg }
              : i
          ),
        };
      }
      return { ...state, items: [...state.items, action.payload] };
    }

    case "UPDATE_QUANTITY": {
      const { product, quantity } = action.payload;
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((i) => i.productId !== product.id),
        };
      }
      
      const existing = state.items.find((i) => i.productId === product.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.productId === product.id
              ? {
                  ...i,
                  quantity: quantity,
                  subtotal: quantity * i.pricePerKg,
                }
              : i
          ),
        };
      } else {
        return {
          ...state,
          items: [
            ...state.items,
            {
              productId: product.id,
              name: product.name,
              pricePerKg: product.price_per_kg,
              quantity: quantity,
              subtotal: quantity * product.price_per_kg,
              imageUrl: product.image_url,
            }
          ]
        };
      }
    }

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter(
          (i) => i.productId !== action.payload.productId
        ),
      };

    case "CLEAR_CART":
      return { ...state, items: [] };

    default:
      return state;
  }
}

// ============================================================
// Context
// ============================================================

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    hydrated: false,
  });

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as CartItem[];
        if (Array.isArray(parsed)) {
          dispatch({ type: "HYDRATE", payload: parsed });
          return;
        }
      }
    } catch {
      // ignore parse errors
    }
    dispatch({ type: "HYDRATE", payload: [] });
  }, []);

  // Persist to localStorage whenever cart changes (after hydration)
  useEffect(() => {
    if (!state.hydrated) return;
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(state.items));
    } catch {
      // ignore storage errors (e.g. private browsing quota)
    }
  }, [state.items, state.hydrated]);

  // Derived values
  const totalAmount = state.items.reduce((sum, i) => sum + i.subtotal, 0);
  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);

  const addItem = useCallback(
    (
      product: { id: string; name: string; price_per_kg: number; image_url: string | null },
      quantity: number
    ) => {
      dispatch({
        type: "ADD_ITEM",
        payload: {
          productId: product.id,
          name: product.name,
          pricePerKg: product.price_per_kg,
          quantity,
          subtotal: quantity * product.price_per_kg,
          imageUrl: product.image_url,
        },
      });
    },
    []
  );

  const updateQuantity = useCallback((product: { id: string; name: string; price_per_kg: number; image_url: string | null }, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { product, quantity } as any });
  }, []);

  const removeItem = useCallback((productId: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: { productId } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR_CART" });
    try {
      localStorage.removeItem(CART_KEY);
    } catch {
      // ignore
    }
  }, []);

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        hydrated: state.hydrated,
        totalAmount,
        totalItems,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
}

// ============================================================
// Customer info helpers
// ============================================================

export function getCustomerInfo(): CustomerInfo | null {
  try {
    const stored = localStorage.getItem(CUSTOMER_KEY);
    if (stored) return JSON.parse(stored) as CustomerInfo;
  } catch {
    // ignore
  }
  return null;
}

export function saveCustomerInfo(info: CustomerInfo) {
  try {
    localStorage.setItem(CUSTOMER_KEY, JSON.stringify(info));
  } catch {
    // ignore
  }
}
