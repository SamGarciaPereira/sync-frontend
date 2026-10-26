import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Logo } from "../components/Logo";
import { Waves } from "../components/Waves";

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  /** Shown below the card (e.g. link to the other auth page). */
  footer?: ReactNode;
}

/** Shell for the sign-in and sign-up pages: logo, centered card and waves. */
export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div className="app-shell relative flex min-h-svh flex-col overflow-hidden">
      <header className="relative z-10 px-6 py-6 lg:px-12">
        <Link
          to="/"
          aria-label="Voltar para o início"
          className="inline-flex rounded-lg text-heading focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest/40"
        >
          <Logo size="lg" />
        </Link>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-md flex-1 px-5 pb-40 pt-2">
        <div className="rounded-card border border-surface-border bg-surface p-6 shadow-card sm:p-8">
          <h1 className="text-3xl font-bold tracking-tight text-heading">{title}</h1>
          {subtitle && <p className="mt-1.5 text-muted">{subtitle}</p>}
          <div className="mt-6">{children}</div>
        </div>
        {footer && <div className="mt-6 text-center text-heading">{footer}</div>}
      </main>

      <Waves variant="light" className="absolute inset-x-0 bottom-0 z-0 h-32 lg:h-40" />
    </div>
  );
}
