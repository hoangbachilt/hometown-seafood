export function ProductCardSkeleton() {
  return (
    <div
      style={{
        backgroundColor: "var(--color-card)",
        borderRadius: "var(--radius-card)",
        border: "1px solid var(--color-border-light)",
        overflow: "hidden",
      }}
    >
      {/* Image placeholder */}
      <div
        className="animate-shimmer"
        style={{ width: "100%", aspectRatio: "4/3" }}
      />
      {/* Content placeholder */}
      <div style={{ padding: "0.75rem" }}>
        <div
          className="animate-shimmer"
          style={{
            height: "1rem",
            borderRadius: "0.5rem",
            marginBottom: "0.375rem",
            width: "80%",
          }}
        />
        <div
          className="animate-shimmer"
          style={{
            height: "0.875rem",
            borderRadius: "0.5rem",
            marginBottom: "0.625rem",
            width: "50%",
          }}
        />
        <div
          className="animate-shimmer"
          style={{
            height: "2rem",
            borderRadius: "var(--radius-btn)",
          }}
        />
      </div>
    </div>
  );
}

export function ProductGridSkeleton() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "0.75rem",
        padding: "0 1rem",
      }}
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
