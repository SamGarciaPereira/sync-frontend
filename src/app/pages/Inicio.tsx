import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarClock, ChevronRight, ListChecks, Pill } from "lucide-react";
import { Card } from "../components/Card";
import { IconBadge } from "../components/IconBadge";
import { WEEK_DAYS, findNextDose } from "../lib/medicationOptions";
import { medicationService, type Medication } from "../../services/medications";
import { CURRENT_USER_ID } from "../../services/session";

function dayLabel(dayOffset: number): string {
  if (dayOffset === 0) return "hoje";
  if (dayOffset === 1) return "amanhã";
  const weekday = (new Date().getDay() + dayOffset) % 7;
  return WEEK_DAYS.find((d) => d.value === weekday)?.label ?? "";
}

export function Inicio() {
  const [medications, setMedications] = useState<Medication[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let ignore = false;
    medicationService
      .list(CURRENT_USER_ID)
      .then((data) => {
        if (!ignore) setMedications(data);
      })
      .catch(() => {
        if (!ignore) setFailed(true);
      });
    return () => {
      ignore = true;
    };
  }, []);

  const upcoming = medications ? findNextDose(medications) : null;
  const placeholder = failed ? "Não foi possível carregar." : "Carregando...";

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
          {medications ? (
            <>
              <p className="text-3xl font-bold text-heading">{medications.length}</p>
              <p className="text-sm text-muted">cadastrados</p>
            </>
          ) : (
            <p className="text-sm text-muted">{placeholder}</p>
          )}
        </Card>
        <Card icon={CalendarClock} title="Próxima dose">
          {!medications ? (
            <p className="text-sm text-muted">{placeholder}</p>
          ) : upcoming ? (
            <>
              <p className="text-3xl font-bold text-heading">{upcoming.time}</p>
              <p className="text-sm text-muted">
                {upcoming.name} · {dayLabel(upcoming.dayOffset)}
              </p>
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
