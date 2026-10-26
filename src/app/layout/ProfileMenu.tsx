import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { cn } from "../lib/cn";
import { useAuth } from "../auth/authContext";

const triggerStyles = {
  desktop: "h-10 w-10 bg-white/70 text-forest shadow-card",
  mobile: "h-9 w-9 bg-sage text-sage-icon",
};

/** Avatar button (user's initial) that opens a menu with the account and "Sair". */
export function ProfileMenu({ variant }: { variant: "desktop" | "mobile" }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on click outside or Escape
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const handleSignOut = async () => {
    setLeaving(true);
    await signOut();
    navigate("/", { replace: true });
  };

  const initial = user?.name.trim().charAt(0).toUpperCase() || "?";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label="Perfil"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "inline-flex items-center justify-center rounded-full font-semibold transition-shadow",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest/40",
          triggerStyles[variant],
        )}
      >
        {initial}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-30 mt-2 w-64 rounded-card border border-surface-border bg-surface p-2 shadow-float"
        >
          <div className="px-3 py-2">
            <p className="truncate font-semibold text-heading">{user?.name}</p>
            <p className="truncate text-sm text-muted">{user?.email}</p>
          </div>
          <div className="my-1 h-px bg-surface-border" />
          <button
            type="button"
            role="menuitem"
            onClick={handleSignOut}
            disabled={leaving}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left font-medium text-danger transition-colors hover:bg-danger/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest/40 disabled:opacity-60"
          >
            <LogOut size={18} />
            {leaving ? "Saindo..." : "Sair"}
          </button>
        </div>
      )}
    </div>
  );
}
