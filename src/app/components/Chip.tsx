import type { ButtonHTMLAttributes } from "react";
import { cn } from "../lib/cn";

type ChipVariant = "soft" | "toggle";

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ChipVariant;
  active?: boolean;
}

/**
 * `soft` — suggestion pills (sage background).
 * `toggle` — selectable chips (e.g. days of the week) with an active state.
 */
export function Chip({
  variant = "toggle",
  active = false,
  className,
  children,
  type = "button",
  ...rest
}: ChipProps) {
  const styles =
    variant === "soft"
      ? "bg-sage/60 text-heading hover:bg-sage"
      : active
        ? "border border-transparent bg-forest text-white"
        : "border border-surface-border bg-surface text-faint hover:border-forest/40 hover:text-muted";

  return (
    <button
      type={type}
      aria-pressed={variant === "toggle" ? active : undefined}
      className={cn(
        "rounded-xl px-4 py-2 text-sm font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest/40",
        styles,
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
