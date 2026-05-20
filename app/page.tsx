import { supabase } from "@/lib/supabase";
import ProductCard from "@/components/product-card";
import BottomNav from "@/components/bottom-nav";
import { Product } from "@/lib/supabase";
import CategoryTabs from "@/components/category-tabs";
import { CATEGORIES, getCategoryByProductName } from "@/lib/data";

export const revalidate = 60; // ISR every 60 seconds

export default async function HomePage() {
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_available", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching products:", error);
  }

  return (
    <div style={{ minHeight: "100vh", position: "relative" }}>
      {/* Wave Header */}
      <header
        style={{
          backgroundColor: "var(--color-abyssal)",
          color: "var(--color-sand)",
          padding: "3rem 1.5rem 4rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "relative", zIndex: 10 }}>
          <h1
            className="animate-tide-in"
            style={{
              fontSize: "2rem",
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: "0.5rem",
              letterSpacing: "-0.03em",
            }}
          >
            Hải Sản & <br />
            <span style={{ color: "var(--color-terracotta-light)" }}>Đặc Sản Quê</span>
          </h1>
          <p
            className="animate-tide-in"
            style={{
              fontSize: "0.95rem",
              fontWeight: 300,
              opacity: 0.85,
              animationDelay: "0.1s",
            }}
          >
            Hương vị nguyên bản từ biển cả & quê hương
          </p>
        </div>

        {/* Abstract wave shape */}
        <div 
          style={{
            position: "absolute",
            bottom: "-2rem",
            left: "-10%",
            width: "120%",
            height: "100px",
            backgroundColor: "var(--color-bg)",
            borderRadius: "50% 50% 0 0 / 100% 100% 0 0",
            zIndex: 1,
          }}
        />
      </header>

      <CategoryTabs />

      <main style={{ padding: "0 1.25rem 1rem", position: "relative", zIndex: 2 }}>
        {(!products || products.length === 0) ? (
          <div style={{ textAlign: "center", padding: "4rem 1rem", opacity: 0.5 }}>
            <span style={{ fontSize: "3rem" }}>🌊</span>
            <p style={{ marginTop: "1rem", fontWeight: 300 }}>Chưa có sản phẩm nào</p>
          </div>
        ) : (
          CATEGORIES.filter((c) => c.id !== "all").map((cat) => {
            const catProducts = products.filter((p) => getCategoryByProductName(p.name) === cat.id);
            if (catProducts.length === 0) return null;

            return (
              <section 
                key={cat.id} 
                id={`section-${cat.id}`} 
                style={{ 
                  scrollMarginTop: "120px", // Để khi cuộn tới không bị Header che mất
                  marginTop: "2rem",
                  marginBottom: "2rem" 
                }}
              >
                <h2 
                  style={{ 
                    fontSize: "1.5rem", 
                    fontWeight: 800, 
                    color: "var(--color-terracotta)", 
                    marginBottom: "1.25rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem"
                  }}
                >
                  <span style={{ width: "4px", height: "1.5rem", backgroundColor: "var(--color-terracotta)", borderRadius: "4px" }}></span>
                  {cat.label}
                </h2>
                
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                    gap: "1.5rem 1rem", // Vast negative space
                    maxWidth: "1024px",
                    margin: "0 auto",
                  }}
                >
                  {catProducts.map((product: Product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </section>
            );
          })
        )}

        {/* Bottom padding for floating nav */}
        <div className="pb-nav" />
      </main>

      <BottomNav />
    </div>
  );
}
