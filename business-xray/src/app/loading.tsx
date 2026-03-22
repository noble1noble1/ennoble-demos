export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-[#0a0a0a]">
      <div className="loading-spinner">
        <div className="loading-ring" />
        <div className="loading-ring" />
        <div className="loading-ring" />
      </div>
      <div className="text-[10px] font-mono tracking-[0.2em] text-zinc-600 mt-4">
        LOADING
      </div>
    </div>
  );
}
