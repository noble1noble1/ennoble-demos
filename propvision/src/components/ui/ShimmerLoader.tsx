"use client";

export function ShimmerLoader({ lines = 4, className = "" }: { lines?: number; className?: string }) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="shimmer-line rounded"
          style={{
            height: i === 0 ? "24px" : "16px",
            width: i === 0 ? "60%" : i === lines - 1 ? "40%" : "90%",
          }}
        />
      ))}
    </div>
  );
}
