"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import CartItemRow from "@/components/cart-item-row";
import BottomNav from "@/components/bottom-nav";

export default function CartPage() {
  const { items, totalAmount, clearCart } = useCart();
  const router = useRouter();

  const formattedTotal = new Intl.NumberFormat("vi-VN").format(totalAmount);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--color-bg)" }}>
      {/* Header */}
      <header
        style={{
          backgroundColor: "white",
          borderBottom: "1px solid var(--color-border-light)",
          padding: "1rem",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <span style={{ fontSize: "1.25rem" }}>🛒</span>
        <h1
          style={{
            fontSize: "1.125rem",
            fontWeight: 800,
            color: "var(--color-text)",
            flex: 1,
          }}
        >
          Giỏ hàng
        </h1>
        {items.length > 0 && (
          <button
            onClick={clearCart}
            style={{
              fontSize: "0.75rem",
              color: "var(--color-error)",
              fontWeight: 600,
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "0.25rem 0.5rem",
            }}
          >
            Xóa tất cả
          </button>
        )}
      </header>

      <main style={{ padding: "1rem" }}>
        {/* Empty state */}
        {items.length === 0 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "4rem 1rem",
              textAlign: "center",
              gap: "1rem",
            }}
          >
            <span style={{ fontSize: "4rem" }}>🛒</span>
            <h2
              style={{
                fontSize: "1.125rem",
                fontWeight: 800,
                color: "var(--color-text)",
              }}
            >
              Giỏ hàng trống
            </h2>
            <p style={{ color: "var(--color-text-muted)", fontSize: "0.875rem" }}>
              Bạn chưa chọn món nào. Hãy khám phá danh mục hải sản tươi ngon nhé!
            </p>
            <Link
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.75rem 1.5rem",
                backgroundColor: "var(--color-accent)",
                color: "white",
                borderRadius: "var(--radius-btn)",
                fontWeight: 700,
                fontSize: "0.9rem",
                textDecoration: "none",
                transition: "opacity 0.2s ease",
              }}
            >
              🌊 Xem sản phẩm
            </Link>
          </div>
        )}

        {/* Cart items */}
        {items.length > 0 && (
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem", marginBottom: "1rem" }}>
              {items.map((item) => (
                <CartItemRow key={item.productId} item={item} />
              ))}
            </div>

            {/* Order summary */}
            <div
              style={{
                backgroundColor: "var(--color-card)",
                borderRadius: "var(--radius-card)",
                border: "1px solid var(--color-border-light)",
                padding: "1rem",
                marginBottom: "1rem",
              }}
            >
              <h3
                style={{
                  fontWeight: 700,
                  color: "var(--color-text-muted)",
                  marginBottom: "0.75rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  fontSize: "0.75rem",
                }}
              >
                Tóm tắt đơn hàng
              </h3>

              {items.map((item) => (
                <div
                  key={item.productId}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "0.375rem",
                    fontSize: "0.875rem",
                  }}
                >
                  <span style={{ color: "var(--color-text-muted)" }}>
                    {item.name} × {item.quantity}kg
                  </span>
                  <span style={{ fontWeight: 600, color: "var(--color-text)" }}>
                    {new Intl.NumberFormat("vi-VN").format(item.subtotal)}đ
                  </span>
                </div>
              ))}

              <div
                style={{
                  borderTop: "1.5px dashed var(--color-border)",
                  marginTop: "0.75rem",
                  paddingTop: "0.75rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontWeight: 700,
                    color: "var(--color-text)",
                    fontSize: "1rem",
                  }}
                >
                  Tổng cộng
                </span>
                <span
                  style={{
                    fontWeight: 800,
                    color: "var(--color-accent)",
                    fontSize: "1.25rem",
                  }}
                >
                  {formattedTotal}đ
                </span>
              </div>

              <div
                style={{
                  marginTop: "0.625rem",
                  padding: "0.5rem 0.75rem",
                  backgroundColor: "#f0fdf4",
                  borderRadius: "0.5rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.375rem",
                }}
              >
                <span style={{ fontSize: "0.875rem" }}>💵</span>
                <span
                  style={{
                    fontSize: "0.8rem",
                    color: "#15803d",
                    fontWeight: 600,
                  }}
                >
                  Thanh toán khi nhận hàng (COD)
                </span>
              </div>
            </div>

            {/* Checkout button */}
            <button
              onClick={() => router.push("/checkout")}
              className="btn-primary"
            >
              Tiến hành đặt hàng →
            </button>

            <div className="pb-nav" />
          </>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
