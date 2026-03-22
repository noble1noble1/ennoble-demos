"use client";

interface ShimmerLoaderProps {
  lines?: number;
  className?: string;
}

const SHIMMER_WIDTHS = [85, 72, 93, 78, 88, 70, 96, 82, 75, 91];

export function ShimmerLoader({ lines = 4, className = "" }: ShimmerLoaderProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="shimmer-line rounded"
          style={{
            height: "12px",
            width: `${SHIMMER_WIDTHS[i % SHIMMER_WIDTHS.length]}%`,
            animationDelay: `${i * 100}ms`,
          }}
        />
      ))}
    </div>
  );
}
