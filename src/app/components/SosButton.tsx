import { Siren } from "lucide-react";
import { cn } from "../lib/cn";

interface SosButtonProps {
  onClick: () => void;
  className?: string;
}

/**
 * Botão de SOS: grande, vermelho e de alto contraste, pensado para o idoso
 * acionar com facilidade. Abre a confirmação antes de pedir ajuda.
 */
export function SosButton({ onClick, className }: SosButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="SOS — pedir ajuda agora"
      className={cn(
        "flex w-full items-center justify-center gap-3 rounded-card bg-danger px-6 py-6",
        "text-xl font-bold text-white shadow-card transition-colors",
        "hover:brightness-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-danger/40",
        className,
      )}
    >
      <Siren size={30} aria-hidden="true" />
      SOS — Pedir ajuda
    </button>
  );
}
