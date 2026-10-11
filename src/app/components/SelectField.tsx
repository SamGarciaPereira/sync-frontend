import type { SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../lib/cn";

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  containerClassName?: string;
}

export function SelectField({
  containerClassName,
  className,
  children,
  ...rest
}: SelectFieldProps) {
  return (
    <div className={cn("relative", containerClassName)}>
      <select
        className={cn(
          "w-full appearance-none rounded-xl border border-surface-border bg-white py-3 pl-4 pr-11 text-heading transition-shadow",
          "focus:border-forest/40 focus:outline-none focus:ring-2 focus:ring-forest/30",
          className,
        )}
        {...rest}
      >
        {children}
      </select>
      <ChevronDown
        size={18}
        className="pointer-events-none absolute inset-y-0 right-4 my-auto text-muted"
        aria-hidden="true"
      />
    </div>
  );
}
