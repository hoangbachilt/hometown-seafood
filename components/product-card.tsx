"use client";

import { Product } from "@/lib/supabase";
import { useCart } from "@/lib/cart-context";
import Image from "next/image";
import { useState } from "react";
import ProductDetailSheet from "./product-detail-sheet";
import { PRODUCT_IMAGES_MAP, getProductUnit } from "@/lib/data";

export default function ProductCard({
  product,
}: {
  product: Product;
}) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { items, addItem, updateQuantity } = useCart();

  const cartItem = items.find((i) => i.productId === product.id);
  const initialQuantity = cartItem ? cartItem.quantity : 0;

  const extraImages = PRODUCT_IMAGES_MAP[product.id] || [];
  const displayImage = product.image_url || extraImages[0];
  const isVideo = displayImage?.toLowerCase().endsWith(".mp4") || displayImage?.toLowerCase().endsWith(".webm");
  
  const unit = getProductUnit(product.id);

  const handleAdd = () => {
    addItem(product, 1);
  };

  const handleIncrease = () => {
    updateQuantity(product, initialQuantity + 1);
  };

  const handleDecrease = () => {
    updateQuantity(product, Math.max(0, initialQuantity - 1));
  };

  // Earthen Tides: Organic shapes for image placeholders
  const organicClasses = ["shape-organic-1", "shape-organic-2", "shape-organic-3"];
  const shapeClass = organicClasses[product.name.length % organicClasses.length];

  return (
    <div
      className="animate-slide-up"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        padding: "0.5rem",
      }}
    >
      {/* Organic Image or Placeholder */}
      <div
        style={{
          width: "100%",
          aspectRatio: "1/1",
          position: "relative",
          overflow: "hidden",
          borderRadius: "50%",
          backgroundColor: "var(--color-seafoam)",
          boxShadow: "inset 0 0 20px rgba(56, 41, 35, 0.05)",
          cursor: "pointer",
          transition: "transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.transform = "scale(1.02)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.transform = "scale(1)";
        }}
      >
        <div
          onClick={() => setIsSheetOpen(true)}
          style={{ width: "100%", height: "100%", position: "relative" }}
        >
          {displayImage ? (
            isVideo ? (
              <video
                src={displayImage}
                autoPlay
                muted
                loop
                playsInline
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <Image
                src={displayImage}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                style={{ objectFit: "cover" }}
              />
            )
          ) : (
            <span style={{ fontSize: "2.5rem", opacity: 0.5, display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%" }}>🐟</span>
          )}
        </div>
      </div>

      {/* Minimalist Info */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", padding: "0 0.25rem" }}>
        <h3
          style={{
            fontSize: "0.95rem",
            fontWeight: 700,
            color: "var(--color-text)",
            lineHeight: 1.3,
          }}
          className="text-balance"
        >
          {product.name}
        </h3>
        <p
          style={{
            fontSize: "0.85rem",
            fontWeight: 400, // whisper-quiet
            color: "var(--color-text-muted)",
          }}
        >
          {new Intl.NumberFormat("vi-VN").format(product.price_per_kg)}đ/{unit}
        </p>
      </div>

      {/* Inline Progressive Stepper */}
      <div style={{ marginTop: "auto", minHeight: "36px", display: "flex", alignItems: "center" }}>
        {initialQuantity === 0 ? (
          <button
            onClick={handleAdd}
            className="shadow-tactile"
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "transparent",
              color: "var(--color-terracotta)",
              border: "1.5px solid var(--color-terracotta)",
              borderRadius: "var(--radius-pill)",
              fontSize: "0.8rem",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              const t = e.currentTarget as HTMLElement;
              t.style.backgroundColor = "var(--color-terracotta)";
              t.style.color = "var(--color-sand)";
            }}
            onMouseLeave={(e) => {
              const t = e.currentTarget as HTMLElement;
              t.style.backgroundColor = "transparent";
              t.style.color = "var(--color-terracotta)";
            }}
            onMouseDown={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "scale(0.96)";
            }}
            onMouseUp={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "scale(1)";
            }}
          >
            + Thêm
          </button>
        ) : (
          <div
            className="animate-tide-in"
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "var(--color-terracotta)",
              borderRadius: "var(--radius-pill)",
              padding: "0.25rem",
              color: "var(--color-sand)",
              boxShadow: "0 4px 10px rgba(196, 90, 54, 0.2)",
            }}
          >
            <button
              onClick={handleDecrease}
              style={{
                width: "44px", // Touch target size Apple HIG
                height: "44px",
                borderRadius: "50%",
                border: "none",
                backgroundColor: "transparent", // Make the actual visual button smaller via pseudo element or just keep the background small
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
              {/* Visual Button */}
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.2rem",
                  transition: "transform 0.1s",
                }}
              >
                -
              </div>
            </button>
            <span style={{ margin: "0 0.25rem", fontSize: "0.85rem", fontWeight: 800, width: "32px", textAlign: "center", whiteSpace: "nowrap" }}>
              {initialQuantity} {unit === "kg" ? "kg" : "x"}
            </span>
            <button
              onClick={handleIncrease}
              style={{
                width: "44px", // Touch target size Apple HIG
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
              {/* Visual Button */}
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.2rem",
                  transition: "transform 0.1s",
                }}
              >
                +
              </div>
            </button>
          </div>
        )}
      </div>

      <ProductDetailSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        product={product}
        initialQuantity={initialQuantity}
      />
    </div>
  );
}
