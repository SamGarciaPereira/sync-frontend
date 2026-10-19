import { CircleUser } from "lucide-react";
import { Link } from "react-router-dom";
import { Logo } from "../components/Logo";

/** Top bar shown on mobile (below lg). */
export function MobileHeader() {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-surface-border bg-cream/90 px-5 py-4 backdrop-blur lg:hidden">
      <Link to="/app" className="text-heading">
        <Logo size="md" />
      </Link>
      <button
        type="button"
        aria-label="Perfil"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-sage text-sage-icon focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest/40"
      >
        <CircleUser size={22} />
      </button>
    </header>
  );
}
