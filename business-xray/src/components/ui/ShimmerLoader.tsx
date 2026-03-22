"use client";

interface ShimmerLoaderProps {
  lines?: number;
  className?: string;
}

export function ShimmerLoader({ lines = 4, className = "" }: ShimmerLoaderProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="shimmer-line rounded"
          style={{
            height: "12px",
            width: `${70 + Math.random() * 30}%`,
            animationDelay: `${i * 100}ms`,
          }}
        />
      ))}
    </div>
  );
}
