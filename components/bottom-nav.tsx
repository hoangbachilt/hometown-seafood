"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart-context";

const navItems = [
  {
    href: "/",
    label: "Sản phẩm",
    icon: (active: boolean) => (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={active ? 2.5 : 2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    href: "/cart",
    label: "Giỏ hàng",
    icon: (active: boolean) => (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={active ? 2.5 : 2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
    ),
    showBadge: true,
  },
  {
    href: "/profile",
    label: "Thông tin",
    icon: (active: boolean) => (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={active ? 2.5 : 2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { totalItems } = useCart();

  // Hide bottom nav on success page
  if (pathname === "/success") return null;

  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        maxWidth: "480px",
        backgroundColor: "white",
        borderTop: "1px solid var(--color-border-light)",
        display: "flex",
        alignItems: "stretch",
        paddingBottom: "env(safe-area-inset-bottom)",
        zIndex: 50,
        boxShadow: "0 -4px 20px rgba(124, 79, 42, 0.08)",
      }}
    >
      {navItems.map((item) => {
        const isActive =
          item.href === "/"
            ? pathname === "/"
            : pathname.startsWith(item.href);

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
              padding: "0.625rem 0.5rem",
              gap: "0.25rem",
              color: isActive ? "var(--color-accent)" : "var(--color-text-light)",
              transition: "color 0.2s ease",
              textDecoration: "none",
              position: "relative",
            }}
          >
            <span style={{ position: "relative" }}>
              {item.icon(isActive)}
              {item.showBadge && totalItems > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "-6px",
                    right: "-8px",
                    backgroundColor: "var(--color-accent)",
                    color: "white",
                    fontSize: "0.65rem",
                    fontWeight: 800,
                    lineHeight: 1,
                    minWidth: "18px",
                    height: "18px",
                    borderRadius: "9999px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0 4px",
                    animation: "badgePop 0.3s ease-out",
                  }}
                >
                  {totalItems > 99 ? "99+" : Math.round(totalItems * 10) / 10}
                </span>
              )}
            </span>
            <span
              style={{
                fontSize: "0.65rem",
                fontWeight: isActive ? 700 : 500,
                letterSpacing: "0.02em",
              }}
            >
              {item.label}
            </span>
            {isActive && (
              <span
                style={{
                  position: "absolute",
                  top: 0,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "32px",
                  height: "2px",
                  backgroundColor: "var(--color-accent)",
                  borderRadius: "0 0 4px 4px",
                }}
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
