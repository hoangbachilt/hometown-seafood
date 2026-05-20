"use client";

import { CartItem, useCart } from "@/lib/cart-context";

type Props = {
  item: CartItem;
};

export default function CartItemRow({ item }: Props) {
  const { updateQuantity, removeItem } = useCart();
  const STEP = 0.5;

  const formattedSubtotal = new Intl.NumberFormat("vi-VN").format(item.subtotal);
  const formattedPrice = new Intl.NumberFormat("vi-VN").format(item.pricePerKg);

  return (
    <div
      style={{
        backgroundColor: "var(--color-card)",
        borderRadius: "var(--radius-card)",
        border: "1px solid var(--color-border-light)",
        padding: "0.875rem",
        display: "flex",
        gap: "0.75rem",
        alignItems: "center",
      }}
    >
      {/* Emoji icon */}
      <div
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "0.75rem",
          backgroundColor: "var(--color-bg-alt)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.5rem",
          flexShrink: 0,
        }}
      >
        🐟
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontSize: "0.875rem",
            fontWeight: 700,
            color: "var(--color-text)",
            marginBottom: "0.125rem",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {item.name}
        </p>
        <p
          style={{
            fontSize: "0.75rem",
            color: "var(--color-text-muted)",
            marginBottom: "0.5rem",
          }}
        >
          {formattedPrice}đ/kg
        </p>

        {/* Qty controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <button
            onClick={() =>
              updateQuantity(item.productId, parseFloat((item.quantity - STEP).toFixed(1)))
            }
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "8px",
              border: "1.5px solid var(--color-border)",
              backgroundColor: "white",
              color: "var(--color-primary)",
              fontSize: "1rem",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.15s ease",
            }}
          >
            −
          </button>

          <span
            style={{
              fontSize: "0.875rem",
              fontWeight: 800,
              color: "var(--color-text)",
              minWidth: "40px",
              textAlign: "center",
            }}
          >
            {item.quantity} kg
          </span>

          <button
            onClick={() =>
              updateQuantity(item.productId, parseFloat((item.quantity + STEP).toFixed(1)))
            }
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "var(--color-accent)",
              color: "white",
              fontSize: "1rem",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.15s ease",
            }}
          >
            +
          </button>
        </div>
      </div>

      {/* Subtotal + delete */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: "0.5rem",
          flexShrink: 0,
        }}
      >
        <p
          style={{
            fontSize: "0.9rem",
            fontWeight: 800,
            color: "var(--color-accent)",
          }}
        >
          {formattedSubtotal}đ
        </p>

        <button
          onClick={() => removeItem(item.productId)}
          style={{
            width: "28px",
            height: "28px",
            borderRadius: "8px",
            border: "1.5px solid #fecaca",
            backgroundColor: "#fff5f5",
            color: "#e05252",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.15s ease",
          }}
          title="Xóa"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
          </svg>
        </button>
      </div>
    </div>
  );
}
