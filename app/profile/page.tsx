"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCustomerInfo, saveCustomerInfo, CUSTOMER_KEY } from "@/lib/cart-context";
import BottomNav from "@/components/bottom-nav";

type FormData = {
  name: string;
  phone: string;
  address: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>({ name: "", phone: "", address: "" });
  const [saved, setSaved] = useState(false);
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    const info = getCustomerInfo();
    if (info) {
      setForm({ name: info.name || "", phone: info.phone || "", address: info.address || "" });
      setHasData(true);
    }
  }, []);

  const handleSave = () => {
    saveCustomerInfo(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setHasData(true);
  };

  const handleClear = () => {
    try { localStorage.removeItem(CUSTOMER_KEY); } catch {}
    setForm({ name: "", phone: "", address: "" });
    setHasData(false);
  };

  const inputStyle = {
    width: "100%",
    padding: "0.75rem 1rem",
    backgroundColor: "white",
    border: "1.5px solid var(--color-border)",
    borderRadius: "0.75rem",
    fontSize: "1rem",
    color: "var(--color-text)",
    fontFamily: "var(--font-sans)",
    outline: "none",
    boxSizing: "border-box" as const,
  };

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
        <span style={{ fontSize: "1.25rem" }}>👤</span>
        <h1
          style={{
            fontSize: "1.125rem",
            fontWeight: 800,
            color: "var(--color-text)",
            flex: 1,
          }}
        >
          Thông tin của tôi
        </h1>
        {hasData && (
          <button
            onClick={handleClear}
            style={{
              fontSize: "0.75rem",
              color: "var(--color-error)",
              fontWeight: 600,
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            Xóa
          </button>
        )}
      </header>

      <main style={{ padding: "1rem" }}>
        {/* Info note */}
        <div
          style={{
            padding: "0.75rem 1rem",
            backgroundColor: "#fffbeb",
            border: "1px solid #fde68a",
            borderRadius: "0.75rem",
            marginBottom: "1rem",
            display: "flex",
            gap: "0.5rem",
            alignItems: "flex-start",
          }}
        >
          <span style={{ fontSize: "1rem", flexShrink: 0 }}>💡</span>
          <p style={{ fontSize: "0.8rem", color: "#92400e", fontWeight: 500 }}>
            Thông tin được lưu trên thiết bị của bạn. Lần sau đặt hàng sẽ tự động điền vào form.
          </p>
        </div>

        <div
          style={{
            backgroundColor: "var(--color-card)",
            borderRadius: "var(--radius-card)",
            border: "1px solid var(--color-border-light)",
            padding: "1rem",
            marginBottom: "1rem",
          }}
        >
          {/* Name */}
          <div style={{ marginBottom: "0.875rem" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.8rem",
                fontWeight: 700,
                color: "var(--color-text)",
                marginBottom: "0.375rem",
              }}
            >
              Họ và tên
            </label>
            <input
              type="text"
              placeholder="Nguyễn Văn A"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              style={inputStyle}
            />
          </div>

          {/* Phone */}
          <div style={{ marginBottom: "0.875rem" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.8rem",
                fontWeight: 700,
                color: "var(--color-text)",
                marginBottom: "0.375rem",
              }}
            >
              Số điện thoại
            </label>
            <input
              type="tel"
              placeholder="0901234567"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              style={inputStyle}
            />
          </div>

          {/* Address */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.8rem",
                fontWeight: 700,
                color: "var(--color-text)",
                marginBottom: "0.375rem",
              }}
            >
              Địa chỉ giao hàng
            </label>
            <textarea
              placeholder="Số nhà, tên đường, phường/xã, quận/huyện..."
              value={form.address}
              onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
              rows={3}
              style={{ ...inputStyle, resize: "vertical", minHeight: "80px" }}
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          className="btn-primary"
          style={
            saved
              ? { background: "var(--color-success)", backgroundColor: "var(--color-success)" }
              : {}
          }
        >
          {saved ? "✓ Đã lưu thông tin!" : "💾 Lưu thông tin"}
        </button>

        <div className="pb-nav" />
      </main>

      <BottomNav />

      <style>{`
        input:focus, textarea:focus {
          border-color: var(--color-primary) !important;
          box-shadow: 0 0 0 3px rgba(124, 79, 42, 0.1);
        }
      `}</style>
    </div>
  );
}
