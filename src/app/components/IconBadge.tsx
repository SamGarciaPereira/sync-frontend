import type { LucideIcon } from "lucide-react";
import { cn } from "../lib/cn";

interface IconBadgeProps {
  icon: LucideIcon;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const boxes = { sm: "h-9 w-9", md: "h-10 w-10", lg: "h-12 w-12" };
const glyphs = { sm: 18, md: 20, lg: 24 };

/** Rounded sage square holding a green icon — the recurring motif in the cards. */
export function IconBadge({ icon: Icon, size = "md", className }: IconBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-[0.7rem] bg-sage text-sage-icon",
        boxes[size],
        className,
      )}
    >
      <Icon size={glyphs[size]} strokeWidth={2} />
    </span>
  );
}
