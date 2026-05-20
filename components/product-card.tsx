"use client";

import Image from "next/image";
import { useState } from "react";
import { Product } from "@/lib/supabase";
import QuantityModal from "./quantity-modal";

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  const [modalOpen, setModalOpen] = useState(false);

  const formattedPrice = new Intl.NumberFormat("vi-VN").format(
    product.price_per_kg
  );

  return (
    <>
      <div
        style={{
          backgroundColor: "var(--color-card)",
          borderRadius: "var(--radius-card)",
          border: "1px solid var(--color-border-light)",
          overflow: "hidden",
          transition: "box-shadow 0.2s ease, transform 0.2s ease",
        }}
        className="shadow-card"
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
        }}
      >
        {/* Product Image */}
        <div
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "4/3",
            backgroundColor: "var(--color-bg-alt)",
            overflow: "hidden",
          }}
        >
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              style={{ objectFit: "cover" }}
              sizes="(max-width: 480px) 50vw, 240px"
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "3rem",
                background:
                  "linear-gradient(135deg, var(--color-bg-alt) 0%, var(--color-border-light) 100%)",
              }}
            >
              🐟
            </div>
          )}
        </div>

        {/* Product Info */}
        <div style={{ padding: "0.75rem" }}>
          <h3
            style={{
              fontSize: "0.875rem",
              fontWeight: 700,
              color: "var(--color-text)",
              marginBottom: "0.25rem",
              lineHeight: 1.3,
            }}
          >
            {product.name}
          </h3>
          <p
            style={{
              fontSize: "0.8rem",
              color: "var(--color-accent)",
              fontWeight: 800,
              marginBottom: "0.625rem",
            }}
          >
            {formattedPrice}đ
            <span
              style={{
                fontSize: "0.7rem",
                color: "var(--color-text-muted)",
                fontWeight: 600,
              }}
            >
              {" "}/ kg
            </span>
          </p>

          <button
            onClick={() => setModalOpen(true)}
            style={{
              width: "100%",
              padding: "0.5rem",
              backgroundColor: "var(--color-accent)",
              color: "white",
              borderRadius: "var(--radius-btn)",
              border: "none",
              fontSize: "0.8rem",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.25rem",
              transition: "background-color 0.2s ease, transform 0.15s ease",
              fontFamily: "var(--font-sans)",
            }}
            onMouseDown={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.96)";
            }}
            onMouseUp={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
            }}
          >
            <span style={{ fontSize: "1rem" }}>+</span> Thêm
          </button>
        </div>
      </div>

      {modalOpen && (
        <QuantityModal
          product={product}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}
