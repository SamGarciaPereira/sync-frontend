import { cn } from "../lib/cn";

interface WavesProps {
  variant?: "light" | "dark";
  className?: string;
}

const palettes = {
  light: ["#e3eadd", "#d7e2cf", "#c7d8bd"],
  dark: ["rgba(255,255,255,0.05)", "rgba(255,255,255,0.08)", "rgba(145,180,140,0.18)"],
};

/** Soft layered hills used along the bottom edge of screens and the sidebar foot. */
export function Waves({ variant = "light", className }: WavesProps) {
  const [a, b, c] = palettes[variant];
  return (
    <svg
      className={cn("pointer-events-none block w-full", className)}
      viewBox="0 0 1440 220"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path fill={a} d="M0 120 C 240 60, 480 170, 720 140 S 1200 70, 1440 120 L1440 220 L0 220 Z" />
      <path fill={b} d="M0 160 C 260 110, 520 190, 760 165 S 1220 120, 1440 160 L1440 220 L0 220 Z" />
      <path fill={c} d="M0 192 C 300 160, 560 210, 820 194 S 1240 168, 1440 196 L1440 220 L0 220 Z" />
    </svg>
  );
}
