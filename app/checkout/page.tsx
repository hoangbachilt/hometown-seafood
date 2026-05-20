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
  // Vietnamese phone numbers: 10 digits, starts with 0
  return /^(0[3-9]\d{8})$/.test(phone.replace(/\s/g, ""));
}

export default function CheckoutPage() {
  const { items, totalAmount, clearCart } = useCart();
  const router = useRouter();

  const [form, setForm] = useState<FormData>({ name: "", phone: "", address: "" });
  const [errors, setErrors] = useState<FieldError>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Auto-fill from localStorage
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

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.replace("/cart");
    }
  }, [items, router]);

  const formattedTotal = new Intl.NumberFormat("vi-VN").format(totalAmount);

  const validate = (): boolean => {
    const newErrors: FieldError = {};
    if (!form.name.trim()) newErrors.name = "Vui lòng nhập họ tên";
    if (!form.phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
    } else if (!validatePhone(form.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ (10 số, bắt đầu bằng 0)";
    }
    if (!form.address.trim()) newErrors.address = "Vui lòng nhập địa chỉ giao hàng";
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
        throw new Error(data.error ?? "Đặt hàng thất bại. Vui lòng thử lại.");
      }

      // Save customer info for next time
      saveCustomerInfo({ name: form.name, phone: form.phone, address: form.address });

      // Clear cart
      clearCart();

      // Navigate to success
      router.push(`/success?orderId=${data.orderId}`);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (hasError: boolean) => ({
    width: "100%",
    padding: "0.75rem 1rem",
    backgroundColor: "white",
    border: `1.5px solid ${hasError ? "var(--color-error)" : "var(--color-border)"}`,
    borderRadius: "0.75rem",
    fontSize: "1rem",
    color: "var(--color-text)",
    fontFamily: "var(--font-sans)",
    outline: "none",
    transition: "border-color 0.2s ease",
    boxSizing: "border-box" as const,
  });

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
        <button
          onClick={() => router.back()}
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            border: "1.5px solid var(--color-border)",
            background: "transparent",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--color-text)",
          }}
        >
          ←
        </button>
        <h1
          style={{
            fontSize: "1.125rem",
            fontWeight: 800,
            color: "var(--color-text)",
          }}
        >
          Xác nhận đơn hàng
        </h1>
      </header>

      <main style={{ padding: "1rem" }}>
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
          <h2
            style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              color: "var(--color-text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "0.75rem",
            }}
          >
            📦 Tóm tắt đơn hàng
          </h2>

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
              <span style={{ fontWeight: 700, color: "var(--color-text)" }}>
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
            <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>Tổng cộng</span>
            <span
              style={{
                fontWeight: 800,
                color: "var(--color-accent)",
                fontSize: "1.2rem",
              }}
            >
              {formattedTotal}đ
            </span>
          </div>
        </div>

        {/* Customer info form */}
        <div
          style={{
            backgroundColor: "var(--color-card)",
            borderRadius: "var(--radius-card)",
            border: "1px solid var(--color-border-light)",
            padding: "1rem",
            marginBottom: "1rem",
          }}
        >
          <h2
            style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              color: "var(--color-text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "1rem",
            }}
          >
            👤 Thông tin nhận hàng
          </h2>

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
              Họ và tên *
            </label>
            <input
              id="checkout-name"
              type="text"
              placeholder="Nguyễn Văn A"
              value={form.name}
              onChange={(e) => {
                setForm((f) => ({ ...f, name: e.target.value }));
                if (errors.name) setErrors((er) => ({ ...er, name: undefined }));
              }}
              style={inputStyle(!!errors.name)}
            />
            {errors.name && (
              <p style={{ fontSize: "0.75rem", color: "var(--color-error)", marginTop: "0.25rem" }}>
                {errors.name}
              </p>
            )}
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
              Số điện thoại *
            </label>
            <input
              id="checkout-phone"
              type="tel"
              placeholder="0901234567"
              value={form.phone}
              onChange={(e) => {
                setForm((f) => ({ ...f, phone: e.target.value }));
                if (errors.phone) setErrors((er) => ({ ...er, phone: undefined }));
              }}
              style={inputStyle(!!errors.phone)}
            />
            {errors.phone && (
              <p style={{ fontSize: "0.75rem", color: "var(--color-error)", marginTop: "0.25rem" }}>
                {errors.phone}
              </p>
            )}
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
              Địa chỉ giao hàng *
            </label>
            <textarea
              id="checkout-address"
              placeholder="Số nhà, tên đường, phường/xã, quận/huyện..."
              value={form.address}
              onChange={(e) => {
                setForm((f) => ({ ...f, address: e.target.value }));
                if (errors.address) setErrors((er) => ({ ...er, address: undefined }));
              }}
              rows={3}
              style={{
                ...inputStyle(!!errors.address),
                resize: "vertical",
                minHeight: "80px",
              }}
            />
            {errors.address && (
              <p style={{ fontSize: "0.75rem", color: "var(--color-error)", marginTop: "0.25rem" }}>
                {errors.address}
              </p>
            )}
          </div>
        </div>

        {/* COD notice */}
        <div
          style={{
            padding: "0.75rem 1rem",
            backgroundColor: "#f0fdf4",
            border: "1px solid #bbf7d0",
            borderRadius: "0.75rem",
            marginBottom: "1rem",
            display: "flex",
            gap: "0.5rem",
            alignItems: "flex-start",
          }}
        >
          <span style={{ fontSize: "1rem", flexShrink: 0 }}>💵</span>
          <div>
            <p style={{ fontSize: "0.8rem", color: "#15803d", fontWeight: 700, marginBottom: "0.125rem" }}>
              Thanh toán khi nhận hàng (COD)
            </p>
            <p style={{ fontSize: "0.75rem", color: "#166534" }}>
              Bạn chỉ cần trả tiền khi nhận được hàng. Shop sẽ liên hệ xác nhận trước khi giao.
            </p>
          </div>
        </div>

        {/* API Error */}
        {apiError && (
          <div
            style={{
              padding: "0.75rem 1rem",
              backgroundColor: "#fff5f5",
              border: "1px solid #fecaca",
              borderRadius: "0.75rem",
              marginBottom: "1rem",
              color: "var(--color-error)",
              fontSize: "0.875rem",
              fontWeight: 600,
            }}
          >
            ⚠️ {apiError}
          </div>
        )}

        {/* Submit button */}
        <button
          id="checkout-submit"
          onClick={handleSubmit}
          disabled={loading || items.length === 0}
          className="btn-primary"
        >
          {loading ? (
            <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span
                style={{
                  width: "18px",
                  height: "18px",
                  border: "2px solid rgba(255,255,255,0.4)",
                  borderTopColor: "white",
                  borderRadius: "50%",
                  animation: "spin 0.7s linear infinite",
                  display: "inline-block",
                }}
              />
              Đang xử lý...
            </span>
          ) : (
            `🎉 Chốt đơn — ${formattedTotal}đ`
          )}
        </button>

        <div className="pb-nav" />
      </main>

      <BottomNav />

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        input:focus, textarea:focus {
          border-color: var(--color-primary) !important;
          box-shadow: 0 0 0 3px rgba(124, 79, 42, 0.1);
        }
      `}</style>
    </div>
  );
}
