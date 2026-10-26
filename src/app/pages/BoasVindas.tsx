import { Link } from "react-router-dom";
import { ArrowRight, Boxes, CalendarClock, Clock, Pill, Type } from "lucide-react";
import { IconBadge } from "../components/IconBadge";
import { Logo } from "../components/Logo";
import { Waves } from "../components/Waves";

const features = [
  { icon: Clock, text: "Horários e doses organizados" },
  { icon: Boxes, text: "Aviso quando o remédio estiver acabando" },
  { icon: Type, text: "Letras grandes e poucos passos" },
];

/** Landing page: presents sync. and leads to sign in / sign up. */
export function BoasVindas() {
  return (
    <div className="app-shell relative flex min-h-svh flex-col overflow-hidden">
      <header className="relative z-10 px-6 py-6 lg:px-12">
        <Logo size="lg" className="text-heading" />
      </header>

      <main className="relative z-10 mx-auto grid w-full max-w-5xl flex-1 items-center gap-12 px-6 pb-40 pt-4 lg:grid-cols-2 lg:px-12">
        <section>
          <p className="inline-flex rounded-full bg-sage px-3 py-1 text-sm font-medium text-sage-icon">
            Segurança na medicação
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-heading sm:text-5xl">
            Seus remédios,
            <br />
            na hora certa.
          </h1>
          <p className="mt-4 max-w-md text-lg text-muted">
            O sync. organiza horários, doses e estoque dos seus medicamentos de um jeito simples,
            para você e para quem cuida de você.
          </p>

          <ul className="mt-6 space-y-3">
            {features.map(({ icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-heading">
                <IconBadge icon={icon} size="sm" />
                {text}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col gap-3 sm:max-w-sm">
            <Link
              to="/entrar"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-forest px-6 py-4 text-lg font-semibold text-white shadow-card transition-colors hover:bg-forest-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest/40 focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
            >
              Entrar
              <ArrowRight size={20} aria-hidden="true" />
            </Link>
            <Link
              to="/cadastro"
              className="rounded-2xl border border-surface-border bg-surface px-6 py-4 text-center text-heading transition-colors hover:bg-sage/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest/40"
            >
              Ainda não tem cadastro?{" "}
              <span className="font-semibold text-forest underline underline-offset-4">
                Cadastre-se aqui!
              </span>
            </Link>
          </div>
        </section>

        {/* Decorative preview of the app */}
        <section aria-hidden="true" className="hidden lg:block">
          <div className="relative mx-auto max-w-sm">
            <div className="rotate-[-2deg] rounded-card border border-surface-border bg-surface p-6 shadow-float">
              <div className="flex items-center gap-3">
                <IconBadge icon={CalendarClock} />
                <p className="font-semibold text-heading">Próxima dose</p>
              </div>
              <p className="mt-4 text-5xl font-bold text-heading">08:00</p>
              <p className="mt-1 text-muted">Losartana · 1 comprimido</p>
            </div>
            <div className="relative -mt-4 ml-16 rotate-[3deg] rounded-card border border-surface-border bg-surface p-5 shadow-float">
              <div className="flex items-center gap-3">
                <IconBadge icon={Pill} size="sm" />
                <div>
                  <p className="font-semibold text-heading">Omeprazol 20mg</p>
                  <p className="text-sm text-muted">Estoque: 28 cápsulas</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Waves variant="light" className="absolute inset-x-0 bottom-0 z-0 h-32 lg:h-44" />
    </div>
  );
}
