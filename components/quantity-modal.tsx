"use client";

import { useState, useEffect, useRef } from "react";
import { Product } from "@/lib/supabase";
import { useCart } from "@/lib/cart-context";

type Props = {
  product: Product;
  onClose: () => void;
};

const STEP = 0.5;
const MIN = 0.5;
const MAX = 20;

export default function QuantityModal({ product, onClose }: Props) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on backdrop click
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) onClose();
  };

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const decrease = () => setQuantity((q) => Math.max(MIN, parseFloat((q - STEP).toFixed(1))));
  const increase = () => setQuantity((q) => Math.min(MAX, parseFloat((q + STEP).toFixed(1))));

  const handleAdd = () => {
    addItem(
      { id: product.id, name: product.name, pricePerKg: product.price_per_kg },
      quantity
    );
    setAdded(true);
    setTimeout(() => {
      onClose();
    }, 700);
  };

  const subtotal = new Intl.NumberFormat("vi-VN").format(
    quantity * product.price_per_kg
  );

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(61, 35, 16, 0.5)",
        zIndex: 100,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
      }}
    >
      <div
        className="animate-slide-up"
        style={{
          width: "100%",
          maxWidth: "480px",
          backgroundColor: "var(--color-card)",
          borderRadius: "1.25rem 1.25rem 0 0",
          padding: "1.5rem",
          paddingBottom: "calc(1.5rem + env(safe-area-inset-bottom))",
        }}
      >
        {/* Handle bar */}
        <div
          style={{
            width: "3rem",
            height: "4px",
            backgroundColor: "var(--color-border)",
            borderRadius: "2px",
            margin: "0 auto 1.25rem",
          }}
        />

        {/* Product name & price */}
        <div style={{ marginBottom: "1.25rem" }}>
          <h2
            style={{
              fontSize: "1.125rem",
              fontWeight: 800,
              color: "var(--color-text)",
              marginBottom: "0.25rem",
            }}
          >
            {product.name}
          </h2>
          <p style={{ color: "var(--color-text-muted)", fontSize: "0.875rem" }}>
            {new Intl.NumberFormat("vi-VN").format(product.price_per_kg)}đ / kg
          </p>
        </div>

        {/* Quantity selector */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "var(--color-bg)",
            borderRadius: "var(--radius-btn)",
            padding: "0.5rem",
            marginBottom: "1rem",
          }}
        >
          <button
            onClick={decrease}
            disabled={quantity <= MIN}
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "0.625rem",
              border: "none",
              backgroundColor: quantity <= MIN ? "var(--color-border-light)" : "var(--color-primary)",
              color: quantity <= MIN ? "var(--color-text-light)" : "white",
              fontSize: "1.5rem",
              fontWeight: 700,
              cursor: quantity <= MIN ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.15s ease",
            }}
          >
            −
          </button>

          <div style={{ textAlign: "center" }}>
            <span
              style={{
                fontSize: "1.75rem",
                fontWeight: 800,
                color: "var(--color-text)",
                display: "block",
                lineHeight: 1,
              }}
            >
              {quantity}
            </span>
            <span
              style={{
                fontSize: "0.75rem",
                color: "var(--color-text-muted)",
                fontWeight: 600,
              }}
            >
              kg
            </span>
          </div>

          <button
            onClick={increase}
            disabled={quantity >= MAX}
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "0.625rem",
              border: "none",
              backgroundColor: quantity >= MAX ? "var(--color-border-light)" : "var(--color-accent)",
              color: quantity >= MAX ? "var(--color-text-light)" : "white",
              fontSize: "1.5rem",
              fontWeight: 700,
              cursor: quantity >= MAX ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.15s ease",
            }}
          >
            +
          </button>
        </div>

        {/* Subtotal */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "1.25rem",
            padding: "0.625rem",
            backgroundColor: "var(--color-bg-alt)",
            borderRadius: "0.75rem",
          }}
        >
          <span style={{ color: "var(--color-text-muted)", fontSize: "0.875rem" }}>
            Thành tiền:{" "}
          </span>
          <span
            style={{
              fontSize: "1.125rem",
              fontWeight: 800,
              color: "var(--color-accent)",
            }}
          >
            {subtotal}đ
          </span>
        </div>

        {/* Add button */}
        <button
          onClick={handleAdd}
          disabled={added}
          className="btn-primary"
          style={added ? { backgroundColor: "var(--color-success)", background: "var(--color-success)" } : {}}
        >
          {added ? (
            <>✓ Đã thêm vào giỏ!</>
          ) : (
            <>🛒 Thêm vào giỏ hàng</>
          )}
        </button>
      </div>
    </div>
  );
}
