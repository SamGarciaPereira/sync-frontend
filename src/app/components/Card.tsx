import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "../lib/cn";
import { IconBadge } from "./IconBadge";

interface CardProps {
  icon?: LucideIcon;
  title?: ReactNode;
  subtitle?: ReactNode;
  /** Slot rendered at the far right of the header row. */
  headerRight?: ReactNode;
  children?: ReactNode;
  className?: string;
  bodyClassName?: string;
}

/** Rounded surface card. With a title it renders the sage-badge header row. */
export function Card({
  icon,
  title,
  subtitle,
  headerRight,
  children,
  className,
  bodyClassName,
}: CardProps) {
  const hasHeader = Boolean(icon || title || subtitle || headerRight);
  return (
    <section
      className={cn(
        "rounded-card border border-surface-border bg-surface p-5 shadow-card sm:p-6",
        className,
      )}
    >
      {hasHeader && (
        <header className="flex items-start gap-3">
          {icon && <IconBadge icon={icon} />}
          <div className="min-w-0 flex-1">
            {title && (
              <h2 className="text-base font-semibold text-heading sm:text-lg">{title}</h2>
            )}
            {subtitle && <p className="mt-0.5 text-sm text-muted">{subtitle}</p>}
          </div>
          {headerRight}
        </header>
      )}
      {children && <div className={cn(hasHeader && "mt-4", bodyClassName)}>{children}</div>}
    </section>
  );
}
