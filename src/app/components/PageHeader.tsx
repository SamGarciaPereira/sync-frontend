import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "../lib/cn";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  /** Where the back arrow goes. Omit to hide the arrow. */
  backTo?: string;
  className?: string;
}

export function PageHeader({ title, subtitle, backTo, className }: PageHeaderProps) {
  const navigate = useNavigate();
  return (
    <header className={cn("mb-6", className)}>
      <div className="flex items-center gap-2">
        {backTo && (
          <button
            type="button"
            onClick={() => navigate(backTo)}
            aria-label="Voltar"
            className="-ml-1 inline-flex h-9 w-9 items-center justify-center rounded-full text-heading transition-colors hover:bg-sage/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest/40"
          >
            <ArrowLeft size={24} />
          </button>
        )}
        <h1 className="text-2xl font-bold tracking-tight text-heading sm:text-3xl">{title}</h1>
      </div>
      {subtitle && <p className="mt-1.5 text-muted">{subtitle}</p>}
    </header>
  );
}
