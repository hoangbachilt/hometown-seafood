"use client";

import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { Product } from "@/lib/supabase";
import { useCart } from "@/lib/cart-context";
import { PRODUCT_IMAGES_MAP, getProductUnit } from "@/lib/data";

export default function ProductDetailSheet({
  isOpen,
  onClose,
  product,
  initialQuantity,
}: {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  initialQuantity: number;
}) {
  const { addItem, updateQuantity } = useCart();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Get additional images from hardcoded map, fallback to main image
  const extraImages = PRODUCT_IMAGES_MAP[product.id] || [];
  const images = product.image_url 
    ? [product.image_url, ...extraImages] 
    : extraImages;
    
  const unit = getProductUnit(product.id);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setActiveImageIndex(0);
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollLeft = 0;
      }
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAdd = () => {
    addItem(product, 1);
  };

  const handleIncrease = () => {
    updateQuantity(product, initialQuantity + 1);
  };

  const handleDecrease = () => {
    updateQuantity(product, Math.max(0, initialQuantity - 1));
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const scrollPosition = target.scrollLeft;
    const width = target.clientWidth;
    const newIndex = Math.round(scrollPosition / width);
    setActiveImageIndex(newIndex);
  };

  if (!mounted) return null;

  const content = (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(56, 41, 35, 0.6)", // Abyssal backdrop
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
        zIndex: 9999, // Đảm bảo luôn nằm trên cùng (trên cả BottomNav)
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
      }}
      onClick={onClose}
    >
      <div
        className="animate-slide-up"
        style={{
          backgroundColor: "var(--color-bg)",
          borderTopLeftRadius: "32px",
          borderTopRightRadius: "32px",
          height: "85vh", // Trượt lên 85% màn hình
          width: "100%",
          maxWidth: "500px", // Hạn chế chiều rộng trên màn hình máy tính
          margin: "0 auto", // Căn giữa màn hình
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 -4px 20px rgba(0,0,0,0.1)",
        }}
        onClick={(e) => e.stopPropagation()} // Prevent close on content click
      >
        {/* Handle bar for dragging visual */}
        <div 
          style={{
            width: "40px",
            height: "4px",
            backgroundColor: "var(--color-abyssal-light)",
            borderRadius: "4px",
            margin: "1rem auto",
            flexShrink: 0,
          }}
        />

        <div style={{ flex: 1, overflowY: "auto", paddingBottom: "2rem" }}>
          {/* Image Gallery (Horizontal Scroll / Carousel) */}
          <div 
            style={{ 
              position: "relative", 
              width: "100%", 
              height: "280px", // Chiều cao cố định vừa phải
              backgroundColor: "var(--color-bg)",
              paddingBottom: "1rem"
            }}
          >
            {images.length > 0 ? (
              <>
                <div
                  ref={scrollContainerRef}
                  onScroll={handleScroll}
                  style={{
                    display: "flex",
                    overflowX: "auto",
                    scrollSnapType: "x mandatory",
                    width: "100%",
                    height: "100%",
                    padding: "1rem", // Padding xung quanh
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                  }}
                  className="no-scrollbar"
                >
                  <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
                  {images.map((img, idx) => {
                    const isVideo = img.toLowerCase().endsWith(".mp4") || img.toLowerCase().endsWith(".webm");
                    return (
                      <div
                        key={idx}
                        style={{
                          height: "100%",
                          aspectRatio: "1/1", // VUÔNG CHUẨN THEO BÊN NGOÀI
                          scrollSnapAlign: "center",
                          position: "relative",
                          borderRadius: "50%", // HÌNH TRÒN 
                          overflow: "hidden",
                          marginRight: "1rem",
                          boxShadow: "inset 0 0 20px rgba(56, 41, 35, 0.05)",
                          backgroundColor: "var(--color-seafoam)"
                        }}
                      >
                        {isVideo ? (
                          <video
                            src={img}
                            autoPlay
                            muted
                            loop
                            playsInline
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                        ) : (
                          <Image
                            src={img}
                            alt={`${product.name} - ảnh ${idx + 1}`}
                            fill
                            sizes="280px"
                            style={{ objectFit: "cover" }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
                
                {/* Dots Indicator */}
                {images.length > 1 && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: "1rem",
                      left: "0",
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                      gap: "0.5rem",
                    }}
                  >
                    {images.map((_, idx) => (
                      <div
                        key={idx}
                        style={{
                          width: activeImageIndex === idx ? "24px" : "8px",
                          height: "8px",
                          borderRadius: "4px",
                          backgroundColor: activeImageIndex === idx ? "var(--color-terracotta)" : "rgba(255,255,255,0.7)",
                          transition: "all 0.3s ease",
                        }}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: "4rem", opacity: 0.5 }}>🐟</span>
              </div>
            )}
          </div>

          {/* Details */}
          <div style={{ padding: "1.5rem" }}>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: 800,
                color: "var(--color-text)",
                marginBottom: "0.5rem",
                lineHeight: 1.2,
              }}
            >
              {product.name}
            </h2>
            <div
              style={{
                fontSize: "1.25rem",
                fontWeight: 800,
                color: "var(--color-terracotta)",
                marginBottom: "1.5rem",
              }}
            >
              {new Intl.NumberFormat("vi-VN").format(product.price_per_kg)}đ/{unit}
            </div>

            <p style={{ color: "var(--color-text-muted)", lineHeight: 1.6, fontSize: "0.95rem" }}>
              Đặc sản vùng biển, được tuyển chọn kỹ lưỡng và bảo quản tươi ngon nhất trước khi giao đến tay bạn.
              Cam kết chất lượng 100%. Phù hợp để làm quà biếu hoặc thiết đãi gia đình.
            </p>
          </div>
        </div>

        {/* Sticky Bottom Action (Inline Stepper) */}
        <div
          style={{
            padding: "1rem 1.5rem calc(1rem + env(safe-area-inset-bottom))",
            borderTop: "1px solid var(--color-border)",
            backgroundColor: "var(--color-bg)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {initialQuantity === 0 ? (
            <button
              onClick={handleAdd}
              className="btn-primary"
              style={{ width: "100%", padding: "1rem", fontSize: "1.1rem" }}
            >
              + Thêm vào giỏ
            </button>
          ) : (
            <div
              className="animate-tide-in"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "var(--color-terracotta)",
                borderRadius: "var(--radius-pill)",
                padding: "0.5rem",
                color: "var(--color-sand)",
                width: "100%",
                boxShadow: "0 4px 15px rgba(226, 115, 86, 0.3)",
              }}
            >
              <button
                onClick={handleDecrease}
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  border: "none",
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  color: "inherit",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                }}
                onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.9)")}
                onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                -
              </button>
              <span style={{ fontSize: "1.2rem", fontWeight: 800 }}>
                {initialQuantity} {unit === "kg" ? "kg" : "x"}
              </span>
              <button
                onClick={handleIncrease}
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  border: "none",
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  color: "inherit",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                }}
                onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.9)")}
                onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
