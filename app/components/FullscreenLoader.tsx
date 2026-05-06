"use client";

interface FullscreenLoaderProps {
  isLoading: boolean;
  text?: string;
}

export function FullscreenLoader({
  isLoading,
  text = "加载中...",
}: FullscreenLoaderProps) {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent" />
        <p className="text-white text-sm">{text}</p>
      </div>
    </div>
  );
}
