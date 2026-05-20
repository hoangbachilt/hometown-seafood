"use client";

import { useCart } from "@/lib/cart-context";
import Image from "next/image";

export default function CartItemRow({
  item,
}: {
  item: {
    productId: string;
    name: string;
    pricePerKg: number;
    quantity: number;
    subtotal: number;
    imageUrl: string | null;
  };
}) {
  const { updateQuantity } = useCart();

  // Recreate partial Product object for the update context
  const dummyProduct = {
    id: item.productId,
    name: item.name,
    price_per_kg: item.pricePerKg,
    image_url: item.imageUrl,
    is_available: true,
    sort_order: 0,
    created_at: "",
  };

  const organicClasses = ["shape-organic-1", "shape-organic-2", "shape-organic-3"];
  const shapeClass = organicClasses[item.name.length % organicClasses.length];

  const handleIncrease = () => {
    updateQuantity(dummyProduct, item.quantity + 1);
  };

  const handleDecrease = () => {
    updateQuantity(dummyProduct, Math.max(0, item.quantity - 1));
  };

  return (
    <div
      className="animate-slide-up"
      style={{
        display: "flex",
        gap: "1rem",
        alignItems: "center",
        padding: "1rem 0",
        borderBottom: "1px solid var(--color-border)",
      }}
    >
      {/* Organic Image Thumbnail */}
      <div
        className={shapeClass}
        style={{
          width: "64px",
          height: "64px",
          backgroundColor: "var(--color-seafoam)",
          flexShrink: 0,
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            sizes="64px"
            style={{ objectFit: "cover" }}
          />
        ) : (
          <span style={{ fontSize: "1.5rem", opacity: 0.5 }}>🐟</span>
        )}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <h3
          style={{
            fontSize: "0.95rem",
            fontWeight: 700,
            color: "var(--color-text)",
            marginBottom: "0.25rem",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {item.name}
        </h3>
        <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
          {new Intl.NumberFormat("vi-VN").format(item.pricePerKg)}đ/kg
        </p>
        <div
          style={{
            marginTop: "0.25rem",
            fontSize: "0.95rem",
            fontWeight: 800,
            color: "var(--color-terracotta)",
          }}
        >
          {new Intl.NumberFormat("vi-VN").format(item.subtotal)}đ
        </div>
      </div>

      {/* Tactile Action (Inline Stepper) */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", alignItems: "flex-end" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "var(--color-sand)",
            borderRadius: "var(--radius-pill)",
            padding: "0 0.1rem", // minimal padding since buttons are 44x44
            border: "1.5px solid var(--color-terracotta)",
            color: "var(--color-terracotta)",
          }}
        >
          <button
            onClick={handleDecrease}
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              border: "none",
              backgroundColor: "transparent",
              color: "inherit",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
            onMouseDown={(e) => {
              const child = e.currentTarget.firstElementChild as HTMLElement;
              if (child) child.style.transform = "scale(0.85)";
            }}
            onMouseUp={(e) => {
              const child = e.currentTarget.firstElementChild as HTMLElement;
              if (child) child.style.transform = "scale(1)";
            }}
          >
            <div
              style={{
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1rem",
                fontWeight: 800,
                transition: "transform 0.1s",
              }}
            >
              -
            </div>
          </button>
          <span style={{ margin: "0", fontSize: "0.8rem", fontWeight: 800, width: "32px", textAlign: "center" }}>
            {item.quantity} kg
          </span>
          <button
            onClick={handleIncrease}
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              border: "none",
              backgroundColor: "transparent",
              color: "inherit",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
            onMouseDown={(e) => {
              const child = e.currentTarget.firstElementChild as HTMLElement;
              if (child) child.style.transform = "scale(0.85)";
            }}
            onMouseUp={(e) => {
              const child = e.currentTarget.firstElementChild as HTMLElement;
              if (child) child.style.transform = "scale(1)";
            }}
          >
            <div
              style={{
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1rem",
                fontWeight: 800,
                transition: "transform 0.1s",
              }}
            >
              +
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
