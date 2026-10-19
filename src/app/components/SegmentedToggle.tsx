import { cn } from "../lib/cn";

interface Option<T extends string> {
  value: T;
  label: string;
}

interface SegmentedToggleProps<T extends string> {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  "aria-label"?: string;
  className?: string;
}

/** Row of equal-width buttons where one is selected (e.g. Sim / Não). */
export function SegmentedToggle<T extends string>({
  options,
  value,
  onChange,
  className,
  ...rest
}: SegmentedToggleProps<T>) {
  return (
    <div
      role="group"
      aria-label={rest["aria-label"]}
      className={cn("grid gap-3", className)}
      style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(option.value)}
            className={cn(
              "rounded-xl px-4 py-3 text-sm font-medium transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest/40",
              selected
                ? "bg-forest text-white"
                : "border border-surface-border bg-surface text-muted hover:border-forest/40",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
