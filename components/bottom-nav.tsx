"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart-context";

export default function BottomNav() {
  const pathname = usePathname();
  const { totalItems } = useCart();

  const navItems = [
    { href: "/", label: "Hải sản", icon: "🌊" },
    { href: "/cart", label: "Giỏ hàng", icon: "🛒", badge: totalItems },
    { href: "/profile", label: "Cá nhân", icon: "👤" },
  ];

  return (
    <nav
      style={{
        position: "fixed",
        bottom: "env(safe-area-inset-bottom, 1rem)", // floating above bottom
        left: "50%",
        transform: "translateX(-50%)",
        width: "calc(100% - 2rem)",
        maxWidth: "400px",
        backgroundColor: "rgba(244, 239, 230, 0.85)", // Sand color with transparency
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid rgba(26, 47, 76, 0.05)", // Abyssal Blue very light border
        borderRadius: "var(--radius-pill)",
        display: "flex",
        justifyContent: "space-between",
        padding: "0.5rem 1rem",
        zIndex: 50,
        boxShadow: "0 8px 32px rgba(26, 47, 76, 0.12)", // Soft floating shadow
      }}
    >
      {navItems.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.2rem",
              padding: "0.5rem 0",
              textDecoration: "none",
              position: "relative",
              color: isActive ? "var(--color-terracotta)" : "var(--color-text-muted)",
              transition: "all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)",
            }}
          >
            {/* Active Indicator (Fluid bubble) */}
            {isActive && (
              <div
                style={{
                  position: "absolute",
                  width: "48px",
                  height: "48px",
                  backgroundColor: "rgba(196, 90, 54, 0.1)", // Terracotta light
                  borderRadius: "var(--radius-pill)",
                  zIndex: -1,
                  animation: "badgePop 0.3s ease-out",
                }}
              />
            )}

            <div style={{ position: "relative" }}>
              <span
                style={{
                  fontSize: "1.25rem",
                  filter: isActive ? "grayscale(0)" : "grayscale(0.8) opacity(0.7)",
                  transition: "all 0.3s ease",
                  display: "inline-block",
                  transform: isActive ? "translateY(-2px)" : "translateY(0)",
                }}
              >
                {item.icon}
              </span>
              
              {/* Badge */}
              {item.badge !== undefined && item.badge > 0 && (
                <div
                  className="animate-badge-pop"
                  style={{
                    position: "absolute",
                    top: "-6px",
                    right: "-10px",
                    backgroundColor: "var(--color-terracotta)",
                    color: "var(--color-sand)",
                    fontSize: "0.65rem",
                    fontWeight: 800,
                    width: "18px",
                    height: "18px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "2px solid var(--color-sand)",
                    boxShadow: "0 2px 4px rgba(196, 90, 54, 0.3)",
                  }}
                >
                  {item.badge}
                </div>
              )}
            </div>
            
            {/* Whisper-quiet text */}
            <span
              style={{
                fontSize: "0.65rem",
                fontWeight: isActive ? 800 : 600,
                letterSpacing: "0.02em",
              }}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
