"use client";

import { useEffect, useState } from "react";
import { supabase, Product } from "@/lib/supabase";
import ProductCard from "@/components/product-card";
import BottomNav from "@/components/bottom-nav";
import { ProductGridSkeleton } from "@/components/loading-skeleton";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_available", true)
        .order("sort_order", { ascending: true });

      if (error) {
        setError("Không thể tải danh sách sản phẩm. Vui lòng thử lại.");
      } else {
        setProducts(data ?? []);
      }
      setLoading(false);
    }

    fetchProducts();
  }, []);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--color-bg)" }}>
      {/* Header */}
      <header className="bg-header-gradient" style={{ padding: "1.25rem 1rem 2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
          <span style={{ fontSize: "2rem" }}>🦑</span>
          <div>
            <h1
              style={{
                fontSize: "1.25rem",
                fontWeight: 800,
                color: "white",
                lineHeight: 1.2,
              }}
            >
              Hải Sản Đặc Sản Quê
            </h1>
            <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.75)", fontWeight: 500 }}>
              Tươi ngon — Giao tận nơi — COD
            </p>
          </div>
        </div>

        {/* Banner strip */}
        <div
          style={{
            backgroundColor: "rgba(255,255,255,0.15)",
            borderRadius: "0.75rem",
            padding: "0.625rem 0.875rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <span style={{ fontSize: "1rem" }}>📦</span>
          <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.9)", fontWeight: 600 }}>
            Đặt hàng — nhận ngay — thanh toán khi nhận
          </span>
        </div>
      </header>

      {/* Content */}
      <main style={{ padding: "1rem 1rem 0", marginTop: "-0.75rem" }}>
        {/* Section title */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "0.875rem",
          }}
        >
          <span style={{ fontSize: "1.125rem" }}>🌊</span>
          <h2
            style={{
              fontSize: "1rem",
              fontWeight: 800,
              color: "var(--color-text)",
            }}
          >
            Danh mục hải sản
          </h2>
          {!loading && (
            <span
              style={{
                fontSize: "0.75rem",
                color: "var(--color-text-muted)",
                marginLeft: "auto",
                fontWeight: 600,
              }}
            >
              {products.length} sản phẩm
            </span>
          )}
        </div>

        {/* Loading state */}
        {loading && <ProductGridSkeleton />}

        {/* Error state */}
        {error && !loading && (
          <div
            style={{
              textAlign: "center",
              padding: "2rem",
              color: "var(--color-text-muted)",
            }}
          >
            <p style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>😔</p>
            <p style={{ fontWeight: 600 }}>{error}</p>
          </div>
        )}

        {/* Products grid */}
        {!loading && !error && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0.75rem",
            }}
          >
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Bottom spacing for nav */}
        <div className="pb-nav" />
      </main>

      <BottomNav />
    </div>
  );
}
