import type { LucideIcon } from "lucide-react";
import { House, Pill, ListChecks, CalendarDays, Settings } from "lucide-react";

export interface NavItem {
  label: string;
  /** Shorter label for the mobile bottom bar. */
  shortLabel: string;
  path: string;
  icon: LucideIcon;
  /** Exact-match the route (used for the index "/app"). */
  end?: boolean;
  /** Whether it appears in the mobile bottom navigation. */
  bottom?: boolean;
}

export const navItems: NavItem[] = [
  { label: "Início", shortLabel: "Início", path: "/app", icon: House, end: true, bottom: true },
  { label: "Cadastrar medicação", shortLabel: "Cadastrar", path: "/app/cadastrar", icon: Pill, bottom: true },
  { label: "Meus medicamentos", shortLabel: "Meus medicamentos", path: "/app/medicamentos", icon: ListChecks, bottom: true },
  { label: "Lembretes", shortLabel: "Lembretes", path: "/app/lembretes", icon: CalendarDays, bottom: true },
  { label: "Configurações", shortLabel: "Configurações", path: "/app/configuracoes", icon: Settings },
];

export const bottomNavItems = navItems.filter((item) => item.bottom);
