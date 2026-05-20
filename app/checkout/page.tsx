"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { getCustomerInfo, saveCustomerInfo } from "@/lib/cart-context";
import BottomNav from "@/components/bottom-nav";

type FormData = {
  name: string;
  phone: string;
  address: string;
};

type FieldError = Partial<Record<keyof FormData, string>>;

function validatePhone(phone: string): boolean {
  return /^(0[3-9]\d{8})$/.test(phone.replace(/\s/g, ""));
}

export default function CheckoutPage() {
  const { items, totalAmount, clearCart } = useCart();
  const router = useRouter();

  const [form, setForm] = useState<FormData>({ name: "", phone: "", address: "" });
  const [errors, setErrors] = useState<FieldError>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    const saved = getCustomerInfo();
    if (saved) {
      setForm({
        name: saved.name || "",
        phone: saved.phone || "",
        address: saved.address || "",
      });
    }
  }, []);

  useEffect(() => {
    if (items.length === 0) {
      router.replace("/cart");
    }
  }, [items, router]);

  const formattedTotal = new Intl.NumberFormat("vi-VN").format(totalAmount);

  const validate = (): boolean => {
    const newErrors: FieldError = {};
    if (!form.name.trim()) newErrors.name = "Bắt buộc";
    if (!form.phone.trim()) {
      newErrors.phone = "Bắt buộc";
    } else if (!validatePhone(form.phone)) {
      newErrors.phone = "Chưa hợp lệ";
    }
    if (!form.address.trim()) newErrors.address = "Bắt buộc";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    setApiError(null);

    try {
      const payload = {
        customerName: form.name.trim(),
        customerPhone: form.phone.trim(),
        customerAddress: form.address.trim(),
        items: items.map((i) => ({
          name: i.name,
          quantity: i.quantity,
          price_per_kg: i.pricePerKg,
          subtotal: i.subtotal,
        })),
        totalAmount,
      };

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error ?? "Có lỗi xảy ra");
      }

      saveCustomerInfo({ name: form.name, phone: form.phone, address: form.address });
      clearCart();
      router.push(`/success?orderId=${data.orderId}`);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  // Minimalist input style
  const inputStyle = (hasError: boolean) => ({
    width: "100%",
    padding: "0.5rem 0",
    backgroundColor: "transparent",
    border: "none",
    borderBottom: `2px solid ${hasError ? "var(--color-error)" : "var(--color-abyssal-muted)"}`,
    borderRadius: "0",
    fontSize: "1.1rem",
    color: "var(--color-abyssal)",
    fontFamily: "var(--font-sans)",
    outline: "none",
    transition: "border-color 0.3s ease",
    boxSizing: "border-box" as const,
  });

  return (
    <div style={{ minHeight: "100vh" }}>
      <header
        style={{
          padding: "2rem 1.5rem 1rem",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <button
          onClick={() => router.back()}
          aria-label="Quay lại"
          style={{
            background: "none",
            border: "none",
            fontSize: "1.5rem",
            color: "var(--color-abyssal)",
            cursor: "pointer",
            padding: 0,
          }}
        >
          ←
        </button>
        <h1
          style={{
            fontSize: "1.5rem",
            fontWeight: 800,
            color: "var(--color-abyssal)",
            letterSpacing: "-0.02em",
          }}
        >
          Giao hàng
        </h1>
      </header>

      <main style={{ padding: "0 1.5rem 1rem" }} className="animate-slide-up">
        {/* Minimal Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem", marginTop: "1rem" }}>
          <div style={{ position: "relative" }}>
            <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-terracotta)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Tên người nhận
            </label>
            <input
              type="text"
              placeholder="VD: Hải Anh"
              value={form.name}
              onChange={(e) => {
                setForm({ ...form, name: e.target.value });
                if (errors.name) setErrors({ ...errors, name: undefined });
              }}
              style={inputStyle(!!errors.name)}
              className="earthen-input"
            />
            {errors.name && <span style={{ position: "absolute", right: 0, top: 0, fontSize: "0.75rem", color: "var(--color-error)" }}>{errors.name}</span>}
          </div>

          <div style={{ position: "relative" }}>
            <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-terracotta)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Số điện thoại
            </label>
            <input
              type="tel"
              placeholder="09..."
              value={form.phone}
              onChange={(e) => {
                setForm({ ...form, phone: e.target.value });
                if (errors.phone) setErrors({ ...errors, phone: undefined });
              }}
              style={inputStyle(!!errors.phone)}
              className="earthen-input"
            />
            {errors.phone && <span style={{ position: "absolute", right: 0, top: 0, fontSize: "0.75rem", color: "var(--color-error)" }}>{errors.phone}</span>}
          </div>

          <div style={{ position: "relative" }}>
            <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-terracotta)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Địa chỉ chi tiết
            </label>
            <textarea
              placeholder="Số nhà, tên đường..."
              value={form.address}
              onChange={(e) => {
                setForm({ ...form, address: e.target.value });
                if (errors.address) setErrors({ ...errors, address: undefined });
              }}
              rows={2}
              style={{ ...inputStyle(!!errors.address), resize: "none" }}
              className="earthen-input"
            />
            {errors.address && <span style={{ position: "absolute", right: 0, top: 0, fontSize: "0.75rem", color: "var(--color-error)" }}>{errors.address}</span>}
          </div>
        </div>

        {/* COD Notice */}
        <div style={{ marginTop: "2.5rem", padding: "1.25rem", backgroundColor: "var(--color-seafoam)", borderRadius: "var(--radius-organic-1)" }}>
          <p style={{ fontSize: "0.85rem", color: "var(--color-abyssal-light)", lineHeight: 1.5 }}>
            <span style={{ fontWeight: 800 }}>Thanh toán khi nhận hàng (COD).</span><br />
            Shop sẽ liên hệ xác nhận trước khi giao.
          </p>
        </div>

        {apiError && (
          <p style={{ color: "var(--color-error)", fontSize: "0.85rem", marginTop: "1rem", textAlign: "center" }}>
            {apiError}
          </p>
        )}

        <div style={{ marginTop: "2rem" }}>
          <button
            onClick={handleSubmit}
            disabled={loading || items.length === 0}
            className="btn-primary"
            style={{ padding: "1.25rem" }}
          >
            {loading ? "Đang xử lý..." : `Chốt đơn — ${formattedTotal}đ`}
          </button>
        </div>

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
