"use client";

import { useCart } from "@/lib/cart-context";
import { useRouter } from "next/navigation";
import CartItemRow from "@/components/cart-item-row";
import BottomNav from "@/components/bottom-nav";

export default function CartPage() {
  const { items, totalAmount, clearCart } = useCart();
  const router = useRouter();

  const formattedTotal = new Intl.NumberFormat("vi-VN").format(totalAmount);

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Abstract minimal header */}
      <header
        style={{
          padding: "2rem 1.5rem 1rem",
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
        }}
      >
        <h1
          style={{
            fontSize: "1.75rem",
            fontWeight: 800,
            color: "var(--color-abyssal)",
            letterSpacing: "-0.02em",
          }}
        >
          Giỏ hàng
        </h1>
        {items.length > 0 && (
          <button
            onClick={clearCart}
            style={{
              fontSize: "0.8rem",
              color: "var(--color-terracotta)",
              fontWeight: 600,
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            Xóa tất cả
          </button>
        )}
      </header>

      <main style={{ padding: "0 1.5rem 1rem" }}>
        {items.length === 0 ? (
          <div
            className="animate-tide-in"
            style={{
              textAlign: "center",
              padding: "4rem 1rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "var(--radius-organic-1)",
                backgroundColor: "var(--color-seafoam)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2rem",
                opacity: 0.8,
              }}
            >
              🌊
            </div>
            <div>
              <p style={{ fontWeight: 700, color: "var(--color-text)", fontSize: "1.1rem" }}>
                Giỏ hàng trống
              </p>
              <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem", marginTop: "0.25rem" }}>
                Hãy chọn thêm những món hải sản tươi ngon nhé!
              </p>
            </div>
            <button
              onClick={() => router.push("/")}
              className="btn-primary"
              style={{ width: "auto", padding: "0.75rem 2rem", marginTop: "1rem" }}
            >
              Xem thực đơn
            </button>
          </div>
        ) : (
          <div className="animate-slide-up">
            <div style={{ display: "flex", flexDirection: "column" }}>
              {items.map((item) => (
                <CartItemRow key={item.productId} item={item} />
              ))}
            </div>

            <div
              style={{
                marginTop: "2rem",
                padding: "1.5rem",
                backgroundColor: "var(--color-sand-alt)",
                borderRadius: "24px", // soft curves
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <span style={{ fontSize: "1rem", fontWeight: 600, color: "var(--color-abyssal-muted)" }}>
                  Tổng cộng
                </span>
                <span style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--color-terracotta)" }}>
                  {formattedTotal}đ
                </span>
              </div>
              <button onClick={() => router.push("/checkout")} className="btn-primary">
                Tiếp tục thanh toán
              </button>
            </div>
          </div>
        )}

        <div className="pb-nav" />
      </main>

      <BottomNav />
    </div>
  );
}
