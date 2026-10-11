import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/cn";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: ReactNode;
  containerClassName?: string;
}

const fieldBase =
  "w-full rounded-xl border border-surface-border bg-white text-heading placeholder:text-faint transition-shadow focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest/40";

export function TextField({
  leftIcon,
  containerClassName,
  className,
  ...rest
}: TextFieldProps) {
  if (!leftIcon) {
    return <input className={cn(fieldBase, "px-4 py-3", className)} {...rest} />;
  }
  return (
    <div className={cn("relative", containerClassName)}>
      <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-faint">
        {leftIcon}
      </span>
      <input className={cn(fieldBase, "py-3 pl-11 pr-4", className)} {...rest} />
    </div>
  );
}
