import { NavLink } from "react-router-dom";
import { cn } from "../lib/cn";
import { bottomNavItems } from "./navItems";

/** Bottom tab bar shown on mobile (below lg). */
export function BottomNav() {
  return (
    <nav className="sticky bottom-0 z-20 border-t border-surface-border bg-cream/95 backdrop-blur lg:hidden">
      <ul className="mx-auto flex max-w-xl items-stretch justify-around px-2 py-2">
        {bottomNavItems.map(({ shortLabel, path, icon: Icon, end }) => (
          <li key={path} className="flex-1">
            <NavLink
              to={path}
              end={end}
              className={({ isActive }) =>
                cn(
                  "flex h-full flex-col items-center gap-1 rounded-xl px-1 py-1.5 text-center text-[0.68rem] font-medium leading-tight transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest/40",
                  isActive ? "text-forest" : "text-faint hover:text-muted",
                )
              }
            >
              <Icon size={22} strokeWidth={2} className="shrink-0" />
              <span className="line-clamp-2 text-balance">{shortLabel}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
