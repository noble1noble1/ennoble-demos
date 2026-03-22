import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen relative">
      <div className="grid-lines" />
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-4">
        <div className="text-[80px] font-mono font-bold leading-none bg-gradient-to-r from-[#00ff88] to-[#00ccff] bg-clip-text text-transparent">
          404
        </div>
        <div className="text-[11px] font-mono tracking-[0.3em] text-zinc-600 mt-2 uppercase">
          Property Not Found
        </div>
        <p className="text-sm text-zinc-500 mt-4 text-center max-w-md">
          The address you&apos;re looking for doesn&apos;t exist in our system. Try searching for a different property.
        </p>
        <Link
          href="/"
          className="mt-6 px-6 py-2.5 text-xs font-mono font-semibold tracking-wider border border-[rgba(0,255,136,0.2)] text-[#00ff88] rounded-lg hover:bg-[rgba(0,255,136,0.06)] transition-colors"
        >
          BACK TO SEARCH
        </Link>
      </div>
    </div>
  );
}
