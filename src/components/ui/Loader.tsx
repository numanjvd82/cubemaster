interface LoaderProps {
  text?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function Loader({
  text = "Loading...",
  size = "md",
  className = "",
}: LoaderProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 ${className}`}
    >
      <div className="flex flex-col items-center gap-4">
        <div
          className={`animate-spin rounded-full border-b-2 border-white ${sizeClasses[size]}`}
        ></div>
        <p className="text-white/70">{text}</p>
      </div>
    </div>
  );
}
