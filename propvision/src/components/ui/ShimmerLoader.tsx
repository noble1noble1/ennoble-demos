"use client";

export function ShimmerLoader({ lines = 4, className = "" }: { lines?: number; className?: string }) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="shimmer-line rounded"
          style={{
            height: i === 0 ? "24px" : i % 3 === 0 ? "20px" : "14px",
            width: i === 0 ? "65%" : i === lines - 1 ? "35%" : i % 2 === 0 ? "85%" : "70%",
            animationDelay: `${i * 100}ms`,
            opacity: 1 - i * 0.05,
          }}
        />
      ))}
    </div>
  );
}
