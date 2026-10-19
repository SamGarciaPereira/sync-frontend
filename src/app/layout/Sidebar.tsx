import { NavLink } from "react-router-dom";
import { Logo } from "../components/Logo";
import { Waves } from "../components/Waves";
import { cn } from "../lib/cn";
import { navItems } from "./navItems";

/** Desktop navigation rail (lg and up). */
export function Sidebar() {
  return (
    <aside className="relative hidden w-64 shrink-0 flex-col overflow-hidden bg-linear-to-b from-forest-dark to-forest-darker text-white lg:flex">
      <div className="px-6 pb-8 pt-7">
        <Logo size="lg" className="text-white" />
      </div>

      <nav className="flex-1 space-y-1 px-4">
        {navItems.map(({ label, path, icon: Icon, end }) => (
          <NavLink
            key={path}
            to={path}
            end={end}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40",
                isActive
                  ? "bg-white/12 text-white"
                  : "text-white/70 hover:bg-white/5 hover:text-white",
              )
            }
          >
            <Icon size={20} strokeWidth={2} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="relative z-10 px-6 pb-6 pt-8 text-sm leading-snug text-white/55">
        Cuidando de quem
        <br />
        sempre cuidou de você.
      </div>
      <Waves variant="dark" className="absolute inset-x-0 bottom-0 h-28" />
    </aside>
  );
}
