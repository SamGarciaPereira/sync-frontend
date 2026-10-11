import { cn } from "../lib/cn";

interface LogoProps {
  /** Overall font size of the wordmark. */
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: { text: "text-lg", mark: 16 },
  md: { text: "text-xl", mark: 18 },
  lg: { text: "text-2xl", mark: 22 },
};

/** The "✳ sync." wordmark. Inherits color from the parent via currentColor. */
export function Logo({ size = "md", className }: LogoProps) {
  const s = sizes[size];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-semibold tracking-tight",
        s.text,
        className,
      )}
    >
      <AsteriskMark size={s.mark} />
      <span>sync.</span>
    </span>
  );
}

function AsteriskMark({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M12 3v18M4.2 7.5l15.6 9M19.8 7.5l-15.6 9" />
    </svg>
  );
}
