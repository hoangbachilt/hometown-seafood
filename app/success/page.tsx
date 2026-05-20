"use client";

import { useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  // Short order ID for display (first 8 chars)
  const shortId = orderId ? orderId.slice(0, 8).toUpperCase() : "—";

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--color-bg)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1.5rem",
        textAlign: "center",
      }}
    >
      {/* Success icon */}
      <div
        className="animate-check-bounce"
        style={{
          width: "96px",
          height: "96px",
          borderRadius: "50%",
          backgroundColor: "#dcfce7",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "1.5rem",
        }}
      >
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#16a34a"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      {/* Title */}
      <h1
        style={{
          fontSize: "1.5rem",
          fontWeight: 800,
          color: "var(--color-text)",
          marginBottom: "0.5rem",
        }}
      >
        Đặt hàng thành công! 🎉
      </h1>

      <p
        style={{
          color: "var(--color-text-muted)",
          fontSize: "0.9rem",
          marginBottom: "0.25rem",
        }}
      >
        Mã đơn hàng:{" "}
        <span style={{ fontWeight: 800, color: "var(--color-primary)", fontFamily: "monospace" }}>
          #{shortId}
        </span>
      </p>

      {/* Notice card */}
      <div
        className="animate-fade-in"
        style={{
          backgroundColor: "var(--color-card)",
          border: "1px solid var(--color-border-light)",
          borderRadius: "var(--radius-card)",
          padding: "1.25rem",
          marginTop: "1.5rem",
          marginBottom: "1.5rem",
          width: "100%",
          maxWidth: "360px",
          textAlign: "left",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
            <span style={{ fontSize: "1.25rem", flexShrink: 0 }}>📞</span>
            <div>
              <p style={{ fontWeight: 700, color: "var(--color-text)", fontSize: "0.875rem" }}>
                Xác nhận đơn hàng
              </p>
              <p style={{ color: "var(--color-text-muted)", fontSize: "0.8rem" }}>
                Shop sẽ liên hệ xác nhận đơn hàng trong thời gian sớm nhất
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
            <span style={{ fontSize: "1.25rem", flexShrink: 0 }}>🚚</span>
            <div>
              <p style={{ fontWeight: 700, color: "var(--color-text)", fontSize: "0.875rem" }}>
                Giao hàng tận nơi
              </p>
              <p style={{ color: "var(--color-text-muted)", fontSize: "0.8rem" }}>
                Hàng tươi sẽ được giao đến địa chỉ bạn đã cung cấp
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
            <span style={{ fontSize: "1.25rem", flexShrink: 0 }}>💵</span>
            <div>
              <p style={{ fontWeight: 700, color: "var(--color-text)", fontSize: "0.875rem" }}>
                Thanh toán khi nhận
              </p>
              <p style={{ color: "var(--color-text-muted)", fontSize: "0.8rem" }}>
                Chỉ cần trả tiền mặt khi nhận được hàng (COD)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA button */}
      <Link
        href="/"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.875rem 2rem",
          background: "linear-gradient(135deg, #a84e06 0%, #c9620a 100%)",
          color: "white",
          borderRadius: "var(--radius-btn)",
          fontWeight: 700,
          fontSize: "0.95rem",
          textDecoration: "none",
          boxShadow: "0 4px 14px rgba(201, 98, 10, 0.3)",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
        }}
      >
        🌊 Tiếp tục mua sắm
      </Link>

      <p
        style={{
          marginTop: "1rem",
          fontSize: "0.8rem",
          color: "var(--color-text-light)",
        }}
      >
        Cảm ơn bạn đã tin tưởng lựa chọn hải sản của chúng tôi! 🦑
      </p>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}
