"use client";

type Props = {
  className?: string;
};

export default function CameraControls({ className = "" }: Props) {
  return (
    <div
      className={`absolute top-4 left-4 bg-black/20 backdrop-blur-sm rounded-lg p-3 text-white text-sm ${className}`}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs opacity-70">Camera Controls:</span>
      </div>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <kbd className="px-2 py-1 bg-white/20 rounded text-xs">↑</kbd>
            <kbd className="px-2 py-1 bg-white/20 rounded text-xs">↓</kbd>
          </div>
          <span className="text-xs">Move up/down</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <kbd className="px-2 py-1 bg-white/20 rounded text-xs">←</kbd>
            <kbd className="px-2 py-1 bg-white/20 rounded text-xs">→</kbd>
          </div>
          <span className="text-xs">Rotate around</span>
        </div>
      </div>
    </div>
  );
}
