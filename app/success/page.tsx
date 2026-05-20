"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
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
      className="animate-tide-in"
    >
      {/* Meditative Icon */}
      <div
        style={{
          width: "120px",
          height: "120px",
          borderRadius: "var(--radius-organic-2)",
          backgroundColor: "var(--color-seafoam)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "2.5rem",
          boxShadow: "0 20px 40px rgba(216, 226, 220, 0.5)",
        }}
      >
        <span style={{ fontSize: "3rem", opacity: 0.8 }}>🌊</span>
      </div>

      <h1
        style={{
          fontSize: "1.5rem",
          fontWeight: 800,
          color: "var(--color-abyssal)",
          marginBottom: "1rem",
          letterSpacing: "-0.02em",
        }}
      >
        Đơn hàng đang trôi về phía bạn
      </h1>

      <p
        style={{
          color: "var(--color-abyssal-muted)",
          fontSize: "1rem",
          fontWeight: 300,
          lineHeight: 1.6,
          maxWidth: "300px",
          marginBottom: "2.5rem",
        }}
      >
        Mã số hành trình: <br />
        <span style={{ fontWeight: 700, color: "var(--color-terracotta)", letterSpacing: "0.1em" }}>
          #{shortId}
        </span>
      </p>

      <Link
        href="/"
        className="btn-primary"
        style={{
          width: "auto",
          padding: "1rem 2.5rem",
          backgroundColor: "var(--color-abyssal)", // Use abyssal blue for calming effect
          color: "var(--color-sand)",
        }}
      >
        Trở về bến
      </Link>
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
