"use client";

import { useState, useEffect } from "react";
import { getCustomerInfo, saveCustomerInfo, CUSTOMER_KEY } from "@/lib/cart-context";
import BottomNav from "@/components/bottom-nav";

type FormData = {
  name: string;
  phone: string;
  address: string;
};

export default function ProfilePage() {
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
    padding: "0.5rem 0",
    backgroundColor: "transparent",
    border: "none",
    borderBottom: "2px solid var(--color-abyssal-muted)",
    borderRadius: "0",
    fontSize: "1.1rem",
    color: "var(--color-abyssal)",
    fontFamily: "var(--font-sans)",
    outline: "none",
    transition: "border-color 0.3s ease",
    boxSizing: "border-box" as const,
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      <header
        style={{
          padding: "2rem 1.5rem 1rem",
          display: "flex",
          alignItems: "center",
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
          Sổ tay
        </h1>
        {hasData && (
          <button
            onClick={handleClear}
            style={{
              fontSize: "0.8rem",
              color: "var(--color-error)",
              fontWeight: 600,
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            Tẩy xóa
          </button>
        )}
      </header>

      <main style={{ padding: "0 1.5rem 1rem" }} className="animate-slide-up">
        {/* Info note */}
        <div
          style={{
            padding: "1.25rem",
            backgroundColor: "var(--color-seafoam)",
            borderRadius: "var(--radius-organic-3)",
            marginBottom: "2rem",
          }}
        >
          <p style={{ fontSize: "0.85rem", color: "var(--color-abyssal-light)", lineHeight: 1.5 }}>
            Thông tin được lưu trên trình duyệt của bạn. Hệ thống sẽ tự động điền giúp bạn trong lần thả lưới tiếp theo.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          <div>
            <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-terracotta)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Họ và tên
            </label>
            <input
              type="text"
              placeholder="VD: Hải Anh"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              style={inputStyle}
              className="earthen-input"
            />
          </div>

          <div>
            <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-terracotta)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Số điện thoại
            </label>
            <input
              type="tel"
              placeholder="09..."
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              style={inputStyle}
              className="earthen-input"
            />
          </div>

          <div>
            <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-terracotta)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Địa chỉ chi tiết
            </label>
            <textarea
              placeholder="Số nhà, tên đường..."
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              rows={2}
              style={{ ...inputStyle, resize: "none" }}
              className="earthen-input"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          className="btn-primary"
          style={{
            marginTop: "2.5rem",
            padding: "1.25rem",
            background: saved ? "var(--color-success)" : "var(--color-abyssal)",
          }}
        >
          {saved ? "✓ Đã ghi nhớ" : "Lưu vào sổ tay"}
        </button>

        <div className="pb-nav" />
      </main>

      <BottomNav />

      <style>{`
        .earthen-input:focus {
          border-color: var(--color-abyssal) !important;
        }
        .earthen-input::placeholder {
          color: rgba(26, 47, 76, 0.3);
          font-weight: 300;
        }
      `}</style>
    </div>
  );
}
