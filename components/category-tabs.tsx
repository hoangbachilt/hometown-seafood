"use client";

import { CATEGORIES } from "@/lib/data";
import { useEffect, useState, useRef } from "react";

export default function CategoryTabs() {
  const [activeTab, setActiveTab] = useState("all");
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Scroll spy logic
    const handleScroll = () => {
      // Find which section is most visible in the viewport
      const sections = CATEGORIES.map((cat) => ({
        id: cat.id,
        el: document.getElementById(`section-${cat.id}`),
      })).filter((s) => s.el !== null);

      if (sections.length === 0) return;

      // If at very top, set to "all"
      if (window.scrollY < 100) {
        setActiveTab("all");
        return;
      }

      let currentActive = activeTab;
      for (const section of sections) {
        if (!section.el) continue;
        const rect = section.el.getBoundingClientRect();
        // If the top of the section is near the top of the viewport
        if (rect.top <= 150 && rect.bottom >= 150) {
          currentActive = section.id;
          break;
        }
      }

      if (currentActive !== activeTab) {
        setActiveTab(currentActive);
        
        // Auto scroll the tab bar
        const tabEl = document.getElementById(`tab-${currentActive}`);
        if (tabEl && navRef.current) {
          navRef.current.scrollTo({
            left: tabEl.offsetLeft - 20,
            behavior: "smooth",
          });
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeTab]);

  const handleTabClick = (id: string) => {
    setActiveTab(id);
    if (id === "all") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const section = document.getElementById(`section-${id}`);
    if (section) {
      // scroll with offset for the sticky header
      const y = section.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <nav
      ref={navRef}
      style={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        backgroundColor: "rgba(255, 253, 247, 0.9)", // Golden Sunset BG (Trắng kem)
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        display: "flex",
        overflowX: "auto",
        scrollbarWidth: "none", // Firefox
        msOverflowStyle: "none", // IE
        padding: "0.75rem 1rem",
        gap: "0.5rem",
        borderBottom: "1px solid rgba(56, 41, 35, 0.05)",
      }}
      className="no-scrollbar"
    >
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      
      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          id={`tab-${cat.id}`}
          onClick={() => handleTabClick(cat.id)}
          style={{
            whiteSpace: "nowrap",
            padding: "0.5rem 1rem",
            borderRadius: "var(--radius-pill)",
            fontSize: "0.85rem",
            fontWeight: activeTab === cat.id ? 800 : 600,
            color: activeTab === cat.id ? "var(--color-sand)" : "var(--color-abyssal-muted)",
            backgroundColor: activeTab === cat.id ? "var(--color-terracotta)" : "transparent",
            border: activeTab === cat.id ? "1.5px solid var(--color-terracotta)" : "1.5px solid rgba(56, 41, 35, 0.1)",
            cursor: "pointer",
            transition: "all 0.3s ease",
            boxShadow: activeTab === cat.id ? "0 4px 10px rgba(226, 115, 86, 0.3)" : "none",
          }}
        >
          {cat.label}
        </button>
      ))}
    </nav>
  );
}
