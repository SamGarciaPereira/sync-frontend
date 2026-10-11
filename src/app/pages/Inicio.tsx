import { Link } from "react-router-dom";
import { CalendarClock, ChevronRight, ListChecks, Pill } from "lucide-react";
import { Card } from "../components/Card";
import { IconBadge } from "../components/IconBadge";
import { medications } from "../data/medications";

function nextDose() {
  const now = new Date();
  const current = `${String(now.getHours()).padStart(2, "0")}:${String(
    now.getMinutes(),
  ).padStart(2, "0")}`;
  const doses = medications
    .flatMap((m) => m.times.map((time) => ({ time, name: m.name })))
    .sort((a, b) => a.time.localeCompare(b.time));
  return doses.find((d) => d.time >= current) ?? doses[0];
}

export function Inicio() {
  const upcoming = nextDose();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-heading sm:text-3xl">
          Olá! 👋
        </h1>
        <p className="mt-1.5 text-muted">Acompanhe seus medicamentos e as doses de hoje.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card icon={Pill} title="Medicamentos">
          <p className="text-3xl font-bold text-heading">{medications.length}</p>
          <p className="text-sm text-muted">cadastrados</p>
        </Card>
        <Card icon={CalendarClock} title="Próxima dose">
          {upcoming ? (
            <>
              <p className="text-3xl font-bold text-heading">{upcoming.time}</p>
              <p className="text-sm text-muted">{upcoming.name}</p>
            </>
          ) : (
            <p className="text-sm text-muted">Nenhuma dose programada.</p>
          )}
        </Card>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-heading">Acesso rápido</h2>
        <QuickAction
          to="/app/cadastrar"
          icon={Pill}
          title="Cadastrar medicação"
          description="Adicione um novo medicamento."
        />
        <QuickAction
          to="/app/medicamentos"
          icon={ListChecks}
          title="Meus medicamentos"
          description="Veja e gerencie o que já está cadastrado."
        />
      </section>
    </div>
  );
}

function QuickAction({
  to,
  icon,
  title,
  description,
}: {
  to: string;
  icon: typeof Pill;
  title: string;
  description: string;
}) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 rounded-card border border-surface-border bg-surface p-4 shadow-card transition-colors hover:bg-sage/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest/40"
    >
      <IconBadge icon={icon} />
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-heading">{title}</p>
        <p className="text-sm text-muted">{description}</p>
      </div>
      <ChevronRight size={20} className="shrink-0 text-faint" aria-hidden="true" />
    </Link>
  );
}
